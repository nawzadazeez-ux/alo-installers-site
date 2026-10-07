const defaultConfig = {
  items: [
    {code:'longi-x10-650',category:'panel',quality:'high',mode:'both',name:'LONGi Hi-MO X10 650W',price:108,warranty:'15 Years Warranty',watts:650,kw:0,phase:'single',max_panels:0,amps_per_hour:0},
    {code:'power-solid-620-medium',category:'panel',quality:'medium',mode:'both',name:'Power Solid 620W',price:105,warranty:'15 Years Warranty',watts:620,kw:0,phase:'single',max_panels:0,amps_per_hour:0},
    {code:'power-solid-620-standard',category:'panel',quality:'standard',mode:'both',name:'Power Solid 620W',price:105,warranty:'15 Years Warranty',watts:620,kw:0,phase:'single',max_panels:0,amps_per_hour:0},
    {code:'pylontech-314',category:'battery',quality:'high',mode:'both',name:'PylonTech 314Ah 51.2V',price:1750,warranty:'10 Years Warranty',watts:0,kw:0,phase:'single',max_panels:0,amps_per_hour:60},
    {code:'hoymiles-314',category:'battery',quality:'medium',mode:'both',name:'Hoymiles 314Ah 51.2V',price:1550,warranty:'5 Years Warranty',watts:0,kw:0,phase:'single',max_panels:0,amps_per_hour:60},
    {code:'mana-314',category:'battery',quality:'standard',mode:'both',name:'Mana 314Ah 51.2V',price:1485,warranty:'5 Years Warranty',watts:0,kw:0,phase:'single',max_panels:0,amps_per_hour:60},
    {code:'3watt-100',category:'battery',quality:'common',mode:'both',name:'3Watt 100Ah 51.2V',price:650,warranty:'5 Years Warranty',watts:0,kw:0,phase:'single',max_panels:0,amps_per_hour:18},
    {code:'deye-6-single',category:'inverter',quality:'high',mode:'both',name:'Deye 6kW Hybrid',price:800,warranty:'5 Years Warranty',watts:0,kw:6,phase:'single',max_panels:14,amps_per_hour:0},
    {code:'deye-8-single',category:'inverter',quality:'high',mode:'both',name:'Deye 8kW Hybrid',price:1185,warranty:'5 Years Warranty',watts:0,kw:8,phase:'single',max_panels:21,amps_per_hour:0},
    {code:'deye-12-single',category:'inverter',quality:'high',mode:'both',name:'Deye 12kW Hybrid Single Phase',price:1700,warranty:'5 Years Warranty',watts:0,kw:12,phase:'single',max_panels:28,amps_per_hour:0},
    {code:'deye-14-single',category:'inverter',quality:'high',mode:'both',name:'Deye 14kW Hybrid Single Phase',price:1750,warranty:'5 Years Warranty',watts:0,kw:14,phase:'single',max_panels:32,amps_per_hour:0},
    {code:'deye-16-single',category:'inverter',quality:'high',mode:'both',name:'Deye 16kW Hybrid Single Phase',price:1850,warranty:'5 Years Warranty',watts:0,kw:16,phase:'single',max_panels:36,amps_per_hour:0},
    {code:'medald-6-single',category:'inverter',quality:'medium',mode:'both',name:'Medald Power 6kW Hybrid',price:400,warranty:'4 Years Warranty',watts:0,kw:6,phase:'single',max_panels:8,amps_per_hour:0},
    {code:'viva-11-medium',category:'inverter',quality:'medium',mode:'both',name:'Viva Hybrid Inverter 11kW',price:775,warranty:'2 Years Warranty',watts:0,kw:11,phase:'single',max_panels:18,amps_per_hour:0},
    {code:'bryyzee-6-single',category:'inverter',quality:'standard',mode:'both',name:'Bryyzee Hybrid Inverter 6.2kW',price:335,warranty:'2 Years Warranty',watts:0,kw:6.2,phase:'single',max_panels:8,amps_per_hour:0},
    {code:'viva-11-standard',category:'inverter',quality:'standard',mode:'both',name:'Viva Hybrid Inverter 11kW',price:775,warranty:'2 Years Warranty',watts:0,kw:11,phase:'single',max_panels:18,amps_per_hour:0},
    {code:'deye-12-3ph',category:'inverter',quality:'common',mode:'both',name:'Deye 12kW Hybrid 3-Phase',price:1700,warranty:'5 Years Warranty',watts:0,kw:12,phase:'3ph',max_panels:28,amps_per_hour:0},
    {code:'deye-16-3ph',category:'inverter',quality:'common',mode:'both',name:'Deye 16kW Hybrid 3-Phase',price:1900,warranty:'5 Years Warranty',watts:0,kw:16,phase:'3ph',max_panels:36,amps_per_hour:0},
    {code:'deye-20-3ph',category:'inverter',quality:'common',mode:'both',name:'Deye 20kW Hybrid 3-Phase',price:2500,warranty:'5 Years Warranty',watts:0,kw:20,phase:'3ph',max_panels:50,amps_per_hour:0}
  ],
  settings:{structurePerPanel:45,installationPerPanel:15,solarCablePerMeter:1.25,acCablePerMeter:5,dcProtectionSingle:75,dcProtection3ph:100,acProtectionSingle:75,acProtection3ph:100,transportErbil:50,transportOutside:75,otherElectricalUpTo16:100,otherElectricalAbove16:150,batteryBusbarMinimum:3,batteryBusbarPrice:150}
};

async function ensure(db){
  await db.prepare(`CREATE TABLE IF NOT EXISTS app_calculator_config (id INTEGER PRIMARY KEY CHECK(id=1), config_json TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)`).run();
}
export async function onRequestGet({env}){
  const headers={'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*'};
  if(!env.DB) return new Response(JSON.stringify({...defaultConfig,source:'default-no-db'}),{headers});
  try{
    await ensure(env.DB);
    const row=await env.DB.prepare('SELECT config_json, updated_at FROM app_calculator_config WHERE id=1').first();
    if(!row) return new Response(JSON.stringify({...defaultConfig,source:'default'}),{headers});
    const data=JSON.parse(row.config_json);
    return new Response(JSON.stringify({...data,updated_at:row.updated_at,source:'live'}),{headers});
  }catch(e){
    return new Response(JSON.stringify({...defaultConfig,source:'fallback'}),{headers});
  }
}
