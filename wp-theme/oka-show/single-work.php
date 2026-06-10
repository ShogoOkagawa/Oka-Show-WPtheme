<?php if (!defined('ABSPATH')) exit; get_header(); $works_url = get_post_type_archive_link('work'); ?>

<?php while (have_posts()) : the_post();
  $pid    = get_the_ID();
  $hero   = get_the_post_thumbnail_url($pid, 'full');
  $client = get_post_meta($pid, '_oka_client', true);
  $year   = get_post_meta($pid, '_oka_year', true);
  $role   = get_post_meta($pid, '_oka_role', true);
  $equip  = get_post_meta($pid, '_oka_equip', true);
  $url    = get_post_meta($pid, '_oka_url', true);
  $video  = get_post_meta($pid, '_oka_video', true);
  $gallery= get_post_meta($pid, '_oka_gallery', true);
?>

<!-- 詳細ヒーロー -->
<div class="detail-hero">
  <?php if ($hero) : ?><img src="<?php echo esc_url($hero); ?>" alt="<?php the_title_attribute(); ?>"><?php endif; ?>
  <div class="dh-ov"></div>
  <div class="dh-cap">
    <div class="dh-cat"><?php echo oka_work_cat_name($pid); ?></div>
    <h1><?php the_title(); ?></h1>
  </div>
</div>

<!-- 本文 + メタ -->
<div class="detail-body">
  <div class="rv">
    <?php the_content(); ?>
  </div>
  <aside class="detail-meta rv">
    <dl>
      <?php if ($client) : ?><dt>CLIENT</dt><dd><?php echo esc_html($client); ?></dd><?php endif; ?>
      <dt>CATEGORY</dt><dd><?php echo oka_work_cat_name($pid); ?></dd>
      <?php if ($year)  : ?><dt>YEAR</dt><dd><?php echo esc_html($year); ?></dd><?php endif; ?>
      <?php if ($role)  : ?><dt>ROLE</dt><dd><?php echo esc_html($role); ?></dd><?php endif; ?>
      <?php if ($equip) : ?><dt>EQUIPMENT</dt><dd><?php echo esc_html($equip); ?></dd><?php endif; ?>
    </dl>
    <?php if ($url) : ?>
      <a class="visit-btn" href="<?php echo esc_url($url); ?>" target="_blank" rel="noopener">VISIT SITE →</a>
    <?php endif; ?>
    <?php
    if ($video) {
        echo oka_video_embed($video);
    }
    ?>
  </aside>
</div>

<!-- ギャラリー -->
<?php
$ids = array_filter(explode(',', (string)$gallery));
if ($ids) : ?>
<div class="detail-gallery">
  <?php foreach ($ids as $idx => $id) {
      $url = wp_get_attachment_image_url((int)$id, 'large');
      if (!$url) continue;
      // 3枚ごとに1枚を全幅にしてリズムを出す
      $cls = ($idx % 3 === 0) ? ' class="full rv"' : ' class="rv"';
      echo '<img'.$cls.' src="'.esc_url($url).'" alt="">';
  } ?>
</div>
<?php endif; ?>

<!-- 前後ナビ -->
<?php
$prev = get_previous_post(false);
$next = get_next_post(false);
?>
<nav class="detail-nav">
  <?php if ($prev) : ?>
    <a href="<?php echo esc_url(get_permalink($prev)); ?>" class="prev"><span class="lab">← PREV</span><span class="ttl"><?php echo esc_html(get_the_title($prev)); ?></span></a>
  <?php else : ?><span></span><?php endif; ?>
  <a href="<?php echo esc_url($works_url); ?>" class="all">ALL WORKS</a>
  <?php if ($next) : ?>
    <a href="<?php echo esc_url(get_permalink($next)); ?>" class="next"><span class="lab">NEXT →</span><span class="ttl"><?php echo esc_html(get_the_title($next)); ?></span></a>
  <?php else : ?><span></span><?php endif; ?>
</nav>

<!-- CTA -->
<section class="cta">
  <div class="cta-bg">LET'S CREATE</div>
  <p class="cta-lb rv">GET IN TOUCH</p>
  <h2 class="cta-ttl rv">LET'S CREATE<br><span class="out">TOGETHER</span></h2>
  <div class="rv"><a href="<?php echo esc_url(home_url('/contact/')); ?>" class="btn"><span>CONTACT</span><span>→</span></a></div>
</section>

<?php endwhile; ?>
<?php get_footer(); ?>
