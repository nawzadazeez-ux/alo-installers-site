// Portal API used by the Pages advanced-mode Worker.
const enc = new TextEncoder();
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const clean = (v, max=120) => String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
const hex = b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const randomHex = n => {const b=new Uint8Array(n);crypto.getRandomValues(b);return hex(b)};
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
async function passwordHash(password,salt=randomHex(16)){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:210000,hash:'SHA-256'},key,256);return {salt,hash:hex(bits)}}
async function passwordOK(password,salt,expected){const actual=(await passwordHash(password,salt)).hash;if(actual.length!==expected.length)return false;let d=0;for(let i=0;i<actual.length;i++)d|=actual.charCodeAt(i)^expected.charCodeAt(i);return d===0}
function cookie(request,name){const raw=request.headers.get('cookie')||'';for(const part of raw.split(';')){const [k,...v]=part.trim().split('=');if(k===name)return decodeURIComponent(v.join('='))}return ''}
function setCookie(name,value,maxAge){return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
function clearCookie(name){return `${name}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`}
function sameOrigin(request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin}
async function body(request){try{return await request.json()}catch{return null}}
async function sessionUser(env,request,role){const token=cookie(request,role==='admin'?'alo_admin_session':'alo_installer_session');if(!token)return null;const hash=await sha256(token);const row=await env.DB.prepare('SELECT s.id,s.user_id,s.expires_at,u.full_name,u.username,u.status FROM sessions s LEFT JOIN installers u ON u.id=s.user_id WHERE s.token_hash=? AND s.role=? AND s.expires_at>datetime(\'now\')').bind(hash,role).first();return row||null}
async function issueSession(env,role,userId){const token=randomHex(32),hash=await sha256(token);await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,role,expires_at) VALUES(?,?,?,datetime('now','+7 days'))").bind(hash,userId||null,role).run();return token}
async function throttle(env,request,scope){const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await sha256(`${scope}:${ip}`);const row=await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE key=? AND created_at>datetime('now','-15 minutes')").bind(key).first();if((row?.count||0)>=8)return false;await env.DB.prepare('INSERT INTO login_attempts(key) VALUES(?)').bind(key).run();return true}
async function clearThrottle(env,request,scope){const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await sha256(`${scope}:${ip}`);await env.DB.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run()}
function pathOf(context){return '/'+(context.params.path||[]).join('/')}

export async function onRequest(context){
 const {request,env}=context,path=pathOf(context),method=request.method;
 if(!env.DB)return json({error:'Database binding DB is missing.'},500);
 if(!sameOrigin(request)&&method!=='GET')return json({error:'Invalid origin.'},403);
 try{
  if(path==='/register'&&method==='POST'){
   const d=await body(request);if(!d)return json({error:'Invalid request.'},400);
   const fullName=clean(d.fullName),phone=clean(d.phone,30),business=clean(d.business),city=clean(d.city,60),username=clean(d.username,40).toLowerCase(),password=String(d.password||'');
   if(fullName.length<3||phone.length<7||username.length<4||!/^[a-z0-9._-]+$/.test(username)||password.length<8)return json({error:'Please complete all required fields correctly.'},400);
   const exists=await env.DB.prepare('SELECT id FROM installers WHERE username=? OR phone=?').bind(username,phone).first();if(exists)return json({error:'Username or phone already exists.'},409);
   const p=await passwordHash(password);await env.DB.prepare("INSERT INTO installers(full_name,phone,business,city,username,password_hash,password_salt,status) VALUES(?,?,?,?,?,?,?,'pending')").bind(fullName,phone,business,city,username,p.hash,p.salt).run();
   return json({ok:true,status:'pending'},201);
  }
  if(path==='/login'&&method==='POST'){
   if(!await throttle(env,request,'installer'))return json({error:'Too many attempts. Try again later.'},429);
   const d=await body(request),username=clean(d?.username,40).toLowerCase(),password=String(d?.password||'');const u=await env.DB.prepare('SELECT * FROM installers WHERE username=?').bind(username).first();
   if(!u||!await passwordOK(password,u.password_salt,u.password_hash))return json({error:'Incorrect username or password.'},401);
   if(u.status!=='approved')return json({error:u.status==='pending'?'Your application is awaiting approval.':'Your account is not active.',status:u.status},403);
   await clearThrottle(env,request,'installer');const token=await issueSession(env,'installer',u.id);return json({ok:true,name:u.full_name},200,{'set-cookie':setCookie('alo_installer_session',token,604800)});
  }
  if(path==='/logout'&&method==='POST'){const token=cookie(request,'alo_installer_session');if(token){try{await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run()}catch(e){console.error('Installer session cleanup failed',e)}}return json({ok:true},200,{'set-cookie':clearCookie('alo_installer_session')})}
  if(path==='/me'&&method==='GET'){const u=await sessionUser(env,request,'installer');return u?json({authenticated:true,name:u.full_name,username:u.username}):json({authenticated:false},401)}
  if(path==='/products'&&method==='GET'){const u=await sessionUser(env,request,'installer');if(!u)return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT id,type,name,spec,retail_price,trade_price FROM installer_products WHERE active=1 ORDER BY sort_order,id').all();return json({products:results,updatedAt:new Date().toISOString()})}
  if(path==='/admin/login'&&method==='POST'){
   if(!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD)return json({error:'Admin credentials are not configured.'},500);if(!await throttle(env,request,'admin'))return json({error:'Too many attempts. Try again later.'},429);
   const d=await body(request),u=clean(d?.username,80),p=String(d?.password||'');const userOK=(await sha256(u))===(await sha256(env.ADMIN_USERNAME)),passOK=(await sha256(p))===(await sha256(env.ADMIN_PASSWORD));if(!userOK||!passOK)return json({error:'Incorrect admin credentials.'},401);
   await clearThrottle(env,request,'admin');const token=await issueSession(env,'admin',null);return json({ok:true},200,{'set-cookie':setCookie('alo_admin_session',token,604800)});
  }
  if(path==='/admin/logout'&&method==='POST'){const token=cookie(request,'alo_admin_session');if(token){try{await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run()}catch(e){console.error('Admin session cleanup failed',e)}}return json({ok:true},200,{'set-cookie':clearCookie('alo_admin_session')})}
  if(path==='/admin/me'&&method==='GET'){return (await sessionUser(env,request,'admin'))?json({authenticated:true}):json({authenticated:false},401)}
  if(path==='/admin/applications'&&method==='GET'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT id,full_name,phone,business,city,username,status,created_at FROM installers ORDER BY CASE status WHEN \'pending\' THEN 0 ELSE 1 END,created_at DESC').all();return json({applications:results})}
  if(path==='/admin/applications'&&method==='POST'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const d=await body(request),id=Number(d?.id),action=d?.action;if(!id||!['approve','reject','disable'].includes(action))return json({error:'Invalid action.'},400);const status=action==='approve'?'approved':action==='reject'?'rejected':'disabled';await env.DB.prepare("UPDATE installers SET status=?,approved_at=CASE WHEN ?='approved' THEN datetime('now') ELSE approved_at END WHERE id=?").bind(status,status,id).run();if(status!=='approved')await env.DB.prepare("DELETE FROM sessions WHERE role='installer' AND user_id=?").bind(id).run();return json({ok:true,status})}
  if(path==='/admin/products'&&method==='GET'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT * FROM installer_products ORDER BY sort_order,id').all();return json({products:results})}
  if(path==='/admin/products'&&method==='POST'){
   if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);
   const d=await body(request),id=Number(d?.id||0),type=clean(d?.type,30).toLowerCase(),name=clean(d?.name,120),spec=clean(d?.spec,240),retail=Number(d?.retailPrice),trade=Number(d?.tradePrice),sortOrder=Number(d?.sortOrder||0),active=d?.active?1:0;
   if(!['panel','inverter','battery','service'].includes(type)||name.length<2||!Number.isFinite(retail)||!Number.isFinite(trade)||retail<0||trade<0||!Number.isFinite(sortOrder))return json({error:'Invalid product details.'},400);
   if(id){await env.DB.prepare("UPDATE installer_products SET type=?,name=?,spec=?,retail_price=?,trade_price=?,active=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(type,name,spec,retail,trade,active,sortOrder,id).run();return json({ok:true,id})}
   const result=await env.DB.prepare("INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,?,?)").bind(type,name,spec,retail,trade,active,sortOrder).run();return json({ok:true,id:result.meta?.last_row_id},201)
  }
  if(path==='/admin/products'&&method==='DELETE'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const d=await body(request),id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);await env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id).run();return json({ok:true})}
  return json({error:'Not found.'},404);
 }catch(e){console.error(e);return json({error:'Server error. Please try again.'},500)}
}
