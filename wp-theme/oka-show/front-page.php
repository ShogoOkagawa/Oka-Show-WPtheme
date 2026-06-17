<?php if (!defined('ABSPATH')) exit; get_header();
$tpl  = get_template_directory_uri();
$works_url = get_post_type_archive_link('work');
$contact_url = home_url('/contact/');
?>

<!-- ヒーロー -->
<div class="hero" id="top">
  <div class="hero-fallback"></div>
  <div id="energy-core" data-video="<?php echo esc_url($tpl); ?>/assets/video/hero-ascii.mp4"></div>
  <div class="hero-ov"></div>
  <div class="hero-cnt">
    <p class="h-ey" data-hero>AICHI, JAPAN — <span id="roleRoll" data-words="WEB DEVELOPER,SYSTEM ENGINEER,WEB DESIGNER,DRONE PILOT,VIDEOGRAPHER">WEB DEVELOPER</span></p>
    <h1 class="h-ttl">
      <span class="h-ovf"><span data-hero style="display:inline-block">BUILD</span></span><br>
      <span class="h-ovf"><span class="out" data-hero style="display:inline-block">YOUR</span></span><br>
      <span class="h-ovf"><span class="grad" data-hero style="display:inline-block">SYSTEM</span></span>
    </h1>
    <div class="h-tags">
      <span class="h-tag" data-hero>WEB DESIGN</span>
      <span class="h-tag" data-hero>SYSTEM DEVELOPMENT</span>
      <span class="h-tag" data-hero>DRONE / VIDEO</span>
    </div>
  </div>
  <div class="h-scroll"><span>SCROLL</span><div class="h-line"></div></div>
</div>

<!-- マーキー -->
<div class="mq"><div class="mq-tr" id="mqTr">
  <span class="mi lit">WEB</span><span class="md">·</span>
  <span class="mi">SYSTEM</span><span class="md">·</span>
  <span class="mi">DEVELOPMENT</span><span class="md">·</span>
  <span class="mi">UI / UX</span><span class="md">·</span>
  <span class="mi">WORDPRESS</span><span class="md">·</span>
  <span class="mi">DRONE</span><span class="md">·</span>
  <span class="mi">VIDEO</span><span class="md">·</span>
</div></div>

<!-- イントロ -->
<div class="intro">
  <p>
    <span class="ln"><b>Web制作・システム開発を軸に、</b></span>
    <span class="ln"><b>ドローン・映像まで<span class="acc">一気通貫</span>。</b></span>
    <span class="ln"><b>つくって終わりではなく、</b></span>
    <span class="ln"><b>成果につながる仕組みを。</b></span>
  </p>
</div>

<!-- 3Dリール -->
<div class="reel-outer" id="reelOuter">
  <div class="reel-stage" id="reelStage">
    <div class="reel-grad" id="reelGrad"></div>
    <video class="reel-vbg" id="reelVbg" autoplay muted loop playsinline preload="auto"><source src="<?php echo esc_url($tpl); ?>/assets/video/showreel.mp4" type="video/mp4"></video>
    <div class="reel-blur" id="reelBlur"></div>
    <div class="reel-copy" id="reelCopy">
      <div class="rcl"><span class="rcl-inner it">Rebuilding</span></div>
      <div class="rcl"><span class="rcl-inner">EXPRESSION,</span></div>
      <div class="rcl"><span class="rcl-inner it">Continuously Pursuing</span></div>
      <div class="rcl"><span class="rcl-inner grad">UNIQUE CREATIONS.</span></div>
    </div>

    <?php
    $rw_pos = array(array(-380,-200),array(360,-150),array(-300,180),array(340,200),array(0,-60),array(-60,120));
    $reel_q = new WP_Query(array('post_type'=>'work','posts_per_page'=>6,'orderby'=>'rand'));
    if ($reel_q->have_posts()) :
        $i = 0;
        while ($reel_q->have_posts()) : $reel_q->the_post();
            $pos = $rw_pos[$i % 6];
            $img = get_the_post_thumbnail_url(get_the_ID(), 'large');
            ?>
            <a class="rw" href="<?php the_permalink(); ?>" data-x="<?php echo $pos[0]; ?>" data-y="<?php echo $pos[1]; ?>">
              <img src="<?php echo esc_url($img); ?>" alt="<?php the_title_attribute(); ?>">
              <div class="rw-label"><span class="rw-cat"><?php echo oka_work_cat_name(get_the_ID()); ?></span><div class="rw-title"><?php the_title(); ?></div></div>
            </a>
            <?php $i++;
        endwhile; wp_reset_postdata();
    else :
        // フォールバック（制作実績未登録時のサンプル）
        $samples = array(
            array('web-lamure','WEB','LamuRe'), array('web-beyond','WEB','BEYOND'),
            array('web-nagoyagym','WEB','NAGOYA GYM'), array('web-shukyaku','WEB','WEB MARKETING'),
            array('drone-golf','DRONE','GOLF CLUB'), array('video-sakura','VIDEO','CHERRY BLOSSOMS'),
        );
        foreach ($samples as $i => $s) {
            $pos = $rw_pos[$i % 6];
            echo '<a class="rw" href="'.esc_url($works_url).'" data-x="'.$pos[0].'" data-y="'.$pos[1].'">';
            echo '<img src="'.esc_url($tpl.'/assets/img/works/'.$s[0].'.png').'" alt="">';
            echo '<div class="rw-label"><span class="rw-cat">'.$s[1].'</span><div class="rw-title">'.$s[2].'</div></div></a>';
        }
    endif;
    ?>

    <a class="reel-play" id="reelPlay" href="https://www.youtube.com/@shogookagawa5084" target="_blank" rel="noopener">
      <div class="play-btn"><div class="play-icon"></div></div>
      <p class="play-text">PLAY MORE</p>
      <span class="play-handle">@shogookagawa5084 — YOUTUBE</span>
    </a>
  </div>
</div>

<!-- WORKS（抜粋） -->
<section id="works">
  <div class="s-hd rv">
    <div><span class="s-num">01 — WORKS</span><h2 class="s-title">SELECTED</h2></div>
    <a href="<?php echo esc_url($works_url); ?>" class="s-more">ALL WORKS →</a>
  </div>
  <div class="wg">
    <?php
    $sizes = array('w-lg','w-sm','w-md','w-wide','w-sm','w-lg');
    $prev_q = new WP_Query(array('post_type'=>'work','posts_per_page'=>6,'orderby'=>'rand'));
    if ($prev_q->have_posts()) :
        $i = 0;
        while ($prev_q->have_posts()) : $prev_q->the_post(); ?>
          <a href="<?php the_permalink(); ?>" class="wc <?php echo $sizes[$i % 6]; ?> rv">
            <img src="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(),'large')); ?>" alt="<?php the_title_attribute(); ?>">
            <div class="wc-meta"><div class="wc-cat"><?php echo oka_work_cat_name(get_the_ID()); ?></div><div class="wc-ttl"><?php the_title(); ?></div></div>
          </a>
        <?php $i++; endwhile; wp_reset_postdata();
    else :
        $samples = array(
            array('web-lamure','w-lg','WEB / EC','LamuRe'), array('web-nagoyagym','w-sm','WEB / WORDPRESS','NAGOYA GYM'),
            array('web-mazstay','w-md','WEB / LP','mazStay'), array('web-shukyaku','w-wide','WEB / 集客','WEB MARKETING'),
            array('drone-seaofclouds','w-sm','DRONE / 4K','SEA OF CLOUDS'), array('video-sakura','w-lg','VIDEO','CHERRY BLOSSOMS'),
        );
        foreach ($samples as $s) {
            echo '<a href="'.esc_url($works_url).'" class="wc '.$s[1].' rv">';
            echo '<img src="'.esc_url($tpl.'/assets/img/works/'.$s[0].'.png').'" alt="">';
            echo '<div class="wc-meta"><div class="wc-cat">'.$s[2].'</div><div class="wc-ttl">'.$s[3].'</div></div></a>';
        }
    endif;
    ?>
  </div>
  <div class="rv works-more"><a href="<?php echo esc_url($works_url); ?>" class="btn btn-ghost">VIEW ALL WORKS →</a></div>
</section>

<!-- ABOUT（簡易自己紹介） -->
<section id="about">
  <div class="s-hd rv"><div><span class="s-num">02 — ABOUT</span><h2 class="s-title">WHO I AM</h2></div></div>
  <div class="ab-grid">
    <div class="ab-photo rv">
      <img src="<?php echo esc_url($tpl); ?>/assets/img/self_photo.jpeg" alt="SHOGO OKAGAWA" style="object-position:center 25%">
      <div class="ab-photo-label">SHOGO OKAGAWA<em>WEB DEVELOPER / SYSTEM ENGINEER / CREATOR</em></div>
    </div>
    <div class="rv">
      <p class="ab-lead">Web制作・<br>システム開発を軸に<br><span class="hl">一気通貫</span>でつくる</p>
      <p class="ab-body">愛知県を拠点に、Webサイト制作・システム開発を主軸とするフリーランス。WordPressオリジナルテーマ開発や業務システム構築を中心に、ドローン空撮・動画制作まで一体で対応。「つくって終わり」ではなく、成果につながる仕組みづくりを大切にしています。</p>
      <div class="ab-tags">
        <span class="ab-tag">AICHI, JAPAN</span><span class="ab-tag">FREELANCE</span>
        <span class="ab-tag">WORDPRESS</span><span class="ab-tag">DRONE CERTIFIED</span>
      </div>
      <div class="sk-list" id="skls">
        <div class="sk"><div class="sk-nm"><span>WEB DESIGN</span><span>95%</span></div><div class="sk-bar"><div class="sk-fill" data-p="95"></div></div></div>
        <div class="sk"><div class="sk-nm"><span>SYSTEM DEVELOPMENT</span><span>90%</span></div><div class="sk-bar"><div class="sk-fill" data-p="90"></div></div></div>
        <div class="sk"><div class="sk-nm"><span>WORDPRESS</span><span>92%</span></div><div class="sk-bar"><div class="sk-fill" data-p="92"></div></div></div>
        <div class="sk"><div class="sk-nm"><span>DRONE / VIDEO</span><span>80%</span></div><div class="sk-bar"><div class="sk-fill" data-p="80"></div></div></div>
      </div>
    </div>
  </div>
</section>

<!-- SERVICES -->
<section id="services">
  <div class="s-hd rv"><div><span class="s-num">03 — SERVICES</span><h2 class="s-title">WHAT I DO</h2></div></div>
  <div class="rv">
    <div class="sv"><span class="sv-n">01</span><div class="sv-bd"><div class="sv-nm">WEB DESIGN &amp; DEV<span class="pl">+</span></div><div class="sv-desc">WordPressオリジナルテーマ開発・コーポレートサイト・LP制作。デザインからコーディング、公開後の運用・保守までワンストップ。動きのある“魅せるWeb”が得意です。</div></div></div>
    <div class="sv"><span class="sv-n">02</span><div class="sv-bd"><div class="sv-nm">SYSTEM DEVELOPMENT<span class="pl">+</span></div><div class="sv-desc">業務システム・Webアプリ・管理ツールの開発。要件整理から設計・実装・運用まで対応し、現場の業務を効率化する仕組みをつくります。既存システムの改修・連携も可能。</div></div></div>
    <div class="sv"><span class="sv-n">03</span><div class="sv-bd"><div class="sv-nm">DRONE SHOOTING<span class="pl">+</span></div><div class="sv-desc">国土交通省認定オペレーターによる空撮。風景・施設・イベントの俯瞰映像で、地上撮影では出せないスケール感を演出します。各種申請にも対応。</div></div></div>
    <div class="sv"><span class="sv-n">04</span><div class="sv-bd"><div class="sv-nm">VIDEO PRODUCTION<span class="pl">+</span></div><div class="sv-desc">企業VP・ブランドフィルム・SNS動画まで。企画構成から撮影・編集・カラーグレーディングまで対応。Webと連動した映像活用をご提案します。</div></div></div>
  </div>
</section>

<!-- CTA -->
<section class="cta" id="contact">
  <div class="cta-bg">LET'S CREATE</div>
  <p class="cta-lb rv">GET IN TOUCH</p>
  <h2 class="cta-ttl rv">LET'S CREATE<br><span class="out">TOGETHER</span></h2>
  <div class="rv"><a href="<?php echo esc_url($contact_url); ?>" class="btn"><span>CONTACT</span><span>→</span></a></div>
</section>

<!-- ════ Three.js エネルギーコア（インラインmodule） ════ -->
<script type="importmap">
{ "imports": {
  "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
  "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
}}
</script>
<script type="module" src="<?php echo esc_url($tpl); ?>/assets/js/energy-core.js?ver=<?php echo OKA_VER; ?>"></script>

<?php get_footer(); ?>
