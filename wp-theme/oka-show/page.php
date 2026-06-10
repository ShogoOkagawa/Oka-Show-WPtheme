<?php if (!defined('ABSPATH')) exit; get_header(); ?>

<?php while (have_posts()) : the_post(); ?>
<header class="page-hero">
  <div class="crumb"><a href="<?php echo esc_url(home_url('/')); ?>">HOME</a> / <?php the_title(); ?></div>
  <h1><?php the_title(); ?></h1>
</header>

<div class="legal">
  <div class="legal-body rv">
    <?php the_content(); ?>
  </div>
</div>
<?php endwhile; ?>

<?php get_footer(); ?>
