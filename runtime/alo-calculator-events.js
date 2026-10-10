
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('calcCalculateBtn')?.addEventListener('click',calculateSolar);
  document.getElementById('calcResetBtn')?.addEventListener('click',resetSolarCalculator);
  document.getElementById('calcWhatsAppBtn')?.addEventListener('click',sendCalculatorToWhatsApp);
  document.getElementById('easyModeBtn')?.addEventListener('click',()=>setCalculatorMode('easy'));
  document.getElementById('advancedModeBtn')?.addEventListener('click',()=>setCalculatorMode('advanced'));
  document.getElementById('easyCalculateBtn')?.addEventListener('click',()=>{
    const summary=document.getElementById('easySummary');
    try{
      if(!window.ALO_PRICING?.qualityTiers)throw new Error('Equipment price list is not loaded');
      calculateEasySolar();
      const day=Number(document.getElementById('easyDayAmps')?.value||0);
      const night=Number(document.getElementById('easyNightAmps')?.value||0);
      if((day>0||night>0)&&summary?.hidden)throw new Error('No calculation result was displayed');
    }catch(error){
      console.error('ALO Solar Calculator calculation failed:',error);
      if(summary){summary.hidden=false;summary.textContent='هەڵە لە حیسابکردن ڕوویدا. تکایە جارێکی دیکە هەوڵ بدەوە. / Calculation failed: '+(error?.message||'Unknown error');}
    }
  });
  document.getElementById('easyResetBtn')?.addEventListener('click',resetEasySolar);
  document.getElementById('easyWhatsAppBtn')?.addEventListener('click',sendEasySolarToWhatsApp);
  document.getElementById('easyTransport')?.addEventListener('change',()=>{if((parseFloat(document.getElementById('easyDayAmps')?.value)||0)>0||(parseFloat(document.getElementById('easyNightAmps')?.value)||0)>0)calculateEasySolar()});
  document.getElementById('easyPhase')?.addEventListener('change',()=>{if((parseFloat(document.getElementById('easyDayAmps')?.value)||0)>0||(parseFloat(document.getElementById('easyNightAmps')?.value)||0)>0)calculateEasySolar()});
  ['easyDayAmps','easyNightAmps'].forEach(id=>document.getElementById(id)?.addEventListener('keydown',e=>{if(e.key==='Enter')calculateEasySolar()}));
  document.querySelectorAll('input[name="easyQuality"]').forEach(el=>el.addEventListener('change',()=>{if((parseFloat(document.getElementById('easyDayAmps')?.value)||0)>0||(parseFloat(document.getElementById('easyNightAmps')?.value)||0)>0)calculateEasySolar()}));
  setCalculatorMode(localStorage.getItem('aloCalculatorMode')||'easy');
  const inv = document.getElementById('calcInverter');
  const system = document.getElementById('calcSystemType') || document.getElementById('systemType');
  if (inv) inv.addEventListener('change', function(){ inv.dataset.manualSelected = '1'; if (typeof calculateSolar === 'function') calculateSolar(); });
  if (system) system.addEventListener('change', function(){
    if (inv) { delete inv.dataset.manualSelected; delete inv.dataset.easyUnits; }
    if (typeof calculateSolar === 'function') calculateSolar();
  });
  ['calcKwh','calcPanel','calcBattery','calcBatteryQty','calcDcProtection','calcAcProtection','calcCable','calcAcCable','calcTransport','calcSystemType']
    .forEach(id => { const el=document.getElementById(id); if(el) el.addEventListener('input', calculateSolar); });
  document.getElementById('monthlyElectricityBill')?.addEventListener('input',calculatePayback);
  if (typeof calculateSolar === 'function') calculateSolar();
});

