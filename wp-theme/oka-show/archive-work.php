<?php if (!defined('ABSPATH')) exit; get_header(); $contact_url = home_url('/contact/'); ?>

<header class="page-hero">
  <div class="crumb"><a href="<?php echo esc_url(home_url('/')); ?>">HOME</a> / WORKS</div>
  <span class="ph-num">01 — WORKS</span>
  <h1>SELECTED<br>WORKS</h1>
  <p class="ph-lead">Web制作・システム開発を中心に、ドローン空撮・動画制作の実績一覧です。カテゴリで絞り込めます。</p>
</header>

<section>
  <?php
  // カテゴリ（フィルタ）— 投稿のある work_cat のみ
  $cats = get_terms(array('taxonomy'=>'work_cat','hide_empty'=>true));
  ?>
  <div class="filter">
    <button class="on" data-cat="all">ALL</button>
    <?php if (!is_wp_error($cats) && $cats) : foreach ($cats as $c) : ?>
      <button data-cat="<?php echo esc_attr($c->slug); ?>"><?php echo esc_html($c->name); ?></button>
    <?php endforeach; endif; ?>
  </div>

  <div class="work-grid">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
      <a href="<?php the_permalink(); ?>" class="work-card rv" data-cat="<?php echo oka_work_cat_slug(get_the_ID()); ?>">
        <img src="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(),'large')); ?>" alt="<?php the_title_attribute(); ?>">
        <div class="wc-meta"><div class="wc-cat"><?php echo oka_work_cat_name(get_the_ID()); ?></div><div class="wc-ttl"><?php the_title(); ?></div></div>
      </a>
    <?php endwhile; else : ?>
      <p style="color:var(--mid);font-size:14px;">まだ制作実績が登録されていません。管理画面の「制作実績 → 新規追加」から登録してください。</p>
    <?php endif; ?>
  </div>

  <?php
  // ページネーション
  the_posts_pagination(array('mid_size'=>1,'prev_text'=>'← PREV','next_text'=>'NEXT →'));
  ?>
</section>

<!-- CTA -->
<section class="cta">
  <div class="cta-bg">LET'S CREATE</div>
  <p class="cta-lb rv">GET IN TOUCH</p>
  <h2 class="cta-ttl rv">LET'S CREATE<br><span class="out">TOGETHER</span></h2>
  <div class="rv"><a href="<?php echo esc_url($contact_url); ?>" class="btn"><span>CONTACT</span><span>→</span></a></div>
</section>

<?php get_footer(); ?>
