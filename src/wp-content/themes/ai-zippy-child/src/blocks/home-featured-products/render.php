<?php

defined('ABSPATH') || exit;

$eyebrow    = esc_html($attributes['eyebrow'] ?? '');
$heading    = esc_html($attributes['heading'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$products_to_show = max(1, min(8, (int) ($attributes['productsToShow'] ?? 4)));
$fallback_to_latest = !empty($attributes['fallbackToLatest']);
$cards = [];

if (function_exists('wc_get_products')) {
    $featured_products = wc_get_products([
        'status' => 'publish',
        'limit' => $products_to_show,
        'featured' => true,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);

    $products = is_array($featured_products) ? $featured_products : [];

    if ($fallback_to_latest && count($products) < $products_to_show) {
        $existing_ids = array_map(
            static fn($product) => $product->get_id(),
            $products
        );

        $latest_products = wc_get_products([
            'status' => 'publish',
            'limit' => $products_to_show - count($products),
            'exclude' => $existing_ids,
            'orderby' => 'date',
            'order' => 'DESC',
        ]);

        if (is_array($latest_products)) {
            $products = array_merge($products, $latest_products);
        }
    }

    foreach (array_slice($products, 0, $products_to_show) as $product) {
        $image_url = wp_get_attachment_image_url($product->get_image_id(), 'large') ?: wc_placeholder_img_src();
        $categories = wp_get_post_terms($product->get_id(), 'product_cat', ['fields' => 'names']);
        $category_name = !empty($categories) ? $categories[0] : '';
        $short_description = wp_strip_all_tags($product->get_short_description());
        $spec_text = $short_description !== '' ? $short_description : wp_strip_all_tags($product->get_price_html());

        $cards[] = [
            'image' => esc_url($image_url),
            'category' => esc_html($category_name),
            'title' => esc_html($product->get_name()),
            'spec' => esc_html($spec_text),
            'url' => esc_url($product->get_permalink()),
        ];
    }
}

$wrapper = get_block_wrapper_attributes(['class' => 'ntfp']);
?>

<div <?php echo $wrapper; ?>>
    <div class="ntfp__header">
        <div>
            <?php if ($eyebrow) : ?><p class="ntfp__eyebrow"><?php echo $eyebrow; ?></p><?php endif; ?>
            <?php if ($heading) : ?><h2 class="ntfp__title"><?php echo $heading; ?></h2><?php endif; ?>
        </div>
        <?php if ($button_txt) : ?>
            <a class="ntfp__button" href="<?php echo $button_url; ?>"><?php echo $button_txt; ?> <span aria-hidden="true">&rarr;</span></a>
        <?php endif; ?>
    </div>

    <div class="ntfp__grid">
        <?php foreach ($cards as $card) : ?>
            <div class="ntfp__card">
                <div class="ntfp__image-wrap">
                    <a href="<?php echo $card['url']; ?>" class="ntfp__image-link">
                        <?php if ($card['image']) : ?>
                            <img src="<?php echo $card['image']; ?>" alt="" class="ntfp__image" loading="lazy" />
                        <?php else : ?>
                            <div class="ntfp__placeholder">No image</div>
                        <?php endif; ?>
                    </a>
                </div>
                <div class="ntfp__info">
                    <?php if ($card['category']) : ?><p class="ntfp__category"><?php echo $card['category']; ?></p><?php endif; ?>
                    <?php if ($card['title']) : ?><h3 class="ntfp__card-title"><a class="ntfp__card-link" href="<?php echo $card['url']; ?>"><?php echo $card['title']; ?></a></h3><?php endif; ?>
                    <?php if ($card['spec']) : ?><p class="ntfp__spec"><?php echo $card['spec']; ?></p><?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
