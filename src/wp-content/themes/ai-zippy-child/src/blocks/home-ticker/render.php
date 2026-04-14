<?php

defined('ABSPATH') || exit;

$items = array_values(array_filter([
    trim(wp_strip_all_tags($attributes['itemOne'] ?? '')),
    trim(wp_strip_all_tags($attributes['itemTwo'] ?? '')),
    trim(wp_strip_all_tags($attributes['itemThree'] ?? '')),
    trim(wp_strip_all_tags($attributes['itemFour'] ?? '')),
    trim(wp_strip_all_tags($attributes['itemFive'] ?? '')),
]));

if (empty($items)) {
    return;
}

$wrapper = get_block_wrapper_attributes(['class' => 'ntk']);
?>

<div <?php echo $wrapper; ?>>
    <div class="ntk__inner" aria-label="Services ticker">
        <?php for ($loop = 0; $loop < 2; $loop++) : ?>
            <?php foreach ($items as $item) : ?>
                <span class="ntk__item"><?php echo esc_html($item); ?></span>
            <?php endforeach; ?>
        <?php endfor; ?>
    </div>
</div>
