
function initializeAloChat(){
  const toggle=document.getElementById('aiChatToggle');
  const chat=document.getElementById('aiChat');
  const close=document.getElementById('aiClose');
  const form=document.getElementById('aiForm');
  const input=document.getElementById('aiInput');
  const messages=document.getElementById('aiMessages');
  const quick=document.getElementById('aiQuick');
  const whatsapp=document.getElementById('aiToWhatsApp');
  const buttonText=document.getElementById('aiButtonText');
  const title=document.getElementById('aiTitle');
  const status=document.getElementById('aiStatus');
  if(!toggle||!chat||!form||!input||!messages||!quick||!whatsapp||!buttonText||!title||!status)return;
  const transcript=[];
  let history=[],mode='ask',busy=false;
  const sessionKey='alo-ai-session-v1';
  try{const saved=JSON.parse(sessionStorage.getItem(sessionKey)||'{}');
    if(Array.isArray(saved.history))history=saved.history.filter(m=>m&&['user','assistant'].includes(m.role)&&typeof m.content==='string').slice(-24);
    if(['ask','solar','ev'].includes(saved.mode))mode=saved.mode;
  }catch{}
  const saveSession=()=>{try{sessionStorage.setItem(sessionKey,JSON.stringify({history:history.slice(-24),mode}))}catch{}};
  const aiCopy={
    ku:{status:'یاریدەدەری زیرەکی Alo',modes:['پرسیار لە Alo','سیستەمی خۆری من','شەحنکەری سەیارە'],reset:'گفتوگۆی نوێ',error:'ئێستا یاریدەدەری زیرەک بەردەست نییە. تکایە دووبارە هەوڵ بدە یان لە WhatsApp پەیوەندیمان پێوە بکە.',limit:'تکایە کەمێک چاوەڕێ بکە، پاشان دووبارە هەوڵ بدە.',prompts:['چۆن دەتوانیت یارمەتیم بدەیت؟','یارمەتیم بدە سیستەمێکی خۆری گونجاو هەڵبژێرم.','یارمەتیم بدە شەحنکەرێک بۆ سەیارەکەم هەڵبژێرم.']},
    ar:{status:'مساعد Alo الذكي',modes:['اسأل Alo','نظامي الشمسي','شاحن سيارتي'],reset:'محادثة جديدة',error:'المساعد الذكي غير متاح الآن. حاول مجدداً أو تواصل معنا عبر WhatsApp.',limit:'انتظر قليلاً ثم حاول مجدداً.',prompts:['كيف يمكنك مساعدتي؟','ساعدني في اختيار نظام شمسي مناسب.','ساعدني في اختيار شاحن مناسب لسيارتي.']},
    en:{status:'Alo AI adviser',modes:['Ask Alo','Build my solar system','Find my EV charger'],reset:'New chat',error:'AI is unavailable right now. Please try again or contact us on WhatsApp.',limit:'Please wait a little before trying again.',prompts:['How can you help me?','Help me choose a suitable solar system.','Help me choose an EV charger for my car.']}
  };
  const modesBar=document.createElement('div');modesBar.className='ai-modes';quick.before(modesBar);
  input.maxLength=3000;
  function renderModes(){const t=aiCopy[lang()];modesBar.replaceChildren();
    ['ask','solar','ev'].forEach((key,i)=>{const b=document.createElement('button');b.type='button';b.textContent=t.modes[i];b.setAttribute('aria-pressed',String(key===mode));b.disabled=busy;
      b.onclick=()=>{if(busy)return;mode=key;saveSession();renderModes();send(t.prompts[i])};modesBar.append(b)});
    const reset=document.createElement('button');reset.type='button';reset.textContent=t.reset;reset.disabled=busy;reset.onclick=()=>{history=[];transcript.length=0;messages.replaceChildren();saveSession();applyUi()};modesBar.append(reset);
  }

  const ui={
    en:{button:'Solar Help',title:'Alo Solar Assistant',status:'Free Knowledge Mode',placeholder:'Ask a solar question…',wa:'Continue on WhatsApp',hello:'Hello! I am the Alo Solar Assistant. I can give detailed guidance about system sizing, On-Grid, Off-Grid and Hybrid systems, panels, MPPT and strings, inverters, lithium batteries, protection, cables, earthing, weather, cleaning, maintenance, troubleshooting and your Solar Calculator selection. For safety, final design and settings are confirmed by our technical team; prices are never provided in chat.',chips:['How solar works','System sizing','Battery sizing','Safety','Maintenance'],fallback:'Please ask me about solar-system design, panels, MPPT and strings, inverters, batteries, DC/AC protection, cable sizing, earthing, shading, weather, cleaning, maintenance, faults, savings or your calculator selection. You can include your daytime load, night load, phase and required backup hours for a more useful answer.'},
    ku:{button:'یاریدەدەری سۆلەر',title:'یاریدەدەری سۆلەری Alo',status:'بنکەزانیاری بەخۆڕایی',placeholder:'پرسیارێکی سۆلەر بکە…',wa:'بەردەوام بە لە WhatsApp',hello:'سڵاو! من یاریدەدەری سۆلەری Alo ـم. دەتوانم زانیاری ورد بدەم دەربارەی قەبارەکردنی سیستەم، On-Grid و Off-Grid و Hybrid، پانێڵ، MPPT و ستڕینگ، ئینڤێرتەر، پاتری لیتیۆم، پاراستن، کێبڵ، ئەرث، کەشوهەوا، پاککردنەوە، چاودێری، کێشە و چارەسەر و هەڵبژاردەکانی Calculator. بۆ پاراستن، دیزاین و setting ـی کۆتایی تیمی تەکنیکی پشتڕاستی دەکاتەوە؛ لە چاتدا نرخ نادرێت.',chips:['سۆلەر چۆن کار دەکات؟','قەبارەی سیستەم','قەبارەی پاتری','پاراستن','چاودێری'],fallback:'تکایە دەربارەی دیزاینی سیستەم، پانێڵ، MPPT و ستڕینگ، ئینڤێرتەر، پاتری، پاراستنی DC/AC، قەبارەی کێبڵ، ئەرث، سێبەر، کەش، پاککردنەوە، چاودێری، کێشە، جیاوازی نرخ یان Calculator بپرسە. ئەگەر باری ڕۆژ و شەو، جۆری فەیز و کاتژمێری backup بنووسیت وەڵامەکە وردتر دەبێت.'},
    ar:{button:'مساعد الطاقة',title:'مساعد Alo للطاقة الشمسية',status:'قاعدة معرفة مجانية',placeholder:'اسأل سؤالاً عن الطاقة الشمسية…',wa:'المتابعة عبر WhatsApp',hello:'مرحباً! أنا مساعد Alo للطاقة الشمسية. أقدم معلومات مفصلة عن حساب النظام، وأنظمة On-Grid وOff-Grid وHybrid، والألواح وMPPT والسلاسل والعاكس والبطاريات والحماية والكابلات والتأريض والطقس والتنظيف والصيانة والأعطال واختيارات الحاسبة. حفاظاً على السلامة يؤكد فريقنا الفني التصميم والإعداد النهائي، ولا أعرض الأسعار في الدردشة.',chips:['كيف يعمل النظام؟','حساب النظام','حساب البطارية','السلامة','الصيانة'],fallback:'اسألني عن تصميم النظام أو الألواح وMPPT والسلاسل والعاكس والبطاريات وحماية DC/AC والكابلات والتأريض والظل والطقس والتنظيف والصيانة والأعطال والتوفير أو اختيارات الحاسبة. اذكر حمل النهار والليل ونوع الطور وساعات الدعم المطلوبة للحصول على جواب أدق.'}
  };
  const lang=()=>['en','ku','ar'].includes(document.documentElement.lang)?document.documentElement.lang:'en';
  const cleanOption=id=>{
    const el=document.getElementById(id),text=el?.selectedOptions?.[0]?.textContent.trim()||'';
    return text.replace(/\s*[—-]\s*\$[\d,.]+.*$/,'').trim();
  };
  const context=()=>({
    panels:Math.max(1,parseInt(document.getElementById('calcKwh')?.value)||1),
    panel:cleanOption('calcPanel'),phase:cleanOption('calcSystemType'),inverter:cleanOption('calcInverter'),
    battery:cleanOption('calcBattery'),qty:Math.max(0,parseInt(document.getElementById('calcBatteryQty')?.value)||0),
    dayAmps:document.getElementById('easyDayAmps')?.value||'',nightAmps:document.getElementById('easyNightAmps')?.value||'',easyPhase:cleanOption('easyPhase'),quality:document.querySelector('input[name="easyQuality"]:checked')?.value||''
  });
  function systemSummary(l){
    const x=context();
    if(l==='ku')return `هەڵبژاردەی ئێستات: ${x.panels} پانێڵی ${x.panel}، سیستەمی ${x.phase}، ئینڤێرتەری ${x.inverter} و ${x.qty} دانە ${x.battery}. ئەم هەڵبژاردەیە پێش ناردنی نرخی کۆتایی پێویستی بە پشتڕاستکردنەوەی شوێن و بارە کارەباییەکان هەیە.`;
    if(l==='ar')return `اختيارك الحالي: ${x.panels} لوح من نوع ${x.panel}، نظام ${x.phase}، عاكس ${x.inverter}، و${x.qty} من ${x.battery}. يحتاج الاختيار إلى تأكيد أحمال الموقع قبل تقديم العرض النهائي.`;
    return `Your current selection: ${x.panels} × ${x.panel}, ${x.phase}, ${x.inverter}, and ${x.qty} × ${x.battery}. The site loads should be checked before the final quotation is confirmed.`;
  }
  const add=(text,who)=>{
    const bubble=document.createElement('div');
    bubble.className='ai-message '+who;
    bubble.textContent=text;
    messages.appendChild(bubble);
    messages.scrollTop=messages.scrollHeight;
    transcript.push((who==='user'?'Customer: ':'Alo Assistant: ')+text);
  };
  async function answer(raw){
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),55000);
    try{const response=await fetch('/api/ai/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({message:raw,language:lang(),mode,history:history.slice(-24),calculator:context()})});
      const data=await response.json();if(!response.ok||typeof data.answer!=='string'||!data.answer.trim()){const error=new Error('unavailable');error.status=response.status;throw error}return data.answer;
    }finally{clearTimeout(timer)}
  }
  function applyUi(){
    const t=ui[lang()];buttonText.textContent=t.button;title.textContent=t.title;status.textContent=aiCopy[lang()].status;renderModes();input.placeholder=t.placeholder;whatsapp.textContent=t.wa;
    quick.innerHTML='';t.chips.forEach(label=>{const b=document.createElement('button');b.type='button';b.className='ai-chip';b.textContent=label;b.addEventListener('click',()=>send(label));quick.appendChild(b);});
    if(!messages.children.length)add(lang()==='ku'?'سڵاو، من یاریدەدەری AI ـی Alo ـم. چۆن دەتوانم یارمەتیت بدەم؟':lang()==='ar'?'مرحباً، أنا مساعد Alo الذكي. كيف يمكنني مساعدتك؟':'Hello, I’m Alo’s AI assistant. How can I help?','bot');
  }
  window.updateAiChatUi=applyUi;
  async function send(text){
    const clean=String(text||'').trim();if(!clean||busy||clean.length>3000)return;
    const requestLang=lang();busy=true;renderModes();add(clean,'user');input.value='';input.disabled=true;
    form.querySelector('button')?.setAttribute('disabled','');
    const typing=document.createElement('div');typing.className='ai-message bot ai-typing';typing.textContent='•••';messages.appendChild(typing);messages.scrollTop=messages.scrollHeight;
    try{const reply=await answer(clean);typing.remove();add(reply,'bot');history.push({role:'user',content:clean},{role:'assistant',content:reply});history=history.slice(-24);saveSession();}
    catch(error){typing.remove();add(error.status===429?aiCopy[requestLang].limit:aiCopy[requestLang].error,'bot');}
    finally{busy=false;input.disabled=false;form.querySelector('button')?.removeAttribute('disabled');renderModes();input.focus();}
  }
  function setOpen(open){chat.classList.toggle('open',open);chat.setAttribute('aria-hidden',String(!open));toggle.setAttribute('aria-expanded',String(open));if(open){applyUi();window.setTimeout(()=>input.focus(),180);}}
  toggle.addEventListener('click',()=>setOpen(!chat.classList.contains('open')));
  close.addEventListener('click',()=>setOpen(false));
  form.addEventListener('submit',event=>{event.preventDefault();send(input.value);});
  whatsapp.addEventListener('click',()=>{const text=['Alo Solar Energy - AI Chat',...transcript].join('\n');openTrustedWhatsApp('https://wa.me/9647764400440?text='+encodeURIComponent(text));});
  document.querySelectorAll('.lang-btn').forEach(btn=>btn.addEventListener('click',()=>window.setTimeout(applyUi,0)));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&chat.classList.contains('open'))setOpen(false);});
  history.forEach(m=>add(m.content,m.role==='user'?'user':'bot'));
  applyUi();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initializeAloChat,{once:true});else initializeAloChat();
