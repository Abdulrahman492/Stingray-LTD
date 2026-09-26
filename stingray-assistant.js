/* Ask Stingray, website assistant widget.
   Paste the Google Apps Script Web App URL (assistant.gs deployment) below.
   While empty, the widget runs in preview mode with built-in answers. */
(function(){
  var ASSISTANT_ENDPOINT='https://script.google.com/macros/s/AKfycbzM-YrtlT_4YcHZv1BUqdi8CT0oSOJeN2VHZglb-syyGzzfCc5ECVRp5AUWSiQwem0/exec';

  if(window.__srAsk)return;window.__srAsk=1;
  var R=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css=`
.ask-fab{position:fixed;right:24px;bottom:24px;z-index:1300;display:flex;align-items:center;gap:10px;height:56px;padding:0 22px 0 8px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:#132D6B;color:#fff;font:600 14.5px 'Sora',system-ui,sans-serif;cursor:pointer;box-shadow:0 18px 40px -12px rgba(11,26,66,.55);transition:transform .4s cubic-bezier(.16,1,.3,1),box-shadow .4s,opacity .3s}
.ask-fab:hover{transform:translateY(-3px);box-shadow:0 24px 50px -12px rgba(11,26,66,.7)}
.ask-fab .orb{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 30%,#20A0D0,#2070B0 70%);position:relative}
.ask-fab .orb::after{content:"";position:absolute;inset:-3px;border-radius:50%;border:1.5px solid rgba(212,168,83,.7);animation:askPulse 2.8s infinite}
.ask-fab svg{width:20px;height:20px}
.ask-fab.hide{opacity:0;pointer-events:none;transform:scale(.9)}
@keyframes askPulse{0%{transform:scale(1);opacity:.9}70%{transform:scale(1.35);opacity:0}100%{opacity:0}}
.ask-panel{position:fixed;right:24px;bottom:24px;z-index:1301;width:min(400px,calc(100vw - 32px));height:min(620px,calc(100svh - 48px));display:flex;flex-direction:column;border-radius:24px;overflow:hidden;background:#fff;border:1px solid #E3E8F0;box-shadow:0 40px 90px -20px rgba(11,26,66,.45);font-family:'Figtree',system-ui,sans-serif;transform-origin:bottom right;opacity:0;transform:translateY(16px) scale(.97);pointer-events:none;transition:opacity .35s cubic-bezier(.16,1,.3,1),transform .45s cubic-bezier(.16,1,.3,1)}
.ask-panel.open{opacity:1;transform:none;pointer-events:auto}
.ask-head{background:#0b1a42;color:#fff;padding:18px 18px 16px;display:flex;align-items:center;gap:12px;position:relative;overflow:hidden}
.ask-head::before{content:"";position:absolute;inset:0;background:radial-gradient(70% 120% at 100% 0,rgba(32,160,208,.35),transparent 60%),radial-gradient(50% 90% at 0 100%,rgba(212,168,83,.18),transparent 60%)}
.ask-head>*{position:relative}
.ask-head .orb{width:38px;height:38px;border-radius:50%;flex:none;display:grid;place-items:center;background:radial-gradient(circle at 30% 30%,#20A0D0,#2070B0 70%)}
.ask-head .orb svg{width:18px;height:18px}
.ask-head b{display:block;font:600 15.5px 'Sora',system-ui,sans-serif}
.ask-x{margin-left:auto;width:36px;height:36px;border-radius:10px;border:0;background:rgba(255,255,255,.08);color:#fff;cursor:pointer;display:grid;place-items:center;transition:background .25s}
.ask-x:hover{background:rgba(255,255,255,.16)}
.ask-body{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:12px;background:#F5F7FB;scroll-behavior:smooth}
.ask-msg{max-width:86%;padding:11px 14px;border-radius:16px;font-size:14.5px;line-height:1.55;color:#0E1729;animation:askIn .35s cubic-bezier(.16,1,.3,1) both;word-wrap:break-word}
.ask-msg.bot{background:#fff;border:1px solid #E3E8F0;border-bottom-left-radius:6px;align-self:flex-start}
.ask-msg.me{background:#132D6B;color:#fff;border-bottom-right-radius:6px;align-self:flex-end}
.ask-msg a{color:#2070B0;font-weight:600;text-decoration:underline;text-underline-offset:3px}
.ask-msg ul{margin:6px 0 0;padding-left:18px}.ask-msg li{margin:3px 0}
.ask-msg p{margin:0 0 6px}.ask-msg p:last-child{margin:0}
.ask-msg[dir=rtl] ul{padding-left:0;padding-right:18px}
@keyframes askIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.ask-typing{display:flex;gap:5px;padding:14px 16px}
.ask-typing i{width:7px;height:7px;border-radius:50%;background:#94A3B8;animation:askDot 1.2s infinite}
.ask-typing i:nth-child(2){animation-delay:.15s}.ask-typing i:nth-child(3){animation-delay:.3s}
@keyframes askDot{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-5px);opacity:1}}
.ask-sug{display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 12px;background:#F5F7FB}
.ask-sug button{font:500 13px 'Sora',system-ui,sans-serif;color:#132D6B;background:#fff;border:1px solid #CBD5E1;border-radius:999px;padding:8px 13px;cursor:pointer;transition:border-color .25s,background .25s}
.ask-sug button:hover{border-color:#2070B0;background:#EDF4FB}
.ask-form{display:flex;gap:8px;padding:12px;border-top:1px solid #E3E8F0;background:#fff}
.ask-form textarea{flex:1;resize:none;border:1px solid #E3E8F0;background:#F5F7FB;border-radius:14px;padding:12px 14px;font:15px 'Figtree',system-ui,sans-serif;color:#0E1729;max-height:110px;line-height:1.4;transition:border-color .25s,background .25s}
.ask-form textarea:focus{outline:0;border-color:#2070B0;background:#fff}
.ask-send{width:46px;height:46px;flex:none;align-self:flex-end;border:0;border-radius:14px;background:#132D6B;color:#fff;cursor:pointer;display:grid;place-items:center;transition:background .25s,transform .3s}
.ask-send:hover{background:#2070B0}.ask-send:disabled{opacity:.45;cursor:default}
.ask-send svg{width:18px;height:18px}
.ask-foot{font-size:11px;color:#94A3B8;text-align:center;padding:0 12px 10px;background:#fff}
@media(max-width:560px){
  .ask-fab{right:16px;bottom:16px;padding:0 8px;height:56px}.ask-fab span.t{display:none}
  .ask-panel{right:0;bottom:0;width:100vw;height:100svh;border-radius:0;border:0}
}
@media(prefers-reduced-motion:reduce){.ask-fab .orb::after,.ask-typing i,.ask-msg{animation:none}.ask-panel{transition:none}}
`;
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

  var ICON='<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z"/><path d="M18.5 15.5l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/></svg>';
  var fab=document.createElement('button');fab.className='ask-fab';fab.setAttribute('aria-label','Stingray AI assistant');
  fab.innerHTML='<span class="orb">'+ICON+'</span><span class="t">Stingray AI</span>';
  var panel=document.createElement('div');panel.className='ask-panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Stingray AI assistant');
  panel.innerHTML='<div class="ask-head"><span class="orb">'+ICON+'</span><div><b>Stingray AI</b></div><button class="ask-x" aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg></button></div>'+
    '<div class="ask-body" aria-live="polite"></div><div class="ask-sug"></div>'+
    '<form class="ask-form"><textarea rows="1" placeholder="Ask about our products..." aria-label="Your question" maxlength="600"></textarea><button class="ask-send" type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>'+
    '<div class="ask-foot">AI can make mistakes. For commitments, please contact our team.</div>';
  document.body.appendChild(fab);document.body.appendChild(panel);

  var body=panel.querySelector('.ask-body'),sug=panel.querySelector('.ask-sug'),form=panel.querySelector('.ask-form'),ta=form.querySelector('textarea'),send=form.querySelector('.ask-send');
  var KEY='srAiHistory',hist=[];
  try{hist=JSON.parse(sessionStorage.getItem(KEY)||'[]')}catch(e){}
  function save(){try{sessionStorage.setItem(KEY,JSON.stringify(hist.slice(-20)))}catch(e){}}

  function esc(s){return s.replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function md(s){
    s=esc(s);
    s=s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g,function(m,t,u){
      if(/^[\w-]+\.html(#[\w-]+)?$/.test(u)||/^#[\w-]+$/.test(u)||/^mailto:[^\s]+$/.test(u))return '<a href="'+u+'">'+t+'</a>';
      return t;});
    s=s.replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
    s=s.replace(/([\w.+-]+@[\w-]+\.[\w.]+)(?![^<]*<\/a>)/g,'<a href="mailto:$1">$1</a>');
    var lines=s.split(/\n/),out='',inList=false;
    lines.forEach(function(l){var m=l.match(/^\s*(?:[-*\u2022]|\d+\.)\s+(.*)/);
      if(m){if(!inList){out+='<ul>';inList=true}out+='<li>'+m[1]+'</li>'}
      else{if(inList){out+='</ul>';inList=false}if(l.trim())out+='<p>'+l+'</p>'}});
    if(inList)out+='</ul>';return out;
  }
  function add(role,text,store){
    var d=document.createElement('div');d.className='ask-msg '+(role==='user'?'me':'bot');
    if(/[\u0600-\u06FF]/.test(text))d.dir='rtl';
    d.innerHTML=role==='user'?'<p>'+esc(text)+'</p>':md(text);
    body.appendChild(d);body.scrollTop=body.scrollHeight;
    if(store!==false){hist.push({role:role,content:text});save()}
    d.querySelectorAll('a[href]').forEach(function(a){a.addEventListener('click',function(){if(innerWidth<=560)close()})});
  }
  var SUGS=['What is RAFM?','Which product fits my business?','Tell me about SAILOR AI','Book a demo'];
  function showSug(){sug.innerHTML='';if(hist.length>1)return;SUGS.forEach(function(q){var b=document.createElement('button');b.type='button';b.textContent=q;b.onclick=function(){ask(q)};sug.appendChild(b)})}

  var WELCOME='Hi, I am Stingray AI. Ask me about our platforms, domains or services, or how to get a demo.';
  if(!hist.length){add('assistant',WELCOME)}else hist.forEach(function(h){add(h.role,h.content,false)});
  showSug();

  /* preview answers used until ASSISTANT_ENDPOINT is set */
  var LOCAL=[
    [/demo|price|pricing|cost|contact|call|meet|\u0639\u0631\u0636|\u0633\u0639\u0631|\u062a\u0648\u0627\u0635\u0644/i,'The best next step is a tailored session with our team. [Request a Demo](index.html#demo) or email sales@stingrayltd.com.'],
    [/rafm|revenue assurance|fraud|leak/i,'RAFM (Revenue Assurance and Fraud Management) protects revenue by detecting leakage and preventing fraud. Stingray delivers it end to end with [iView 360°](iview360.html) and [SAILOR AI](sailor-ai.html). Learn more on [What is RAFM?](rafm.html).'],
    [/sailor|agent|genai|\bai\b/i,'[SAILOR AI](sailor-ai.html) is our supervised GenAI agent platform for autonomous assurance: risk assessment, natural language analytics, automation and impact analysis.'],
    [/iview|360/i,'[iView 360°](iview360.html) is our no-code Business Assurance platform covering the full RAFM lifecycle, from ETL to dashboards, fraud rules and case management.'],
    [/ocean|octopus|tasky|tactics|tracx|meeting|gates|operation/i,'[Ocean Platform](ocean.html) is our business operations orchestrator with modules like [Octopus](octopus.html), [Tasky](tasky.html), [Tactics](tactics.html) and [TraCx](tracx.html).'],
    [/surf|workflow|bpm/i,'[SURF](surf.html) is our no-code workflow and BPM platform with stages, approvals, SLAs and AI-powered automation.'],
    [/quality|testing|qa\b/i,'We run quality engineering through our TCoE with script-less automation. See [Autonomous Quality Assurance](autonomous-qa.html).'],
    [/fit|which|recommend|best|business/i,'It depends on your goal:\n- Revenue and fraud: [iView 360°](iview360.html)\n- AI-driven assurance: [SAILOR AI](sailor-ai.html)\n- Operations and projects: [Ocean Platform](ocean.html)\n- Workflows and approvals: [SURF](surf.html)\nTell me a bit about your business and I will point you further.']
  ];
  function local(q){for(var i=0;i<LOCAL.length;i++)if(LOCAL[i][0].test(q))return LOCAL[i][1];return 'I can help with our products, domains and services. For anything specific, please [request a demo](index.html#demo) or email sales@stingrayltd.com.'}

  var busy=false;
  function ask(q){
    q=(q||'').trim().slice(0,600);if(!q||busy)return;
    busy=true;send.disabled=true;sug.innerHTML='';
    var prior=hist.slice(-6);
    add('user',q);ta.value='';ta.style.height='';
    var t=document.createElement('div');t.className='ask-msg bot ask-typing';t.innerHTML='<i></i><i></i><i></i>';body.appendChild(t);body.scrollTop=body.scrollHeight;
    function done(txt){t.remove();add('assistant',txt);busy=false;send.disabled=false;ta.focus()}
    if(!ASSISTANT_ENDPOINT){setTimeout(function(){done(local(q))},R?0:650);return}
    fetch(ASSISTANT_ENDPOINT,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({message:q,history:prior,page:location.pathname})})
      .then(function(r){return r.json()})
      .then(function(d){done(d&&d.ok&&d.reply?d.reply:'Sorry, I could not answer that right now. Please try again, or [request a demo](index.html#demo).')})
      .catch(function(){done('Connection problem. Please try again, or email sales@stingrayltd.com.')});
  }
  form.addEventListener('submit',function(e){e.preventDefault();ask(ta.value)});
  ta.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();ask(ta.value)}});
  ta.addEventListener('input',function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,110)+'px'});

  function open(){panel.classList.add('open');fab.classList.add('hide');setTimeout(function(){ta.focus()},200)}
  function close(){panel.classList.remove('open');fab.classList.remove('hide');fab.focus()}
  fab.addEventListener('click',open);
  panel.querySelector('.ask-x').addEventListener('click',close);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&panel.classList.contains('open'))close()});
})();
