// Refresh the assistant's public catalogue after product edits: node scripts/build-ai-knowledge.cjs
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('products.js', 'utf8').split('const tx=')[0];
const products = vm.runInNewContext(source + '\nproducts');
const solar = products.map(p => ({type:p.type,name:p.name,model:p.model,warranty:p.w,specifications:p.s,datasheet:'/'+p.pdf}));
const html = fs.readFileSync('ev-products.html', 'utf8');
const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const text = s => decode(s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim());
const ev = [...html.matchAll(/<article class="catalog-card"[\s\S]*?<\/article>/g)].map(([card]) => ({
  brand: decode(card.match(/data-brand="([^"]*)"/)?.[1] || ''),
  name: text(card.match(/<h2[^>]*>([\s\S]*?)<\/h2>/)?.[1] || ''),
  power: text(card.match(/<[^>]*class="catalog-power"[^>]*>([\s\S]*?)<\//)?.[1] || ''),
  listing: text(card.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] || ''),
  page:'/ev-products.html'
}));
fs.writeFileSync('ai-knowledge.js', '// Generated from public product listings. Do not include dealer prices.\nexport const catalogue = ' + JSON.stringify({solar,ev},null,2) + ';\n');
console.log(`Knowledge refreshed: ${solar.length} solar products, ${ev.length} EV listings`);
