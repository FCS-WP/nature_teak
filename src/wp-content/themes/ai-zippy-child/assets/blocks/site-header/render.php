<?php

defined('ABSPATH') || exit;

$logo_url = esc_url($attributes['logoUrl'] ?? '');
$logo_alt = esc_attr($attributes['logoAlt'] ?? 'Nature Teak Wood');
$background_color = sanitize_hex_color($attributes['backgroundColor'] ?? '');
$menu_id = absint($attributes['menuId'] ?? 0);
$button_text = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');

$current_path = '';
global $wp;

if (isset($wp->request)) {
    $current_path = untrailingslashit((string) wp_parse_url(home_url($wp->request), PHP_URL_PATH));
}

$nav_items = [];

if ($menu_id > 0) {
    $menu_items = wp_get_nav_menu_items($menu_id);

    if (is_array($menu_items)) {
        foreach ($menu_items as $item) {
            if ((int) $item->menu_item_parent !== 0) {
                continue;
            }

            $item_url = (string) $item->url;
            $item_path = untrailingslashit((string) wp_parse_url($item_url, PHP_URL_PATH));

            $nav_items[] = [
                'label' => $item->title,
                'url' => esc_url($item_url),
                'is_active' => $item_path !== '' && $current_path !== '' && $item_path === $current_path,
            ];
        }
    }
}

if (empty($nav_items)) {
    foreach (['home', 'shop', 'contact'] as $key) {
        $label = trim(wp_strip_all_tags($attributes["{$key}Label"] ?? ''));
        $raw_url = (string) ($attributes["{$key}Url"] ?? '#');
        $item_path = untrailingslashit((string) wp_parse_url($raw_url, PHP_URL_PATH));

        if ($label === '') {
            continue;
        }

        $nav_items[] = [
            'label' => $label,
            'url' => esc_url($raw_url),
            'is_active' => $item_path !== '' && $current_path !== '' && $item_path === $current_path,
        ];
    }
}

$wrapper_args = ['class' => 'nth'];

if ($background_color) {
    $wrapper_args['style'] = 'background-color:' . $background_color . ';';
}

$wrapper = get_block_wrapper_attributes($wrapper_args);
?>

<header <?php echo $wrapper; ?>>
    <div class="nth__inner">
        <a class="nth__brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if ($logo_url) : ?>
                <img src="<?php echo $logo_url; ?>" alt="<?php echo $logo_alt; ?>" class="nth__logo" />
            <?php else : ?>
                <span class="nth__brand-text"><?php bloginfo('name'); ?></span>
            <?php endif; ?>
        </a>

        <div class="nth__desktop">
            <?php if (!empty($nav_items)) : ?>
                <nav class="nth__nav" aria-label="<?php esc_attr_e('Primary navigation', 'ai-zippy-child'); ?>">
                    <?php foreach ($nav_items as $item) : ?>
                        <a class="nth__nav-link<?php echo !empty($item['is_active']) ? ' is-active' : ''; ?>" href="<?php echo esc_url($item['url']); ?>">
                            <?php echo esc_html($item['label']); ?>
                        </a>
                    <?php endforeach; ?>
                </nav>
            <?php endif; ?>

            <?php if ($button_text) : ?>
                <a class="nth__cta" href="<?php echo $button_url; ?>"><?php echo $button_text; ?></a>
            <?php endif; ?>
        </div>

        <button type="button" class="nth__toggle" aria-expanded="false" aria-controls="nth-offcanvas" aria-label="<?php esc_attr_e('Open menu', 'ai-zippy-child'); ?>">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>

    <div class="nth__overlay" hidden></div>

    <aside class="nth__offcanvas" id="nth-offcanvas" aria-hidden="true">
        <div class="nth__offcanvas-top">
            <a class="nth__brand" href="<?php echo esc_url(home_url('/')); ?>">
                <?php if ($logo_url) : ?>
                    <img src="<?php echo $logo_url; ?>" alt="<?php echo $logo_alt; ?>" class="nth__logo nth__logo--drawer" />
                <?php else : ?>
                    <span class="nth__brand-text"><?php bloginfo('name'); ?></span>
                <?php endif; ?>
            </a>
            <button type="button" class="nth__close" aria-label="<?php esc_attr_e('Close menu', 'ai-zippy-child'); ?>">&times;</button>
        </div>

        <?php if (!empty($nav_items)) : ?>
            <nav class="nth__offcanvas-nav" aria-label="<?php esc_attr_e('Mobile navigation', 'ai-zippy-child'); ?>">
                <?php foreach ($nav_items as $item) : ?>
                    <a class="nth__offcanvas-link<?php echo !empty($item['is_active']) ? ' is-active' : ''; ?>" href="<?php echo esc_url($item['url']); ?>">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>

        <?php if ($button_text) : ?>
            <a class="nth__offcanvas-cta" href="<?php echo $button_url; ?>"><?php echo $button_text; ?></a>
        <?php endif; ?>
    </aside>
</header>
