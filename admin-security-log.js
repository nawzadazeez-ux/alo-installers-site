(()=>{
 const panel=document.getElementById('adminPanel');
 if(!panel)return;
 const nav=panel.querySelector('nav');
 if(!nav||document.getElementById('securityLogView'))return;
 const style=document.createElement('style');
 style.textContent=`
 #securityLogView .security-stats{display:grid;grid-template-columns:repeat(5,minmax(120px,1fr));gap:10px;margin:14px 0 18px}
 #securityLogView .security-stat{padding:14px;border:1px solid rgba(148,163,184,.22);border-radius:14px;background:rgba(255,255,255,.03)}
 #securityLogView .security-stat b{display:block;font-size:1.5rem;margin-top:4px}
 #securityLogView .security-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
 #securityLogView .security-tools select,#securityLogView .security-tools button{min-height:40px}
 #securityLogView table{width:100%;border-collapse:collapse}
 #securityLogView th,#securityLogView td{padding:11px 9px;border-bottom:1px solid rgba(148,163,184,.16);text-align:right;vertical-align:top}
 #securityLogView .status{display:inline-flex;padding:4px 9px;border-radius:999px;font-size:.82rem;font-weight:700}
 #securityLogView .status.success{background:rgba(34,197,94,.14);color:#22c55e}
 #securityLogView .status.failed{background:rgba(239,68,68,.14);color:#ef4444}
 #securityLogView .status.locked{background:rgba(245,158,11,.15);color:#f59e0b}
 #securityLogView .status.challenge{background:rgba(59,130,246,.14);color:#60a5fa}
 #securityLogView .muted{opacity:.7;font-size:.86rem}
 @media(max-width:900px){#securityLogView .security-stats{grid-template-columns:repeat(2,1fr)}#securityLogView .table-wrap{overflow:auto}#securityLogView table{min-width:760px}}
 `;
 document.head.appendChild(style);
 const btn=document.createElement('button');
 btn.type='button';btn.dataset.view='securityLog';btn.textContent='پاراستن و هەوڵی چوونەژوورەوە';
 nav.appendChild(btn);
 const view=document.createElement('div');
 view.id='securityLogView';view.className='hidden';
 view.innerHTML=`<section class="box"><div class="section-title"><div><h2>پاراستن و هەوڵی چوونەژوورەوە</h2><p>دوایین هەوڵەکانی Admin. IP بە شێوەی hash هەڵدەگیرێت و پاسوۆرد هەرگیز تۆمار ناکرێت.</p></div><button id="securityRefresh" type="button">نوێکردنەوە</button></div><div class="security-stats"><div class="security-stat">هەموو هەوڵەکان / ٧ ڕۆژ<b id="secTotal">—</b></div><div class="security-stat">سەرکەوتوو<b id="secSuccess">—</b></div><div class="security-stat">هەڵەی پاسوۆرد<b id="secFailed">—</b></div><div class="security-stat">Lockout<b id="secLocked">—</b></div><div class="security-stat">Turnstile / 2FA<b id="secChallenge">—</b></div></div><div class="security-tools"><label>پیشاندانی <select id="securityLimit"><option value="50">50</option><option value="100" selected>100</option><option value="200">200</option></select> هەوڵ</label><span class="muted">تۆمارەکان 90 ڕۆژ پارێزراون.</span></div><p id="securityMessage" class="msg"></p><div class="table-wrap"><table><thead><tr><th>کات</th><th>دۆخ</th><th>پەیوەندی</th><th>Browser / Device</th></tr></thead><tbody id="securityRows"></tbody></table></div></section>`;
 panel.appendChild(view);
 const otherViews=['announcementsView','analyticsView','applicationsView','pricesView','calculatorView','evView'];
 function activate(){
  otherViews.forEach(id=>document.getElementById(id)?.classList.add('hidden'));
  nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn));
  view.classList.remove('hidden');load();
 }
 btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();activate()});
 nav.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&b!==btn)view.classList.add('hidden')},true);
 function browserLabel(ua=''){
  const s=String(ua);let browser='Browser';
  if(/Edg\//.test(s))browser='Microsoft Edge';else if(/Chrome\//.test(s))browser='Google Chrome';else if(/Firefox\//.test(s))browser='Firefox';else if(/Safari\//.test(s)&&!/Chrome\//.test(s))browser='Safari';
  let device='Desktop';if(/Android/i.test(s))device='Android';else if(/iPhone|iPad/i.test(s))device='iPhone/iPad';else if(/Windows/i.test(s))device='Windows';else if(/Macintosh|Mac OS X/i.test(s))device='Mac';else if(/Linux/i.test(s))device='Linux';
  return `${browser} · ${device}`;
 }
 function statusInfo(status){
  if(status==='success'||status==='success_2fa')return ['سەرکەوتوو','success'];
  if(status==='failed')return ['هەڵەی login','failed'];
  if(status==='locked')return ['Lockout','locked'];
  if(status==='2fa_failed')return ['2FA هەڵە','challenge'];
  if(status==='turnstile_failed')return ['Turnstile هەڵە','challenge'];
  return [status||'—','challenge'];
 }
 function fmtTime(v){if(!v)return '—';const d=new Date(String(v).replace(' ','T')+'Z');return isNaN(d)?v:d.toLocaleString('en-GB',{timeZone:'Asia/Baghdad',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'})}
 async function load(){
  const msg=document.getElementById('securityMessage'),rows=document.getElementById('securityRows');if(!rows)return;
  msg.textContent='بارکردن...';
  try{
   const limit=document.getElementById('securityLimit').value;
   const r=await fetch(`/api/portal/admin/login-events?limit=${encodeURIComponent(limit)}`,{credentials:'same-origin',cache:'no-store'});
   const d=await r.json();if(!r.ok)throw new Error(d.error||'هەڵەیەک ڕوویدا');
   document.getElementById('secTotal').textContent=d.stats.total;document.getElementById('secSuccess').textContent=d.stats.success;document.getElementById('secFailed').textContent=d.stats.failed;document.getElementById('secLocked').textContent=d.stats.locked;document.getElementById('secChallenge').textContent=d.stats.challenged;
   rows.innerHTML=(d.events||[]).map(x=>{const [label,cls]=statusInfo(x.status);return `<tr><td dir="ltr">${fmtTime(x.created_at)}</td><td><span class="status ${cls}">${label}</span></td><td dir="ltr">#${String(x.connection_id||'—')}</td><td>${browserLabel(x.user_agent)}<div class="muted" dir="ltr">${String(x.user_agent||'').replace(/[<>&]/g,'')}</div></td></tr>`}).join('')||'<tr><td colspan="4">هێشتا هیچ تۆمارێک نییە.</td></tr>';
   msg.textContent='';
  }catch(e){msg.textContent=e.message;rows.innerHTML=''}
 }
 document.getElementById('securityRefresh').addEventListener('click',load);
 document.getElementById('securityLimit').addEventListener('change',load);
})();
