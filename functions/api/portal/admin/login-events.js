const enc=new TextEncoder();
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
function cookieValue(request,name){
 const raw=request.headers.get('Cookie')||'';
 for(const part of raw.split(';')){
  const [k,...rest]=part.trim().split('=');
  if(k===name)return decodeURIComponent(rest.join('='));
 }
 return '';
}
async function requireAdmin(request,env){
 if(!env.DB)return false;
 const token=cookieValue(request,'alo_admin_session');
 if(!token)return false;
 const hash=await sha256(token);
 const row=await env.DB.prepare("SELECT id FROM sessions WHERE token_hash=? AND role='admin' AND expires_at>datetime('now') LIMIT 1").bind(hash).first();
 return Boolean(row);
}
async function ensureTable(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS admin_login_events (id INTEGER PRIMARY KEY AUTOINCREMENT,ip_hash TEXT NOT NULL,username_hash TEXT,status TEXT NOT NULL,user_agent TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_admin_login_events_created ON admin_login_events(created_at)').run();
}
export async function onRequestGet({request,env}){
 try{
  if(!(await requireAdmin(request,env)))return json({error:'Unauthorized.'},401);
  await ensureTable(env);
  const url=new URL(request.url);
  const limit=Math.min(200,Math.max(20,Number(url.searchParams.get('limit')||100)));
  const rows=await env.DB.prepare("SELECT id,status,user_agent,created_at,substr(ip_hash,1,10) AS connection_id FROM admin_login_events ORDER BY id DESC LIMIT ?").bind(limit).all();
  const stats=await env.DB.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status IN ('success','success_2fa') THEN 1 ELSE 0 END) AS success, SUM(CASE WHEN status='failed' THEN 1 ELSE 0 END) AS failed, SUM(CASE WHEN status='locked' THEN 1 ELSE 0 END) AS locked, SUM(CASE WHEN status IN ('turnstile_failed','2fa_failed') THEN 1 ELSE 0 END) AS challenged FROM admin_login_events WHERE created_at>=datetime('now','-7 days')").first();
  return json({events:rows?.results||[],stats:{total:Number(stats?.total||0),success:Number(stats?.success||0),failed:Number(stats?.failed||0),locked:Number(stats?.locked||0),challenged:Number(stats?.challenged||0)},retentionDays:90});
 }catch(error){
  console.error('Admin login events failed',error);
  return json({error:'Could not load login attempts.'},500);
 }
}
