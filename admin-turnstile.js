(()=>{
 const form=document.getElementById('adminLoginForm');
 if(!form)return;
 form.onsubmit=async event=>{
  event.preventDefault();
  const error=document.getElementById('adminLoginError');
  const button=event.submitter||form.querySelector('button');
  if(error)error.textContent='';
  const token=form.querySelector('[name="cf-turnstile-response"]')?.value||'';
  if(!token){if(error)error.textContent='تکایە پشتڕاستکردنەوەی پاراستن تەواو بکە.';return}
  if(button)button.disabled=true;
  try{
   const response=await fetch('/api/portal/admin/login',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({username:document.getElementById('adminUsername').value,password:document.getElementById('adminPassword').value,turnstileToken:token})});
   let data={};try{data=await response.json()}catch{}
   if(!response.ok)throw new Error(data.error||'هەڵەیەک ڕوویدا');
   if(typeof showPanel==='function')showPanel();else location.reload();
  }catch(err){if(error)error.textContent=err.message;if(window.turnstile)window.turnstile.reset()}
  finally{if(button)button.disabled=false}
 };
})();
