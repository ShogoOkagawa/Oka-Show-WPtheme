<?php if (!defined('ABSPATH')) exit; get_header(); ?>

<header class="page-hero">
  <div class="crumb"><a href="<?php echo esc_url(home_url('/')); ?>">HOME</a></div>
  <h1><?php echo esc_html(wp_get_document_title()); ?></h1>
</header>

<section>
  <?php if (have_posts()) : ?>
    <div class="work-grid">
      <?php while (have_posts()) : the_post(); ?>
        <a href="<?php the_permalink(); ?>" class="work-card rv">
          <?php if (has_post_thumbnail()) : ?>
            <img src="<?php echo esc_url(get_the_post_thumbnail_url(get_the_ID(),'large')); ?>" alt="<?php the_title_attribute(); ?>">
          <?php endif; ?>
          <div class="wc-meta"><div class="wc-ttl"><?php the_title(); ?></div></div>
        </a>
      <?php endwhile; ?>
    </div>
    <?php the_posts_pagination(array('prev_text'=>'← PREV','next_text'=>'NEXT →')); ?>
  <?php else : ?>
    <p style="color:var(--mid)">コンテンツが見つかりませんでした。</p>
  <?php endif; ?>
</section>

<?php get_footer(); ?>
