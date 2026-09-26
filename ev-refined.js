(()=>{
 let trigger=null;
 const language=()=>document.documentElement.lang;
 function labels(){const lang=language(),copy={en:['Home','Business','Public station','Single phase','3 phase','Close'],ku:['ماڵ','کاروبار','وێستگەی گشتی','سینگڵ فەیز','٣ فەیز','داخستن'],ar:['المنزل','الأعمال','محطة عامة','أحادي الطور','ثلاثي الطور','إغلاق']}[lang]||[];document.querySelectorAll('#use option').forEach((x,i)=>x.textContent=copy[i]);document.querySelectorAll('#phase option').forEach((x,i)=>x.textContent=copy[i+3]);document.querySelectorAll('.close').forEach(b=>b.setAttribute('aria-label',copy[5]));}
 // Preserve existing option values used by recommend(), before translating visible text.
 document.querySelectorAll('#phase option').forEach(o=>o.value=o.value);
 const originalLang=window.setLang;window.setLang=function(l){originalLang(l);labels();for(const id of ['finderResult','calcResult']){const box=document.getElementById(id);box.style.display='none';box.replaceChildren()}};
 function open(id){trigger=document.activeElement;document.getElementById(id).classList.add('open');document.body.classList.add('ev-dialog-open');requestAnimationFrame(()=>document.querySelector('#'+id+' .modal-card').focus());}
 window.openFinder=()=>open('finder');window.openCalc=()=>open('calc');window.closeModals=()=>{document.querySelectorAll('.modal').forEach(m=>m.classList.remove('open'));document.body.classList.remove('ev-dialog-open');trigger?.focus();};
 document.addEventListener('keydown',e=>{const modal=document.querySelector('.modal.open');if(!modal)return;if(e.key==='Escape'){e.preventDefault();window.closeModals()}if(e.key==='Tab'){const items=[...modal.querySelectorAll('button,input,select,a[href]')].filter(x=>!x.disabled&&x.getClientRects().length);const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===modal.querySelector('.modal-card'))){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}});
 document.querySelectorAll('a[target="_blank"]').forEach(a=>a.rel='noopener noreferrer');labels();
})();
