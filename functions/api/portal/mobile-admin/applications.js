const enc=new TextEncoder();
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
const randomHex=n=>{const b=new Uint8Array(n);crypto.getRandomValues(b);return hex(b)};
const clean=(v,max=300)=>String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
function cookie(request,name){const raw=request.headers.get('cookie')||'';for(const part of raw.split(';')){const [k,...v]=part.trim().split('=');if(k===name)return decodeURIComponent(v.join('='))}return ''}
async function adminSession(env,request){
 const auth=String(request.headers.get('authorization')||'');
 const bearer=auth.toLowerCase().startsWith('bearer ')?auth.slice(7).trim():'';
 const token=bearer||cookie(request,'alo_admin_session');if(!token)return null;
 const hash=await sha256(token);
 return await env.DB.prepare("SELECT id FROM sessions WHERE token_hash=? AND role='admin' AND expires_at>datetime('now')").bind(hash).first();
}
async function ensureInstallerColumns(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS installers (id INTEGER PRIMARY KEY AUTOINCREMENT,full_name TEXT NOT NULL,phone TEXT NOT NULL,business TEXT,city TEXT,username TEXT NOT NULL,password_hash TEXT,password_salt TEXT,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,approved_at TEXT)").run();
 const {results:columns}=await env.DB.prepare('PRAGMA table_info(installers)').all();
 const existing=new Set(columns.map(x=>x.name));
 const migrations=[['verification_code','TEXT'],['archived_at','TEXT'],['ban_reason','TEXT']];
 for(const [name,type] of migrations)if(!existing.has(name))await env.DB.prepare(`ALTER TABLE installers ADD COLUMN ${name} ${type}`).run();
}
async function listApplications(env){
 await ensureInstallerColumns(env);
 const {results}=await env.DB.prepare("SELECT i.id,i.full_name,i.phone,i.business,i.city,i.username,i.status,i.created_at,i.approved_at,i.verification_code,i.archived_at,i.ban_reason,(SELECT COUNT(*) FROM installer_purchases p WHERE p.installer_id=i.id) purchase_count,COALESCE((SELECT SUM(p.amount) FROM installer_purchases p WHERE p.installer_id=i.id AND p.purchased_at>=datetime('now','-2 months')),0) reward_total FROM installers i ORDER BY CASE i.status WHEN 'pending' THEN 0 ELSE 1 END,i.created_at DESC").all();
 return results||[];
}
export async function onRequestGet({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!await adminSession(env,request))return json({error:'Unauthorized'},401);
  const applications=await listApplications(env);
  return json({applications,count:applications.length});
 }catch(e){console.error('Mobile admin applications GET failed',e);return json({error:'Server error. Please try again.'},500)}
}
export async function onRequestPost({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  if(!await adminSession(env,request))return json({error:'Unauthorized'},401);
  await ensureInstallerColumns(env);
  let d;try{d=await request.json()}catch{return json({error:'Invalid request.'},400)}
  const id=Number(d?.id),action=String(d?.action||'');
  if(!Number.isSafeInteger(id)||id<=0||!['approve','reject','disable','ban','unban','archive','restore','delete'].includes(action))return json({error:'Invalid action.'},400);
  const account=await env.DB.prepare('SELECT id,username,status,archived_at FROM installers WHERE id=?').bind(id).first();
  if(!account)return json({error:'Installer account not found.'},404);
  if(action==='delete'){
   if(String(d?.confirmation||'')!==String(account.username||''))return json({error:'Type the username correctly to delete this account.'},400);
   const purchase=await env.DB.prepare('SELECT COUNT(*) count FROM installer_purchases WHERE installer_id=?').bind(id).first();
   if(Number(purchase?.count||0)>0)return json({error:'This account has purchase history; archive it instead.'},409);
   await env.DB.batch([
    env.DB.prepare("DELETE FROM sessions WHERE role='installer' AND user_id=?").bind(id),
    env.DB.prepare('DELETE FROM installers WHERE id=?').bind(id)
   ]);
   return json({ok:true,deleted:true});
  }
  if(account.archived_at&&action!=='restore')return json({error:'Restore this archived account first.'},409);
  const status=['approve','unban'].includes(action)?'approved':action==='reject'?'rejected':action==='restore'?'pending':'disabled';
  const reason=['ban','disable'].includes(action)?clean(d?.reason):null;
  const verification=status==='approved'?randomHex(16):null;
  const changes=[env.DB.prepare("UPDATE installers SET status=?,approved_at=CASE WHEN ?='approved' THEN COALESCE(approved_at,datetime('now')) ELSE approved_at END,verification_code=CASE WHEN ?='approved' THEN COALESCE(NULLIF(verification_code,''),?) ELSE verification_code END,archived_at=CASE WHEN ?='archive' THEN datetime('now') WHEN ?='restore' THEN NULL ELSE archived_at END,ban_reason=? WHERE id=?").bind(status,status,status,verification,action,action,reason,id)];
  if(status!=='approved')changes.push(env.DB.prepare("DELETE FROM sessions WHERE role='installer' AND user_id=?").bind(id));
  await env.DB.batch(changes);
  return json({ok:true,status});
 }catch(e){console.error('Mobile admin applications POST failed',e);return json({error:'Server error. Please try again.'},500)}
}
