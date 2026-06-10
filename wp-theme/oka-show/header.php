<?php if (!defined('ABSPATH')) exit; ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php
$logo = get_template_directory_uri() . '/assets/img/logo.svg';
$works_url = get_post_type_archive_link('work');
?>

<div class="bg-glow"></div>

<!-- ローダー -->
<div id="loader">
  <img class="ld-logo" src="<?php echo esc_url($logo); ?>" alt="OKA-SHOW">
  <div class="ld-num" id="ldNum">0</div>
  <div class="ld-bar" id="ldBar"></div>
</div>

<div id="cur"></div><div id="ring"></div>
<div id="sp"></div>

<!-- ナビ -->
<nav class="site-nav">
  <a href="<?php echo esc_url(home_url('/')); ?>" class="n-logo"><img src="<?php echo esc_url($logo); ?>" alt="OKA-SHOW"></a>
  <div class="n-right">
    <div class="n-pct" id="np">SCROLL 0%</div>
    <button class="menu-btn" id="menuBtn"><span id="menuLabel">MENU</span><span class="bars"><i></i><i></i></span></button>
  </div>
</nav>

<!-- フルスクリーンメニュー -->
<div id="menu">
  <a class="m-link" href="<?php echo esc_url($works_url); ?>">WORKS<span>01</span></a>
  <a class="m-link" href="<?php echo esc_url(home_url('/#about')); ?>">ABOUT<span>02</span></a>
  <a class="m-link" href="<?php echo esc_url(home_url('/#services')); ?>">SERVICES<span>03</span></a>
  <a class="m-link" href="<?php echo esc_url(home_url('/contact/')); ?>">CONTACT<span>04</span></a>
  <div class="m-foot">
    <a href="https://www.youtube.com/@shogookagawa5084" target="_blank" rel="noopener">YOUTUBE</a>
    <a href="https://www.instagram.com/show_goon/" target="_blank" rel="noopener">INSTAGRAM</a>
    <a href="https://vimeo.com/user149609341" target="_blank" rel="noopener">VIMEO</a>
  </div>
</div>
