<?php
/**
 * Server-side render for Shop Product Grid block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

$columns     = (int) ($attributes['columns'] ?? 3);
$per_page    = (int) ($attributes['perPage'] ?? 12);
$orderby     = $attributes['orderby'] ?? 'menu_order';
$order       = $attributes['order'] ?? 'ASC';
$show_sale   = (bool) ($attributes['showSaleBadge'] ?? true);
$show_rating = (bool) ($attributes['showRating'] ?? true);
$show_cart   = (bool) ($attributes['showAddToCart'] ?? true);

$order_dir = $orderby === 'price' ? 'ASC' : 'DESC';
if ($order) {
    $order_dir = strtoupper($order);
}

// Initial query
$query_args = [
    'status'   => 'publish',
    'limit'    => $per_page,
    'page'     => 1,
    'paginate' => true,
    'orderby'  => $orderby,
    'order'    => $order_dir,
];

$results   = wc_get_products($query_args);
$products  = $results->products;
$total     = (int) $results->total;
$max_pages = (int) $results->max_num_pages;

$wrapper_attributes = get_block_wrapper_attributes([
    'class'       => 'spg',
    'data-config' => esc_attr(wp_json_encode([
        'columns'      => $columns,
        'per_page'     => $per_page,
        'orderby'      => $orderby,
        'order'        => $order,
        'show_sale'    => $show_sale,
        'show_rating'  => $show_rating,
        'show_cart'    => $show_cart,
        'total'        => $total,
        'pages'        => $max_pages,
    ])),
]);

?>

<div <?php echo $wrapper_attributes; ?>>

    <!-- Toolbar -->
    <div class="spg__toolbar">
        <div class="spg__toolbar-left">
            <span class="spg__count">
                <?php
                /* translators: %d: number of products */
                echo esc_html(sprintf(_n('%d product', '%d products', $total, 'ai-zippy'), $total));
                ?>
            </span>
        </div>
        <div class="spg__toolbar-right">
            <select class="spg__sort" data-sort>
                <option value="menu_order-ASC" <?php selected($orderby === 'menu_order' && $order_dir === 'ASC'); ?>>
                    <?php esc_html_e('Default', 'ai-zippy'); ?>
                </option>
                <option value="date-DESC" <?php selected($orderby === 'date' && $order_dir === 'DESC'); ?>>
                    <?php esc_html_e('Newest', 'ai-zippy'); ?>
                </option>
                <option value="price-ASC" <?php selected($orderby === 'price' && $order_dir === 'ASC'); ?>>
                    <?php esc_html_e('Price: Low to High', 'ai-zippy'); ?>
                </option>
                <option value="price-DESC" <?php selected($orderby === 'price' && $order_dir === 'DESC'); ?>>
                    <?php esc_html_e('Price: High to Low', 'ai-zippy'); ?>
                </option>
                <option value="rating-DESC" <?php selected($orderby === 'rating' && $order_dir === 'DESC'); ?>>
                    <?php esc_html_e('Best Rating', 'ai-zippy'); ?>
                </option>
                <option value="popularity-DESC" <?php selected($orderby === 'popularity' && $order_dir === 'DESC'); ?>>
                    <?php esc_html_e('Popularity', 'ai-zippy'); ?>
                </option>
            </select>
            <div class="spg__view-toggle">
                <button class="spg__view-btn is-active" data-view="grid" type="button" aria-label="<?php esc_attr_e('Grid view', 'ai-zippy'); ?>">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="0" y="0" width="7" height="7" rx="1"/><rect x="9" y="0" width="7" height="7" rx="1"/>
                        <rect x="0" y="9" width="7" height="7" rx="1"/><rect x="9" y="9" width="7" height="7" rx="1"/>
                    </svg>
                </button>
                <button class="spg__view-btn" data-view="list" type="button" aria-label="<?php esc_attr_e('List view', 'ai-zippy'); ?>">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="0" y="0" width="16" height="4" rx="1"/><rect x="0" y="6" width="16" height="4" rx="1"/>
                        <rect x="0" y="12" width="16" height="4" rx="1"/>
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <!-- Product grid -->
    <div class="spg__grid-wrap">
        <div class="spg__grid spg__grid--grid" data-grid style="grid-template-columns: repeat(<?php echo $columns; ?>, 1fr);">
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

                $on_sale  = $product->is_on_sale();
                $regular  = (float) $product->get_regular_price();
                $sale     = (float) $product->get_sale_price();
                $sale_pct = ($on_sale && $regular > 0 && $sale > 0)
                    ? round((($regular - $sale) / $regular) * 100) : 0;
                $oos      = $product->get_stock_status() === 'outofstock';
            ?>
                <div class="spg__card" data-images="<?php echo esc_attr(wp_json_encode($all_images)); ?>">
                    <div class="spg__card-image">
                        <a href="<?php echo esc_url($product->get_permalink()); ?>">
                            <img src="<?php echo esc_url($img_src); ?>" alt="<?php echo esc_attr($product->get_name()); ?>" loading="lazy" />
                        </a>

                        <?php if ($show_sale && $on_sale) : ?>
                            <span class="spg__badge spg__badge--sale">
                                <?php echo $sale_pct > 0 ? $sale_pct . '% OFF' : 'Sale'; ?>
                            </span>
                        <?php endif; ?>

                        <?php if ($oos) : ?>
                            <span class="spg__badge spg__badge--oos"><?php esc_html_e('Sold Out', 'ai-zippy'); ?></span>
                        <?php endif; ?>

                        <button class="spg__wish" aria-label="<?php esc_attr_e('Add to wishlist', 'ai-zippy'); ?>">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>

                        <?php if (count($all_images) > 1) : ?>
                            <div class="spg__thumbs">
                                <?php foreach (array_slice($all_images, 0, 3) as $i => $img) : ?>
                                    <button class="spg__thumb <?php echo $i === 0 ? 'is-active' : ''; ?>" data-index="<?php echo $i; ?>" type="button">
                                        <img src="<?php echo esc_url($img); ?>" alt="" />
                                    </button>
                                <?php endforeach; ?>
                                <?php if (count($all_images) > 3) : ?>
                                    <a href="<?php echo esc_url($product->get_permalink()); ?>" class="spg__thumb spg__thumb--more">
                                        +<?php echo count($all_images) - 3; ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>

                    <div class="spg__card-body">
                        <?php if ($cat_name) : ?>
                            <span class="spg__card-cat"><?php echo esc_html($cat_name); ?></span>
                        <?php endif; ?>

                        <a href="<?php echo esc_url($product->get_permalink()); ?>" class="spg__card-title">
                            <?php echo esc_html($product->get_name()); ?>
                        </a>

                        <?php if ($show_rating && $product->get_average_rating() > 0) : ?>
                            <div class="spg__card-rating">
                                <?php echo wc_get_rating_html($product->get_average_rating(), $product->get_rating_count()); ?>
                            </div>
                        <?php endif; ?>

                        <div class="spg__card-price">
                            <?php echo $product->get_price_html(); ?>
                        </div>

                        <?php if ($show_cart && !$oos) : ?>
                            <div class="spg__card-actions">
                                <a href="<?php echo esc_url($product->add_to_cart_url()); ?>" class="spg__card-btn" data-product-id="<?php echo $product->get_id(); ?>">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                                    </svg>
                                    <?php esc_html_e('ADD TO CART', 'ai-zippy'); ?>
                                </a>
                                <button class="spg__card-wish-sm" aria-label="<?php esc_attr_e('Wishlist', 'ai-zippy'); ?>">
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
    </div>

    <!-- Empty state -->
    <div class="spg__empty" style="display:none;">
        <p><?php esc_html_e('No products found matching your filters.', 'ai-zippy'); ?></p>
    </div>

    <!-- Pagination -->
    <?php if ($max_pages > 1) : ?>
        <nav class="spg__pagination" data-pagination>
            <button class="spg__page-btn spg__page-prev" data-page="prev" type="button" disabled>&lsaquo; <?php esc_html_e('Prev', 'ai-zippy'); ?></button>
            <?php for ($p = 1; $p <= $max_pages; $p++) : ?>
                <button class="spg__page-btn <?php echo $p === 1 ? 'is-active' : ''; ?>" data-page="<?php echo $p; ?>" type="button"><?php echo $p; ?></button>
            <?php endfor; ?>
            <button class="spg__page-btn spg__page-next" data-page="next" type="button"><?php esc_html_e('Next', 'ai-zippy'); ?> &rsaquo;</button>
        </nav>
    <?php endif; ?>

</div>
