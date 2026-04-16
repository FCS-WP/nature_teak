<?php

defined('ABSPATH') || exit;

$section_id       = sanitize_title($attributes['sectionId'] ?? '');
$heading          = esc_html($attributes['heading'] ?? '');
$subtitle         = esc_html($attributes['subtitle'] ?? '');
$background_color = sanitize_hex_color($attributes['backgroundColor'] ?? '');
$use_current_category = !empty($attributes['useCurrentCategory']);
$category         = sanitize_text_field($attributes['category'] ?? '');
$include_categories = array_values(
    array_unique(
        array_filter(
            array_map(
                'sanitize_title',
                is_array($attributes['includeCategories'] ?? null) ? $attributes['includeCategories'] : []
            )
        )
    )
);
$exclude_categories = array_values(
    array_unique(
        array_filter(
            array_map(
                'sanitize_title',
                is_array($attributes['excludeCategories'] ?? null) ? $attributes['excludeCategories'] : []
            )
        )
    )
);
$exclude_categories = array_values(array_diff($exclude_categories, $include_categories));
$per_page         = max(1, min(12, (int) ($attributes['perPage'] ?? 4)));
$columns          = max(2, min(4, (int) ($attributes['columns'] ?? 4)));
$enquire_text     = esc_html($attributes['enquireText'] ?? 'Enquire');
$enquire_url      = esc_url($attributes['enquireUrl'] ?? '#');
$show_promo       = !empty($attributes['showPromoCard']);
$promo_icon       = esc_html($attributes['promoIcon'] ?? '');
$promo_title      = esc_html($attributes['promoTitle'] ?? '');
$promo_text       = esc_html($attributes['promoText'] ?? '');
$promo_button_txt = esc_html($attributes['promoButtonText'] ?? '');
$promo_button_url = esc_url($attributes['promoButtonUrl'] ?? '#');
$banner_image_url = esc_url($attributes['bannerImageUrl'] ?? '');
$banner_alt       = esc_attr($attributes['bannerAlt'] ?? '');

$args = [
    'status' => 'publish',
    'limit'  => $per_page,
    'order'  => 'ASC',
    'orderby'=> 'menu_order',
];

$queried_term = null;
if ($use_current_category && function_exists('get_queried_object')) {
    $queried_term = get_queried_object();

    if (
        $queried_term instanceof \WP_Term &&
        isset($queried_term->taxonomy) &&
        $queried_term->taxonomy === 'product_cat' &&
        !empty($queried_term->slug)
    ) {
        $include_categories = [$queried_term->slug];
    }
}

if (empty($include_categories) && $category !== '') {
    $include_categories = [$category];
}

if (!empty($include_categories)) {
    $args['category'] = $include_categories;
}

if (!empty($exclude_categories)) {
    $args['tax_query'] = [
        [
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => $exclude_categories,
            'operator' => 'NOT IN',
        ],
    ];
}

$products = function_exists('wc_get_products') ? wc_get_products($args) : [];

$wrapper_args = ['class' => 'scs'];
if ($section_id !== '') {
    $wrapper_args['id'] = $section_id;
}
if ($background_color) {
    $wrapper_args['style'] = 'background-color:' . $background_color . ';';
}

$wrapper = get_block_wrapper_attributes($wrapper_args);
?>

<div <?php echo $wrapper; ?>>
    <?php if ($heading) : ?><h2 class="scs__title"><?php echo $heading; ?></h2><?php endif; ?>
    <?php if ($subtitle) : ?><p class="scs__subtitle"><?php echo $subtitle; ?></p><?php endif; ?>

    <?php if (!empty($products) || $show_promo) : ?>
        <div class="scs__grid scs__grid--cols-<?php echo esc_attr((string) $columns); ?>" style="grid-template-columns: repeat(<?php echo esc_attr((string) $columns); ?>, 1fr);">
            <?php foreach ($products as $product) : ?>
                <?php
                $image_url         = wp_get_attachment_image_url($product->get_image_id(), 'large') ?: wc_placeholder_img_src();
                $category_terms    = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
                $category_name     = !empty($category_terms) ? $category_terms[0] : '';
                $short_description = wp_strip_all_tags($product->get_short_description());
                $spec_text         = $short_description !== '' ? $short_description : wp_strip_all_tags($product->get_price_html());
                ?>
                <div class="scs__card">
                    <div class="scs__image-wrap">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" class="scs__image" loading="lazy" />
                        <a class="scs__enquire" href="<?php echo $enquire_url; ?>"><?php echo $enquire_text; ?></a>
                    </div>
                    <div class="scs__info">
                        <?php if ($category_name) : ?><span class="scs__cat"><?php echo esc_html($category_name); ?></span><?php endif; ?>
                        <h3 class="scs__name"><?php echo esc_html($product->get_name()); ?></h3>
                        <?php if ($spec_text) : ?><p class="scs__spec"><?php echo esc_html($spec_text); ?></p><?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>

            <?php if ($show_promo) : ?>
                <div class="scs__promo">
                    <?php if ($promo_icon) : ?><p class="scs__promo-icon"><?php echo $promo_icon; ?></p><?php endif; ?>
                    <?php if ($promo_title) : ?><h3 class="scs__promo-title"><?php echo $promo_title; ?></h3><?php endif; ?>
                    <?php if ($promo_text) : ?><p class="scs__promo-text"><?php echo $promo_text; ?></p><?php endif; ?>
                    <?php if ($promo_button_txt) : ?><a class="scs__promo-button" href="<?php echo $promo_button_url; ?>"><?php echo $promo_button_txt; ?></a><?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <?php if ($banner_image_url) : ?>
        <div class="scs__banner-wrap">
            <img src="<?php echo $banner_image_url; ?>" alt="<?php echo $banner_alt; ?>" class="scs__banner" loading="lazy" />
        </div>
    <?php endif; ?>
</div>
