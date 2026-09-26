/* Stingray v2 behavior for inner pages. Mirrors the homepage motion system. */
(function(){
  var R=matchMedia('(prefers-reduced-motion: reduce)').matches,de=document.documentElement;
  var nav=document.getElementById('sr-nav'),pg=document.getElementById('sr-pg'),ly=0;

  function lum(el){while(el&&el!==document.documentElement){var b=getComputedStyle(el).backgroundColor,m=b.match(/[\d.]+/g);if(m&&(m.length<4||+m[3]>.5)){return(.299*m[0]+.587*m[1]+.114*m[2])/255}if(getComputedStyle(el).backgroundImage!=='none')return 0.2;el=el.parentElement}return 1}
  document.querySelectorAll('section,.stat-banner,.cta-box,[class*="cta"]').forEach(function(s){if(s.closest('.sr-nav'))return;s.classList.add(lum(s)<.5?'v2d':'v2l')});
  function onS(){
    var y=de.scrollTop,m=de.scrollHeight-de.clientHeight;
    if(pg)pg.style.transform='scaleX('+(m>0?y/m:0)+')';
    if(nav){nav.classList.toggle('s',y>30);if(!nav.classList.contains('o'))nav.classList.toggle('h',y>ly&&y>600);document.body.classList.toggle('sr-navh',nav.classList.contains('h'))}
    ly=y;
  }
  addEventListener('scroll',function(){requestAnimationFrame(onS)},{passive:true});onS();

  var b=document.getElementById('sr-burg');
  if(b)b.addEventListener('click',function(){nav.classList.toggle('o')});
  document.querySelectorAll('.sr-dd>a').forEach(function(a){a.addEventListener('click',function(e){if(innerWidth<=900){e.preventDefault();a.parentElement.classList.toggle('o')}})});

  /* staggered reveal for anything marked .reveal (page JS may also add .visible) */
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target,p=el.parentElement,sib=p?[].filter.call(p.children,function(c){return c.classList.contains('reveal')}):[],i=Math.max(0,sib.indexOf(el));el.style.transitionDelay=Math.min(i,6)*70+'ms';el.classList.add('visible','in');io.unobserve(el)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});
  }else document.querySelectorAll('.reveal').forEach(function(el){el.classList.add('visible')});

  /* count-up for purely numeric hero metrics */
  document.querySelectorAll('.hm .v,.pm-val,.cs-amount').forEach(function(el){
    var m=el.textContent.trim().match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);if(!m||R)return;
    var t=parseFloat(m[2]);if(t>=1900&&t<=2100)return;var dec=(m[2].split('.')[1]||'').length;
    var co=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;co.disconnect();var t0=null;
      (function f(ts){t0=t0||ts;var p=Math.min((ts-t0)/1500,1),k=1-Math.pow(1-p,4);el.textContent=m[1]+(t*k).toFixed(dec)+m[3];if(p<1)requestAnimationFrame(f)})(performance.now())},{threshold:.5});
    co.observe(el);
  });

  /* hero data network, same as homepage */
  var hero=document.getElementById('hero');if(!hero||R)return;
  var c=document.createElement('canvas');c.className='v2net';c.setAttribute('aria-hidden','true');hero.insertBefore(c,hero.firstChild);
  var x=c.getContext('2d'),W,H,N=[],P=[],dpr=Math.min(devicePixelRatio||1,2),run=true,D=150;
  function rs(){W=c.offsetWidth;H=c.offsetHeight;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);N=[];var n=Math.round(W*H/26000);for(var i=0;i<n;i++)N.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18})}
  rs();addEventListener('resize',rs);
  new IntersectionObserver(function(e){run=e[0].isIntersecting}).observe(c);
  (function fr(){
    if(run){x.clearRect(0,0,W,H);var i,j,a,q;
      for(i=0;i<N.length;i++){a=N[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1}
      for(i=0;i<N.length;i++)for(j=i+1;j<N.length;j++){a=N[i];var bb=N[j],dx=a.x-bb.x,dy=a.y-bb.y,d=Math.sqrt(dx*dx+dy*dy);
        if(d<D){x.strokeStyle='rgba(32,160,208,'+(.14*(1-d/D))+')';x.lineWidth=1;x.beginPath();x.moveTo(a.x,a.y);x.lineTo(bb.x,bb.y);x.stroke();
          if(P.length<14&&Math.random()<.0009)P.push({a:a,b:bb,t:0,g:Math.random()<.12})}}
      for(i=0;i<N.length;i++){x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.arc(N[i].x,N[i].y,1.3,0,6.3);x.fill()}
      for(i=P.length-1;i>=0;i--){var p=P[i];p.t+=.012;if(p.t>=1){if(p.g)p.b.fl=40;P.splice(i,1);continue}
        x.fillStyle=p.g?'#D4A853':'#20A0D0';x.shadowColor=x.fillStyle;x.shadowBlur=10;x.beginPath();x.arc(p.a.x+(p.b.x-p.a.x)*p.t,p.a.y+(p.b.y-p.a.y)*p.t,2.2,0,6.3);x.fill();x.shadowBlur=0}
      for(i=0;i<N.length;i++){q=N[i];if(q.fl){q.fl--;x.strokeStyle='rgba(212,168,83,'+(q.fl/40)+')';x.lineWidth=1.2;x.beginPath();x.arc(q.x,q.y,4+(40-q.fl)*.35,0,6.3);x.stroke()}}
    }
    requestAnimationFrame(fr);
  })();
})();

/* accordion used by feature groups (was referenced but never defined in the original pages) */
window.toggleAccordion=function(h){
  var g=h.closest('.fa-group')||h.parentElement;if(!g)return;
  var open=!g.classList.contains('open');
  g.parentElement&&[].forEach.call(g.parentElement.querySelectorAll('.fa-group.open'),function(o){if(o!==g)o.classList.remove('open')});
  g.classList.toggle('open',open);h.setAttribute('aria-expanded',open);
};
document.querySelectorAll('.fa-header').forEach(function(h){h.setAttribute('role','button');h.setAttribute('tabindex','0');h.setAttribute('aria-expanded','false');
  h.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();window.toggleAccordion(h)}})});
