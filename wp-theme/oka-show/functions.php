<?php
/**
 * OKA-SHOW theme functions
 * - アセット読み込み
 * - カスタム投稿「work（制作実績）」+ タクソノミー「work_cat」
 * - 自前メタボックス（ACF不使用）: CLIENT / YEAR / ROLE / 機材 / 動画URL / ギャラリー
 */
if (!defined('ABSPATH')) exit;

define('OKA_VER', '1.1.1');

/* Contact Form 7 の自動 <p>/<br> 挿入を無効化（フォームのグリッド崩れ防止） */
add_filter('wpcf7_autop_or_not', '__return_false');

/* ───────── テーマ基本設定 ───────── */
function oka_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form','gallery','caption','style','script'));
    add_theme_support('automatic-feed-links');
    register_nav_menus(array(
        'primary' => 'メインメニュー',
        'social'  => 'SNSリンク',
    ));
}
add_action('after_setup_theme', 'oka_setup');

/* ───────── アセット読み込み ───────── */
function oka_assets() {
    // 本体CSS（style.css = テーマヘッダー + 全スタイル）
    wp_enqueue_style('oka-style', get_stylesheet_uri(), array(), OKA_VER);

    // GSAP / ScrollTrigger（CDN）
    wp_enqueue_script('gsap', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', array(), '3.12.5', true);
    wp_enqueue_script('scrolltrigger', 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', array('gsap'), '3.12.5', true);

    // 共通JS
    wp_enqueue_script('oka-main', get_template_directory_uri() . '/assets/js/main.js', array('gsap','scrolltrigger'), OKA_VER, true);
}
add_action('wp_enqueue_scripts', 'oka_assets');

/* ───────── カスタム投稿「work」 ───────── */
function oka_register_work() {
    register_post_type('work', array(
        'labels' => array(
            'name'          => '制作実績',
            'singular_name' => '制作実績',
            'add_new'       => '新規追加',
            'add_new_item'  => '制作実績を追加',
            'edit_item'     => '制作実績を編集',
            'all_items'     => '制作実績一覧',
            'menu_name'     => '制作実績',
        ),
        'public'       => true,
        'has_archive'  => true,
        'menu_icon'    => 'dashicons-format-gallery',
        'menu_position'=> 5,
        'rewrite'      => array('slug' => 'works'),
        'supports'     => array('title','editor','thumbnail','excerpt','page-attributes'),
        'show_in_rest' => true,
    ));

    register_taxonomy('work_cat', 'work', array(
        'labels' => array(
            'name'          => 'カテゴリ',
            'singular_name' => 'カテゴリ',
            'menu_name'     => 'カテゴリ',
        ),
        'public'       => true,
        'hierarchical' => true,
        'rewrite'      => array('slug' => 'work-cat'),
        'show_admin_column' => true,
        'show_in_rest' => true,
    ));
}
add_action('init', 'oka_register_work');

/* 既定カテゴリ（WEB / SYSTEM / DRONE / VIDEO）を自動作成 */
function oka_default_terms() {
    $terms = array('web'=>'WEB','system'=>'SYSTEM','drone'=>'DRONE','video'=>'VIDEO');
    foreach ($terms as $slug => $name) {
        if (!term_exists($slug, 'work_cat')) {
            wp_insert_term($name, 'work_cat', array('slug' => $slug));
        }
    }
}
add_action('init', 'oka_default_terms', 11);

/* テーマ有効化時にパーマリンクを再構築 */
function oka_rewrite_flush() { oka_register_work(); flush_rewrite_rules(); }
add_action('after_switch_theme', 'oka_rewrite_flush');

/* ───────── メタボックス（ACF不使用・自前実装） ───────── */
function oka_meta_fields() {
    return array(
        '_oka_client' => 'CLIENT（クライアント名）',
        '_oka_year'   => 'YEAR（制作年）',
        '_oka_role'   => 'ROLE（担当領域）',
        '_oka_equip'  => 'EQUIPMENT（使用機材/技術）',
        '_oka_url'    => 'サイトURL（Web/システムの場合・https://〜）',
        '_oka_video'  => '動画URL（YouTube / Vimeo）',
    );
}

function oka_add_meta_box() {
    add_meta_box('oka_work_details', '制作実績の詳細情報', 'oka_render_meta_box', 'work', 'normal', 'high');
}
add_action('add_meta_boxes', 'oka_add_meta_box');

function oka_render_meta_box($post) {
    wp_nonce_field('oka_save_meta', 'oka_meta_nonce');
    echo '<style>.oka-f{margin:14px 0}.oka-f label{display:block;font-weight:600;margin-bottom:4px}.oka-f input{width:100%;max-width:560px}
    #oka-gallery-prev{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}#oka-gallery-prev img{width:90px;height:60px;object-fit:cover;border:1px solid #ccc;border-radius:4px}</style>';

    foreach (oka_meta_fields() as $key => $label) {
        $val = esc_attr(get_post_meta($post->ID, $key, true));
        echo '<div class="oka-f"><label for="'.$key.'">'.esc_html($label).'</label>';
        echo '<input type="text" id="'.$key.'" name="'.$key.'" value="'.$val.'"></div>';
    }

    // ギャラリー（wp.media で複数画像 → 添付ID をカンマ区切りで保存）
    $gallery = get_post_meta($post->ID, '_oka_gallery', true);
    echo '<div class="oka-f"><label>ギャラリー画像（詳細ページ下部）</label>';
    echo '<input type="hidden" id="oka_gallery" name="_oka_gallery" value="'.esc_attr($gallery).'">';
    echo '<div id="oka-gallery-prev"></div>';
    echo '<button type="button" class="button" id="oka-gallery-add">画像を選択/追加</button> ';
    echo '<button type="button" class="button" id="oka-gallery-clear">クリア</button>';
    echo '<p class="description">※ 詳細ページ上部の大きな画像は「アイキャッチ画像」を使用します。</p></div>';
}

/* メタ保存 */
function oka_save_meta($post_id) {
    if (!isset($_POST['oka_meta_nonce']) || !wp_verify_nonce($_POST['oka_meta_nonce'], 'oka_save_meta')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    foreach (array_keys(oka_meta_fields()) as $key) {
        if (isset($_POST[$key])) {
            update_post_meta($post_id, $key, sanitize_text_field(wp_unslash($_POST[$key])));
        }
    }
    if (isset($_POST['_oka_gallery'])) {
        // 数字とカンマのみ許可
        $clean = preg_replace('/[^0-9,]/', '', wp_unslash($_POST['_oka_gallery']));
        update_post_meta($post_id, '_oka_gallery', $clean);
    }
}
add_action('save_post_work', 'oka_save_meta');

/* 管理画面：ギャラリー用に wp.media + インラインJS */
function oka_admin_assets($hook) {
    global $post_type;
    if ($post_type === 'work' && ($hook === 'post.php' || $hook === 'post-new.php')) {
        wp_enqueue_media();
        $js = <<<JS
jQuery(function($){
  function render(){
    var ids = ($('#oka_gallery').val()||'').split(',').filter(Boolean);
    var box = $('#oka-gallery-prev').empty();
    ids.forEach(function(id){
      wp.media.attachment(id).fetch().then(function(){
        var a = wp.media.attachment(id);
        var url = a.get('sizes') && a.get('sizes').thumbnail ? a.get('sizes').thumbnail.url : a.get('url');
        box.append('<img src="'+url+'">');
      });
    });
  }
  var frame;
  $('#oka-gallery-add').on('click', function(e){
    e.preventDefault();
    if(frame){ frame.open(); return; }
    frame = wp.media({ title:'ギャラリー画像を選択', multiple:'add', library:{type:'image'},
      button:{ text:'追加' } });
    frame.on('select', function(){
      var ids = ($('#oka_gallery').val()||'').split(',').filter(Boolean);
      frame.state().get('selection').each(function(att){ ids.push(String(att.id)); });
      $('#oka_gallery').val(ids.join(','));
      render();
    });
    frame.open();
  });
  $('#oka-gallery-clear').on('click', function(e){ e.preventDefault(); $('#oka_gallery').val(''); render(); });
  render();
});
JS;
        wp_add_inline_script('jquery-core', $js);
    }
}
add_action('admin_enqueue_scripts', 'oka_admin_assets');

/* ───────── ヘルパー ───────── */

/* 投稿のカテゴリ slug を取得（フィルタ用 data-cat） */
function oka_work_cat_slug($post_id) {
    $terms = get_the_terms($post_id, 'work_cat');
    if ($terms && !is_wp_error($terms)) {
        return esc_attr($terms[0]->slug);
    }
    return 'work';
}
function oka_work_cat_name($post_id) {
    $terms = get_the_terms($post_id, 'work_cat');
    if ($terms && !is_wp_error($terms)) {
        return esc_html($terms[0]->name);
    }
    return '';
}

/* 動画URL → レスポンシブ埋め込み */
function oka_video_embed($url) {
    if (!$url) return '';
    $embed = wp_oembed_get($url);
    if (!$embed) return '';
    return '<div class="embed-frame">'.$embed.'</div>';
}
