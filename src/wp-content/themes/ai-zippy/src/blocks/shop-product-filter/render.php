<?php
/**
 * Server-side render for Shop Product Filter block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

$show_search     = (bool) ($attributes['showSearch'] ?? true);
$show_categories = (bool) ($attributes['showCategories'] ?? true);
$show_price      = (bool) ($attributes['showPrice'] ?? true);
$show_brands     = (bool) ($attributes['showBrands'] ?? true);
$show_tags       = (bool) ($attributes['showTags'] ?? true);
$show_attributes = (bool) ($attributes['showAttributes'] ?? true);
$show_stock      = (bool) ($attributes['showStock'] ?? true);
$layout          = $attributes['layout'] ?? 'sidebar';

$wrapper_attributes = get_block_wrapper_attributes([
    'class'          => 'spf spf--' . esc_attr($layout),
    'data-layout'    => esc_attr($layout),
    'data-config'    => esc_attr(wp_json_encode([
        'showSearch'     => $show_search,
        'showCategories' => $show_categories,
        'showPrice'      => $show_price,
        'showBrands'     => $show_brands,
        'showTags'       => $show_tags,
        'showAttributes' => $show_attributes,
        'showStock'      => $show_stock,
    ])),
]);

?>

<aside <?php echo $wrapper_attributes; ?>>
    <div class="spf__inner">
        <?php if ($show_search) : ?>
            <div class="spf__section spf__section--search" data-section="search">
                <div class="spf__section-toggle">
                    <span><?php esc_html_e('Search', 'ai-zippy'); ?></span>
                </div>
                <div class="spf__section-content">
                    <div class="spf__search">
                        <svg class="spf__search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <input type="text" class="spf__search-input" placeholder="<?php esc_attr_e('Search name or SKU...', 'ai-zippy'); ?>" data-filter="search" />
                        <button class="spf__search-clear" type="button" aria-label="<?php esc_attr_e('Clear search', 'ai-zippy'); ?>">&times;</button>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($show_categories) : ?>
            <div class="spf__section spf__section--categories" data-section="categories">
                <button class="spf__section-toggle" type="button">
                    <span><?php esc_html_e('Categories', 'ai-zippy'); ?></span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="2 4 6 8 10 4"/>
                    </svg>
                </button>
                <div class="spf__section-content">
                    <ul class="spf__list spf__cat-list" data-filter="category"></ul>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($show_price) : ?>
            <div class="spf__section spf__section--price" data-section="price">
                <button class="spf__section-toggle" type="button">
                    <span><?php esc_html_e('Price', 'ai-zippy'); ?></span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="2 4 6 8 10 4"/>
                    </svg>
                </button>
                <div class="spf__section-content">
                    <div class="spf__price" data-filter="price">
                        <div class="spf__price-inputs">
                            <input type="number" class="spf__price-input spf__price-min" min="0" placeholder="Min" />
                            <span class="spf__price-sep">&ndash;</span>
                            <input type="number" class="spf__price-input spf__price-max" min="0" placeholder="Max" />
                        </div>
                        <input type="range" class="spf__price-slider" min="0" max="1000" value="1000" />
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($show_brands) : ?>
            <div class="spf__section spf__section--brands" data-section="brands">
                <button class="spf__section-toggle" type="button">
                    <span><?php esc_html_e('Brands', 'ai-zippy'); ?></span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="2 4 6 8 10 4"/>
                    </svg>
                </button>
                <div class="spf__section-content">
                    <div class="spf__list spf__brand-list" data-filter="brands"></div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($show_tags) : ?>
            <div class="spf__section spf__section--tags" data-section="tags">
                <button class="spf__section-toggle" type="button">
                    <span><?php esc_html_e('Tags', 'ai-zippy'); ?></span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="2 4 6 8 10 4"/>
                    </svg>
                </button>
                <div class="spf__section-content">
                    <div class="spf__list spf__tag-list" data-filter="tags"></div>
                </div>
            </div>
        <?php endif; ?>

        <?php if ($show_attributes) : ?>
            <div class="spf__attrs" data-filter="attributes"></div>
        <?php endif; ?>

        <?php if ($show_stock) : ?>
            <div class="spf__section spf__section--stock" data-section="stock">
                <button class="spf__section-toggle" type="button">
                    <span><?php esc_html_e('Availability', 'ai-zippy'); ?></span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="2 4 6 8 10 4"/>
                    </svg>
                </button>
                <div class="spf__section-content">
                    <div class="spf__stock" data-filter="stock_status">
                        <label class="spf__radio">
                            <input type="radio" name="stock_status" value="" checked />
                            <span><?php esc_html_e('All', 'ai-zippy'); ?></span>
                        </label>
                        <label class="spf__radio">
                            <input type="radio" name="stock_status" value="instock" />
                            <span><?php esc_html_e('In Stock', 'ai-zippy'); ?></span>
                        </label>
                        <label class="spf__radio">
                            <input type="radio" name="stock_status" value="outofstock" />
                            <span><?php esc_html_e('Out of Stock', 'ai-zippy'); ?></span>
                        </label>
                        <label class="spf__radio">
                            <input type="radio" name="stock_status" value="onbackorder" />
                            <span><?php esc_html_e('On Backorder', 'ai-zippy'); ?></span>
                        </label>
                    </div>
                </div>
            </div>
        <?php endif; ?>

        <button class="spf__reset" type="button" style="display:none;">
            <?php esc_html_e('Reset Filters', 'ai-zippy'); ?>
        </button>
    </div>
</aside>
