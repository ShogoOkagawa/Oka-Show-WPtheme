<?php
/* Template Name: お問い合わせ */
if (!defined('ABSPATH')) exit; get_header(); ?>

<header class="page-hero">
  <div class="crumb"><a href="<?php echo esc_url(home_url('/')); ?>">HOME</a> / CONTACT</div>
  <span class="ph-num">04 — CONTACT</span>
  <h1>GET IN<br>TOUCH</h1>
  <p class="ph-lead">Web制作・システム開発・ドローン空撮・動画制作のご相談、お見積もりはお気軽にどうぞ。2〜3営業日以内にご返信します。</p>
</header>

<div class="contact-wrap">
  <div class="contact-info">
    <h2>お気軽に<br>ご相談ください</h2>
    <p>企画段階のふんわりしたご相談でも歓迎です。内容・公開時期・ご予算感などがあれば、メッセージ欄にご記入ください。</p>
    <div class="ci-row"><div class="k">EMAIL</div><div class="v"><a href="mailto:info@oka-show.site">info@oka-show.site</a></div></div>
    <div class="ci-row"><div class="k">BASE</div><div class="v">愛知県（全国・オンライン対応可）</div></div>
    <div class="ci-row"><div class="k">SNS</div><div class="v"><a href="https://www.youtube.com/@shogookagawa5084" target="_blank" rel="noopener">YouTube</a> / <a href="https://www.instagram.com/show_goon/" target="_blank" rel="noopener">Instagram</a> / <a href="https://vimeo.com/user149609341" target="_blank" rel="noopener">Vimeo</a></div></div>
  </div>

  <div class="contact-form-col rv">
    <?php
    // 固定ページ本文に Contact Form 7 のショートコードを貼り付けてください
    while (have_posts()) : the_post(); the_content(); endwhile;
    ?>
  </div>
</div>

<?php get_footer(); ?>
