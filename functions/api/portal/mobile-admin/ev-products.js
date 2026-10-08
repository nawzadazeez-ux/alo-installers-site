const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean=(v,max=500)=>String(v??'').trim().replace(/[<>]/g,'').slice(0,max);
async function authorized(request){
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer '))return false;
  const u=new URL(request.url);u.pathname='/api/portal/mobile-admin/me';u.search='';
  try{const r=await fetch(u.toString(),{headers:{authorization:auth,accept:'application/json'}});return r.ok;}catch(_){return false;}
}
async function ensure(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS ev_products (id INTEGER PRIMARY KEY AUTOINCREMENT,brand TEXT NOT NULL,name TEXT NOT NULL,type TEXT NOT NULL DEFAULT 'AC',power_kw REAL NOT NULL DEFAULT 0,phase TEXT,spec TEXT,warranty TEXT,price REAL NOT NULL DEFAULT 0,show_price INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  const {results:cols}=await db.prepare('PRAGMA table_info(ev_products)').all();const have=new Set(cols.map(x=>x.name));
  for(const [n,t] of [['model','TEXT'],['image_url','TEXT'],['datasheet_url','TEXT'],['compatibility','TEXT']])if(!have.has(n))await db.prepare('ALTER TABLE ev_products ADD COLUMN '+n+' '+t).run();
  await db.prepare("CREATE TABLE IF NOT EXISTS admin_activity_log (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
}
export async function onRequestGet({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);const {results:products}=await env.DB.prepare('SELECT * FROM ev_products ORDER BY sort_order,id').all();return json({products});
}
export async function onRequestPost({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);if(!env.DB)return json({error:'DB binding is missing.'},500);await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id||0),brand=clean(d?.brand,60),name=clean(d?.name,120),type=clean(d?.type,10).toUpperCase(),power=Number(d?.powerKw??d?.power_kw??0),phase=clean(d?.phase,30),spec=clean(d?.spec,300),warranty=clean(d?.warranty,100),model=clean(d?.model,100),image=clean(d?.imageUrl??d?.image_url,500),datasheet=clean(d?.datasheetUrl??d?.datasheet_url,500),compat=clean(d?.compatibility,240),price=Number(d?.price||0),show=d?.showPrice===true||d?.show_price===1?1:0,active=d?.active===false?0:1,sort=Math.trunc(Number(d?.sortOrder??d?.sort_order??0));
  if(!brand||!name||!['AC','DC'].includes(type)||!Number.isFinite(power)||power<=0||!Number.isFinite(price)||price<0)return json({error:'Invalid EV product.'},400);
  if(id){
    await env.DB.prepare("UPDATE ev_products SET brand=?,name=?,type=?,power_kw=?,phase=?,spec=?,warranty=?,model=?,image_url=?,datasheet_url=?,compatibility=?,price=?,show_price=?,active=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(brand,name,type,power,phase,spec,warranty,model,image,datasheet,compat,price,show,active,sort,id).run();
    await env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('ev_update',?)").bind(name).run();return json({ok:true,id});
  }
  const r=await env.DB.prepare("INSERT INTO ev_products(brand,name,type,power_kw,phase,spec,warranty,model,image_url,datasheet_url,compatibility,price,show_price,active,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(brand,name,type,power,phase,spec,warranty,model,image,datasheet,compat,price,show,active,sort).run();
  await env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('ev_add',?)").bind(name).run();return json({ok:true,id:r.meta?.last_row_id},201);
}
export async function onRequestDelete({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);if(!env.DB)return json({error:'DB binding is missing.'},500);await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}const id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);
  const row=await env.DB.prepare('SELECT name FROM ev_products WHERE id=?').bind(id).first();if(!row)return json({error:'Not found.'},404);
  await env.DB.batch([env.DB.prepare('DELETE FROM ev_products WHERE id=?').bind(id),env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('ev_delete',?)").bind(row.name)]);
  return json({ok:true});
}