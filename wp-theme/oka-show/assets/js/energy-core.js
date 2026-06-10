import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const mount = document.getElementById('energy-core');
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

// WebGL対応チェック（非対応/低速環境ではフォールバックのグラデのまま）
function webglOK(){ try{ const c=document.createElement('canvas');
  return !!(window.WebGLRenderingContext && (c.getContext('webgl')||c.getContext('experimental-webgl'))); }catch(e){ return false; } }

if(mount && webglOK() && !reduce){ initEnergyCore(mount); }

function initEnergyCore(mount){
  // ───── 品質ティア ─────
  const w = innerWidth;
  const TIER = w>=1920 ? 'ultra' : (w>=768 ? 'high' : 'medium');
  const Q = {
    ultra:  { bg:3000, orbit:500, spark:100, bloom:0.95, dpr:2   },
    high:   { bg:2000, orbit:400, spark:80,  bloom:0.85, dpr:1.75},
    medium: { bg:800,  orbit:250, spark:50,  bloom:0.55, dpr:1.5 },
  }[TIER];

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x031024, 0.085);          // 青い霧

  const camera = new THREE.PerspectiveCamera(55, mount.clientWidth/mount.clientHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio||1, Q.dpr));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  // ───── GLSL simplex noise（Ashima webgl-noise 3D） ─────
  const NOISE = `
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+1.0*C.xxx; vec3 x2=x0-i2+2.0*C.xxx; vec3 x3=x0-1.0+3.0*C.xxx;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }`;

  // ───── エネルギーリング（有機変形 + 発光 + フレネル + 電流ライン） ─────
  const ringGeo = new THREE.TorusGeometry(1.45, 0.16, 48, 200);
  const ringMat = new THREE.ShaderMaterial({
    transparent:true,
    uniforms:{ uTime:{value:0}, uGlow:{value:0.7},
      uColor:{value:new THREE.Color(0x80D4FF)}, uCore:{value:new THREE.Color(0x2a6cff)} },
    vertexShader: NOISE + `
      uniform float uTime; varying vec3 vNormal; varying vec3 vView; varying float vN; varying vec2 vUv;
      void main(){
        vUv = uv;
        float n = snoise(position*1.7 + uTime*0.14);
        vN = n;
        vec3 p = position + normal * n * 0.16;            // 有機的変形（脈動・控えめ）
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(p,1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: NOISE + `
      uniform float uTime; uniform float uGlow; uniform vec3 uColor; uniform vec3 uCore;
      varying vec3 vNormal; varying vec3 vView; varying float vN; varying vec2 vUv;
      void main(){
        float fres = pow(1.0 - max(dot(vNormal,vView),0.0), 2.2);   // フレネル（リム）
        // ★ 渦状に流れる筋：リング周回方向(vUv.x)に沿って高速で流れるストリーク
        float flow1 = sin(vUv.x*52.0 - uTime*2.4 + vN*3.0);
        float flow2 = sin(vUv.x*23.0 - uTime*1.3 - vN*2.0);
        float streak = smoothstep(0.55,1.0, max(flow1,flow2)*0.5+0.5);
        // 細かな明滅ノイズ
        float lines = smoothstep(0.86,0.99, sin(vN*9.0 + uTime*1.1)*0.5+0.5);
        vec3 col = mix(uCore, uColor, fres);
        col += uColor * (streak*1.35 + lines*0.9);
        col *= uGlow;                                               // 発光（uniformで制御・控えめ）
        float alpha = clamp(fres*0.38 + streak*0.72 + lines*0.5 + 0.04, 0.0, 1.0); // 筋主体・薄め
        gl_FragColor = vec4(col, alpha);
      }`
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  const ringGroup = new THREE.Group(); ringGroup.add(ring); scene.add(ringGroup);
  const BASE_TILT = -0.5;   // 参考画像のように楕円＝傾けて配置

  // ───── 円形パーティクル用テクスチャ（四角→丸） ─────
  function makeDotTexture(){
    const c=document.createElement('canvas'); c.width=c.height=64;
    const g=c.getContext('2d');
    const grd=g.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,'rgba(255,255,255,1)');
    grd.addColorStop(0.35,'rgba(255,255,255,0.85)');
    grd.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=grd; g.beginPath(); g.arc(32,32,32,0,Math.PI*2); g.fill();
    const t=new THREE.CanvasTexture(c); t.needsUpdate=true; return t;
  }
  const dotTex = makeDotTexture();

  // ───── パーティクル生成ヘルパー ─────
  function makePoints(count, spread, size, color, opacity){
    const g=new THREE.BufferGeometry(); const pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){ pos[i*3]=(Math.random()-0.5)*spread;
      pos[i*3+1]=(Math.random()-0.5)*spread; pos[i*3+2]=(Math.random()-0.5)*spread; }
    g.setAttribute('position', new THREE.BufferAttribute(pos,3));
    const m=new THREE.PointsMaterial({ size, color, map:dotTex, alphaTest:0.01, transparent:true, opacity,
      blending:THREE.AdditiveBlending, depthWrite:false, sizeAttenuation:true });
    return new THREE.Points(g,m);
  }

  // レイヤー2: 背景パーティクル（奥行き・霧の粒）
  const bgP = makePoints(Q.bg, 40, 0.06, 0x6fa8ff, 0.5); scene.add(bgP);

  // レイヤー1: 公転パーティクル（リング周囲）
  const orbitN=Q.orbit; const orbitG=new THREE.BufferGeometry();
  const orbitPos=new Float32Array(orbitN*3); const orbitData=[];
  for(let i=0;i<orbitN;i++){
    const a=Math.random()*Math.PI*2, r=1.45+(Math.random()-0.5)*0.9, zoff=(Math.random()-0.5)*0.5;
    orbitData.push({a,r,zoff,sp:0.2+Math.random()*0.5});
    orbitPos[i*3]=Math.cos(a)*r; orbitPos[i*3+1]=Math.sin(a)*r; orbitPos[i*3+2]=zoff;
  }
  orbitG.setAttribute('position', new THREE.BufferAttribute(orbitPos,3));
  const orbit=new THREE.Points(orbitG, new THREE.PointsMaterial({size:0.05,color:0x80D4FF,
    map:dotTex,alphaTest:0.01,transparent:true,opacity:0.9,blending:THREE.AdditiveBlending,depthWrite:false}));
  scene.add(orbit);

  // レイヤー3: スパーク（エネルギー放出）
  const sparkN=Q.spark; const sparkG=new THREE.BufferGeometry();
  const sparkPos=new Float32Array(sparkN*3); const sparkData=[];
  function resetSpark(i){ const a=Math.random()*Math.PI*2;
    // リング付近から“ほぼ直進”で外へ漂う光の粒（カーブさせると虫に見えるので直進主体）
    sparkData[i]={a, r:1.2+Math.random()*0.5, sp:0.5+Math.random()*1.1, z:(Math.random()-0.5)*0.8};
    sparkPos[i*3]=Math.cos(a)*1.45; sparkPos[i*3+1]=Math.sin(a)*1.45; sparkPos[i*3+2]=sparkData[i].z; }
  for(let i=0;i<sparkN;i++) resetSpark(i);
  sparkG.setAttribute('position', new THREE.BufferAttribute(sparkPos,3));
  const spark=new THREE.Points(sparkG, new THREE.PointsMaterial({size:0.045,color:0xbfe8ff,
    map:dotTex,alphaTest:0.01,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));
  let sparkSwirl=0;
  scene.add(spark);

  // ───── ポストエフェクト ─────
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), Q.bloom, 0.8, 0.0);
  composer.addPass(bloom);
  // 仕上げ：色収差 + ヴィネット + フィルムグレイン
  const finalPass = new ShaderPass({
    uniforms:{ tDiffuse:{value:null}, uTime:{value:0}, uRes:{value:new THREE.Vector2(mount.clientWidth,mount.clientHeight)} },
    vertexShader:`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader:`
      uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
      float rand(vec2 c){ return fract(sin(dot(c,vec2(12.9898,78.233)))*43758.5453); }
      void main(){
        vec2 d = (vUv-0.5);
        float ca = 0.001;                                  // 色収差（微量）
        vec3 col;
        col.r = texture2D(tDiffuse, vUv + d*ca).r;
        col.g = texture2D(tDiffuse, vUv).g;
        col.b = texture2D(tDiffuse, vUv - d*ca).b;
        float vig = smoothstep(0.9, 0.3, length(d));       // ヴィネット 15%
        col *= mix(1.0, vig, 0.15);
        float grain = (rand(vUv+uTime)-0.5)*0.03;          // フィルムグレイン 3%
        col += grain;
        gl_FragColor = vec4(col,1.0);
      }`
  });
  composer.addPass(finalPass);

  // ───── マウス追従パララックス / タッチ端末は自動傾き ─────
  let mx=0,my=0,cx=0,cy=0;
  const touchDev = matchMedia('(hover:none)').matches;   // スマホ・タブレット
  if(!touchDev) addEventListener('mousemove',e=>{ mx=(e.clientX/innerWidth-0.5); my=(e.clientY/innerHeight-0.5); },{passive:true});

  // ───── スクロール連動（0〜100vh） ─────
  let scrollP=0;
  addEventListener('scroll',()=>{ scrollP=Math.min(scrollY/innerHeight,1); },{passive:true});

  // ───── リサイズ & レスポンシブなリング縮尺 ─────
  let fit = 1;
  function computeFit(){ const W=mount.clientWidth;
    // 画面が狭いほどリングを小さく（最小0.5・最大1.0）
    fit = Math.max(0.72, Math.min(1.0, W/1150)); }
  function onResize(){ const W=mount.clientWidth,H=mount.clientHeight;
    camera.aspect=W/H; camera.updateProjectionMatrix();
    renderer.setSize(W,H); composer.setSize(W,H); finalPass.uniforms.uRes.value.set(W,H);
    computeFit(); }
  computeFit();
  addEventListener('resize', onResize);

  // ───── 描画ループ（非表示/画面外で停止） ─────
  const clock = new THREE.Clock();
  let running=true, looping=false;
  function start(){ if(looping||!running) return; looping=true; loop(); }
  document.addEventListener('visibilitychange',()=>{ running=!document.hidden; start(); });
  const heroEl=document.querySelector('.hero');
  const io=new IntersectionObserver(es=>{ es.forEach(e=>{ running=e.isIntersecting; start(); }); });
  if(heroEl) io.observe(heroEl);

  function loop(){
    if(!running){ looping=false; return; }
    requestAnimationFrame(loop);
    const dt=Math.min(clock.getDelta(),0.05);   // ★ getDeltaを先に
    const t=clock.getElapsedTime();

    // タッチ端末：マウスの代わりにゆるやかなサイン波で自動的に傾ける
    if(touchDev){ mx = Math.sin(t*0.25)*0.45; my = Math.cos(t*0.19)*0.32; }
    // マウス追従（lerp）
    cx += (mx - cx)*0.045; cy += (my - cy)*0.045;

    // リング：傾き(固定)＋マウスで明確に傾く / 中心軸でゆっくり電流回転
    ringGroup.rotation.x = BASE_TILT + cy*0.6;     // ★ マウス上下でハッキリ傾く
    ringGroup.rotation.y = cx*0.9;                  // ★ マウス左右で回り込む
    ring.rotation.z += 0.004;                       // 電流がリングを流れる（低速）
    ringGroup.position.y = Math.sin(t*(Math.PI*2/6))*0.12 - scrollP*1.6;  // 浮遊(6秒) + スクロールで上へ
    const breathe = 1.0 + Math.sin(t*(Math.PI*2/4))*0.03;                 // 呼吸 97〜103%(4秒)
    const shrink  = 1.0 - scrollP*0.5;                                    // スクロールで縮小
    ringGroup.scale.setScalar(fit*breathe*shrink);                        // ★ レスポンシブ縮尺
    ringMat.uniforms.uTime.value = t;
    ringMat.uniforms.uGlow.value = 0.7 + Math.sin(t*1.0)*0.25;            // 発光 0.45〜0.95(控えめ)

    // 公転パーティクル（低速）
    const op=orbit.geometry.attributes.position.array;
    for(let i=0;i<orbitN;i++){ const d=orbitData[i]; d.a+=d.sp*dt*0.5;
      op[i*3]=Math.cos(d.a)*d.r; op[i*3+1]=Math.sin(d.a)*d.r; op[i*3+2]=d.zoff; }
    orbit.geometry.attributes.position.needsUpdate=true;
    orbit.rotation.copy(ringGroup.rotation);    // リングと一緒に傾く
    orbit.scale.setScalar(fit*shrink);

    // スパーク（低速放出）
    const sp=spark.geometry.attributes.position.array;
    for(let i=0;i<sparkN;i++){ const d=sparkData[i];
      d.r += d.sp*dt;                           // 直進で外へ
      if(d.r>10){ resetSpark(i); continue; }    // 画面端を越えたら再生成
      sp[i*3]=Math.cos(d.a)*d.r; sp[i*3+1]=Math.sin(d.a)*d.r; sp[i*3+2]=d.z; }
    spark.geometry.attributes.position.needsUpdate=true;
    // 全体をゆっくり旋回（粒は直進でも“場”として渦巻く＝シネマティック）
    sparkSwirl += dt*0.08;
    spark.rotation.set(ringGroup.rotation.x, ringGroup.rotation.y, ringGroup.rotation.z + sparkSwirl);
    spark.scale.setScalar(fit*shrink);

    // 背景パーティクル：低速回転＋逆方向パララックス
    bgP.rotation.y += 0.00025;
    bgP.position.x = -cx*0.8;
    bgP.position.y = cy*0.5;

    // カメラ：マウスで控えめに動く（リングの傾きが主役なので弱め）
    camera.position.x = cx*0.5;
    camera.position.y = -cy*0.35;
    camera.lookAt(0,0,0);

    finalPass.uniforms.uTime.value = t;
    composer.render();
  }
  start();
}
