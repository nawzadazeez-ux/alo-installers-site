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
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash,role,expires_at)').run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_key ON login_attempts(key,created_at)').run();
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
async function throttle(env,request){
 const ip=request.headers.get('CF-Connecting-IP')||'unknown';
 const key=await sha256(`admin:${ip}`);
 const row=await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE key=? AND created_at>datetime('now','-15 minutes')").bind(key).first();
 if((row?.count||0)>=8)return false;
 await env.DB.prepare('INSERT INTO login_attempts(key) VALUES(?)').bind(key).run();
 return true;
}
async function clearThrottle(env,request){const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await sha256(`admin:${ip}`);await env.DB.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run()}
async function issueSession(env){const token=randomHex(32),hash=await sha256(token);await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,role,expires_at) VALUES(?,?,?,datetime('now','+7 days'))").bind(hash,null,'admin').run();return token}
const setCookie=(name,value,maxAge)=>`${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
export async function onRequestPost({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD)return json({error:'Admin credentials are not configured.'},500);
  await ensureTables(env);
  const data=await readJson(request);if(!data)return json({error:'Invalid request.'},400);
  const challenge=await verifyTurnstile(env,request,data.turnstileToken);if(!challenge.ok)return json({error:challenge.error},403);
  if(!await throttle(env,request))return json({error:'Too many attempts. Try again later.'},429);
  const username=clean(data.username,80),password=String(data.password||'');
  const userOK=(await sha256(username))===(await sha256(env.ADMIN_USERNAME));
  const passOK=(await sha256(password))===(await sha256(env.ADMIN_PASSWORD));
  if(!userOK||!passOK)return json({error:'Incorrect admin credentials.'},401);
  await clearThrottle(env,request);
  const token=await issueSession(env);
  return json({ok:true},200,{'set-cookie':setCookie('alo_admin_session',token,604800)});
 }catch(error){console.error('Admin Turnstile login failed',error);return json({error:'Server error. Please try again.'},500)}
}
