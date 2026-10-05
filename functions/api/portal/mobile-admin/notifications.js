const enc=new TextEncoder();
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
function tokenFrom(request){const a=String(request.headers.get('authorization')||'');return a.toLowerCase().startsWith('bearer ')?a.slice(7).trim():''}
async function adminSession(env,request){
 const token=tokenFrom(request);if(!token)return null;
 const hash=await sha256(token);
 return env.DB.prepare("SELECT id FROM sessions WHERE token_hash=? AND role='admin' AND expires_at>datetime('now')").bind(hash).first();
}
async function ensureTables(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS installer_announcements (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,message TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'general',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS app_announcements (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,message TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'general',audience TEXT NOT NULL DEFAULT 'users',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
}
const clean=(v,max)=>String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
export async function onRequestGet({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!await adminSession(env,request))return json({error:'Unauthorized'},401);
  await ensureTables(env);
  const {results:dealers}=await env.DB.prepare('SELECT id,title,message,kind,active,created_at,updated_at FROM installer_announcements ORDER BY id DESC LIMIT 100').all();
  const {results:app}=await env.DB.prepare('SELECT id,title,message,kind,audience,active,created_at,updated_at FROM app_announcements ORDER BY id DESC LIMIT 100').all();
  return json({dealerAnnouncements:dealers||[],appAnnouncements:app||[]});
 }catch(e){console.error(e);return json({error:'Server error. Please try again.'},500)}
}
export async function onRequestPost({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!await adminSession(env,request))return json({error:'Unauthorized'},401);
  await ensureTables(env);
  let d;try{d=await request.json()}catch{return json({error:'Invalid request.'},400)}
  const title=clean(d?.title,120),message=clean(d?.message,2000),kind=clean(d?.kind||'general',20),audience=clean(d?.audience||'users',20);
  if(!title||!message||!['general','price','product','offer'].includes(kind)||!['users','dealers','all'].includes(audience))return json({error:'Invalid notification data.'},400);
  const ops=[];
  if(audience==='users'||audience==='all')ops.push(env.DB.prepare('INSERT INTO app_announcements(title,message,kind,audience,active) VALUES(?,?,?,?,1)').bind(title,message,kind,audience));
  if(audience==='dealers'||audience==='all')ops.push(env.DB.prepare('INSERT INTO installer_announcements(title,message,kind,active) VALUES(?,?,?,1)').bind(title,message,kind));
  if(ops.length)await env.DB.batch(ops);
  return json({ok:true},201);
 }catch(e){console.error(e);return json({error:'Server error. Please try again.'},500)}
}