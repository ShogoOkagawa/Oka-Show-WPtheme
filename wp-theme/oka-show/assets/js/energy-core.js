/* ════════════════════════════════════════════════════════════
   HERO ASCII — ショーリール映像をリアルタイムで ASCII/文字 に変換
   映像(被写体) × コード(変換) × Web(実装) を一画面に。
   ・#energy-core の data-video から動画を読み込み
   ・ピクセル輝度 → 文字ランプ + 青系グラデーション
   ・カーソルが当たった所が明るくなる“スポットライト”
   ※ file:// は getImageData が塞がれるため http(s) で表示すること
   ════════════════════════════════════════════════════════════ */
(function(){
  const mount = document.getElementById('energy-core');
  if (!mount) return;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const src = mount.dataset.video;
  if (!src) return;

  const isTouch = matchMedia('(hover:none)').matches || matchMedia('(max-width:860px)').matches;
  const RAMP = ' .,:;=+*oOX#%@';   // 暗→明（左ほど暗い）

  // 隠し動画（早期プリロード）
  const video = document.createElement('video');
  video.muted = true; video.loop = true; video.playsInline = true; video.autoplay = true;
  video.preload = 'auto'; video.crossOrigin = 'anonymous'; video.setAttribute('playsinline','');
  // ★ ビューポート内・フルサイズの“実質透明”にして自動再生を確実に発火させる
  //   （極小/opacity:0 だとブラウザが画面外扱いで自動再生を後回しにする）
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.001;pointer-events:none';
  video.src = src;
  mount.appendChild(video);
  video.load();
  const tryPlay = ()=>{ const q=video.play(); if(q&&q.catch)q.catch(()=>{}); };
  tryPlay();
  // 最初のフレームが来たら即・描画開始
  video.addEventListener('loadeddata', ()=>{ tryPlay(); last=0; start(); });
  video.addEventListener('canplay', tryPlay, {once:true});
  video.addEventListener('playing', ()=>{ last=0; start(); }, {once:true});
  // 念のため：最初のユーザー操作でも再生を試みる（自動再生が拒否された環境の保険）
  ['pointerdown','touchstart','keydown','wheel'].forEach(ev=>
    addEventListener(ev, tryPlay, {once:true, passive:true}));

  // 表示用キャンバス
  const cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  mount.appendChild(cv);
  const ctx = cv.getContext('2d');

  // サンプリング用（小）キャンバス
  const sc = document.createElement('canvas');
  const sctx = sc.getContext('2d', { willReadFrequently:true });

  let W,H,cols,rows,cw,ch,fs;
  function layout(){
    W = mount.clientWidth; H = mount.clientHeight;
    const dpr = Math.min(devicePixelRatio||1, 2);
    cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    // ★ 文字セル幅を一定に保つ → どの端末でも“文字として読める”大きさを維持
    //   （列数を固定すると狭い画面で文字が小さくなり、ほぼ映像に見えてしまうため）
    const targetCW = 8.5;
    cols = Math.max(36, Math.min(220, Math.round(W / targetCW)));
    cw = W/cols;
    fs = cw/0.6;            // monospaceの文字幅 ≈ 0.6em
    ch = fs*1.05;           // 行の高さ
    rows = Math.max(1, Math.floor(H/ch));
    sc.width = cols; sc.height = rows;
    ctx.textBaseline = 'top';
  }
  layout(); addEventListener('resize', layout);

  // 入力
  let mxN=0.5, myN=0.42;
  if (!isTouch) addEventListener('mousemove', e=>{ mxN=e.clientX/innerWidth; myN=e.clientY/innerHeight; }, {passive:true});
  let fade=1;
  addEventListener('scroll', ()=>{ fade = Math.max(0, 1 - scrollY/innerHeight); }, {passive:true});

  // ループ（画面外/非表示で停止 + 30fpsに制限）
  let running=true, looping=false, last=0; const FRAME=1000/30;
  function start(){ if(looping||!running) return; looping=true; requestAnimationFrame(loop); }
  document.addEventListener('visibilitychange', ()=>{ running=!document.hidden; start(); });
  const hero = document.querySelector('.hero');
  if (hero) new IntersectionObserver(es=>{ es.forEach(e=>{ running=e.isIntersecting; start(); }); }).observe(hero);

  let tainted=false, tT=0;
  function loop(ts){
    if(!running){ looping=false; return; }
    requestAnimationFrame(loop);
    if (ts-last < FRAME) return; last = ts;
    if (video.paused) tryPlay();                 // 停止中なら再生を試み続ける
    if (video.readyState < 2 || tainted) return;

    sctx.drawImage(video, 0, 0, cols, rows);
    let data;
    try { data = sctx.getImageData(0,0,cols,rows).data; }
    catch(err){ fallback(); return; }    // file:// などで読めない時の保険

    ctx.clearRect(0,0,W,H);
    ctx.font = fs.toFixed(1)+'px ui-monospace, Menlo, Consolas, monospace';
    ctx.globalAlpha = fade;
    tT += 0.016;
    for (let y=0; y<rows; y++){
      for (let x=0; x<cols; x++){
        const i = (y*cols+x)*4;
        let lum = (data[i]*0.299 + data[i+1]*0.587 + data[i+2]*0.114)/255;
        // カーソルのスポットライト
        const dx=(x/cols)-mxN, dy=(y/rows)-myN;
        lum *= 1 + 0.8*Math.max(0, 1 - Math.sqrt(dx*dx+dy*dy)*5.2);  // スポット範囲を狭く
        if (lum < 0.07) continue;        // 暗部は空白（深宇宙）
        lum = lum>1?1:lum;
        const c = RAMP[Math.min(RAMP.length-1, (lum*RAMP.length)|0)];
        // 青→シアン→白のグラデ
        const r = (30 + lum*200)|0, g = (110 + lum*145)|0, b = 255;
        ctx.fillStyle = 'rgb('+r+','+g+','+b+')';
        ctx.fillText(c, x*cw, y*ch);
      }
    }
    ctx.globalAlpha = 1;
  }
  start();

  // 保険：ピクセルが読めない環境では動画を薄く表示
  function fallback(){
    tainted = true;
    cv.style.display='none';
    video.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.4;filter:saturate(1.2)';
  }
})();
