const enc=new TextEncoder();
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
const randomHex=n=>{const b=new Uint8Array(n);crypto.getRandomValues(b);return hex(b)};
const clean=(v,max=120)=>String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
async function readJson(request){try{return await request.json()}catch{return null}}
async function ensureTables(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT,token_hash TEXT NOT NULL UNIQUE,user_id INTEGER,role TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT,key TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_login_events (id INTEGER PRIMARY KEY AUTOINCREMENT,ip_hash TEXT NOT NULL,username_hash TEXT,status TEXT NOT NULL,user_agent TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash,role,expires_at)').run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_key ON login_attempts(key,created_at)').run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_admin_login_events_created ON admin_login_events(created_at)').run();
}
async function verifyTurnstile(env,request,token){
 const secret=String(env.TURNSTILE_SECRET_KEY||'').trim();
 const response=String(token||'').trim();
 if(!secret)return {ok:false,error:'Turnstile secret is not configured.'};
 if(!response||response.length>4096)return {ok:false,error:'Security verification is required.'};
 const form=new FormData();form.append('secret',secret);form.append('response',response);
 const ip=request.headers.get('CF-Connecting-IP');if(ip)form.append('remoteip',ip);
 let result;
 try{const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});if(!r.ok)return {ok:false,error:'Security verification service is unavailable.'};result=await r.json()}catch{return {ok:false,error:'Security verification service is unavailable.'}}
 const hostname=String(result?.hostname||'').toLowerCase();
 const action=String(result?.action||'');
 const hostOK=hostname==='alosolarenergy.com'||hostname.endsWith('.alosolarenergy.com');
 return {ok:result?.success===true&&hostOK&&action==='admin_login',error:'Security verification failed.'};
}
function base32Bytes(value){
 const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
 const s=String(value||'').toUpperCase().replace(/[^A-Z2-7]/g,'');
 if(s.length<16)return null;
 let bits=0,bitCount=0,out=[];
 for(const ch of s){const v=alphabet.indexOf(ch);if(v<0)return null;bits=(bits<<5)|v;bitCount+=5;while(bitCount>=8){out.push((bits>>(bitCount-8))&255);bitCount-=8}}
 return new Uint8Array(out);
}
async function totpCode(secret,counter){
 const keyBytes=base32Bytes(secret);if(!keyBytes)return null;
 const msg=new Uint8Array(8);let n=BigInt(counter);for(let i=7;i>=0;i--){msg[i]=Number(n&255n);n>>=8n}
 const key=await crypto.subtle.importKey('raw',keyBytes,{name:'HMAC',hash:'SHA-1'},false,['sign']);
 const mac=new Uint8Array(await crypto.subtle.sign('HMAC',key,msg));
 const o=mac[mac.length-1]&15;
 const bin=((mac[o]&127)<<24)|((mac[o+1]&255)<<16)|((mac[o+2]&255)<<8)|(mac[o+3]&255);
 return String(bin%1000000).padStart(6,'0');
}
function safeEqual(a,b){a=String(a);b=String(b);if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
async function verifyTotp(secret,input){
 const code=String(input||'').replace(/\D/g,'');if(code.length!==6)return false;
 const step=Math.floor(Date.now()/30000);
 for(let offset=-1;offset<=1;offset++){const expected=await totpCode(secret,step+offset);if(expected&&safeEqual(expected,code))return true}
 return false;
}
async function identityKey(request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 return {ip,key:await sha256(`admin:${ip}`),ipHash:await sha256(ip)};
}
async function checkThrottle(env,request){
 const {key}=await identityKey(request);
 const row=await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE key=? AND created_at>datetime('now','-15 minutes')").bind(key).first();
 const count=Number(row?.count||0);
 if(count>=5){
  const first=await env.DB.prepare("SELECT CAST(MAX(0,900-(strftime('%s','now')-strftime('%s',MIN(created_at)))) AS INTEGER) retry_after FROM login_attempts WHERE key=? AND created_at>datetime('now','-15 minutes')").bind(key).first();
  return {allowed:false,retryAfter:Math.max(1,Number(first?.retry_after||900))};
 }
 return {allowed:true,retryAfter:0};
}
async function addFailedAttempt(env,request){const {key}=await identityKey(request);await env.DB.prepare('INSERT INTO login_attempts(key) VALUES(?)').bind(key).run()}
async function clearThrottle(env,request){const {key}=await identityKey(request);await env.DB.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run()}
async function logEvent(env,request,username,status){
 try{
  const {ipHash}=await identityKey(request);
  const usernameHash=username?await sha256(String(username).toLowerCase()):null;
  const ua=clean(request.headers.get('User-Agent')||'',220);
  await env.DB.prepare('INSERT INTO admin_login_events(ip_hash,username_hash,status,user_agent) VALUES(?,?,?,?)').bind(ipHash,usernameHash,status,ua).run();
  await env.DB.prepare("DELETE FROM admin_login_events WHERE created_at<datetime('now','-90 days')").run();
 }catch(e){console.error('Admin login event log failed',e)}
}
async function issueSession(env){const token=randomHex(32),hash=await sha256(token);await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,role,expires_at) VALUES(?,?,?,datetime('now','+7 days'))").bind(hash,null,'admin').run();return token}
const setCookie=(name,value,maxAge)=>`${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
export async function onRequestPost({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD)return json({error:'Admin credentials are not configured.'},500);
  await ensureTables(env);
  const data=await readJson(request);if(!data)return json({error:'Invalid request.'},400);
  const username=clean(data.username,80),password=String(data.password||'');
  const challenge=await verifyTurnstile(env,request,data.turnstileToken);
  if(!challenge.ok){await logEvent(env,request,username,'turnstile_failed');return json({error:challenge.error},403)}
  const throttle=await checkThrottle(env,request);
  if(!throttle.allowed){await logEvent(env,request,username,'locked');return json({error:'Too many failed attempts. Try again in about 15 minutes.',retryAfter:throttle.retryAfter},429,{'retry-after':String(throttle.retryAfter)})}
  const userOK=(await sha256(username))===(await sha256(env.ADMIN_USERNAME));
  const passOK=(await sha256(password))===(await sha256(env.ADMIN_PASSWORD));
  if(!userOK||!passOK){
   await addFailedAttempt(env,request);await logEvent(env,request,username,'failed');
   const after=await checkThrottle(env,request);
   if(!after.allowed)return json({error:'Too many failed attempts. Admin login is temporarily locked for this connection.',retryAfter:after.retryAfter},429,{'retry-after':String(after.retryAfter)});
   return json({error:'Incorrect admin credentials.'},401);
  }
  const twoFactorSecret=String(env.ADMIN_TOTP_SECRET||'').trim();
  if(twoFactorSecret){
   const twoFactorOK=await verifyTotp(twoFactorSecret,data.totpCode);
   if(!twoFactorOK){
    await addFailedAttempt(env,request);await logEvent(env,request,username,'2fa_failed');
    const after=await checkThrottle(env,request);
    if(!after.allowed)return json({error:'Too many failed attempts. Admin login is temporarily locked for this connection.',retryAfter:after.retryAfter},429,{'retry-after':String(after.retryAfter)});
    return json({error:'2FA code is incorrect or expired.'},401);
   }
  }
  await clearThrottle(env,request);
  await logEvent(env,request,username,twoFactorSecret?'success_2fa':'success');
  const token=await issueSession(env);
  return json({ok:true,twoFactorEnabled:Boolean(twoFactorSecret)},200,{'set-cookie':setCookie('alo_admin_session',token,604800)});
 }catch(error){console.error('Admin secure login failed',error);return json({error:'Server error. Please try again.'},500)}
}
