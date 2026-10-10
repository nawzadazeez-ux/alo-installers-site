
window.addEventListener('alo-pricing-updated',()=>{
  // Do not reinitialize or recalculate an Easy quote when the initial
  // asynchronous prices arrive. Recalculate Advanced only before first quote.
  if(!document.getElementById('calculator')?.classList.contains('easy-mode')) calculateSolar();
});
function setCalculatorMode(mode){
  const section=document.getElementById('calculator');
  const easy=document.getElementById('easyModeBtn'),advanced=document.getElementById('advancedModeBtn');
  const isEasy=mode==='easy';
  section?.classList.toggle('easy-mode',isEasy);
  easy?.classList.toggle('active',isEasy);advanced?.classList.toggle('active',!isEasy);
  easy?.setAttribute('aria-selected',String(isEasy));advanced?.setAttribute('aria-selected',String(!isEasy));
  localStorage.setItem('aloCalculatorMode',isEasy?'easy':'advanced');
  if(!isEasy){const inv=document.getElementById('calcInverter');if(inv)delete inv.dataset.easyUnits}
}

function selectCalcOption(id,matcher){
  const select=document.getElementById(id);if(!select)return null;
  let option=Array.from(select.options).find(o=>matcher(o));
  if(!option && arguments.length>2){
    const item=arguments[2];
    if(item?.id && Number(item.price)>0){
      option=document.createElement('option');
      option.value=String(item.price);
      option.dataset.id=String(item.id);
      option.dataset.warranty=item.warranty||'No Warranty';
      if(item.watts)option.dataset.watts=String(item.watts);
      if(item.kw)option.dataset.kw=String(item.kw);
      if(item.phase)option.dataset.phase=item.phase;
      option.textContent=item.name+' — $'+item.price;
      select.appendChild(option);
    }
  }
  // Use the exact option index because some inverter models share the same price/value
  // (for example Deye 12kW single-phase and 3-phase are both $1,700).
  if(option){select.selectedIndex=option.index;option.selected=true;return option}return null;
}

function calculateEasySolar(){
  const pricing=window.ALO_PRICING;
  const day=Math.min(500,Math.max(0,parseFloat(document.getElementById('easyDayAmps')?.value)||0));
  const night=Math.min(500,Math.max(0,parseFloat(document.getElementById('easyNightAmps')?.value)||0));
  const quality=document.querySelector('input[name="easyQuality"]:checked')?.value||'high';
  const lang=document.documentElement.lang||'en';
  const summary=document.getElementById('easySummary');
  if(day<=0&&night<=0){if(summary){summary.hidden=false;summary.textContent=lang==='ku'?'تکایە ئەمپێری ڕۆژ یان شەو داخڵ بکە.':lang==='ar'?'يرجى إدخال حمل النهار أو الليل.':'Please enter the day or night load.'}return}

  const tier=pricing.qualityTiers?.[quality]||pricing.qualityTiers?.high;
  const panelItem=tier?.panels?.[0];
  // Customer sizing rule: every solar panel is counted as 2 amps of daytime load.
  const panels=day>0?Math.ceil(day/2):0;
  if(!panelItem)throw new Error('No solar panel for this quality');
  const selectedPanel=selectCalcOption('calcPanel',o=>o.dataset.id===panelItem?.id,panelItem);
  if(!selectedPanel)throw new Error('Panel model is absent from price list');
  document.getElementById('calcKwh').value=panels;
  document.getElementById('calcType').value='hybrid';

  let inverterName='',inverterId='',inverterUnits=1;
  const phase=document.getElementById('easyPhase')?.value==='3ph'?'3ph':'single';
  if(phase==='3ph'){
    // Deye is the available 3-phase range in the supplied equipment list.
    const choices=pricing.common.threePhaseInverters.map(x=>({cap:x.maxPanels,name:x.name,id:x.id}));
    const choice=choices.find(x=>panels<=x.cap)||choices[choices.length-1];
    inverterName=choice.name;inverterId=choice.id;inverterUnits=panels>choice.cap?Math.ceil(panels/choice.cap):1;
  }else{
    const choices=tier.inverters.filter(x=>x.phase==='single').map(x=>({cap:x.maxPanels,name:x.name,id:x.id}));
    const choice=choices.find(x=>panels<=x.cap)||choices[choices.length-1];
    inverterName=choice.name;inverterId=choice.id;inverterUnits=panels>choice.cap?Math.ceil(panels/choice.cap):1;
  }
  document.getElementById('calcSystemType').value=phase;
  const inverterSelect=document.getElementById('calcInverter');
  if(inverterSelect){delete inverterSelect.dataset.manualSelected;delete inverterSelect.dataset.easyUnits}
  // Phase-specific protections are configured after equipment selection.
  const selectedInvItem=(phase==='3ph'?pricing.common.threePhaseInverters:tier.inverters).find(o=>o.id===inverterId);
  const chosenInverter=selectCalcOption('calcInverter',o=>o.dataset.id===inverterId,selectedInvItem);
  if(!chosenInverter)throw new Error('Inverter model is absent from price list');
  if(inverterSelect){inverterSelect.dataset.easyUnits=String(inverterUnits);inverterSelect.dataset.manualSelected='1'}

  const smallBattery=pricing.common.batteries[0];
  const tierBattery=tier.batteries[0];
  const batteryItem=night<=6?smallBattery:tierBattery;
  if(!batteryItem)throw new Error('Battery is absent from pricing configuration');
  const batteryRate=batteryItem.ampsPerHour||60;
  // This 100Ah rule applies to all quality levels: 1–3A = one battery,
  // 4–6A = two batteries. Above 6A switches to that quality level's 314Ah battery.
  const batteries=night>0
    ? (batteryItem.id===smallBattery.id ? Math.ceil(night/3) : Math.max(1,Math.ceil(night*7.5/batteryRate)))
    : 0;
  if(batteries){selectCalcOption('calcBattery',o=>o.dataset.id===batteryItem.id,batteryItem)}else{document.getElementById('calcBattery').value='0'}
  const qty=document.getElementById('calcBatteryQty');
  if(qty){while(qty.options.length<=batteries){const o=document.createElement('option');o.value=String(qty.options.length);o.textContent=o.value;qty.appendChild(o)}qty.value=String(batteries)}
  // Initialize AC/DC protection options before computing the final total.
  const protectionPhase=document.getElementById('calcSystemType').value==='3ph'?'3ph':'single';
  for(const [id,cost] of [['calcDcProtection',pricing.services.dcProtection[protectionPhase]],['calcAcProtection',pricing.services.acProtection[protectionPhase]]]){
    const field=document.getElementById(id);
    if(!field)continue;
    const none=document.createElement('option');none.value='0';none.textContent='Not selected';
    const included=document.createElement('option');included.value=String(cost);included.textContent='Protection — $'+cost;
    field.replaceChildren(none,included);
    field.value=String(cost);
    field.dataset.phase=protectionPhase;
    field.dataset.price=String(cost);
  }
  const dcProtectionCost=String(pricing.services.dcProtection[phase]);
  const acProtectionCost=String(pricing.services.acProtection[phase]);
  const dc=document.getElementById('calcDcProtection'),ac=document.getElementById('calcAcProtection');
  if(dc)dc.value=dcProtectionCost;if(ac)ac.value=acProtectionCost;
  const transportValue=document.getElementById('easyTransport')?.value||'50';
  const advancedTransport=document.getElementById('calcTransport');if(advancedTransport)advancedTransport.value=transportValue;
  calculateSolar();

  const panelText=document.querySelector('#calcPanel option:checked')?.textContent.split('—')[0].trim()||'';
  const invText=document.querySelector('#calcInverter option:checked')?.textContent.split('—')[0].trim()||inverterName;
  const batteryText=batteries?document.querySelector('#calcBattery option:checked')?.textContent.split('—')[0].trim():'—';
  if(summary){
    const labels=lang==='ku'?['فەیز','پانێڵ','ئینڤێرتەر','پاتری','پاراستنی DC و AC','گواستنەوە','کۆی نرخ']:lang==='ar'?['الطور','الألواح','العاكس','البطارية','حماية DC وAC','النقل','السعر الإجمالي']:['Phase','Panels','Inverter','Battery','DC & AC protection','Transport','Total'];
    const transportText=document.querySelector('#easyTransport option:checked')?.textContent||'';
    const phaseText=document.querySelector('#easyPhase option:checked')?.textContent||'';
    summary.hidden=false;summary.innerHTML=`<strong>${labels[0]}:</strong> ${phaseText}<br><strong>${labels[1]}:</strong> ${panels} × ${panelText}<br><strong>${labels[2]}:</strong> ${inverterUnits} × ${invText}<br><strong>${labels[3]}:</strong> ${batteries} × ${batteryText}<br><strong>${labels[4]}:</strong> $${Number(dcProtectionCost)+Number(acProtectionCost)}<br><strong>${labels[5]}:</strong> ${transportText}<br><strong>${labels[6]}:</strong> ${document.getElementById('calcTotal')?.textContent||'$0'}`;
  }
}

function resetEasySolar(){
  const day=document.getElementById('easyDayAmps'),night=document.getElementById('easyNightAmps');
  if(day)day.value='0';if(night)night.value='0';
  const phase=document.getElementById('easyPhase'),transport=document.getElementById('easyTransport');
  if(phase)phase.value='single';if(transport)transport.value='50';
  const high=document.querySelector('input[name="easyQuality"][value="high"]');if(high)high.checked=true;
  const summary=document.getElementById('easySummary');if(summary){summary.hidden=true;summary.innerHTML=''}
  resetSolarCalculator();
}

function sendEasySolarToWhatsApp(){
  const day=parseFloat(document.getElementById('easyDayAmps')?.value)||0;
  const night=parseFloat(document.getElementById('easyNightAmps')?.value)||0;
  if(day<=0&&night<=0){calculateEasySolar();return}
  calculateEasySolar();
  sendCalculatorToWhatsApp();
}

function calculateSolar() {
  const pricing=window.ALO_PRICING;
  const get = id => document.getElementById(id);
  const calcLang=document.documentElement.lang||'en';
  const c=calculatorTranslations[calcLang]||calculatorTranslations.en;
  const panelCount = Math.max(0, parseInt(get('calcKwh')?.value) || 0);
  const panel = get('calcPanel');
  const systemType = get('calcSystemType')?.value || 'single';
  const phase = systemType.toLowerCase().includes('3') || systemType.toLowerCase().includes('three') ? '3ph' : 'single';

  const panelW = parseFloat(panel?.selectedOptions?.[0]?.dataset?.watts || 0);
  const panelPrice = parseFloat(panel?.value || 0);
  const pvKw = panelCount * panelW / 1000;
  const recommendedKw = panelCount > 0 && panelW > 0 ? Math.max(1, Math.ceil(pvKw * 2) / 2) : 0;

  const inverter = get('calcInverter');
  if (inverter) {
    const manualSelected = inverter.dataset.manualSelected === '1';
    const options = Array.from(inverter.options).filter(o => o.value !== '');
    options.forEach(o => {
      const optPhase = o.dataset.phase || 'single';
      o.hidden = optPhase !== 'all' && optPhase !== phase;
      o.disabled = optPhase !== 'all' && optPhase !== phase;
    });
    const currentOption=inverter.selectedOptions?.[0];
    if(currentOption&&currentOption.dataset.phase!=='all'&&currentOption.dataset.phase!==phase)inverter.value='';
  }

  const selectedInv = inverter?.selectedOptions?.[0];
  const inverterPrice = parseFloat(selectedInv?.value || 0);
  const inverterUnits = Math.max(1,parseInt(inverter?.dataset?.easyUnits||'1')||1);
  const inverterKw = parseFloat(selectedInv?.dataset?.kw || 0);
  const inverterName = selectedInv ? selectedInv.textContent.trim() : 'Not selected';

  const battery = get('calcBattery');
  const batteryUnitPrice = parseFloat(battery?.value || 0);
  const batteryQtyField = get('calcBatteryQty');
  let batteryQty = Math.max(0, parseInt(batteryQtyField?.value || 0) || 0);
  if (batteryUnitPrice > 0 && batteryQty === 0) {
    batteryQty = 1;
    if (batteryQtyField) batteryQtyField.value = '1';
  }
  if (batteryUnitPrice === 0) {
    batteryQty = 0;
    if (batteryQtyField) batteryQtyField.value = '0';
  }
  const batteryCost = batteryUnitPrice * batteryQty;
  const batteryBusbarCost = batteryQty >= pricing.services.batteryBusbar.minimumBatteries ? pricing.services.batteryBusbar.price : 0;
  const batteryBusbarField = get('calcBatteryBusbar');
  const batteryBusbarLabel = get('calcBatteryBusbarLabel');
  if (batteryBusbarField) batteryBusbarField.value = batteryBusbarCost;
  if (batteryBusbarLabel) batteryBusbarLabel.textContent = `${c.batteryBusbar} — $${batteryBusbarCost}`;

  // Requested prices:
  // Structure $45/panel; DC Protection $75 single / $100 three;
  // AC Protection $75 single / $100 three; Solar cable $1.25/m;
  // AC cable 4x6mm $5/m; Installation $15/panel;
  // Transport $50 Erbil / $75 outside; Other Electrical $100 up to 16 panels, $150 above 16.
  const dcProtection = get('calcDcProtection');
  const acProtection = get('calcAcProtection');
  [[dcProtection,pricing.services.dcProtection[phase]],[acProtection,pricing.services.acProtection[phase]]].forEach(([select,value])=>{
    const label=phase==='3ph'?`${c.three} — $${value}`:`${c.single} — $${value}`;
    if(select&&(select.dataset.phase!==phase||select.dataset.price!==String(value))){select.innerHTML=`<option value="0">Not selected — $0</option><option value="${value}">${label}</option>`;select.dataset.phase=phase;select.dataset.price=String(value);}
  });

  const dcCost = parseFloat(dcProtection?.value||0);
  const acCost = parseFloat(acProtection?.value||0);
  const cableMeters = parseFloat(get('calcCable')?.value || 0);
  const acCableMeters = parseFloat(get('calcAcCable')?.value || 0);
  const cableCost = cableMeters * pricing.services.solarCablePerMeter;
  const acCableCost = acCableMeters * pricing.services.acCablePerMeter;
  const transportCost = parseFloat(get('calcTransport')?.value || 0);
  const otherElectricCost = panelCount > 16 ? pricing.services.otherElectrical.above16Panels : (panelCount > 0 ? pricing.services.otherElectrical.upTo16Panels : 0);
  const otherElectricField = get('calcOtherElectric');
  const otherElectricLabel = get('calcOtherElectricLabel');
  if (otherElectricField) otherElectricField.value = otherElectricCost;
  if (otherElectricLabel) otherElectricLabel.textContent = `${c.other} — $${otherElectricCost}`;

  const structureCost = panelCount * pricing.services.structurePerPanel;
  const installCost = panelCount * pricing.services.installationPerPanel;

  const total = panelCount * panelPrice + (inverterPrice*inverterUnits) + batteryCost + structureCost +
                dcCost + acCost + cableCost + acCableCost + installCost +
                transportCost + otherElectricCost + batteryBusbarCost;

  const rec = get('calcRecommendation');
  const breakdown = get('calcBreakdown');
  const totalEl = get('calcTotal');

  if (rec) {
    const warning = inverterKw && inverterKw < recommendedKw
      ? `<div style="margin-top:8px;color:#b45309;">⚠️ Selected inverter (${inverterKw} kW) is smaller than the recommended PV size (${recommendedKw} kW).</div>`
      : '';
    rec.innerHTML = `<strong>${c.recommendedPv}:</strong> ${panelCount} (${pvKw.toFixed(2)} kW)<br>
      <strong>${c.systemLine}:</strong> ${phase === '3ph' ? c.three : c.single}<br>
      <strong>${c.inverterLine}:</strong> ${inverterUnits>1?inverterUnits+' × ':''}${inverterName}${inverterKw ? ` (${inverterKw} kW)` : ''}${warning}`;
  }

  if (breakdown) {
    breakdown.innerHTML = `
      <div>${c.solarPanels}: $${(panelCount * panelPrice).toFixed(2)}</div>
      <div>${c.structure}: $${structureCost.toFixed(2)} ($${pricing.services.structurePerPanel} × ${panelCount})</div>
      <div>${c.inverterLine}: $${(inverterPrice*inverterUnits).toFixed(2)} (${inverterUnits} × $${inverterPrice.toFixed(2)})</div>
      <div>${c.batteryLine}: $${batteryCost.toFixed(2)} (${batteryQty} × $${batteryUnitPrice.toFixed(2)})</div>
      <div>${c.batteryBusbar}: $${batteryBusbarCost.toFixed(2)}</div>
      <div>${c.dcLine}: $${dcCost.toFixed(2)}</div>
      <div>${c.acLine}: $${acCost.toFixed(2)}</div>
      <div>${c.other}: $${otherElectricCost.toFixed(2)}</div>
      <div>${c.solarCableLine}: $${cableCost.toFixed(2)} ($1.25/m × ${cableMeters}m)</div>
      <div>${c.acCableLine}: $${acCableCost.toFixed(2)} ($5/m × ${acCableMeters}m)</div>
      <div>${c.installation}: $${installCost.toFixed(2)} ($15 × ${panelCount})</div>
      <div>${c.transportLine}: $${transportCost.toFixed(2)}</div>
    `;
  }

  const warrantyEl = get('calcWarranty');
  if (warrantyEl) {
    const panelWarranty = document.querySelector('#calcPanel option:checked')?.dataset.warranty || '15 Years Warranty';
    const inverterWarranty = document.querySelector('#calcInverter option:checked')?.dataset.warranty || '5 Years Warranty';
    const batteryWarranty = batteryQty > 0 ? (document.querySelector('#calcBattery option:checked')?.dataset.warranty || 'No Warranty') : 'No Warranty';
    warrantyEl.innerHTML = `
      <div class="warranty-item"><span>${c.solarPanel}</span><b>${panelWarranty}</b></div>
      <div class="warranty-item"><span>${c.inverterLine}</span><b>${inverterWarranty}</b></div>
      <div class="warranty-item"><span>${c.batteryLine}</span><b>${batteryWarranty}</b></div>
    `;
  }

  if (totalEl){totalEl.textContent = `$${total.toFixed(2)}`;totalEl.dataset.usd=String(total)}
  calculatePayback();
}

function calculatePayback(){
  const get=id=>document.getElementById(id);
  const result=get('paybackResult');if(!result)return;
  const lang=document.documentElement.lang||'en';
  const monthly=Math.max(0,parseFloat(get('monthlyElectricityBill')?.value)||0);
  const systemUsd=Math.max(0,parseFloat(get('calcTotal')?.dataset?.usd)||0);
  const annual=monthly*12;
  const fmt=n=>Math.round(n).toLocaleString(lang==='ar'?'ar-IQ':'en-US');
  const t=lang==='ku'
    ? {monthly:'جیاوازی نرخی مانگانە',annual:'جیاوازی نرخی ساڵانە',cost:'نرخی سیستەم',enter:'نرخی سیستەم و پارەدانی مانگانەی کارەبا داخڵ بکە.',returns:'بەپێی ئەم خەمڵاندنە، نرخی سیستەمەکە لە نزیکەی {y} ساڵ و {m} مانگدا دەگەڕێتەوە.'}
    :lang==='ar'
    ? {monthly:'التوفير الشهري',annual:'التوفير السنوي',cost:'تكلفة النظام',enter:'أدخل تكلفة النظام وتكلفة الكهرباء الشهرية.',returns:'حسب هذا التقدير، يسترد النظام تكلفته خلال نحو {y} سنة و{m} شهر.'}
    : {monthly:'Monthly savings',annual:'Annual savings',cost:'System cost',enter:'Enter a system cost and your monthly electricity payment.',returns:'At this estimate, the system pays for itself in about {y} years and {m} months.'};
  if(systemUsd<=0||monthly<=0){result.innerHTML=`<div class="payback-message payback-warning">${t.enter}</div>`;return}
  const months=Math.ceil(systemUsd/monthly),years=Math.floor(months/12),remaining=months%12;
  const message=t.returns.replace('{y}',years).replace('{m}',remaining);
  result.innerHTML=`<div class="payback-stat"><span>${t.monthly}</span><strong>$${fmt(monthly)}</strong></div><div class="payback-stat"><span>${t.annual}</span><strong>$${fmt(annual)}</strong></div><div class="payback-stat"><span>${t.cost}</span><strong>$${fmt(systemUsd)}</strong></div><div class="payback-message">☀️ ${message}</div>`;
}

function resetSolarCalculator() {
  const defaults={calcKwh:'0',calcType:'hybrid',calcBattery:'0',calcBatteryQty:'0',calcPanel:'',calcSystemType:'single',calcInverter:'',calcDcProtection:'0',calcAcProtection:'0',calcCable:'0',calcAcCable:'0',calcTransport:'0'};
  Object.entries(defaults).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.value=value;});
  const inverter=document.getElementById('calcInverter');
  if(inverter){delete inverter.dataset.manualSelected;delete inverter.dataset.easyUnits;}
  const monthlyElectricityBill=document.getElementById('monthlyElectricityBill');
  if(monthlyElectricityBill)monthlyElectricityBill.value='0';
  calculateSolar();
  if(typeof window.showCalculatorStep==='function')window.showCalculatorStep(0);
  window.setTimeout(()=>{
    const calculator=document.getElementById('calculator');
    if(calculator){
      const headerOffset=document.querySelector('header')?.offsetHeight||78;
      const top=calculator.getBoundingClientRect().top+window.scrollY-headerOffset;
      window.scrollTo({top,behavior:'smooth'});
    }
  },60);
}

function sendCalculatorToWhatsApp() {
  calculateSolar();
  const get=id=>document.getElementById(id);
  const lang=document.documentElement.lang||'en';
  const labels=lang==='ku'
    ? {title:'داواکاری سیستەمی وزەی خۆر',panels:'ژمارەی پانێڵ',panel:'جۆری پانێڵ',phase:'جۆری فەیز',inverter:'ئینڤێرتەر',battery:'پاتری',qty:'ژمارەی پاتری',cable:'کێبڵی خۆری',acCable:'کێبڵی AC',transport:'گواستنەوە',total:'کۆی نرخ',monthlyBill:'پارەدانی مانگانەی کارەبا',payback:'ماوەی گەڕانەوەی تێچووی سیستەم'}
    : lang==='ar'
    ? {title:'طلب نظام طاقة شمسية',panels:'عدد الألواح',panel:'نوع اللوح',phase:'نوع الطور',inverter:'العاكس',battery:'البطارية',qty:'عدد البطاريات',cable:'الكابل الشمسي',acCable:'كابل AC',transport:'النقل',total:'السعر الإجمالي',monthlyBill:'تكلفة الكهرباء الشهرية',payback:'مدة استرداد الاستثمار'}
    : {title:'Solar System Request',panels:'Number of panels',panel:'Panel',phase:'Phase',inverter:'Inverter',battery:'Battery',qty:'Battery quantity',cable:'Solar cable',acCable:'AC cable',transport:'Transport',total:'Total price',monthlyBill:'Monthly electricity payment',payback:'Estimated payback'};
  const selectedText=id=>get(id)?.selectedOptions?.[0]?.textContent.trim()||'';
  const lines=[
    `*${labels.title}*`,
    `${labels.panels}: ${get('calcKwh')?.value||0}`,
    `${labels.panel}: ${selectedText('calcPanel')}`,
    `${labels.phase}: ${selectedText('calcSystemType')}`,
    `${labels.inverter}: ${Math.max(1,parseInt(get('calcInverter')?.dataset?.easyUnits||'1')||1)} × ${selectedText('calcInverter')}`,
    `${labels.battery}: ${selectedText('calcBattery')}`,
    `${labels.qty}: ${get('calcBatteryQty')?.value||0}`,
    `${labels.cable}: ${get('calcCable')?.value||0} m`,
    `${labels.acCable}: ${get('calcAcCable')?.value||0} m`,
    `${labels.transport}: ${selectedText('calcTransport')}`,
    `${labels.total}: ${get('calcTotal')?.textContent||'$0'}`,
    `${labels.monthlyBill}: $${(parseFloat(get('monthlyElectricityBill')?.value)||0).toLocaleString()}`,
    `${labels.payback}: ${get('paybackResult')?.innerText.trim()||'—'}`
  ];
  openTrustedWhatsApp('https://wa.me/9647764400440?text='+encodeURIComponent(lines.join('\n')));
}

