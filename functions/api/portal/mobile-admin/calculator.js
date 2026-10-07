async function ensure(db){
  await db.prepare(`CREATE TABLE IF NOT EXISTS app_calculator_config (id INTEGER PRIMARY KEY CHECK(id=1), config_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
}
async function authorized(request){
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return false;
  const u=new URL(request.url);
  u.pathname='/api/portal/mobile-admin/me';
  u.search='';
  try{
    const r=await fetch(u.toString(),{headers:{authorization:auth,accept:'application/json'}});
    return r.ok;
  }catch(_){
    return false;
  }
}
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
export async function onRequestGet({request,env}){
  if(!(await authorized(request))) return json({error:'Unauthorized'},401);
  if(!env.DB) return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  const row=await env.DB.prepare('SELECT config_json, updated_at FROM app_calculator_config WHERE id=1').first();
  if(!row) return json({items:[],settings:{},empty:true});
  try{
    return json({...JSON.parse(row.config_json),updated_at:row.updated_at});
  }catch(_){
    return json({error:'Saved calculator config is invalid.'},500);
  }
}
export async function onRequestPost({request,env}){
  if(!(await authorized(request))) return json({error:'Unauthorized'},401);
  if(!env.DB) return json({error:'DB binding is missing.'},500);
  let body;
  try{ body=await request.json(); }catch(_){ return json({error:'Invalid JSON.'},400); }
  const items=Array.isArray(body?.items)?body.items:[];
  const settings=(body?.settings&&typeof body.settings==='object')?body.settings:{};
  if(items.length<1) return json({error:'At least one calculator item is required.'},400);
  for(const x of items){
    if(!x||typeof x.code!=='string'||!x.code.trim()||!x.category||!Number.isFinite(Number(x.price))||Number(x.price)<0){
      return json({error:'Invalid calculator item.'},400);
    }
  }
  for(const [k,v] of Object.entries(settings)){
    if(!k||!Number.isFinite(Number(v))||Number(v)<0) return json({error:`Invalid setting: ${k}`},400);
  }
  const clean={
    items:items.map(x=>({...x,price:Number(x.price)})),
    settings:Object.fromEntries(Object.entries(settings).map(([k,v])=>[k,Number(v)]))
  };
  await ensure(env.DB);
  await env.DB.prepare(`INSERT INTO app_calculator_config(id,config_json,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,updated_at=CURRENT_TIMESTAMP`).bind(JSON.stringify(clean)).run();
  return json({ok:true,...clean});
}
