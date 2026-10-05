const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
export async function onRequestGet({env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS app_announcements (id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,message TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'general',audience TEXT NOT NULL DEFAULT 'users',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  const {results}=await env.DB.prepare("SELECT id,title,message,kind,audience,created_at,updated_at FROM app_announcements WHERE active=1 AND audience IN ('users','all') ORDER BY id DESC LIMIT 50").all();
  return json({announcements:results||[]});
 }catch(e){console.error(e);return json({error:'Server error. Please try again.'},500)}
}