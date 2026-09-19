// Portal API used by the Pages advanced-mode Worker.
const enc = new TextEncoder();
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {status, headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store',...headers}});
const clean = (v, max=120) => String(v||'').trim().replace(/[<>]/g,'').slice(0,max);
const hex = b => [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const randomHex = n => {const b=new Uint8Array(n);crypto.getRandomValues(b);return hex(b)};
const sha256 = async s => hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
const CALCULATOR_SEED = [
 ['longi-x10-650','panel','high','both','LONGi Hi-MO X10 650W',108,'15 Years Warranty',650,0,'single',0,0,10],['power-solid-620-medium','panel','medium','both','Power Solid 620W',105,'15 Years Warranty',620,0,'single',0,0,20],['power-solid-620-standard','panel','standard','both','Power Solid 620W',105,'15 Years Warranty',620,0,'single',0,0,30],
 ['pylontech-314','battery','high','both','PylonTech 314Ah 51.2V',1750,'10 Years Warranty',0,0,'single',0,60,40],['hoymiles-314','battery','medium','both','Hoymiles 314Ah 51.2V',1550,'5 Years Warranty',0,0,'single',0,60,50],['mana-314','battery','standard','both','Mana 314Ah 51.2V',1485,'5 Years Warranty',0,0,'single',0,60,60],['3watt-100','battery','common','both','3Watt 100Ah 51.2V',650,'5 Years Warranty',0,0,'single',0,18,70],
 ['deye-6-single','inverter','high','both','Deye 6kW Hybrid',800,'5 Years Warranty',0,6,'single',14,0,80],['deye-8-single','inverter','high','both','Deye 8kW Hybrid',1185,'5 Years Warranty',0,8,'single',21,0,90],['deye-12-single','inverter','high','both','Deye 12kW Hybrid Single Phase',1700,'5 Years Warranty',0,12,'single',28,0,100],['deye-14-single','inverter','high','both','Deye 14kW Hybrid Single Phase',1750,'5 Years Warranty',0,14,'single',32,0,110],['deye-16-single','inverter','high','both','Deye 16kW Hybrid Single Phase',1850,'5 Years Warranty',0,16,'single',36,0,120],
 ['medald-6-single','inverter','medium','both','Medald Power 6kW Hybrid',400,'4 Years Warranty',0,6,'single',8,0,130],['viva-11-medium','inverter','medium','both','Viva Hybrid Inverter 11kW',775,'2 Years Warranty',0,11,'single',18,0,140],['bryyzee-6-single','inverter','standard','both','Bryyzee Hybrid Inverter 6.2kW',335,'2 Years Warranty',0,6.2,'single',8,0,150],['viva-11-standard','inverter','standard','both','Viva Hybrid Inverter 11kW',775,'2 Years Warranty',0,11,'single',18,0,160],
 ['deye-12-3ph','inverter','common','both','Deye 12kW Hybrid 3-Phase',1700,'5 Years Warranty',0,12,'3ph',28,0,170],['deye-16-3ph','inverter','common','both','Deye 16kW Hybrid 3-Phase',1900,'5 Years Warranty',0,16,'3ph',36,0,180],['deye-20-3ph','inverter','common','both','Deye 20kW Hybrid 3-Phase',2500,'5 Years Warranty',0,20,'3ph',50,0,190]
];
const SERVICE_SEED={structurePerPanel:45,installationPerPanel:15,solarCablePerMeter:1.25,acCablePerMeter:5,dcProtectionSingle:75,dcProtection3ph:100,acProtectionSingle:75,acProtection3ph:100,transportErbil:50,transportOutside:75,otherElectricalUpTo16:100,otherElectricalAbove16:150,batteryBusbarMinimum:3,batteryBusbarPrice:150};
const INSTALLER_PRICE_LIST=[
 ['panel','Power Solid Solar Panel','Monocrystalline - 620W - High Efficiency 23% - 15 Years Warranty',98],
 ['panel','LONGi Hi-MO X10 Solar Panel','655W - High Efficiency 24.26% - 15 Years Warranty',112],
 ['inverter','Deye Hybrid Inverter 8kW','48V DC - IP65 - Single Phase - 5 Years Warranty',1125],
 ['inverter','Deye Hybrid Inverter 12kW SP','48V DC - IP65 - Single Phase - 5 Years Warranty',1650],
 ['inverter','Deye Hybrid Inverter 12kW 3PH','48V DC - IP65 - Three Phase - 5 Years Warranty',1650],
 ['inverter','Deye Hybrid Inverter 14kW SP','48V DC - IP65 - Single Phase - 5 Years Warranty',1700],
 ['inverter','Deye Hybrid Inverter 16kW SP','48V DC - IP65 - Single Phase - 5 Years Warranty',1875],
 ['inverter','Deye Hybrid Inverter 16kW 3PH','48V DC - IP65 - Three Phase - 5 Years Warranty',1950],
 ['inverter','Deye Hybrid Inverter 20kW 3PH','48V DC - IP65 - Three Phase - 5 Years Warranty',2500],
 ['inverter','Deye Hybrid High Voltage Inverter 30kW','IP65 - Three Phase - 5 Years Warranty',3200],
 ['inverter','Deye Hybrid High Voltage Inverter 50kW','IP65 - Three Phase - 5 Years Warranty',3900],
 ['inverter','Deye Hybrid High Voltage Inverter 80kW','IP65 - Three Phase - 5 Years Warranty',5450],
 ['inverter','Deye On-Grid Inverter 20kW','IP65 - Three Phase - 5 Years Warranty',750],
 ['inverter','Deye On-Grid Inverter 25kW','IP65 - Three Phase - 5 Years Warranty',800],
 ['inverter','Deye On-Grid Inverter 30kW','IP65 - Three Phase - 5 Years Warranty',1050],
 ['inverter','Deye On-Grid Inverter 40kW','IP65 - Three Phase - 5 Years Warranty',1565],
 ['inverter','Deye On-Grid Inverter 50kW','IP65 - Three Phase - 5 Years Warranty',1650],
 ['inverter','Deye On-Grid Inverter 60kW','IP65 - Three Phase - 5 Years Warranty',1765],
 ['inverter','Deye On-Grid Inverter 80kW','IP65 - Three Phase - 5 Years Warranty',2100],
 ['inverter','Deye On-Grid Inverter 100kW','IP65 - Three Phase - 5 Years Warranty',2750],
 ['inverter','Deye On-Grid Inverter 120kW','IP65 - Three Phase - 5 Years Warranty',3300],
 ['inverter','Deye On-Grid Inverter 136kW','IP65 - Three Phase - 5 Years Warranty',3750],
 ['inverter','Medal Power Hybrid Inverter 6kW','48V DC - IP54 - Single Phase - 4 Years Warranty',385],
 ['inverter','Bryyze Hybrid Inverter 6.2kW','48V DC - IP54 - Single Phase - 2 Years Warranty',325],
 ['battery','Viva Lithium Battery 314Ah','LiFePO4 - 6000+ Cycles - 5 Years Warranty',1600],
 ['battery','EVE Lithium Battery 314Ah','LiFePO4 - 6000+ Cycles - 5 Years Warranty',1620],
 ['service','BlueVoltio Circuit BVDC63A 20A','32-20A - 500V - One Year Warranty',5.4],
 ['service','BlueVoltio Circuit BVDC63A 32A','32-32A - 500V - One Year Warranty',5.5],
 ['service','BlueVoltio DC Fuse Holder','DC Fuse Holder - One Year Warranty',2],
 ['service','BlueVoltio DC Fuse Link','32A / 20A / 16A - One Year Warranty',1],
 ['service','BlueVoltio DC SPD BVN40','1000V - One Year Warranty',11],
 ['service','BlueVoltio Mini AC 2-Pole','BV63 63A / 32A - One Year Warranty',3.2],
 ['service','BlueVoltio Mini AC 3-Phase','BV63 3-Pole 63A / 32A - One Year Warranty',5.5],
 ['service','BlueVoltio Contactor BVCT','22/63 NO, N - One Year Warranty',9.5],
 ['service','BlueVoltio Board BVHT 12-Way','Distribution board',5.5],
 ['service','BlueVoltio Board BVHT 18-Way','Distribution board',9],
 ['service','BlueVoltio Board BVDB 18-Way','Distribution board',19],
 ['service','BlueVoltio Board BVDB 12-Way','Distribution board',13],
 ['service','BlueVoltio Board BVDB 18-Way Premium','Distribution board',25],
 ['service','BlueVoltio MC4 Connector','30A - 1000V',0.5],
 ['service','BlueVoltio Smart WiFi Meter','63A Smart Circuit - One Year Warranty',20],
 ['service','BlueVoltio Voltage & Current Protector','63A - One Year Warranty',5.5],
 ['service','BlueVoltio 3-Phase V & C Protector','Three Phase - One Year Warranty',26],
 ['service','BlueVoltio Fire Extinguisher BVS32-1EL','One Year Warranty',5.8],
 ['service','Galvanized Steel DKSN China','2mm - 5.9m',13.75],
 ['service','Galvanized Steel DKSN Iraq','2mm - 6m',13.25],
 ['service','Clamp','Made in China',0.5],
 ['service','End Clamp','Made in China',0.5],
 ['service','Base Lakesha','Made in China',1.95],
 ['service','Triangle 3mm','Made in China',0.85],
 ['service','Join 2mm','Made in China',0.95],
 ['service','DC Cable','Turkey - 500m roll; price per meter',0.95]
];
async function ensurePortalCore(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS installers (id INTEGER PRIMARY KEY AUTOINCREMENT,full_name TEXT NOT NULL,phone TEXT NOT NULL,business TEXT,city TEXT,username TEXT NOT NULL,password_hash TEXT,password_salt TEXT,status TEXT NOT NULL DEFAULT 'pending',created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,approved_at TEXT)").run();
 const {results:columns}=await env.DB.prepare('PRAGMA table_info(installers)').all();
 const existing=new Set(columns.map(x=>x.name));
 const migrations=[['full_name','TEXT'],['phone','TEXT'],['business','TEXT'],['city','TEXT'],['username','TEXT'],['password_hash','TEXT'],['password_salt','TEXT'],['status',"TEXT DEFAULT 'pending'"],['created_at','TEXT'],['approved_at','TEXT']];
 for(const [name,type] of migrations)if(!existing.has(name))await env.DB.prepare(`ALTER TABLE installers ADD COLUMN ${name} ${type}`).run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT,token_hash TEXT NOT NULL UNIQUE,user_id INTEGER,role TEXT NOT NULL,expires_at TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS login_attempts (id INTEGER PRIMARY KEY AUTOINCREMENT,key TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash,role,expires_at)').run();
 await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_key ON login_attempts(key,created_at)').run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS installer_products (id INTEGER PRIMARY KEY AUTOINCREMENT,type TEXT NOT NULL,name TEXT NOT NULL,spec TEXT,retail_price REAL NOT NULL DEFAULT 0,trade_price REAL NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 await env.DB.prepare('CREATE TABLE IF NOT EXISTS app_migrations (key TEXT PRIMARY KEY,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)').run();
 const imported=await env.DB.prepare('SELECT key FROM app_migrations WHERE key=?').bind('installer-price-list-2026-08-09').first();
 if(!imported){
  await env.DB.prepare('DELETE FROM installer_products').run();
  await env.DB.batch(INSTALLER_PRICE_LIST.map((x,i)=>env.DB.prepare('INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,1,?)').bind(x[0],x[1],x[2],x[3],x[3],(i+1)*10)));
  await env.DB.prepare('INSERT INTO app_migrations(key) VALUES(?)').bind('installer-price-list-2026-08-09').run();
 }
}
async function ensureCalculator(env){
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS calculator_items (id INTEGER PRIMARY KEY AUTOINCREMENT,code TEXT NOT NULL UNIQUE,category TEXT NOT NULL,quality TEXT NOT NULL DEFAULT 'common',mode TEXT NOT NULL DEFAULT 'both',name TEXT NOT NULL,price REAL NOT NULL DEFAULT 0,warranty TEXT,watts REAL NOT NULL DEFAULT 0,kw REAL NOT NULL DEFAULT 0,phase TEXT NOT NULL DEFAULT 'single',max_panels INTEGER NOT NULL DEFAULT 0,amps_per_hour REAL NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 const {results:columns}=await env.DB.prepare('PRAGMA table_info(calculator_items)').all();
 const existing=new Set(columns.map(x=>x.name));
 const migrations=[['quality',"TEXT NOT NULL DEFAULT 'common'"],['mode',"TEXT NOT NULL DEFAULT 'both'"],['warranty','TEXT'],['watts','REAL NOT NULL DEFAULT 0'],['kw','REAL NOT NULL DEFAULT 0'],['phase',"TEXT NOT NULL DEFAULT 'single'"],['max_panels','INTEGER NOT NULL DEFAULT 0'],['amps_per_hour','REAL NOT NULL DEFAULT 0'],['active','INTEGER NOT NULL DEFAULT 1'],['sort_order','INTEGER NOT NULL DEFAULT 0'],['updated_at','TEXT']];
 for(const [name,type] of migrations)if(!existing.has(name))await env.DB.prepare(`ALTER TABLE calculator_items ADD COLUMN ${name} ${type}`).run();
 await env.DB.prepare("CREATE TABLE IF NOT EXISTS calculator_settings (key TEXT PRIMARY KEY,value REAL NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)").run();
 const count=await env.DB.prepare('SELECT COUNT(*) count FROM calculator_items').first();if(!Number(count?.count))await env.DB.batch(CALCULATOR_SEED.map(x=>env.DB.prepare('INSERT OR IGNORE INTO calculator_items(code,category,quality,mode,name,price,warranty,watts,kw,phase,max_panels,amps_per_hour,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(...x)));
 const settings=await env.DB.prepare('SELECT COUNT(*) count FROM calculator_settings').first();if(!Number(settings?.count))await env.DB.batch(Object.entries(SERVICE_SEED).map(([k,v])=>env.DB.prepare('INSERT OR IGNORE INTO calculator_settings(key,value) VALUES(?,?)').bind(k,v)));
}
async function calculatorConfig(env){await ensureCalculator(env);const {results:items}=await env.DB.prepare('SELECT * FROM calculator_items WHERE active=1 ORDER BY sort_order,id').all();const {results:rows}=await env.DB.prepare('SELECT key,value FROM calculator_settings').all();return {items,settings:Object.fromEntries(rows.map(x=>[x.key,Number(x.value)]))}}
async function derivePassword(password,salt,iterations){const key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations,hash:'SHA-256'},key,256);return hex(bits)}
async function passwordHash(password,salt=randomHex(16)){const iterations=100000,hash=await derivePassword(password,salt,iterations);return {salt,hash:`${iterations}$${hash}`}}
async function passwordOK(password,salt,expected){const tagged=/^(\d+)\$([a-f0-9]+)$/.exec(String(expected||'')),iterations=tagged?Number(tagged[1]):210000,target=tagged?tagged[2]:String(expected||''),actual=await derivePassword(password,salt,iterations);if(actual.length!==target.length)return false;let d=0;for(let i=0;i<actual.length;i++)d|=actual.charCodeAt(i)^target.charCodeAt(i);return d===0}
function cookie(request,name){const raw=request.headers.get('cookie')||'';for(const part of raw.split(';')){const [k,...v]=part.trim().split('=');if(k===name)return decodeURIComponent(v.join('='))}return ''}
function setCookie(name,value,maxAge){return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`}
function clearCookie(name){return `${name}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`}
function sameOrigin(request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin}
async function body(request){try{return await request.json()}catch{return null}}
async function sessionUser(env,request,role){const token=cookie(request,role==='admin'?'alo_admin_session':'alo_installer_session');if(!token)return null;const hash=await sha256(token);const row=await env.DB.prepare('SELECT s.id,s.user_id,s.expires_at,u.full_name,u.username,u.status FROM sessions s LEFT JOIN installers u ON u.id=s.user_id WHERE s.token_hash=? AND s.role=? AND s.expires_at>datetime(\'now\')').bind(hash,role).first();return row||null}
async function issueSession(env,role,userId){const token=randomHex(32),hash=await sha256(token);await env.DB.prepare("INSERT INTO sessions(token_hash,user_id,role,expires_at) VALUES(?,?,?,datetime('now','+7 days'))").bind(hash,userId||null,role).run();return token}
async function throttle(env,request,scope){const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await sha256(`${scope}:${ip}`);const row=await env.DB.prepare("SELECT COUNT(*) count FROM login_attempts WHERE key=? AND created_at>datetime('now','-15 minutes')").bind(key).first();if((row?.count||0)>=8)return false;await env.DB.prepare('INSERT INTO login_attempts(key) VALUES(?)').bind(key).run();return true}
async function clearThrottle(env,request,scope){const ip=request.headers.get('CF-Connecting-IP')||'unknown',key=await sha256(`${scope}:${ip}`);await env.DB.prepare('DELETE FROM login_attempts WHERE key=?').bind(key).run()}
function pathOf(context){return '/'+(context.params.path||[]).join('/')}

export async function onRequest(context){
 const {request,env}=context,path=pathOf(context),method=request.method;
 if(!env.DB)return json({error:'Database binding DB is missing.'},500);
 if(!sameOrigin(request)&&method!=='GET')return json({error:'Invalid origin.'},403);
 try{
  await ensurePortalCore(env);
  if(path==='/register'&&method==='POST'){
   const d=await body(request);if(!d)return json({error:'Invalid request.'},400);
   const fullName=clean(d.fullName),phone=clean(d.phone,30),business=clean(d.business),city=clean(d.city,60),username=clean(d.username,40).toLowerCase(),password=String(d.password||'');
   if(fullName.length<3||phone.length<7||username.length<4||!/^[a-z0-9._-]+$/.test(username)||password.length<8)return json({error:'Please complete all required fields correctly.'},400);
   const exists=await env.DB.prepare('SELECT id FROM installers WHERE username=? OR phone=?').bind(username,phone).first();if(exists)return json({error:'Username or phone already exists.'},409);
   const p=await passwordHash(password);await env.DB.prepare("INSERT INTO installers(full_name,phone,business,city,username,password_hash,password_salt,status) VALUES(?,?,?,?,?,?,?,'pending')").bind(fullName,phone,business,city,username,p.hash,p.salt).run();
   return json({ok:true,status:'pending'},201);
  }
  if(path==='/login'&&method==='POST'){
   if(!await throttle(env,request,'installer'))return json({error:'Too many attempts. Try again later.'},429);
   const d=await body(request),username=clean(d?.username,40).toLowerCase(),password=String(d?.password||'');const u=await env.DB.prepare('SELECT * FROM installers WHERE username=?').bind(username).first();
   if(!u||!await passwordOK(password,u.password_salt,u.password_hash))return json({error:'Incorrect username or password.'},401);
   if(u.status!=='approved')return json({error:u.status==='pending'?'Your application is awaiting approval.':'Your account is not active.',status:u.status},403);
   await clearThrottle(env,request,'installer');const token=await issueSession(env,'installer',u.id);return json({ok:true,name:u.full_name},200,{'set-cookie':setCookie('alo_installer_session',token,604800)});
  }
  if(path==='/logout'&&method==='POST'){const token=cookie(request,'alo_installer_session');if(token){try{await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run()}catch(e){console.error('Installer session cleanup failed',e)}}return json({ok:true},200,{'set-cookie':clearCookie('alo_installer_session')})}
  if(path==='/me'&&method==='GET'){const u=await sessionUser(env,request,'installer');return u?json({authenticated:true,name:u.full_name,username:u.username}):json({authenticated:false},401)}
  if(path==='/products'&&method==='GET'){const u=await sessionUser(env,request,'installer');if(!u)return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT id,type,name,spec,retail_price,trade_price FROM installer_products WHERE active=1 ORDER BY sort_order,id').all();return json({products:results,updatedAt:new Date().toISOString()})}
  if(path==='/calculator/config'&&method==='GET')return json(await calculatorConfig(env),200,{'cache-control':'no-store, no-cache, must-revalidate','cdn-cache-control':'no-store'});
  if(path==='/admin/login'&&method==='POST'){
   if(!env.ADMIN_USERNAME||!env.ADMIN_PASSWORD)return json({error:'Admin credentials are not configured.'},500);if(!await throttle(env,request,'admin'))return json({error:'Too many attempts. Try again later.'},429);
   const d=await body(request),u=clean(d?.username,80),p=String(d?.password||'');const userOK=(await sha256(u))===(await sha256(env.ADMIN_USERNAME)),passOK=(await sha256(p))===(await sha256(env.ADMIN_PASSWORD));if(!userOK||!passOK)return json({error:'Incorrect admin credentials.'},401);
   await clearThrottle(env,request,'admin');const token=await issueSession(env,'admin',null);return json({ok:true},200,{'set-cookie':setCookie('alo_admin_session',token,604800)});
  }
  if(path==='/admin/logout'&&method==='POST'){const token=cookie(request,'alo_admin_session');if(token){try{await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha256(token)).run()}catch(e){console.error('Admin session cleanup failed',e)}}return json({ok:true},200,{'set-cookie':clearCookie('alo_admin_session')})}
  if(path==='/admin/me'&&method==='GET'){return (await sessionUser(env,request,'admin'))?json({authenticated:true}):json({authenticated:false},401)}
  if(path==='/admin/applications'&&method==='GET'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT id,full_name,phone,business,city,username,status,created_at FROM installers ORDER BY CASE status WHEN \'pending\' THEN 0 ELSE 1 END,created_at DESC').all();return json({applications:results})}
  if(path==='/admin/applications'&&method==='POST'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const d=await body(request),id=Number(d?.id),action=d?.action;if(!id||!['approve','reject','disable'].includes(action))return json({error:'Invalid action.'},400);const status=action==='approve'?'approved':action==='reject'?'rejected':'disabled';await env.DB.prepare("UPDATE installers SET status=?,approved_at=CASE WHEN ?='approved' THEN datetime('now') ELSE approved_at END WHERE id=?").bind(status,status,id).run();if(status!=='approved')await env.DB.prepare("DELETE FROM sessions WHERE role='installer' AND user_id=?").bind(id).run();return json({ok:true,status})}
  if(path==='/admin/products'&&method==='GET'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const {results}=await env.DB.prepare('SELECT * FROM installer_products ORDER BY sort_order,id').all();return json({products:results})}
  if(path==='/admin/products'&&method==='POST'){
   if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);
   const d=await body(request),id=Number(d?.id||0),type=clean(d?.type,30).toLowerCase(),name=clean(d?.name,120),spec=clean(d?.spec,240),retail=Number(d?.retailPrice),trade=Number(d?.tradePrice),sortOrder=Number(d?.sortOrder||0),active=d?.active?1:0;
   if(!['panel','inverter','battery','service'].includes(type)||name.length<2||!Number.isFinite(retail)||!Number.isFinite(trade)||retail<0||trade<0||!Number.isFinite(sortOrder))return json({error:'Invalid product details.'},400);
   if(id){await env.DB.prepare("UPDATE installer_products SET type=?,name=?,spec=?,retail_price=?,trade_price=?,active=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(type,name,spec,retail,trade,active,sortOrder,id).run();return json({ok:true,id})}
   const result=await env.DB.prepare("INSERT INTO installer_products(type,name,spec,retail_price,trade_price,active,sort_order) VALUES(?,?,?,?,?,?,?)").bind(type,name,spec,retail,trade,active,sortOrder).run();return json({ok:true,id:result.meta?.last_row_id},201)
  }
  if(path==='/admin/products'&&method==='DELETE'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const d=await body(request),id=Number(d?.id);if(!id)return json({error:'Invalid product.'},400);await env.DB.prepare('DELETE FROM installer_products WHERE id=?').bind(id).run();return json({ok:true})}
  if(path==='/admin/calculator'&&method==='GET'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);await ensureCalculator(env);const {results:items}=await env.DB.prepare('SELECT * FROM calculator_items ORDER BY sort_order,id').all();const {results:rows}=await env.DB.prepare('SELECT key,value FROM calculator_settings').all();return json({items,settings:Object.fromEntries(rows.map(x=>[x.key,Number(x.value)]))})}
  if(path==='/admin/calculator/item'&&method==='POST'){
   if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);await ensureCalculator(env);const d=await body(request),id=Number(d?.id||0),current=id?await env.DB.prepare('SELECT * FROM calculator_items WHERE id=?').bind(id).first():null;
   if(id&&!current)return json({error:'Calculator item not found.'},404);
   const code=clean(d?.code??current?.code,80).toLowerCase(),category=clean(d?.category??current?.category,20),quality=clean(d?.quality??current?.quality,20),mode=clean(d?.mode??current?.mode,20),name=clean(d?.name??current?.name,120),price=Number(d?.price??current?.price),warranty=clean(d?.warranty??current?.warranty,100),watts=Number(d?.watts??current?.watts??0),kw=Number(d?.kw??current?.kw??0),phase=clean(d?.phase??current?.phase??'single',10),maxPanels=Number(d?.maxPanels??current?.max_panels??0),amps=Number(d?.ampsPerHour??current?.amps_per_hour??0),sort=Number(d?.sortOrder??current?.sort_order??0),active=d?.active===undefined?Number(current?.active??1):(d.active?1:0);
   if(!/^[a-z0-9._-]+$/.test(code)||!['panel','inverter','battery'].includes(category)||!['high','medium','standard','common'].includes(quality)||!['easy','advanced','both'].includes(mode)||!['single','3ph'].includes(phase)||name.length<2||![price,watts,kw,maxPanels,amps,sort].every(Number.isFinite)||price<0)return json({error:'Invalid calculator item.'},400);
   if(id){await env.DB.prepare("UPDATE calculator_items SET code=?,category=?,quality=?,mode=?,name=?,price=?,warranty=?,watts=?,kw=?,phase=?,max_panels=?,amps_per_hour=?,active=?,sort_order=?,updated_at=datetime('now') WHERE id=?").bind(code,category,quality,mode,name,price,warranty,watts,kw,phase,maxPanels,amps,active,sort,id).run();return json({ok:true,id,item:{code,category,quality,mode,name,price,warranty,watts,kw,phase,maxPanels,ampsPerHour:amps,active,sortOrder:sort}})}
   const result=await env.DB.prepare('INSERT INTO calculator_items(code,category,quality,mode,name,price,warranty,watts,kw,phase,max_panels,amps_per_hour,active,sort_order) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(code,category,quality,mode,name,price,warranty,watts,kw,phase,maxPanels,amps,active,sort).run();return json({ok:true,id:result.meta?.last_row_id},201)
  }
  if(path==='/admin/calculator/item'&&method==='DELETE'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);const d=await body(request),id=Number(d?.id);if(!id)return json({error:'Invalid item.'},400);await env.DB.prepare('DELETE FROM calculator_items WHERE id=?').bind(id).run();return json({ok:true})}
  if(path==='/admin/calculator/settings'&&method==='POST'){if(!await sessionUser(env,request,'admin'))return json({error:'Unauthorized'},401);await ensureCalculator(env);const d=await body(request);if(!d||typeof d.settings!=='object')return json({error:'Invalid settings.'},400);const allowed=Object.keys(SERVICE_SEED),entries=Object.entries(d.settings).filter(([k,v])=>allowed.includes(k)&&Number.isFinite(Number(v))&&Number(v)>=0);if(entries.length!==allowed.length)return json({error:'Complete all service prices.'},400);await env.DB.batch(entries.map(([k,v])=>env.DB.prepare("INSERT INTO calculator_settings(key,value,updated_at) VALUES(?,?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=datetime('now')").bind(k,Number(v))));return json({ok:true})}
  return json({error:'Not found.'},404);
 }catch(e){console.error(e);return json({error:'Server error. Please try again.'},500)}
}
