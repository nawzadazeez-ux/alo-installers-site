(()=>{
 const form=document.getElementById('adminLoginForm');
 if(!form)return;
 const turnstileBox=form.querySelector('.cf-turnstile');
 const twoFactorLabel=document.createElement('label');
 twoFactorLabel.id='adminTwoFactorLabel';
 twoFactorLabel.innerHTML='2FA Code <input id="adminTotpCode" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" dir="ltr" placeholder="123456"><small style="display:block;margin-top:6px;opacity:.72">کۆدی ٦ ژمارەیی Google/Microsoft Authenticator — تەنها دوای چالاککردنی 2FA پێویستە.</small>';
 if(turnstileBox)turnstileBox.before(twoFactorLabel);else form.querySelector('button')?.before(twoFactorLabel);
 form.onsubmit=async event=>{
  event.preventDefault();
  const error=document.getElementById('adminLoginError');
  const button=event.submitter||form.querySelector('button');
  if(error)error.textContent='';
  const token=form.querySelector('[name="cf-turnstile-response"]')?.value||'';
  if(!token){if(error)error.textContent='تکایە پشتڕاستکردنەوەی پاراستن تەواو بکە.';return}
  if(button)button.disabled=true;
  try{
   const response=await fetch('/api/portal/admin/login',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({username:document.getElementById('adminUsername').value,password:document.getElementById('adminPassword').value,totpCode:document.getElementById('adminTotpCode')?.value||'',turnstileToken:token})});
   let data={};try{data=await response.json()}catch{}
   if(!response.ok)throw new Error(data.error||'هەڵەیەک ڕوویدا');
   if(typeof showPanel==='function')showPanel();else location.reload();
  }catch(err){if(error)error.textContent=err.message;if(window.turnstile)window.turnstile.reset()}
  finally{if(button)button.disabled=false}
 };
})();
