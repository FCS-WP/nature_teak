<?php
/**
 * Server-side render for Shop Products block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

$heading      = $attributes['heading'] ?? 'Our Products';
$subheading   = $attributes['subheading'] ?? '';
$columns      = (int) ($attributes['columns'] ?? 4);
$per_page     = (int) ($attributes['perPage'] ?? 8);
$orderby      = $attributes['orderby'] ?? 'date';
$tab_slugs    = $attributes['categories'] ?? [];
$show_tabs    = (bool) ($attributes['showTabs'] ?? true);
$show_sale    = (bool) ($attributes['showSaleBadge'] ?? true);
$show_rating  = (bool) ($attributes['showRating'] ?? true);
$show_cart    = (bool) ($attributes['showAddToCart'] ?? true);
$view_all_txt = $attributes['viewAllText'] ?? 'View All Products';
$view_all_url = $attributes['viewAllUrl'] ?? '/shop';
$show_all_btn = (bool) ($attributes['showViewAll'] ?? true);

// Resolve which category slugs to show as tabs
if (!empty($tab_slugs)) {
    $tab_categories = get_terms([
        'taxonomy'   => 'product_cat',
        'slug'       => $tab_slugs,
        'hide_empty' => true,
        'orderby'    => 'name',
    ]);
} else {
    $tab_categories = get_terms([
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'orderby'    => 'name',
        'number'     => 10,
    ]);
}

if (is_wp_error($tab_categories)) {
    $tab_categories = [];
}

// Build query args
$order      = $orderby === 'price' ? 'ASC' : 'DESC';
$query_args = [
    'status'  => 'publish',
    'limit'   => $per_page,
    'orderby' => $orderby,
    'order'   => $order,
];

$products_by_tab = [];

// "All" tab — no category filter
$products_by_tab[''] = wc_get_products($query_args);

// Per-category tab products
foreach ($tab_categories as $term) {
    $cat_args              = array_merge($query_args, ['category' => [$term->slug]]);
    $products_by_tab[$term->slug] = wc_get_products($cat_args);
}

// If nothing in "All", bail
if (empty($products_by_tab[''])) {
    return;
}

$wrapper_attributes = get_block_wrapper_attributes(['class' => 'sp']);
?>

<div <?php echo $wrapper_attributes; ?> data-columns="<?php echo esc_attr($columns); ?>">

    <?php if ($heading || $subheading) : ?>
        <div class="sp__header">
            <?php if ($heading) : ?>
                <h2 class="sp__heading"><?php echo esc_html($heading); ?></h2>
            <?php endif; ?>
            <?php if ($subheading) : ?>
                <p class="sp__subheading"><?php echo esc_html($subheading); ?></p>
            <?php endif; ?>
        </div>
    <?php endif; ?>

    <?php if ($show_tabs && !empty($tab_categories)) : ?>
        <div class="sp__tabs" role="tablist">
            <button
                class="sp__tab is-active"
                role="tab"
                data-tab=""
                aria-selected="true"
            ><?php esc_html_e('All', 'ai-zippy'); ?></button>
            <?php foreach ($tab_categories as $term) : ?>
                <button
                    class="sp__tab"
                    role="tab"
                    data-tab="<?php echo esc_attr($term->slug); ?>"
                    aria-selected="false"
                ><?php echo esc_html($term->name); ?></button>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <?php foreach ($products_by_tab as $slug => $products) : ?>
        <?php if (empty($products)) : continue; endif; ?>
        <div
            class="sp__panel<?php echo $slug === '' ? ' is-active' : ''; ?>"
            data-panel="<?php echo esc_attr($slug); ?>"
            role="tabpanel"
            style="grid-template-columns: repeat(<?php echo $columns; ?>, 1fr);"
        >
            <?php foreach ($products as $product) :
                $image_id    = $product->get_image_id();
                $gallery_ids = $product->get_gallery_image_ids();
                $all_images  = array_values(array_filter(array_merge(
                    [$image_id ? wp_get_attachment_image_url($image_id, 'woocommerce_thumbnail') : ''],
                    array_map(fn($id) => wp_get_attachment_image_url($id, 'woocommerce_thumbnail'), $gallery_ids)
                )));
                $img_src     = $all_images[0] ?? wc_placeholder_img_src();

                $categories  = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
                $cat_name    = !empty($categories) ? $categories[0] : '';

                $on_sale   = $product->is_on_sale();
                $regular   = (float) $product->get_regular_price();
                $sale      = (float) $product->get_sale_price();
                $sale_pct  = ($on_sale && $regular > 0 && $sale > 0)
                    ? round((($regular - $sale) / $regular) * 100) : 0;
                $oos       = $product->get_stock_status() === 'outofstock';
            ?>
                <div class="sp__card" data-images="<?php echo esc_attr(wp_json_encode($all_images)); ?>">
                    <div class="sp__card-image">
                        <a href="<?php echo esc_url($product->get_permalink()); ?>">
                            <img
                                src="<?php echo esc_url($img_src); ?>"
                                alt="<?php echo esc_attr($product->get_name()); ?>"
                                class="sp__card-img"
                                loading="lazy"
                            />
                        </a>

                        <?php if ($show_sale && $on_sale) : ?>
                            <span class="sp__badge sp__badge--sale">
                                <?php echo $sale_pct > 0 ? $sale_pct . '% OFF' : 'Sale'; ?>
                            </span>
                        <?php endif; ?>

                        <?php if ($oos) : ?>
                            <span class="sp__badge sp__badge--oos">Sold Out</span>
                        <?php endif; ?>

                        <button class="sp__wish" aria-label="<?php esc_attr_e('Add to wishlist', 'ai-zippy'); ?>">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>

                        <?php if (count($all_images) > 1) : ?>
                            <div class="sp__thumbs">
                                <?php foreach (array_slice($all_images, 0, 3) as $i => $img) : ?>
                                    <button class="sp__thumb <?php echo $i === 0 ? 'is-active' : ''; ?>" data-index="<?php echo $i; ?>">
                                        <img src="<?php echo esc_url($img); ?>" alt="" />
                                    </button>
                                <?php endforeach; ?>
                                <?php if (count($all_images) > 3) : ?>
                                    <a href="<?php echo esc_url($product->get_permalink()); ?>" class="sp__thumb sp__thumb--more">
                                        +<?php echo count($all_images) - 3; ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="sp__card-body">
                        <?php if ($cat_name) : ?>
                            <span class="sp__card-cat"><?php echo esc_html($cat_name); ?></span>
                        <?php endif; ?>

                        <a href="<?php echo esc_url($product->get_permalink()); ?>" class="sp__card-title">
                            <?php echo esc_html($product->get_name()); ?>
                        </a>

                        <?php if ($show_rating && $product->get_average_rating() > 0) : ?>
                            <div class="sp__card-rating">
                                <?php echo wc_get_rating_html($product->get_average_rating(), $product->get_rating_count()); ?>
                            </div>
                        <?php endif; ?>

                        <div class="sp__card-price">
                            <?php echo $product->get_price_html(); ?>
                        </div>

                        <?php if ($show_cart && !$oos) : ?>
                            <div class="sp__card-actions">
                                <a
                                    href="<?php echo esc_url($product->add_to_cart_url()); ?>"
                                    class="sp__card-btn"
                                    data-product-id="<?php echo $product->get_id(); ?>"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                    <?php esc_html_e('ADD TO CART', 'ai-zippy'); ?>
                                </a>
                                <button class="sp__card-wish-sm" aria-label="<?php esc_attr_e('Wishlist', 'ai-zippy'); ?>">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                    </svg>
                                </button>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endforeach; ?>

    <?php if ($show_all_btn && $view_all_url && $view_all_txt) : ?>
        <div class="sp__footer">
            <a href="<?php echo esc_url($view_all_url); ?>" class="sp__view-all">
                <?php echo esc_html($view_all_txt); ?>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
            </a>
        </div>
    <?php endif; ?>

</div>
