
/* Progressive calculator and unified contact control */
document.addEventListener('DOMContentLoaded',function(){
  const card=document.querySelector('.advanced-calc-card');
  if(card&&!card.querySelector('.calc-progress')){
    const progress=document.createElement('div');
    progress.className='calc-progress';
    progress.innerHTML='<div class="calc-progress-item active" data-step="1"><span class="lang-en">System</span><span class="lang-ku">سیستەم</span><span class="lang-ar">النظام</span></div><div class="calc-progress-item" data-step="2"><span class="lang-en">Equipment</span><span class="lang-ku">ئامێرەکان</span><span class="lang-ar">المعدات</span></div><div class="calc-progress-item" data-step="3"><span class="lang-en">Installation</span><span class="lang-ku">دامەزراندن</span><span class="lang-ar">التركيب</span></div>';
    card.querySelector('h3').after(progress);
    const blocks=[...card.querySelectorAll(':scope > .calc-field,:scope > .calc-row,:scope > .calc-actions')];
    const groups=[blocks.slice(0,2),blocks.slice(2,6),blocks.slice(6)];
    const titles=[['System basics','بنەمای سیستەم','أساسيات النظام'],['Main equipment','ئامێرە سەرەکییەکان','المعدات الرئيسية'],['Installation details','وردەکاری دامەزراندن','تفاصيل التركيب']];
    const steps=groups.map((group,index)=>{
      const step=document.createElement('div');step.className='calc-step'+(index===0?' active':'');step.dataset.calcStep=index;
      step.innerHTML='<h4 class="calc-step-title"><span class="lang-en">'+titles[index][0]+'</span><span class="lang-ku">'+titles[index][1]+'</span><span class="lang-ar">'+titles[index][2]+'</span></h4>';
      group.forEach(node=>step.appendChild(node));card.appendChild(step);
      if(index<2){const nav=document.createElement('div');nav.className='step-nav';nav.innerHTML=(index?'<button class="btn step-back" type="button">‹ <span class="lang-en">Back</span><span class="lang-ku">گەڕانەوە</span><span class="lang-ar">رجوع</span></button>':'')+'<button class="btn btn-primary step-next" type="button"><span class="lang-en">Next</span><span class="lang-ku">دواتر</span><span class="lang-ar">التالي</span> ›</button>';step.appendChild(nav)}
      else {const nav=document.createElement('div');nav.className='step-nav';nav.innerHTML='<button class="btn step-back" type="button">‹ <span class="lang-en">Back</span><span class="lang-ku">گەڕانەوە</span><span class="lang-ar">رجوع</span></button>';step.insertBefore(nav,step.querySelector('.calc-actions'))}
      return step;
    });
    let current=0;
    function show(index){current=Math.max(0,Math.min(2,index));steps.forEach((s,i)=>s.classList.toggle('active',i===current));progress.querySelectorAll('.calc-progress-item').forEach((p,i)=>{p.classList.toggle('active',i===current);p.classList.toggle('done',i<current)});card.scrollIntoView({behavior:'smooth',block:'start'});}
    window.showCalculatorStep=show;
    card.addEventListener('click',e=>{if(e.target.closest('.step-next'))show(current+1);if(e.target.closest('.step-back'))show(current-1)});
  }
  const hub=document.getElementById('contactHub'),hubMain=hub?.querySelector('.hub-main'),hubAi=document.getElementById('hubAi'),aiToggle=document.getElementById('aiChatToggle');
  hubMain?.addEventListener('click',()=>{const open=hub.classList.toggle('open');hubMain.setAttribute('aria-expanded',String(open))});
  hubAi?.addEventListener('click',()=>{hub.classList.remove('open');hubMain.setAttribute('aria-expanded','false');aiToggle?.click()});
  document.addEventListener('click',e=>{if(hub&&!hub.contains(e.target)){hub.classList.remove('open');hubMain?.setAttribute('aria-expanded','false')}});
  document.querySelectorAll('.faq-item').forEach(item=>item.addEventListener('toggle',()=>{
    if(item.open)document.querySelectorAll('.faq-item').forEach(other=>{if(other!==item)other.open=false});
  }));
  const welcomeRobot=document.getElementById('aloRobotWelcome');
  const welcomeLogo=document.getElementById('aloRobotLogo');
  const companyLogo=document.querySelector('.brand img');
  if(welcomeLogo&&companyLogo)welcomeLogo.src=companyLogo.src;
  window.setTimeout(()=>welcomeRobot?.classList.add('show'),2800);
  document.getElementById('aloRobotClose')?.addEventListener('click',()=>{
    welcomeRobot?.classList.remove('show');
    if(welcomeRobot)welcomeRobot.style.display='none';
  });
});

