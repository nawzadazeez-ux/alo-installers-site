const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
for(const [tag,script] of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))if(!tag.includes('application/ld+json'))new vm.Script(script);
const source=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes("const sessionKey='alo-ai-session-v1'"));
class Element{
  constructor(){this.children=[];this.value='';this.disabled=false;this.listeners={};this.classList={toggle(){},contains(){return false}};this.selectedOptions=[]}
  appendChild(e){this.children.push(e)}append(e){this.appendChild(e)}before(){}setAttribute(k,v){this[k]=v}removeAttribute(k){delete this[k]}addEventListener(k,fn){this.listeners[k]=fn}replaceChildren(){this.children=[]}focus(){}remove(){}querySelector(){return this.button||null}
  set innerHTML(v){this.children=[]}get innerHTML(){return ''}
}
const els=Object.fromEntries(['aiChatToggle','aiChat','aiClose','aiForm','aiInput','aiMessages','aiQuick','aiToWhatsApp','aiButtonText','aiTitle','aiStatus'].map(k=>[k,new Element()]));els.aiForm.button=new Element();
const storage=new Map();let calls=0,lastBody,resolve;
const ctx={document:{documentElement:{lang:'en'},getElementById:id=>els[id]||null,createElement:()=>new Element(),querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){}},sessionStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)},setTimeout,clearTimeout,AbortController,window:{setTimeout},openTrustedWhatsApp(){},fetch:async(url,init)=>{calls++;assert.equal(url,'/api/ai/chat');lastBody=JSON.parse(init.body);await new Promise(r=>resolve=r);return {ok:true,json:async()=>({answer:'Alo reply'})}}};
vm.runInNewContext(source,ctx);
(async()=>{
  els.aiInput.value='My supply is three-phase';els.aiForm.listeners.submit({preventDefault(){}});
  els.aiForm.listeners.submit({preventDefault(){}});assert.equal(calls,1);assert.equal(els.aiInput.disabled,true);assert.equal(lastBody.history.length,0);resolve();await new Promise(setImmediate);
  assert.equal(els.aiInput.disabled,false);assert.equal(JSON.parse(storage.get('alo-ai-session-v1')).history.length,2);
  els.aiInput.value='What do you suggest?';els.aiForm.listeners.submit({preventDefault(){}});assert.equal(lastBody.history[0].content,'My supply is three-phase');resolve();await new Promise(setImmediate);
  ctx.fetch=async()=>{throw Error('offline')};els.aiInput.value='hello';els.aiForm.listeners.submit({preventDefault(){}});await new Promise(setImmediate);assert.equal(els.aiInput.disabled,false);assert.match(els.aiMessages.children.at(-1).textContent,/unavailable/);
  console.log('Inline scripts parse; chat calls API, prevents duplicate requests, preserves history and recovers from failures.');
})().catch(e=>{console.error(e);process.exitCode=1});
