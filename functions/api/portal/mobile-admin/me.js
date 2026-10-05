const enc=new TextEncoder();
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
function tokenFrom(request){
 const auth=String(request.headers.get('authorization')||'');
 if(auth.toLowerCase().startsWith('bearer '))return auth.slice(7).trim();
 return '';
}
export async function onRequestGet({request,env}){
 try{
  if(!env.DB)return json({error:'Database is not configured.'},500);
  const token=tokenFrom(request);if(!token)return json({authenticated:false},401);
  const hash=await sha256(token);
  const row=await env.DB.prepare("SELECT id,expires_at FROM sessions WHERE token_hash=? AND role='admin' AND expires_at>datetime('now')").bind(hash).first();
  return row?json({authenticated:true,expiresAt:row.expires_at}):json({authenticated:false},401);
 }catch(e){return json({error:'Server error. Please try again.'},500)}
}