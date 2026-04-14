<?php

defined('ABSPATH') || exit;

$eyebrow     = esc_html($attributes['eyebrow'] ?? '');
$heading     = esc_html($attributes['heading'] ?? '');
$description = esc_html($attributes['description'] ?? '');
$cards       = [];

foreach (['One', 'Two', 'Three', 'Four'] as $key) {
    $cards[] = [
        'num'   => esc_html($attributes["card{$key}Number"] ?? ''),
        'title' => esc_html($attributes["card{$key}Title"] ?? ''),
        'text'  => esc_html($attributes["card{$key}Text"] ?? ''),
    ];
}

$wrapper = get_block_wrapper_attributes(['class' => 'ntw']);
?>

<div <?php echo $wrapper; ?>>
    <?php if ($eyebrow) : ?><p class="ntw__eyebrow"><?php echo $eyebrow; ?></p><?php endif; ?>
    <?php if ($heading) : ?><h2 class="ntw__title"><?php echo $heading; ?></h2><?php endif; ?>
    <?php if ($description) : ?><p class="ntw__body"><?php echo $description; ?></p><?php endif; ?>

    <div class="ntw__grid">
        <?php foreach ($cards as $card) : ?>
            <div class="ntw__card">
                <?php if ($card['num']) : ?><p class="ntw__num"><?php echo $card['num']; ?></p><?php endif; ?>
                <?php if ($card['title']) : ?><h3 class="ntw__card-title"><?php echo $card['title']; ?></h3><?php endif; ?>
                <?php if ($card['text']) : ?><p class="ntw__card-text"><?php echo $card['text']; ?></p><?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>
