const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store'}});
async function authorized(request){
  const auth=request.headers.get('authorization')||'';
  if(!auth.startsWith('Bearer ')) return false;
  const u=new URL(request.url);u.pathname='/api/portal/mobile-admin/me';u.search='';
  try{const r=await fetch(u.toString(),{headers:{authorization:auth,accept:'application/json'}});return r.ok;}catch(_){return false;}
}
async function ensure(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS app_runtime_config (id INTEGER PRIMARY KEY CHECK(id=1), config_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS admin_backups (id INTEGER PRIMARY KEY AUTOINCREMENT, label TEXT, snapshot_json TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS admin_activity_log (id INTEGER PRIMARY KEY AUTOINCREMENT, action TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
}
const defaultConfig=()=>({
  android:{enabled:true,latest_build:31,minimum_build:0,latest_version:'5.6.0',store_url:''},
  ios:{enabled:false,latest_build:31,minimum_build:0,latest_version:'5.6.0',store_url:''},
  message:{ku:'وەشانێکی نوێی ALO SOLAR بەردەستە.',ar:'يتوفر إصدار جديد من ALO SOLAR.',en:'A new version of ALO SOLAR is available.'}
});
async function snapshot(db){
  const tables=['app_calculator_config','installer_products','ev_products','app_runtime_config'];
  const out={};
  for(const t of tables){
    try{const {results}=await db.prepare('SELECT * FROM '+t).all();out[t]=results||[];}catch(_){out[t]=[];}
  }
  return out;
}
export async function onRequestGet({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  const u=new URL(request.url),view=u.searchParams.get('view')||'config';
  if(view==='backups'){
    const {results}=await env.DB.prepare('SELECT id,label,created_at FROM admin_backups ORDER BY id DESC LIMIT 20').all();
    return json({backups:results});
  }
  if(view==='activity'){
    const {results}=await env.DB.prepare('SELECT id,action,detail,created_at FROM admin_activity_log ORDER BY id DESC LIMIT 100').all();
    return json({activity:results});
  }
  const row=await env.DB.prepare('SELECT config_json,updated_at FROM app_runtime_config WHERE id=1').first();
  return json({config:row?JSON.parse(row.config_json):defaultConfig(),updated_at:row?.updated_at||null});
}
export async function onRequestPost({request,env}){
  if(!(await authorized(request)))return json({error:'Unauthorized'},401);
  if(!env.DB)return json({error:'DB binding is missing.'},500);
  await ensure(env.DB);
  let d;try{d=await request.json();}catch(_){return json({error:'Invalid JSON.'},400);}
  const action=String(d?.action||'save_config');
  if(action==='save_config'){
    const config=d?.config&&typeof d.config==='object'?d.config:null;
    if(!config)return json({error:'Invalid config.'},400);
    await env.DB.batch([
      env.DB.prepare("INSERT INTO app_runtime_config(id,config_json,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,updated_at=CURRENT_TIMESTAMP").bind(JSON.stringify(config)),
      env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('app_config',?)").bind('App update configuration changed')
    ]);
    return json({ok:true,config});
  }
  if(action==='create_backup'){
    const snap=await snapshot(env.DB);
    const label=String(d?.label||'Manual backup').slice(0,100);
    const r=await env.DB.prepare('INSERT INTO admin_backups(label,snapshot_json) VALUES(?,?)').bind(label,JSON.stringify(snap)).run();
    await env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('backup',?)").bind('Backup created').run();
    return json({ok:true,id:r.meta?.last_row_id});
  }
  if(action==='restore_backup'){
    const id=Number(d?.id);if(!id||d?.confirmation!=='RESTORE')return json({error:'Confirmation required.'},400);
    const row=await env.DB.prepare('SELECT snapshot_json FROM admin_backups WHERE id=?').bind(id).first();
    if(!row)return json({error:'Backup not found.'},404);
    const snap=JSON.parse(row.snapshot_json);
    if(Array.isArray(snap.app_calculator_config)&&snap.app_calculator_config[0]){
      const x=snap.app_calculator_config[0];
      await env.DB.prepare("INSERT INTO app_calculator_config(id,config_json,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,updated_at=CURRENT_TIMESTAMP").bind(x.config_json).run();
    }
    if(Array.isArray(snap.app_runtime_config)&&snap.app_runtime_config[0]){
      const x=snap.app_runtime_config[0];
      await env.DB.prepare("INSERT INTO app_runtime_config(id,config_json,updated_at) VALUES(1,?,CURRENT_TIMESTAMP) ON CONFLICT(id) DO UPDATE SET config_json=excluded.config_json,updated_at=CURRENT_TIMESTAMP").bind(x.config_json).run();
    }
    if(Array.isArray(snap.installer_products)){
      await env.DB.prepare('DELETE FROM installer_products').run();
      for(const x of snap.installer_products){
        await env.DB.prepare('INSERT INTO installer_products(id,type,name,spec,retail_price,trade_price,active,sort_order,updated_at) VALUES(?,?,?,?,?,?,?,?,?)')
          .bind(x.id,x.type,x.name,x.spec,x.retail_price,x.trade_price,x.active,x.sort_order,x.updated_at).run();
      }
    }
    if(Array.isArray(snap.ev_products)){
      await env.DB.prepare('DELETE FROM ev_products').run();
      for(const x of snap.ev_products){
        const cols=Object.keys(x);
        const qs=cols.map(()=>'?').join(',');
        await env.DB.prepare('INSERT INTO ev_products('+cols.join(',')+') VALUES('+qs+')').bind(...cols.map(k=>x[k])).run();
      }
    }
    await env.DB.prepare("INSERT INTO admin_activity_log(action,detail) VALUES('restore',?)").bind('Backup restored: '+id).run();
    return json({ok:true});
  }
  return json({error:'Unknown action.'},400);
}