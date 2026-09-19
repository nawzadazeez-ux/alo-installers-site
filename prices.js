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
}

function calculatorItem(item) {
  return {
    id: item.code,
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

function applyCalculatorConfig(config) {
  const items = Array.isArray(config.items) ? config.items : [];
  const enabledFor = mode => items.filter(item => item.mode === mode || item.mode === 'both');
  const advanced = enabledFor('advanced').map(calculatorItem);
  const easy = enabledFor('easy');
  const tiers = {};
  qualityOrder.forEach(quality => {
    tiers[quality] = {
      label: ALO_QUALITY_TIERS[quality]?.label || quality,
      panels: easy.filter(x => x.quality === quality && x.category === 'panel').map(calculatorItem),
      batteries: easy.filter(x => x.quality === quality && x.category === 'battery').map(calculatorItem),
      inverters: easy.filter(x => x.quality === quality && x.category === 'inverter').map(calculatorItem),
    };
  });
  const commonEasy = easy.filter(x => x.quality === 'common');
  const s = config.settings || {};
  window.ALO_PRICING = {
    currency: '$',
    qualityTiers: tiers,
    common: {
      batteries: commonEasy.filter(x => x.category === 'battery').map(calculatorItem),
      threePhaseInverters: commonEasy.filter(x => x.category === 'inverter' && x.phase === '3ph').map(calculatorItem),
    },
    panels: advanced.filter(x => x.category === 'panel'),
    batteries: advanced.filter(x => x.category === 'battery'),
    inverters: advanced.filter(x => x.category === 'inverter'),
    services: {
      structurePerPanel: Number(s.structurePerPanel),
      installationPerPanel: Number(s.installationPerPanel),
      solarCablePerMeter: Number(s.solarCablePerMeter),
      acCablePerMeter: Number(s.acCablePerMeter),
      dcProtection: { single: Number(s.dcProtectionSingle), '3ph': Number(s.dcProtection3ph) },
      acProtection: { single: Number(s.acProtectionSingle), '3ph': Number(s.acProtection3ph) },
      transport: { erbil: Number(s.transportErbil), outsideErbil: Number(s.transportOutside) },
      otherElectrical: { upTo16Panels: Number(s.otherElectricalUpTo16), above16Panels: Number(s.otherElectricalAbove16) },
      batteryBusbar: { minimumBatteries: Number(s.batteryBusbarMinimum), price: Number(s.batteryBusbarPrice) },
    },
  };
  renderPriceList();
  window.dispatchEvent(new CustomEvent('alo-pricing-updated'));
}

renderPriceList();
fetch('/api/portal/calculator/config?refresh=' + Date.now(), { cache: 'no-store' })
  .then(response => response.ok ? response.json() : Promise.reject(new Error('Pricing API unavailable')))
  .then(applyCalculatorConfig)
  .catch(error => console.warn('Using the built-in price list:', error.message));
