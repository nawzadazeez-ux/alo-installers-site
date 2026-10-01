(()=>{
 'use strict';

 // Homepage hero artwork. This runs independently from analytics/privacy settings.
 function applyHomeHeroVisual(){
  if(!['/','/index.html'].includes(location.pathname)) return;
  const render=()=>{
   const card=document.querySelector('.hero-card');
   const img=card?.querySelector('img');
   if(!card||!img) return false;

   const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#0b2118"/><stop offset="1" stop-color="#081610"/></linearGradient>
      <linearGradient id="roof" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#213f34"/><stop offset="1" stop-color="#1b3129"/></linearGradient>
      <linearGradient id="panel" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#164b50"/><stop offset="1" stop-color="#0d3439"/></linearGradient>
      <filter id="glow"><feGaussianBlur stdDeviation="18"/></filter>
      <filter id="shadow"><feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000" flood-opacity=".32"/></filter>
    </defs>
    <rect width="840" height="630" rx="42" fill="url(#bg)"/>
    <g opacity=".28"><circle cx="22" cy="22" r="1" fill="#4fdc93"/><circle cx="60" cy="22" r="1" fill="#4fdc93"/><circle cx="98" cy="22" r="1" fill="#4fdc93"/><circle cx="136" cy="22" r="1" fill="#4fdc93"/><circle cx="174" cy="22" r="1" fill="#4fdc93"/><circle cx="212" cy="22" r="1" fill="#4fdc93"/><circle cx="250" cy="22" r="1" fill="#4fdc93"/><circle cx="288" cy="22" r="1" fill="#4fdc93"/><circle cx="326" cy="22" r="1" fill="#4fdc93"/><circle cx="364" cy="22" r="1" fill="#4fdc93"/><circle cx="402" cy="22" r="1" fill="#4fdc93"/><circle cx="440" cy="22" r="1" fill="#4fdc93"/><circle cx="478" cy="22" r="1" fill="#4fdc93"/><circle cx="516" cy="22" r="1" fill="#4fdc93"/><circle cx="554" cy="22" r="1" fill="#4fdc93"/><circle cx="592" cy="22" r="1" fill="#4fdc93"/><circle cx="630" cy="22" r="1" fill="#4fdc93"/><circle cx="668" cy="22" r="1" fill="#4fdc93"/><circle cx="706" cy="22" r="1" fill="#4fdc93"/><circle cx="744" cy="22" r="1" fill="#4fdc93"/></g>

    <circle cx="635" cy="126" r="64" fill="#fff1a0"/>
    <circle cx="635" cy="126" r="86" fill="#d9ff9a" opacity=".08" filter="url(#glow)"/>

    <g filter="url(#shadow)">
      <rect x="86" y="46" width="160" height="122" rx="18" fill="#0a1712" stroke="#285344"/>
      <text x="105" y="80" fill="#98b2a8" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">SOLAR NOW</text>
      <text x="105" y="119" fill="#f5f8f6" font-family="Arial,sans-serif" font-size="27" font-weight="800">8.7 kW</text>
      <text x="105" y="146" fill="#42f58d" font-family="Arial,sans-serif" font-size="14">↗ Producing</text>
    </g>

    <g filter="url(#shadow)">
      <polygon points="190,176 381,151 462,304 135,304" fill="url(#roof)"/>
      <g transform="skewY(-4)">
        <rect x="211" y="190" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
        <rect x="274" y="183" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
        <rect x="337" y="176" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
        <rect x="211" y="243" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
        <rect x="274" y="236" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
        <rect x="337" y="229" width="56" height="45" fill="url(#panel)" stroke="#75a9aa"/>
      </g>
      <rect x="174" y="304" width="247" height="170" fill="#d9ded2"/>
      <rect x="209" y="346" width="70" height="61" fill="#fff4a7"/>
      <rect x="327" y="361" width="59" height="113" fill="#334239"/>
    </g>

    <line x1="469" y1="170" x2="622" y2="278" stroke="#24c56e" stroke-width="3" opacity=".55"/>
    <line x1="336" y1="404" x2="477" y2="369" stroke="#42f58d" stroke-width="3" opacity=".58"/>

    <g filter="url(#shadow)">
      <rect x="557" y="390" width="180" height="111" rx="18" fill="#0a1712" stroke="#285344"/>
      <text x="576" y="425" fill="#98b2a8" font-family="Arial,sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">BATTERY</text>
      <text x="576" y="462" fill="#f5f8f6" font-family="Arial,sans-serif" font-size="28" font-weight="800">86%</text>
      <rect x="576" y="474" width="142" height="8" rx="4" fill="#21382f"/>
      <rect x="576" y="474" width="122" height="8" rx="4" fill="#42f58d"/>
    </g>
   </svg>`;

   img.src='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
   img.alt='Alo Solar Energy smart home solar system with live production and battery status';
   img.style.width='100%';
   img.style.maxWidth='none';
   img.style.aspectRatio='4 / 3';
   img.style.objectFit='contain';
   return true;
  };

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',render,{once:true});
  else if(!render()) setTimeout(render,150);
 }
 applyHomeHeroVisual();

 // Privacy-respecting analytics remains separate from the visual above.
 if(location.pathname.startsWith('/admin')||navigator.doNotTrack==='1'||navigator.globalPrivacyControl)return;
 const uuid=()=>crypto.randomUUID();
 let visitor=uuid(),session=uuid();
 try{const old=JSON.parse(localStorage.getItem('alo_analytics_visitor')||'null');if(old&&old.expires>Date.now())visitor=old.id;else localStorage.setItem('alo_analytics_visitor',JSON.stringify({id:visitor,expires:Date.now()+90*86400000}));}catch{}
 function sessionId(){try{const old=JSON.parse(sessionStorage.getItem('alo_analytics_session')||'null');if(old&&Date.now()-old.time<1800000)session=old.id;else session=uuid();sessionStorage.setItem('alo_analytics_session',JSON.stringify({id:session,time:Date.now()}))}catch{}return session}
 const sections=new Set(['home','services','solutions','calculator','about','contact','products']);
 function page(){const path=location.pathname==='/index.html'?'/':location.pathname;const hash=location.hash.slice(1);return path+(sections.has(hash)?'#'+hash:'')}
 function track(type){try{fetch('/api/portal/events',{method:'POST',credentials:'omit',keepalive:true,headers:{'content-type':'application/json'},body:JSON.stringify({id:uuid(),visitor,session:sessionId(),type,page:page()})}).catch(()=>{})}catch{}}
 let lastPage='';function view(){const p=page();if(p!==lastPage){lastPage=p;track('page_view')}}
 view();addEventListener('hashchange',view);addEventListener('popstate',view);
 let lastWhatsApp=0;function whatsapp(){if(Date.now()-lastWhatsApp<500)return;lastWhatsApp=Date.now();track('whatsapp')}
 function isWhatsApp(value){try{const u=new URL(value,location.href);return ['wa.me','api.whatsapp.com','web.whatsapp.com'].includes(u.hostname)||u.protocol==='whatsapp:'}catch{return false}}
 document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(a&&isWhatsApp(a.href))whatsapp()},true);
 const open=window.open;window.open=function(url,...args){if(isWhatsApp(url))whatsapp();return open.call(this,url,...args)};
})();