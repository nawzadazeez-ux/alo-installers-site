const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
const clean=(v,max=240)=>String(v??'').trim().replace(/[<>]/g,'').slice(0,max);
async function authorized(request){
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return false;
  const u=new URL(request.url);u.pathname='/api/portal/mobile-admin/me';u.search='';
  try{const r=await fetch(u.toString(),{headers:{authorization:auth,accept:'application/json'}});return r.ok;}catch(_){return false;}
}
async function ensure(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS installer_products (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT NOT NULL,name TEXT NOT NULL,spec TEXT,retail_price REAL NOT NULL DEFAULT 0,trade_price REAL NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS installer_product_history (id INTEGER PRIMARY KEY AUTOINCREMENT,product_id INTEGER,action TEXT NOT NULL,name TEXT,trade_price REAL,changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS admin_activity_log (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
}
export async function onRequestGet({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  const {results:products}=await env.DB.prepare('SELECT * FROM installer_products ORDER BY sort_order,id').all();
  const {results:history}=await env.DB.prepare('SELECT id,product_id,action,name,trade_price,changed_at FROM installer_product_history ORDER BY id DESC LIMIT 30').all();
  return json({products,history});
}
export async function onRequestPost({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id||0),type=clean(d?.type,30).toLowerCase(),name=clean(d?.name,120),spec=clean(d?.spec,240);
  const retail=Number(d?.retailPrice??d?.retail_price??0),trade=Number(d?.tradePrice??d?.trade_price??0),sort=Math.trunc(Number(d?.sortOrder??d?.sort_order??0)),active=d?.active===false?0:1;
  if(!['panel','inverter','battery','electrical','structure','cable'].includes(type)||name.length<2||!Number.isFinite(retail)||!Number.isFinite(trade)||retail<0||trade<0||!Number.isFinite(sort))return json({error:'Invalid product details.'},400);
  if(id){
    await env.DB.batch([
      env.DB.prepare("UPDATE installer_products SET type=?,name=?,spec=?,retail_price=?,trade_price=?,active=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(type,name,spec,retail,trade,active,sort,id),
      env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(id,'update',name,trade),
      env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('installer_product_update',?)").bind(name+' = 
    ]);
    return json({ok:true,id});
  }
  const r=await env.DB.prepare("INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,?,?)").bind(type,name,spec,retail,trade,active,sort).run();
  const newId=Number(r.meta?.last_row_id||0);
  await env.DB.batch([env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(newId,'add',name,trade),env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('installer_product_add',?)").bind(name+' = 
  return json({ok:true,id:newId},201);
}
export async function onRequestDelete({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);
  const row=await env.DB.prepare('SELECT name,trade_price FROM installer_products WHERE id=?').bind(id).first();
  if(!row)return json({error:'Product not found.'},404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id),
    env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(id,'delete',row.name,Number(row.trade_price||0)),
    env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('installer_product_delete',?)").bind(row.name)
  ]);
  return json({ok:true});
}
+trade)
    ]);
    return json({ok:true,id});
  }
  const r=await env.DB.prepare("INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,?,?)").bind(type,name,spec,retail,trade,active,sort).run();
  const newId=Number(r.meta?.last_row_id||0);
  await env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(newId,'add',name,trade).run();
  return json({ok:true,id:newId},201);
}
export async function onRequestDelete({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);
  const row=await env.DB.prepare('SELECT name,trade_price FROM installer_products WHERE id=?').bind(id).first();
  if(!row)return json({error:'Product not found.'},404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id),
    env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(id,'delete',row.name,Number(row.trade_price||0))
  ]);
  return json({ok:true});
}
+trade)]);
  return json({ok:true,id:newId},201);
}
export async function onRequestDelete({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);
  const row=await env.DB.prepare('SELECT name,trade_price FROM installer_products WHERE id=?').bind(id).first();
  if(!row)return json({error:'Product not found.'},404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id),
    env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(id,'delete',row.name,Number(row.trade_price||0))
  ]);
  return json({ok:true});
}
+trade)
    ]);
    return json({ok:true,id});
  }
  const r=await env.DB.prepare("INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,?,?)").bind(type,name,spec,retail,trade,active,sort).run();
  const newId=Number(r.meta?.last_row_id||0);
  await env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(newId,'add',name,trade).run();
  return json({ok:true,id:newId},201);
}
export async function onRequestDelete({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);
  const row=await env.DB.prepare('SELECT name,trade_price FROM installer_products WHERE id=?').bind(id).first();
  if(!row)return json({error:'Product not found.'},404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id),
    env.DB.prepare("INSERT INTO installer_product_history(product_id,action,name,trade_price) VALUES(?,?,?,?)").bind(id,'delete',row.name,Number(row.trade_price||0))
  ]);
  return json({ok:true});
}
