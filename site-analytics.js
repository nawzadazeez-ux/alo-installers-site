(()=>{
 'use strict';

 // Homepage hero artwork. This runs independently from analytics/privacy settings.
 function applyHomeHeroVisual(){
  if(!['/','/index.html'].includes(location.pathname)) return;

  const render=()=>{
    const card=document.querySelector('.hero-card');
    const img=card?.querySelector('img:not(.alo-hero-logo)');
    if(!card||!img) return false;

    card.querySelector('.alo-hero-logo')?.remove();
    card.querySelector('.alo-energy-particles')?.remove();

    img.src='/alo-hero-premium.webp?v=20261004-final2';
    img.alt='Alo Solar Energy premium smart solar energy dashboard';
    img.classList.add('alo-live-hero-image');

    const overlay=document.createElementNS('http://www.w3.org/2000/svg','svg');
    overlay.setAttribute('class','alo-energy-particles');
    overlay.setAttribute('viewBox','0 0 1309 1202');
    overlay.setAttribute('preserveAspectRatio','xMidYMid meet');
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML=`
      <defs>
        <filter id="aloParticleGlow" x="-300%" y="-300%" width="700%" height="700%">
          <feGaussianBlur stdDeviation="5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g fill="#f2fff7" filter="url(#aloParticleGlow)">
        <circle r="5"><animateMotion dur="1.55s" repeatCount="indefinite" path="M456 267 C500 267 532 275 559 296"/></circle>
        <circle r="4" opacity=".75"><animateMotion dur="1.55s" begin="-.78s" repeatCount="indefinite" path="M456 267 C500 267 532 275 559 296"/></circle>

        <circle r="5"><animateMotion dur="1.9s" repeatCount="indefinite" path="M596 430 C625 439 650 451 671 469 C689 486 694 523 694 563"/></circle>
        <circle r="4" opacity=".75"><animateMotion dur="1.9s" begin="-.95s" repeatCount="indefinite" path="M596 430 C625 439 650 451 671 469 C689 486 694 523 694 563"/></circle>

        <circle r="5"><animateMotion dur="1.75s" repeatCount="indefinite" path="M748 594 C788 579 813 556 823 526 C834 489 852 462 884 448 C895 443 905 442 915 442"/></circle>
        <circle r="4" opacity=".75"><animateMotion dur="1.75s" begin="-.88s" repeatCount="indefinite" path="M748 594 C788 579 813 556 823 526 C834 489 852 462 884 448 C895 443 905 442 915 442"/></circle>

        <circle r="5"><animateMotion dur="1.45s" repeatCount="indefinite" path="M749 658 C820 665 896 667 972 666"/></circle>
        <circle r="4" opacity=".75"><animateMotion dur="1.45s" begin="-.72s" repeatCount="indefinite" path="M749 658 C820 665 896 667 972 666"/></circle>

        <circle r="5"><animateMotion dur="1.25s" repeatCount="indefinite" path="M700 648 C700 678 701 698 715 712"/></circle>
      </g>
    `;
    card.appendChild(overlay);
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