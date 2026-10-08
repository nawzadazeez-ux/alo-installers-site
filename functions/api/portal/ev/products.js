const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','cdn-cache-control':'no-store'}});
async function ensure(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS ev_products (id INTEGER PRIMARY KEY AUTOINCREMENT,brand TEXT NOT NULL,name TEXT NOT NULL,type TEXT NOT NULL DEFAULT 'AC',power_kw REAL NOT NULL DEFAULT 0,phase TEXT,spec TEXT,warranty TEXT,price REAL NOT NULL DEFAULT 0,show_price INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  const {results:cols}=await db.prepare('PRAGMA table_info(ev_products)').all();const have=new Set(cols.map(x=>x.name));
  for(const [n,t] of [['model','TEXT'],['image_url','TEXT'],['datasheet_url','TEXT'],['compatibility','TEXT']])if(!have.has(n))await db.prepare('ALTER TABLE ev_products ADD COLUMN '+n+' '+t).run();
}
export async function onRequestGet({env}){
  if(!env.DB)return json({products:[]});await ensure(env.DB);
  const {results}=await env.DB.prepare('SELECT id,brand,name,type,power_kw,phase,spec,warranty,model,image_url,datasheet_url,compatibility,price,show_price FROM ev_products WHERE active=1 ORDER BY sort_order,id').all();
  return json({products:results});
}