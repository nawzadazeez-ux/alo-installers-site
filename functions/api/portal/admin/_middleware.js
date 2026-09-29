const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});

function validAdminRequest(request){
  const method=request.method.toUpperCase();
  if(method==='GET'||method==='HEAD'||method==='OPTIONS')return {ok:true};

  const url=new URL(request.url);
  const origin=request.headers.get('Origin');
  const fetchSite=(request.headers.get('Sec-Fetch-Site')||'').toLowerCase();

  if(origin&&origin!==url.origin)return {ok:false,status:403,error:'Invalid origin.'};
  if(fetchSite&&fetchSite!=='same-origin'&&fetchSite!=='same-site'&&fetchSite!=='none')return {ok:false,status:403,error:'Cross-site request blocked.'};

  const contentType=(request.headers.get('Content-Type')||'').toLowerCase();
  if(!contentType.includes('application/json'))return {ok:false,status:415,error:'JSON content type required.'};

  return {ok:true};
}

export async function onRequest(context){
  const check=validAdminRequest(context.request);
  if(!check.ok)return json({error:check.error},check.status);
  const response=await context.next();
  const headers=new Headers(response.headers);
  headers.set('Cache-Control','no-store');
  headers.set('X-Content-Type-Options','nosniff');
  headers.set('Referrer-Policy','no-referrer');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
