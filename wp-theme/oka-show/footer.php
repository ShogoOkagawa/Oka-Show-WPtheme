<?php if (!defined('ABSPATH')) exit; $logo = get_template_directory_uri() . '/assets/img/logo.svg'; ?>

<footer>
  <a href="<?php echo esc_url(home_url('/')); ?>" class="f-logo"><img src="<?php echo esc_url($logo); ?>" alt="OKA-SHOW"></a>
  <div class="f-copy">© <?php echo date('Y'); ?> OKA-SHOW. ALL RIGHTS RESERVED.&nbsp;·&nbsp;<a href="<?php echo esc_url(home_url('/privacy/')); ?>">プライバシーポリシー</a></div>
  <div class="f-sns">
    <a href="https://www.youtube.com/@shogookagawa5084" target="_blank" rel="noopener">YouTube</a>
    <a href="https://www.instagram.com/show_goon/" target="_blank" rel="noopener">Instagram</a>
    <a href="https://vimeo.com/user149609341" target="_blank" rel="noopener">Vimeo</a>
  </div>
</footer>

<?php if (!is_front_page()) : ?>
<a class="to-home" href="<?php echo esc_url(home_url('/')); ?>">← HOME</a>
<?php endif; ?>
<button class="to-top" aria-label="上部へ戻る">↑</button>

<?php wp_footer(); ?>
</body>
</html>
