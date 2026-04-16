<?php

defined('ABSPATH') || exit;

$title      = esc_html($attributes['title'] ?? '');
$subtitle   = esc_html($attributes['subtitle'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$use_auto_categories = !empty($attributes['useAutoCategories']);
$show_all_products_filter = !empty($attributes['showAllProductsFilter']);
$all_products_label = esc_html($attributes['allProductsLabel'] ?? 'All Products');
$all_products_url = esc_url($attributes['allProductsUrl'] ?? '/shop');
$filters    = [];
$current_path = '';

global $wp;

if (isset($wp->request)) {
    $current_path = untrailingslashit((string) wp_parse_url(home_url($wp->request), PHP_URL_PATH));
}

if ($use_auto_categories) {
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

    if ($show_all_products_filter && $all_products_label !== '') {
        $filters[] = [
            'label' => $all_products_label,
            'url'   => $all_products_url,
            'is_active' => untrailingslashit((string) wp_parse_url($all_products_url, PHP_URL_PATH)) === $current_path,
        ];
    }

    $terms = get_terms([
        'taxonomy' => 'product_cat',
        'hide_empty' => true,
        'orderby' => 'menu_order name',
        'order' => 'ASC',
    ]);

    if (!is_wp_error($terms)) {
        foreach ($terms as $term) {
            if (
                (!empty($include_categories) && !in_array($term->slug, $include_categories, true)) ||
                in_array($term->slug, $exclude_categories, true)
            ) {
                continue;
            }

            $term_url = get_term_link($term);
            if (is_wp_error($term_url)) {
                continue;
            }

            $filter_path = untrailingslashit((string) wp_parse_url($term_url, PHP_URL_PATH));
            $filters[] = [
                'label' => $term->name,
                'url' => esc_url($term_url),
                'is_active' => $filter_path !== '' && $current_path !== '' && $filter_path === $current_path,
            ];
        }
    }
} else {
    foreach (['One', 'Two', 'Three', 'Four', 'Five'] as $key) {
        $label = trim(wp_strip_all_tags($attributes["filter{$key}Label"] ?? ''));
        $raw_url = (string) ($attributes["filter{$key}Url"] ?? '#');
        $url   = esc_url($raw_url);
        $filter_path = untrailingslashit((string) wp_parse_url($raw_url, PHP_URL_PATH));

        if ($label !== '') {
            $filters[] = [
                'label' => $label,
                'url'   => $url,
                'is_active' => $filter_path !== '' && $current_path !== '' && $filter_path === $current_path,
            ];
        }
    }
}

$has_active_filter = !empty(array_filter($filters, static fn($filter) => !empty($filter['is_active'])));

$wrapper = get_block_wrapper_attributes(['class' => 'sph']);
?>

<div <?php echo $wrapper; ?>>
    <div class="sph__header">
        <div>
            <?php if ($title) : ?><h1 class="sph__title"><?php echo $title; ?></h1><?php endif; ?>
            <?php if ($subtitle) : ?><p class="sph__subtitle"><?php echo $subtitle; ?></p><?php endif; ?>
        </div>

        <?php if ($button_txt) : ?>
            <a class="sph__button" href="<?php echo $button_url; ?>"><?php echo $button_txt; ?></a>
        <?php endif; ?>
    </div>

    <?php if (!empty($filters)) : ?>
        <div class="sph__filters">
            <?php foreach ($filters as $index => $filter) : ?>
                <a class="sph__filter<?php echo (!empty($filter['is_active']) || (!$has_active_filter && $index === 0)) ? ' is-active' : ''; ?>" href="<?php echo $filter['url']; ?>">
                    <?php echo esc_html($filter['label']); ?>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
