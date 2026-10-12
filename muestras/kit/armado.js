/* Piezas compartidas por las muestras de Trama: fotos que se arman y se desarman con el scroll. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rnd(seed){return function(){seed=(seed*9301+49297)%233280;return seed/233280;};}
  function clamp(v){return Math.max(0,Math.min(1,v));}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
  function foto(id,w){return 'https://images.unsplash.com/photo-'+id+'?auto=format&fit=crop&w='+(w||1400)+'&q=78';}

  /* Sección fija: llama fn(progreso 0..1) mientras se scrollea dentro de ella. */
  function fija(sec,fn){
    if(reduce){fn(1,true);return;}
    sec.classList.add('fija');
    var pend=false;
    function prog(){var r=sec.getBoundingClientRect();return clamp(-r.top/Math.max(1,r.height-innerHeight));}
    function tick(){pend=false;fn(prog());}
    addEventListener('scroll',function(){if(!pend){pend=true;requestAnimationFrame(tick);}},{passive:true});
    addEventListener('resize',tick);tick();
  }

  /* Mosaico: la foto se parte en piezas que vuelan y se acomodan; después se desarma y arma la siguiente. */
  function mosaico(box,imgs,o){
    o=o||{};var cols=o.cols||6,rows=o.rows||4,R=rnd(o.semilla||7),piezas=[],actual=-1;
    box.classList.add('mosaico');
    for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){
      var t=document.createElement('i');
      t.style.left=(c*100/cols)+'%';t.style.top=(r*100/rows)+'%';
      t.style.width='calc('+(100/cols)+'% + 1px)';t.style.height='calc('+(100/rows)+'% + 1px)';
      t.style.backgroundSize=(cols*100)+'% '+(rows*100)+'%';
      t.style.backgroundPosition=(cols>1?c/(cols-1)*100:0)+'% '+(rows>1?r/(rows-1)*100:0)+'%';
      var cx=(c+.5)/cols-.5,cy=(r+.5)/rows-.5;
      t._s={x:cx*(o.abre||520)+(R()-.5)*260,y:cy*(o.abre||520)+(R()-.5)*260,r:(R()-.5)*80,z:R()*500-150,d:R()};
      box.appendChild(t);piezas.push(t);
    }
    imgs.forEach(function(u){var im=new Image();im.src=u;});
    function poner(i){if(i===actual)return;actual=i;piezas.forEach(function(t){t.style.backgroundImage='url("'+imgs[i]+'")';});}
    return function(p){
      var n=imgs.length,f=Math.min(n-1,Math.floor(p*n)),t=p*n-f,ultima=f===n-1;
      if(p>=1){f=n-1;t=1;}
      poner(f);
      piezas.forEach(function(el){var s=el._s;
        var a=clamp((t-s.d*.12)/.28),b=ultima?0:clamp((t-.8-s.d*.08)/.14);
        var k=Math.min(1,(1-ease(a))+ease(b));
        el.style.transform='translate3d('+(s.x*k)+'%,'+(s.y*k)+'%,'+(s.z*k)+'px) rotate('+(s.r*k)+'deg) scale('+(1-.3*k)+')';
        el.style.opacity=String(1-k*.85);
      });
      return {foto:f,t:t};
    };
  }

  /* Tiras: la foto entra en franjas desde arriba y abajo, y se desarma al bajar. */
  function tiras(box,url,n){
    n=n||5;box.classList.add('tiras');var els=[];
    for(var i=0;i<n;i++){
      var t=document.createElement('i');
      t.className=i%2?'abajo':'arriba';
      t.style.left=(i*100/n)+'%';t.style.width='calc('+(100/n)+'% + 1px)';
      t.style.backgroundImage='url("'+url+'")';t.style.backgroundSize=(n*100)+'% 100%';
      t.style.backgroundPosition=(i/(n-1)*100)+'% 50%';t.style.animationDelay=(i*.07)+'s';
      box.appendChild(t);els.push(t);
    }
    if(reduce)return;
    var pend=false;
    function tick(){pend=false;var r=box.getBoundingClientRect();var p=clamp(-r.top/Math.max(1,r.height));
      els.forEach(function(e,i){e.style.translate='0 '+((i%2?1:-1)*p*(50+i*30))+'px';});}
    addEventListener('scroll',function(){if(!pend){pend=true;requestAnimationFrame(tick);}},{passive:true});
  }

  /* Cortes: la foto de una tarjeta entra en franjas horizontales desde los costados al aparecer. */
  function cortes(raiz){
    var els=[].slice.call((raiz||document).querySelectorAll('[data-foto]:not(.corte)'));
    els.forEach(function(el){
      var url=el.getAttribute('data-foto'),n=+(el.getAttribute('data-cortes')||3);el.classList.add('corte');
      for(var i=0;i<n;i++){var t=document.createElement('i');t.style.top=(i*100/n)+'%';t.style.height='calc('+(100/n)+'% + 1px)';
        t.style.backgroundImage='url("'+url+'")';t.style.backgroundSize='100% '+(n*100)+'%';t.style.backgroundPosition='50% '+(i/(n-1)*100)+'%';el.appendChild(t);}
    });
    if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('dentro');});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('dentro');io.unobserve(e.target);}});},{threshold:.2});
    els.forEach(function(e){io.observe(e);});
  }

  window.Armado={foto:foto,fija:fija,mosaico:mosaico,tiras:tiras,cortes:cortes,reduce:reduce,clamp:clamp,ease:ease};
})();
