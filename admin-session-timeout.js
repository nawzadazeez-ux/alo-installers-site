(()=>{
 const IDLE_MS=30*60*1000;
 const WARN_MS=2*60*1000;
 let lastActivity=Date.now();
 let warningVisible=false;
 let timer=null;
 const panel=()=>document.getElementById('adminPanel');
 const login=()=>document.getElementById('adminLogin');
 function isLoggedIn(){return panel()&&!panel().classList.contains('hidden')}
 function ensureWarning(){
  let box=document.getElementById('adminSessionWarning');
  if(box)return box;
  box=document.createElement('div');
  box.id='adminSessionWarning';
  box.className='admin-session-warning hidden';
  box.setAttribute('role','status');
  box.setAttribute('aria-live','polite');
  box.innerHTML='<b>ئاگاداری پاراستن</b><span id="adminSessionWarningText"></span><button type="button" id="adminSessionStay">بەردەوام بم</button>';
  document.body.appendChild(box);
  box.querySelector('#adminSessionStay').addEventListener('click',()=>touch(true));
  return box;
 }
 async function logout(reason='idle'){
  clearInterval(timer);timer=null;
  try{await fetch('/api/portal/admin/logout',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({reason})})}catch{}
  const box=ensureWarning();box.classList.add('hidden');
  if(panel())panel().classList.add('hidden');
  if(login())login().classList.remove('hidden');
  const error=document.getElementById('adminLoginError');
  if(error)error.textContent=reason==='idle'?'بۆ پاراستن، بەهۆی ٣٠ خولەک بێ‌چالاکی دەرچوویت. تکایە دووبارە بچۆ ژوورەوە.':'';
  if(window.turnstile)try{window.turnstile.reset()}catch{}
 }
 function touch(force=false){
  if(!isLoggedIn()&&!force)return;
  lastActivity=Date.now();
  warningVisible=false;
  ensureWarning().classList.add('hidden');
 }
 function tick(){
  if(!isLoggedIn()){lastActivity=Date.now();ensureWarning().classList.add('hidden');return}
  const remaining=IDLE_MS-(Date.now()-lastActivity);
  if(remaining<=0){logout('idle');return}
  if(remaining<=WARN_MS){
   const mins=Math.max(1,Math.ceil(remaining/60000));
   const box=ensureWarning();
   const text=box.querySelector('#adminSessionWarningText');
   if(text)text.textContent=` ئەگەر هیچ کارێک نەکەیت، لە نزیکەی ${mins} خولەکی تر خۆکارانە دەرئەچیت.`;
   box.classList.remove('hidden');warningVisible=true;
  }else if(warningVisible){ensureWarning().classList.add('hidden');warningVisible=false}
 }
 ['pointerdown','keydown','scroll','touchstart'].forEach(type=>window.addEventListener(type,()=>touch(),{passive:true}));
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
 timer=setInterval(tick,15000);
 ensureWarning();
 const logoutButton=document.getElementById('adminLogout');
 if(logoutButton){
  logoutButton.addEventListener('click',async event=>{
   event.preventDefault();
   await logout('manual');
  },true);
 }
 window.addEventListener('alo-admin-login-success',()=>touch(true));
})();
