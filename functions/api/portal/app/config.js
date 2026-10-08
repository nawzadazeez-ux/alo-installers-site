const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store, no-cache, must-revalidate','cdn-cache-control':'no-store'}});
const fallback={android:{enabled:true,latest_build:31,minimum_build:0,latest_version:'5.6.0',store_url:''},ios:{enabled:false,latest_build:31,minimum_build:0,latest_version:'5.6.0',store_url:''},message:{ku:'وەشانێکی نوێی ALO SOLAR بەردەستە.',ar:'يتوفر إصدار جديد من ALO SOLAR.',en:'A new version of ALO SOLAR is available.'}};
export async function onRequestGet({env}){
  if(!env.DB)return json(fallback);
  try{
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS app_runtime_config (id INTEGER PRIMARY KEY CHECK(id=1), config_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
    const row=await env.DB.prepare('SELECT config_json FROM app_runtime_config WHERE id=1').first();
    return json(row?JSON.parse(row.config_json):fallback);
  }catch(_){return json(fallback);}
}