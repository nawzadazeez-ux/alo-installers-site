/*
 * ALO SOLAR ENERGY - PRICE LIST
 * ================================================================
 * نرخەکان تەنها لەم فایلە بگۆڕە.
 * هەر بەرهەمێک لە ژێر کوالێتی خۆی دابنێ: HIGH / MEDIUM / STANDARD.
 * بۆ زیادکردنی بەرهەم، یەک ڕیزی تەواوی {...} کۆپی بکە و id ـێکی نوێی بدە.
 * کۆماکەی کۆتایی هەر ڕیزێک مەسڕەوە.
 * All prices are in US dollars. Every id must be unique.
 */

const ALO_QUALITY_TIERS = {
  /* ======================== HIGH QUALITY ======================== */
  high: {
    label: 'High Quality',
    panels: [
      { id: 'longi-x10-650', name: 'LONGi Hi-MO X10 650W', price: 108, watts: 650, warranty: '15 Years Warranty' },
    ],
    batteries: [
      { id: 'pylontech-314', name: 'PylonTech 314Ah 51.2V', price: 1750, warranty: '10 Years Warranty', ampsPerHour: 60 },
    ],
    inverters: [
      { id: 'deye-6-single', name: 'Deye 6kW Hybrid', price: 800, kw: 6, phase: 'single', warranty: '5 Years Warranty', maxPanels: 14 },
      { id: 'deye-8-single', name: 'Deye 8kW Hybrid', price: 1185, kw: 8, phase: 'single', warranty: '5 Years Warranty', maxPanels: 21 },
      { id: 'deye-12-single', name: 'Deye 12kW Hybrid Single Phase', price: 1700, kw: 12, phase: 'single', warranty: '5 Years Warranty', maxPanels: 28 },
      { id: 'deye-14-single', name: 'Deye 14kW Hybrid Single Phase', price: 1750, kw: 14, phase: 'single', warranty: '5 Years Warranty', maxPanels: 32 },
      { id: 'deye-16-single', name: 'Deye 16kW Hybrid Single Phase', price: 1850, kw: 16, phase: 'single', warranty: '5 Years Warranty', maxPanels: 36 },
    ],
  },

  /* ======================= MEDIUM QUALITY ======================= */
  medium: {
    label: 'Medium Quality',
    panels: [
      { id: 'power-solid-620-medium', name: 'Power Solid 620W', price: 105, watts: 620, warranty: '15 Years Warranty' },
    ],
    batteries: [
      { id: 'hoymiles-314', name: 'Hoymiles 314Ah 51.2V', price: 1550, warranty: '5 Years Warranty', ampsPerHour: 60 },
    ],
    inverters: [
      { id: 'medald-6-single', name: 'Medald Power 6kW Hybrid', price: 400, kw: 6, phase: 'single', warranty: '4 Years Warranty', maxPanels: 8 },
      { id: 'viva-11-medium', name: 'Viva Hybrid Inverter 11kW', price: 775, kw: 11, phase: 'single', warranty: '2 Years Warranty', maxPanels: 18 },
    ],
  },

  /* ====================== STANDARD QUALITY ====================== */
  standard: {
    label: 'Standard Quality',
    panels: [
      { id: 'power-solid-620-standard', name: 'Power Solid 620W', price: 105, watts: 620, warranty: '15 Years Warranty' },
    ],
    batteries: [
      { id: 'mana-314', name: 'Mana 314Ah 51.2V', price: 1485, warranty: '5 Years Warranty', ampsPerHour: 60 },
    ],
    inverters: [
      { id: 'bryyzee-6-single', name: 'Bryyzee Hybrid Inverter 6.2kW', price: 335, kw: 6.2, phase: 'single', warranty: '2 Years Warranty', maxPanels: 8 },
      { id: 'viva-11-standard', name: 'Viva Hybrid Inverter 11kW', price: 775, kw: 11, phase: 'single', warranty: '2 Years Warranty', maxPanels: 18 },
    ],
  },
};

/* COMMON EQUIPMENT: بۆ هەموو کوالێتییەکان هاوبەشن. */
const ALO_COMMON_EQUIPMENT = {
  batteries: [
    { id: '3watt-100', name: '3Watt 100Ah 51.2V', price: 650, warranty: '5 Years Warranty', ampsPerHour: 18 },
  ],
  threePhaseInverters: [
    { id: 'deye-12-3ph', name: 'Deye 12kW Hybrid 3-Phase', price: 1700, kw: 12, phase: '3ph', warranty: '5 Years Warranty', maxPanels: 28 },
    { id: 'deye-16-3ph', name: 'Deye 16kW Hybrid 3-Phase', price: 1900, kw: 16, phase: '3ph', warranty: '5 Years Warranty', maxPanels: 36 },
    { id: 'deye-20-3ph', name: 'Deye 20kW Hybrid 3-Phase', price: 2500, kw: 20, phase: '3ph', warranty: '5 Years Warranty', maxPanels: 50 },
  ],
};

const qualityOrder = ['high', 'medium', 'standard'];
const allTierItems = key => qualityOrder.flatMap(tier =>
  ALO_QUALITY_TIERS[tier][key].map(item => ({ ...item, quality: tier }))
);

window.ALO_PRICING = {
  currency: '$',
  qualityTiers: ALO_QUALITY_TIERS,
  common: ALO_COMMON_EQUIPMENT,
  // ئەم لیستانە ئۆتۆماتیکی دروست دەبن؛ دەستیان مەدە.
  // لیستی Advanced Mode بە شێوەی سادە دەمێنێتەوە تا Calculator تێکنەچێت.
  panels: allTierItems('panels'),
  batteries: [...ALO_COMMON_EQUIPMENT.batteries, ...allTierItems('batteries')],
  inverters: [
    ...allTierItems('inverters'),
    ...ALO_COMMON_EQUIPMENT.threePhaseInverters,
  ],

  services: {
    structurePerPanel: 45,
    installationPerPanel: 15,
    solarCablePerMeter: 1.25,
    acCablePerMeter: 5,
    dcProtection: { single: 75, '3ph': 100 },
    acProtection: { single: 75, '3ph': 100 },
    transport: { erbil: 50, outsideErbil: 75 },
    otherElectrical: { upTo16Panels: 100, above16Panels: 150 },
    batteryBusbar: { minimumBatteries: 3, price: 150 },
  },
};

function renderPriceList() {
  // Keep user selections while the background pricing feed refreshes.
  // Product option values are prices, so track their stable item IDs instead.
  const selectIds=['calcPanel','calcBattery','calcInverter','calcTransport','easyTransport'];
  const savedSelections=Object.fromEntries(selectIds.map(id=>{
    const el=document.getElementById(id);
    const selected=el?.selectedOptions?.[0];
    return [id,{itemId:selected?.dataset?.id || '',value:el?.value ?? '',label:selected?.textContent||'',hasSelection:!!selected,markup:selected?.outerHTML||''}];
  }));
  const p = window.ALO_PRICING;
  const money = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const option = (item, extra = '') =>
    `<option value="${item.price}" data-id="${item.id}" data-quality="${item.quality || 'common'}" data-warranty="${item.warranty}" ${extra}>${item.name} — ${p.currency}${money(item.price)}</option>`;
  const panelSelect = document.getElementById('calcPanel');
  if (panelSelect) {
    panelSelect.innerHTML = `<option value="" data-watts="0" data-warranty="No Warranty">Select panel — $0</option>` +
      p.panels.map(item => option(item, `data-watts="${item.watts}"`)).join('');
  }

  const batterySelect = document.getElementById('calcBattery');
  if (batterySelect) {
    batterySelect.innerHTML = `<option value="0" data-warranty="No Warranty">No Battery</option>` +
      `<optgroup label="Lithium Batteries">${p.batteries.map(item => option(item)).join('')}</optgroup>`;
  }

  const inverterSelect = document.getElementById('calcInverter');
  if (inverterSelect) {
    const group = phase => p.inverters.filter(item => item.phase === phase).map(item =>
      option(item, `data-phase="${item.phase}" data-kw="${item.kw}" data-max-panels="${item.maxPanels || 0}"`)
    ).join('');
    inverterSelect.innerHTML = `<option value="" data-phase="all" data-kw="0" data-warranty="No Warranty">Select inverter — $0</option>` +
      `<optgroup label="Single-Phase Inverters">${group('single')}</optgroup>` +
      `<optgroup label="3-Phase Inverters">${group('3ph')}</optgroup>`;
  }

  const transportOptions = `<option value="0">Not selected — $0</option>` +
    `<option value="${p.services.transport.erbil}">Local Erbil — $${money(p.services.transport.erbil)}</option>` +
    `<option value="${p.services.transport.outsideErbil}">Outside Erbil — $${money(p.services.transport.outsideErbil)}</option>`;
  const transport = document.getElementById('calcTransport');
  if (transport) transport.innerHTML = transportOptions;
  const easyTransport = document.getElementById('easyTransport');
  if (easyTransport) easyTransport.innerHTML = transportOptions.replace('<option value="0">Not selected — $0</option>', '');
  for(const id of selectIds){
    const el=document.getElementById(id), saved=savedSelections[id];
    if(!el||!saved?.hasSelection)continue;
    const options=Array.from(el.options);
    const match=saved.itemId
      ? options.find(option=>option.dataset.id===saved.itemId)
      : options.find(option=>option.value===saved.value);
    if(match)el.selectedIndex=match.index;
    else if(saved.itemId && saved.markup){
      // A temporary/incomplete admin feed must not silently reset a chosen item.
      // Keep the selected item until a valid replacement is explicitly chosen.
      const group=document.createElement('optgroup');
      group.label='Previously selected';
      group.innerHTML=saved.markup;
      const retained=group.querySelector('option');
      if(retained){el.appendChild(retained);el.value=retained.value;}
    }
  }
}

function calculatorItem(item) {
  return {
    id: item.code,
    code: item.code,
    category: item.category || '',
    mode: item.mode || 'both',
    active: item.active !== false,
    name: item.name,
    price: Number(item.price),
    warranty: item.warranty || 'No Warranty',
    watts: Number(item.watts || 0),
    kw: Number(item.kw || 0),
    phase: item.phase || 'single',
    maxPanels: Number(item.max_panels || 0),
    ampsPerHour: Number(item.amps_per_hour || 0),
    quality: item.quality || 'common',
  };
}

let lastAppliedCalculatorConfigSignature = '';
function applyCalculatorConfig(config) {
  // A polling response with unchanged prices must never rebuild controls.
  const signature=JSON.stringify({items:config?.items||[],settings:config?.settings||{}});
  if(signature===lastAppliedCalculatorConfigSignature)return;
  const raw = Array.isArray(config?.items) ? config.items : [];
  const items = raw.filter(item => item && item.active !== false);
  const fallback = window.ALO_PRICING;
  if (!items.length) {
    renderPriceList();
    return;
  }

  const normQuality = q => {
    q = String(q || '').toLowerCase();
    if (q === 'best') return 'high';
    if (q === 'middle') return 'medium';
    if (q === 'basic') return 'standard';
    return ['high','medium','standard','common'].includes(q) ? q : 'common';
  };

  const mapped = items.map(item => {
    const x = calculatorItem(item);
    x.quality = normQuality(item.quality);
    x.active = item.active !== false;
    return x;
  });

  const tierFor = quality => {
    const oldTier = fallback.qualityTiers?.[quality] || { label: quality, panels: [], batteries: [], inverters: [] };
    const panels = mapped.filter(x => x.category === 'panel' && x.quality === quality);
    const batteries = mapped.filter(x => x.category === 'battery' && x.quality === quality);
    const inverters = mapped.filter(x => x.category === 'inverter' && x.quality === quality && x.phase !== '3ph');
    return {
      label: oldTier.label || quality,
      panels: panels.length ? panels : oldTier.panels,
      batteries: batteries.length ? batteries : oldTier.batteries,
      inverters: inverters.length ? inverters : oldTier.inverters,
    };
  };

  const commonBatteries = mapped.filter(x => x.category === 'battery' && x.quality === 'common');
  const threePhase = mapped.filter(x => x.category === 'inverter' && x.phase === '3ph');
  const allPanels = mapped.filter(x => x.category === 'panel');
  const allBatteries = mapped.filter(x => x.category === 'battery');
  const allInverters = mapped.filter(x => x.category === 'inverter');
  const s = config?.settings || {};
  const numberOr = (value, defaultValue) => Number.isFinite(Number(value)) ? Number(value) : defaultValue;

  window.ALO_PRICING = {
    currency: '$',
    qualityTiers: {
      high: tierFor('high'),
      medium: tierFor('medium'),
      standard: tierFor('standard'),
    },
    common: {
      batteries: commonBatteries.length ? commonBatteries : fallback.common.batteries,
      threePhaseInverters: threePhase.length ? threePhase : fallback.common.threePhaseInverters,
    },
    panels: allPanels.length ? allPanels : fallback.panels,
    batteries: allBatteries.length ? allBatteries : fallback.batteries,
    inverters: allInverters.length ? allInverters : fallback.inverters,
    services: {
      structurePerPanel: numberOr(s.structurePerPanel, fallback.services.structurePerPanel),
      installationPerPanel: numberOr(s.installationPerPanel, fallback.services.installationPerPanel),
      solarCablePerMeter: numberOr(s.solarCablePerMeter, fallback.services.solarCablePerMeter),
      acCablePerMeter: numberOr(s.acCablePerMeter, fallback.services.acCablePerMeter),
      dcProtection: {
        single: numberOr(s.dcProtectionSingle, fallback.services.dcProtection.single),
        '3ph': numberOr(s.dcProtection3ph, fallback.services.dcProtection['3ph'])
      },
      acProtection: {
        single: numberOr(s.acProtectionSingle, fallback.services.acProtection.single),
        '3ph': numberOr(s.acProtection3ph, fallback.services.acProtection['3ph'])
      },
      transport: {
        erbil: numberOr(s.transportErbil, fallback.services.transport.erbil),
        outsideErbil: numberOr(s.transportOutside, fallback.services.transport.outsideErbil)
      },
      otherElectrical: {
        upTo16Panels: numberOr(s.otherElectricalUpTo16, fallback.services.otherElectrical.upTo16Panels),
        above16Panels: numberOr(s.otherElectricalAbove16, fallback.services.otherElectrical.above16Panels)
      },
      batteryBusbar: {
        minimumBatteries: numberOr(s.batteryBusbarMinimum, fallback.services.batteryBusbar.minimumBatteries),
        price: numberOr(s.batteryBusbarPrice, fallback.services.batteryBusbar.price)
      },
    },
  };

  renderPriceList();
  lastAppliedCalculatorConfigSignature=signature;
  window.ALO_PRICING_LIVE_STATUS = config?.source || 'live';
  window.dispatchEvent(new CustomEvent('alo-pricing-updated', { detail: { source: window.ALO_PRICING_LIVE_STATUS } }));
}
renderPriceList();
window.ALO_PRICING_LIVE_STATUS = 'loading';
fetch('/api/portal/calculator/config?refresh=' + Date.now(), { cache: 'no-store', headers: { 'accept': 'application/json' } })
  .then(response => response.ok ? response.json() : Promise.reject(new Error('Pricing API unavailable')))
  .then(config => { applyCalculatorConfig(config); window.ALO_PRICING_LIVE_STATUS = config.source || 'live'; })
  .catch(error => { window.ALO_PRICING_LIVE_STATUS = 'fallback'; console.warn('Using the built-in price list:', error.message); });


async function refreshAloLivePricing(){
  try{
    const response = await fetch('/api/portal/calculator/config?refresh=' + Date.now(), {
      cache: 'no-store',
      headers: { 'accept': 'application/json' }
    });
    if(!response.ok) throw new Error('HTTP '+response.status);
    const config = await response.json();
    applyCalculatorConfig(config);
    return config;
  }catch(error){
    window.ALO_PRICING_LIVE_STATUS='fallback';
    console.warn('ALO live pricing refresh failed:', error);
    return null;
  }
}
window.refreshAloLivePricing = refreshAloLivePricing;
// One initial load is sufficient for the public calculator. Refreshing options on
// focus/visibility or a 30-second timer can interrupt an in-progress quote.
// Admin changes are picked up the next time the calculator page is loaded.
