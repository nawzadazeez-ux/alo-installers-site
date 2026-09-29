const enc=new TextEncoder();
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const sha256=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(String(s||''))));
const json=(data,status=200,headers={})=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
function cookieValue(request,name){
 const raw=request.headers.get('Cookie')||'';
 for(const part of raw.split(';')){
  const [k,...rest]=part.trim().split('=');
  if(k===name)return decodeURIComponent(rest.join('='));
 }
 return '';
}
export async function onRequestPost({request,env}){
 try{
  const token=cookieValue(request,'alo_admin_session');
  if(env.DB&&token){
   const hash=await sha256(token);
   await env.DB.prepare('DELETE FROM sessions WHERE token_hash=? AND role=?').bind(hash,'admin').run();
  }
  return json({ok:true},200,{'set-cookie':'alo_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});
 }catch(error){
  console.error('Admin logout failed',error);
  return json({ok:false,error:'Logout failed.'},500,{'set-cookie':'alo_admin_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'});
 }
}
