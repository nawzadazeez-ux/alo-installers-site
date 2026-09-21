(()=>{
 'use strict';
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
 // Record only normalized page paths, never form content, query strings or QR tokens.
})();
