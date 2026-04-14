<?php

defined('ABSPATH') || exit;

$eyebrow    = esc_html($attributes['eyebrow'] ?? '');
$heading    = esc_html($attributes['heading'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$cards      = [];

foreach (['One', 'Two', 'Three', 'Four'] as $key) {
    $cards[] = [
        'image'    => esc_url($attributes["card{$key}ImageUrl"] ?? ''),
        'category' => esc_html($attributes["card{$key}Category"] ?? ''),
        'title'    => esc_html($attributes["card{$key}Title"] ?? ''),
        'spec'     => esc_html($attributes["card{$key}Spec"] ?? ''),
    ];
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
                    <?php if ($card['image']) : ?>
                        <img src="<?php echo $card['image']; ?>" alt="" class="ntfp__image" loading="lazy" />
                    <?php else : ?>
                        <div class="ntfp__placeholder">Select image</div>
                    <?php endif; ?>
                </div>
                <div class="ntfp__info">
                    <?php if ($card['category']) : ?><p class="ntfp__category"><?php echo $card['category']; ?></p><?php endif; ?>
                    <?php if ($card['title']) : ?><h3 class="ntfp__card-title"><?php echo $card['title']; ?></h3><?php endif; ?>
                    <?php if ($card['spec']) : ?><p class="ntfp__spec"><?php echo $card['spec']; ?></p><?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>
