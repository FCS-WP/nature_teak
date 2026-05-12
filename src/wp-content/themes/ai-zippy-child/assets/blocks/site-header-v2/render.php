<?php

defined('ABSPATH') || exit;

$logo_url = esc_url($attributes['logoUrl'] ?? '');
$logo_alt = esc_attr($attributes['logoAlt'] ?? 'Tom & Stefanie');
$brand_text = html_entity_decode(
    trim(wp_strip_all_tags($attributes['brandText'] ?? 'Tom & Stefanie')),
    ENT_QUOTES,
    get_bloginfo('charset') ?: 'UTF-8'
);
$background_color = sanitize_hex_color($attributes['backgroundColor'] ?? '#fbf7ef');
$button_color = sanitize_hex_color($attributes['buttonColor'] ?? '#ff6c73');
$button_hover_color = sanitize_hex_color($attributes['buttonHoverColor'] ?? '#ee5961');
$badge_color = sanitize_hex_color($attributes['badgeColor'] ?? '#ff6c73');
$action_icon_color = sanitize_hex_color($attributes['actionIconColor'] ?? '#070707');
$action_icon_hover_color = sanitize_hex_color($attributes['actionIconHoverColor'] ?? '#ff6c73');
$menu_id = absint($attributes['menuId'] ?? 0);
$button_text = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$show_search = !empty($attributes['showSearch']);
$search_url = esc_url($attributes['searchUrl'] ?? '/?s=');
$search_icon_url = esc_url($attributes['searchIconUrl'] ?? '');
$search_icon_alt = esc_attr($attributes['searchIconAlt'] ?? 'Search');
$show_wishlist = !empty($attributes['showWishlist']);
$wishlist_url = esc_url($attributes['wishlistUrl'] ?? '/wishlist');
$wishlist_icon_url = esc_url($attributes['wishlistIconUrl'] ?? '');
$wishlist_icon_alt = esc_attr($attributes['wishlistIconAlt'] ?? 'Wishlist');
$show_cart = !empty($attributes['showMiniCart']);
$has_wc_cart = $show_cart && function_exists('WC') && function_exists('wc_get_cart_url');
$cart_count = 0;
$cart_url = $has_wc_cart ? esc_url(wc_get_cart_url()) : esc_url($attributes['cartUrl'] ?? '/cart');
$cart_icon_url = esc_url($attributes['cartIconUrl'] ?? '');
$cart_icon_alt = esc_attr($attributes['cartIconAlt'] ?? 'Cart');
$checkout_url = $has_wc_cart && function_exists('wc_get_checkout_url') ? esc_url(wc_get_checkout_url()) : '';
$header_id = wp_unique_id('nthv2-header-');
$menu_id_attr = $header_id . '-menu';
$cart_drawer_id = $header_id . '-cart';

if ($has_wc_cart && WC()->cart) {
    $cart_count = WC()->cart->get_cart_contents_count();
}

$current_path = '';
global $wp;

if (isset($wp->request)) {
    $current_path = untrailingslashit((string) wp_parse_url(home_url($wp->request), PHP_URL_PATH));
}

$fallback_items = [
    'shop' => ['label' => 'Shop', 'url' => '/shop'],
    'gift' => ['label' => 'Gift', 'url' => '/gift'],
    'bestsellers' => ['label' => 'Bestsellers', 'url' => '/bestsellers'],
    'sale' => ['label' => 'Sale', 'url' => '/sale'],
    'corporate' => ['label' => 'Corporate/Wholesale', 'url' => '/corporate-wholesale'],
    'story' => ['label' => 'Our Story', 'url' => '/our-story'],
];

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
    foreach ($fallback_items as $key => $defaults) {
        $label = trim(wp_strip_all_tags($attributes["{$key}Label"] ?? $defaults['label']));
        $raw_url = (string) ($attributes["{$key}Url"] ?? $defaults['url']);
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

$inline_styles = [];

if ($background_color) {
    $inline_styles[] = 'background-color:' . $background_color;
}

if ($button_color) {
    $inline_styles[] = '--nthv2-button-color:' . $button_color;
}

if ($button_hover_color) {
    $inline_styles[] = '--nthv2-button-hover-color:' . $button_hover_color;
}

if ($badge_color) {
    $inline_styles[] = '--nthv2-badge-color:' . $badge_color;
}

if ($action_icon_color) {
    $inline_styles[] = '--nthv2-action-icon-color:' . $action_icon_color;
}

if ($action_icon_hover_color) {
    $inline_styles[] = '--nthv2-action-icon-hover-color:' . $action_icon_hover_color;
}

$wrapper_args = ['class' => 'nthv2'];

if (!empty($inline_styles)) {
    $wrapper_args['style'] = implode(';', $inline_styles) . ';';
}

$wrapper = get_block_wrapper_attributes($wrapper_args);

$render_wordmark = static function () use ($brand_text): void {
    $text = $brand_text !== '' ? $brand_text : get_bloginfo('name');
    $amp_position = strpos($text, '&');

    if ($amp_position === false) {
        echo esc_html($text);
        return;
    }

    $before = substr($text, 0, $amp_position);
    $after = substr($text, $amp_position + 1);
    echo esc_html($before);
    echo '<span class="nthv2__brand-accent">&amp;</span>';
    echo esc_html($after);
};

$render_search_icon = static function () use ($search_icon_url, $search_icon_alt): void {
    if ($search_icon_url) {
        ?>
        <img class="nthv2__icon-img" src="<?php echo $search_icon_url; ?>" alt="<?php echo $search_icon_alt; ?>" />
        <?php
        return;
    }

    ?>
    <svg class="nthv2__icon-svg" width="26" height="26" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="m20 20-4.35-4.35" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
        <circle cx="10.8" cy="10.8" r="6.4" fill="none" stroke="currentColor" stroke-width="2.2" />
    </svg>
    <?php
};

$render_heart_icon = static function () use ($wishlist_icon_url, $wishlist_icon_alt): void {
    if ($wishlist_icon_url) {
        ?>
        <img class="nthv2__icon-img" src="<?php echo $wishlist_icon_url; ?>" alt="<?php echo $wishlist_icon_alt; ?>" />
        <?php
        return;
    }

    ?>
    <svg class="nthv2__icon-svg" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 20.3s-7.2-4.35-8.85-9.05C1.92 7.78 4.1 4.8 7.45 4.8c1.85 0 3.25 1.02 4.05 2.2.8-1.18 2.2-2.2 4.05-2.2 3.35 0 5.53 2.98 4.3 6.45C18.2 15.95 12 20.3 12 20.3Z" fill="none" stroke="currentColor" stroke-width="2.05" stroke-linejoin="round" />
    </svg>
    <?php
};

$render_cart_icon = static function () use ($cart_count, $cart_icon_url, $cart_icon_alt): void {
    if ($cart_icon_url) {
        ?>
        <img class="nthv2__icon-img" src="<?php echo $cart_icon_url; ?>" alt="<?php echo $cart_icon_alt; ?>" />
        <span class="nthv2__cart-count" data-nth-cart-count><?php echo esc_html((string) $cart_count); ?></span>
        <?php
        return;
    }

    ?>
    <svg class="nthv2__icon-svg nthv2__cart-svg" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 6h2.1l1.3 8.2h7.2l1.55-5.55H9.05" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="10.35" cy="19" r="1.35" fill="currentColor" />
        <circle cx="17" cy="19" r="1.35" fill="currentColor" />
    </svg>
    <span class="nthv2__cart-count" data-nth-cart-count><?php echo esc_html((string) $cart_count); ?></span>
    <?php
};
?>

<header <?php echo $wrapper; ?>>
    <div class="nthv2__inner">
        <a class="nthv2__brand" href="<?php echo esc_url(home_url('/')); ?>">
            <?php if ($logo_url) : ?>
                <img src="<?php echo $logo_url; ?>" alt="<?php echo $logo_alt; ?>" class="nthv2__logo" />
            <?php else : ?>
                <span class="nthv2__brand-text"><?php $render_wordmark(); ?></span>
            <?php endif; ?>
        </a>

        <div class="nthv2__desktop">
            <?php if (!empty($nav_items)) : ?>
                <nav class="nthv2__nav" aria-label="<?php esc_attr_e('Primary navigation', 'ai-zippy-child'); ?>">
                    <?php foreach ($nav_items as $item) : ?>
                        <a class="nthv2__nav-link<?php echo !empty($item['is_active']) ? ' is-active' : ''; ?>" href="<?php echo esc_url($item['url']); ?>">
                            <?php echo esc_html($item['label']); ?>
                        </a>
                    <?php endforeach; ?>
                </nav>
            <?php endif; ?>

            <div class="nthv2__actions">
                <?php if ($show_search) : ?>
                    <a class="nthv2__icon-link" href="<?php echo $search_url; ?>" aria-label="<?php esc_attr_e('Search', 'ai-zippy-child'); ?>">
                        <?php $render_search_icon(); ?>
                    </a>
                <?php endif; ?>

                <?php if ($show_wishlist) : ?>
                    <a class="nthv2__icon-link" href="<?php echo $wishlist_url; ?>" aria-label="<?php esc_attr_e('Wishlist', 'ai-zippy-child'); ?>">
                        <?php $render_heart_icon(); ?>
                    </a>
                <?php endif; ?>

                <?php if ($show_cart) : ?>
                    <?php if ($has_wc_cart) : ?>
                        <div class="nthv2__cart-wrap">
                            <button type="button" class="nthv2__icon-link nthv2__cart-button" aria-expanded="false" aria-controls="<?php echo esc_attr($cart_drawer_id); ?>" aria-label="<?php esc_attr_e('Open cart', 'ai-zippy-child'); ?>" data-nth-cart-toggle>
                                <?php $render_cart_icon(); ?>
                            </button>
                            <div class="nthv2__cart-popover" hidden style="display:none;" data-nth-cart-popover data-nth-cart-panel="desktop" data-cart-url="<?php echo esc_attr($cart_url); ?>" data-checkout-url="<?php echo esc_attr($checkout_url); ?>" data-title="<?php esc_attr_e('Cart', 'ai-zippy-child'); ?>">
                                <div class="nthv2__cart-panel-body" data-nth-cart-content></div>
                            </div>
                        </div>
                    <?php else : ?>
                        <a class="nthv2__icon-link nthv2__cart-button" href="<?php echo $cart_url; ?>" aria-label="<?php esc_attr_e('Cart', 'ai-zippy-child'); ?>">
                            <?php $render_cart_icon(); ?>
                        </a>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if ($button_text) : ?>
                    <a class="nthv2__cta" href="<?php echo $button_url; ?>"><?php echo $button_text; ?></a>
                <?php endif; ?>
            </div>
        </div>

        <div class="nthv2__mobile-actions" hidden style="display:none;" data-nth-mobile-actions>
            <?php if ($show_search) : ?>
                <a class="nthv2__icon-link" href="<?php echo $search_url; ?>" aria-label="<?php esc_attr_e('Search', 'ai-zippy-child'); ?>">
                    <?php $render_search_icon(); ?>
                </a>
            <?php endif; ?>

            <?php if ($show_cart) : ?>
                <?php if ($has_wc_cart) : ?>
                    <button type="button" class="nthv2__icon-link nthv2__cart-button nthv2__cart-button--mobile" aria-expanded="false" aria-controls="<?php echo esc_attr($cart_drawer_id); ?>" aria-label="<?php esc_attr_e('Open cart', 'ai-zippy-child'); ?>" data-nth-cart-toggle>
                        <?php $render_cart_icon(); ?>
                    </button>
                <?php else : ?>
                    <a class="nthv2__icon-link nthv2__cart-button nthv2__cart-button--mobile" href="<?php echo $cart_url; ?>" aria-label="<?php esc_attr_e('Cart', 'ai-zippy-child'); ?>">
                        <?php $render_cart_icon(); ?>
                    </a>
                <?php endif; ?>
            <?php endif; ?>

            <button type="button" class="nthv2__toggle" aria-expanded="false" aria-controls="<?php echo esc_attr($menu_id_attr); ?>" aria-label="<?php esc_attr_e('Open menu', 'ai-zippy-child'); ?>">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>

    <div class="nthv2__overlay" hidden></div>

    <aside class="nthv2__offcanvas" id="<?php echo esc_attr($menu_id_attr); ?>" aria-hidden="true">
        <div class="nthv2__offcanvas-top">
            <a class="nthv2__brand" href="<?php echo esc_url(home_url('/')); ?>">
                <?php if ($logo_url) : ?>
                    <img src="<?php echo $logo_url; ?>" alt="<?php echo $logo_alt; ?>" class="nthv2__logo nthv2__logo--drawer" />
                <?php else : ?>
                    <span class="nthv2__brand-text"><?php $render_wordmark(); ?></span>
                <?php endif; ?>
            </a>
            <button type="button" class="nthv2__close" aria-label="<?php esc_attr_e('Close menu', 'ai-zippy-child'); ?>">&times;</button>
        </div>

        <?php if (!empty($nav_items)) : ?>
            <nav class="nthv2__offcanvas-nav" aria-label="<?php esc_attr_e('Mobile navigation', 'ai-zippy-child'); ?>">
                <?php foreach ($nav_items as $item) : ?>
                    <a class="nthv2__offcanvas-link<?php echo !empty($item['is_active']) ? ' is-active' : ''; ?>" href="<?php echo esc_url($item['url']); ?>">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        <?php endif; ?>

        <div class="nthv2__offcanvas-actions">
            <?php if ($show_wishlist) : ?>
                <a class="nthv2__offcanvas-link" href="<?php echo $wishlist_url; ?>"><?php esc_html_e('Wishlist', 'ai-zippy-child'); ?></a>
            <?php endif; ?>

            <?php if ($button_text) : ?>
                <a class="nthv2__offcanvas-cta" href="<?php echo $button_url; ?>"><?php echo $button_text; ?></a>
            <?php endif; ?>
        </div>
    </aside>

    <?php if ($has_wc_cart) : ?>
        <div class="nthv2__cart-overlay" hidden data-nth-cart-overlay></div>
        <aside class="nthv2__cart-drawer" id="<?php echo esc_attr($cart_drawer_id); ?>" hidden style="display:none;" aria-hidden="true" data-nth-cart-panel="drawer" data-cart-url="<?php echo esc_attr($cart_url); ?>" data-checkout-url="<?php echo esc_attr($checkout_url); ?>" data-title="<?php esc_attr_e('Your Cart', 'ai-zippy-child'); ?>">
            <div class="nthv2__cart-drawer-top">
                <span><?php esc_html_e('Cart', 'ai-zippy-child'); ?></span>
                <button type="button" class="nthv2__cart-close" aria-label="<?php esc_attr_e('Close cart', 'ai-zippy-child'); ?>" data-nth-cart-close>&times;</button>
            </div>
            <div class="nthv2__cart-panel-body" data-nth-cart-content></div>
        </aside>
    <?php endif; ?>
</header>
