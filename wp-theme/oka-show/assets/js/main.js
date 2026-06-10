/* ════════════════════════════════════════════════════════════
   OKA-SHOW  共通スクリプト（全ページ共有）
   各ページの該当要素が無い場合は自動でスキップする作り
   ════════════════════════════════════════════════════════════ */
(function(){
  var hasGSAP = (typeof gsap !== 'undefined');
  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  var isTouch = matchMedia('(hover:none)').matches || matchMedia('(max-width:860px)').matches;
  var $  = function(s,c){return (c||document).querySelector(s);};
  var $$ = function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s));};

  /* ════ ローダー ════ */
  (function(){
    var ld=$('#loader'); if(!ld) return;
    var n=$('#ldNum',ld), bar=$('#ldBar',ld), v=0;
    var iv=setInterval(function(){
      v += Math.random()*12+5; if(v>=100){v=100;clearInterval(iv);finish();}
      if(n)n.textContent=Math.round(v); if(bar)bar.style.width=v+'%';
    },85);
    function finish(){
      if(hasGSAP){
        gsap.to(ld,{yPercent:-100,duration:.9,ease:'power3.inOut',delay:.2,onComplete:function(){ld.style.display='none';}});
        gsap.to('[data-hero]',{y:0,opacity:1,duration:1,stagger:.08,ease:'power3.out',delay:.5});
      } else {
        ld.style.display='none'; $$('[data-hero]').forEach(function(e){e.style.opacity=1;e.style.transform='none';});
      }
    }
    if(hasGSAP) gsap.set('[data-hero]',{y:30,opacity:0});
  })();

  /* ════ カーソル（PCのみ） ════ */
  if(!isTouch && $('#cur')){
    document.body.classList.add('cursor-on');
    var cur=$('#cur'), ring=$('#ring'), mx=0,my=0,rx=0,ry=0;
    addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
    (function r(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(r);})();
    $$('a,button,.wc,.work-card,.sv,.play-btn,.m-link').forEach(function(el){
      el.addEventListener('mouseenter',function(){ring.classList.add('big');});
      el.addEventListener('mouseleave',function(){ring.classList.remove('big');});
    });
  }

  /* ════ 進捗バー ════ */
  var sp=$('#sp'), np=$('#np');
  if(sp||np) addEventListener('scroll',function(){
    var p=Math.round(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)||0;
    if(sp)sp.style.width=p+'%'; if(np)np.textContent='SCROLL '+p+'%';
  },{passive:true});

  /* ════ 上部へ戻るボタン（全ページ） ════ */
  var toTop=$('.to-top');
  if(toTop){
    addEventListener('scroll',function(){
      toTop.classList.toggle('show', scrollY>400);
    },{passive:true});
    toTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});});
  }

  /* ════ ヒーローのロール文字切替（3秒ごと） ════ */
  var roll=$('#roleRoll');
  if(roll){
    var words=(roll.dataset.words||'VIDEOGRAPHER,DRONE PILOT,WEB CREATOR').split(',');
    var ri=0;
    setInterval(function(){
      roll.style.opacity=0;
      setTimeout(function(){ ri=(ri+1)%words.length; roll.textContent=words[ri]; roll.style.opacity=1; },400);
    },3000);
  }

  /* ════ メニュー開閉 ════ */
  var menu=$('#menu'), mBtn=$('#menuBtn'), mLabel=$('#menuLabel');
  function closeMenu(){ if(menu){menu.classList.remove('open'); if(mLabel)mLabel.textContent='MENU';} }
  if(mBtn) mBtn.addEventListener('click',function(){
    menu.classList.toggle('open');
    if(mLabel)mLabel.textContent=menu.classList.contains('open')?'CLOSE':'MENU';
  });
  /* 同一ページ内アンカーはスムーススクロール */
  $$('a[href^="#"]').forEach(function(a){
    a.addEventListener('click',function(e){
      var id=a.getAttribute('href'); if(id.length<2)return;
      var el=$(id); if(el){e.preventDefault();closeMenu();el.scrollIntoView({behavior:'smooth'});}
    });
  });
  /* メニュー内リンクは必ずモーダルを閉じる（別ページURL / #付きフルURLも対応） */
  $$('#menu a').forEach(function(a){
    a.addEventListener('click',function(e){
      closeMenu();
      var href=a.getAttribute('href')||''; var hi=href.indexOf('#');
      if(hi>-1){ var el=$(href.substring(hi)); if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth'}); } }
    });
  });

  /* ════ マーキー複製 ════ */
  var mqTr=$('#mqTr'); if(mqTr) mqTr.innerHTML+=mqTr.innerHTML;
  /* 自動で順に点灯が流れる（PC=ホバーと併用 / タッチ=ホバーの代替）
     ※ ホバーは :hover、自動点灯は .lit クラスで別系統なので同時に効く */
  if(mqTr){
    var mis=$$('.mi',mqTr), li=0;
    if(mis.length) setInterval(function(){
      mis.forEach(function(m){m.classList.remove('lit');});
      mis[li%mis.length].classList.add('lit');
      mis[(li+Math.ceil(mis.length/2))%mis.length].classList.add('lit'); // 反対側も同時に点灯
      li++;
    }, 480);
  }

  /* ════ リビール ════ */
  if(hasGSAP){
    $$('.rv').forEach(function(el){
      ScrollTrigger.create({trigger:el,start:'top 88%',onEnter:function(){el.classList.add('in');}});
    });
    $$('.intro .ln b').forEach(function(b){
      gsap.from(b,{yPercent:110,opacity:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:b,start:'top 90%'}});
    });
  } else {
    $$('.rv').forEach(function(el){el.classList.add('in');});
  }

  /* ════ スキルバー ════ */
  var skls=$('#skls');
  if(skls){
    var fill=function(){$$('.sk-fill',skls).forEach(function(f){f.style.width=f.dataset.p+'%';});};
    if(hasGSAP) ScrollTrigger.create({trigger:skls,start:'top 80%',once:true,onEnter:fill});
    else fill();
  }

  /* ════ カウンター ════ */
  function animC(el){
    if(el._d)return; el._d=true;
    var T=+el.dataset.t,D=1600,S=performance.now();
    (function step(now){var t=Math.min((now-S)/D,1),e=1-Math.pow(1-t,4);
      el.textContent=Math.round(e*T); if(t<1)requestAnimationFrame(step);})(S);
  }
  var stats=$('.stats');
  if(stats){
    var run=function(){$$('.ctr',stats).forEach(animC);};
    if(hasGSAP) ScrollTrigger.create({trigger:stats,start:'top 80%',once:true,onEnter:run});
    else run();
  }

  /* ════ サービスアコーディオン ════ */
  $$('.sv').forEach(function(s){s.addEventListener('click',function(){s.classList.toggle('open');});});

  /* ════ CTA到達で色反転 ════ */
  var ctaEl=$('.cta');
  if(ctaEl && hasGSAP){
    ScrollTrigger.create({trigger:ctaEl,start:'top 55%',
      onEnter:function(){document.body.classList.add('invert');},
      onLeaveBack:function(){document.body.classList.remove('invert');}});
  }

  /* ════ WORKS一覧フィルタ ════ */
  var filter=$('.filter');
  if(filter){
    filter.addEventListener('click',function(e){
      var b=e.target.closest('button'); if(!b)return;
      $$('button',filter).forEach(function(x){x.classList.remove('on');});
      b.classList.add('on');
      var cat=b.dataset.cat;
      $$('.work-card').forEach(function(c){
        var show = (cat==='all' || c.dataset.cat===cat);
        c.classList.toggle('hide',!show);
      });
      if(hasGSAP) ScrollTrigger.refresh();
    });
  }

  /* ════ お問い合わせフォーム（プロトタイプ：送信はダミー） ════ */
  var form=$('#contactForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var btn=$('button[type=submit]',form);
      if(btn){btn.querySelector('span').textContent='送信しました（プロトタイプ）';}
      // ※ WordPress化時に Contact Form 7 / WPForms / 独自処理 に置き換え
    });
  }

  /* ════ ★ 3Dリールスクロール（TOPのみ） ════ */
  var outer=$('#reelOuter');
  if(outer && hasGSAP){
    var copyEl=$('#reelCopy'),vbg=$('#reelVbg'),grad=$('#reelGrad'),
        blur=$('#reelBlur'),play=$('#reelPlay'),rws=$$('.rw',outer);
    gsap.set(copyEl,{opacity:0});
    gsap.set($$('.rcl-inner',copyEl),{y:'105%'});
    gsap.set([vbg,grad,blur,play],{opacity:0});
    gsap.set(play,{pointerEvents:'none'});   // PLAY MOREは表示時のみ有効化
    var ZBACK=isTouch?-1400:-3000, ZFRONT=80, ZPASS=isTouch?900:1800;
    rws.forEach(function(w){gsap.set(w,{x:+w.dataset.x||0,y:+w.dataset.y||0,z:ZBACK,opacity:0,pointerEvents:'none',force3D:true});});
    var tl=gsap.timeline({scrollTrigger:{trigger:outer,start:'top top',end:'bottom bottom',scrub:2}}); // ★ ぬるっと
    tl.to(copyEl,{opacity:1,duration:.3},0)
      .to($$('.rcl-inner',copyEl),{y:'0%',stagger:.07,duration:.5,ease:'power3.out'},.02)
      .to(copyEl,{opacity:0,duration:.6,ease:'power2.in'},3.0);   // ★ コピーを長く見せる
    var IN=2.0,STAY=isTouch?2.5:4.0,OUT=1.0;
    rws.forEach(function(w,i){
      var t0=2.0+i*1.5, tOut=t0+IN+STAY;
      // 表示中（手前にある間）だけクリック可能に → 通過後の透明サムネがPLAY MOREを遮らない
      tl.set(w,{pointerEvents:'auto'}, t0)
        .to(w,{z:ZFRONT,opacity:1,duration:IN,ease:'power2.out',force3D:true},t0)
        .to(w,{z:ZPASS,opacity:0,duration:OUT,ease:'power3.in',force3D:true},tOut)
        .set(w,{pointerEvents:'none'}, tOut+OUT);
    });
    var src=vbg&&vbg.querySelector('source');
    var hasVid=src&&src.getAttribute('src');
    // ★ ページ表示と同時に裏で再生開始（到達時には途中まで進んでいる＝起動遅延を感じさせない）
    if(hasVid && vbg && vbg.play){ vbg.muted=true; var _p=vbg.play(); if(_p&&_p.catch)_p.catch(function(){}); }
    tl.to(hasVid?vbg:grad,{opacity:hasVid?1:.8,duration:1.5,ease:'power2.inOut'},14.5)
      .to(blur,{opacity:1,duration:1.2,ease:'power2.out'},15.0)
      .to(play,{opacity:1,duration:1.2,ease:'power2.out'},15.5)
      .set(play,{pointerEvents:'auto'},15.5)   // 表示と同時にクリック可能
      .to({},{duration:8});   // ★ 余韻：映像を固定表示したままスクロールを稼ぐ
    if(hasVid&&vbg.play) vbg.play();
  }

})();
