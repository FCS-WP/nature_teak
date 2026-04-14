<?php

defined('ABSPATH') || exit;

$eyebrow    = esc_html($attributes['eyebrow'] ?? '');
$heading    = esc_html($attributes['heading'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');

$cards = [];
foreach (['One', 'Two', 'Three', 'Four', 'Five', 'Six'] as $key) {
    $cards[] = [
        'icon'  => esc_html($attributes["card{$key}Icon"] ?? ''),
        'title' => esc_html($attributes["card{$key}Title"] ?? ''),
        'text'  => esc_html($attributes["card{$key}Text"] ?? ''),
    ];
}

$wrapper = get_block_wrapper_attributes(['class' => 'nts']);
?>

<div <?php echo $wrapper; ?>>
    <div class="nts__header">
        <div>
            <?php if ($eyebrow) : ?><p class="nts__eyebrow"><?php echo $eyebrow; ?></p><?php endif; ?>
            <?php if ($heading) : ?><h2 class="nts__title"><?php echo $heading; ?></h2><?php endif; ?>
        </div>
        <?php if ($button_txt) : ?>
            <a class="nts__button" href="<?php echo $button_url; ?>"><?php echo $button_txt; ?> <span aria-hidden="true">&rarr;</span></a>
        <?php endif; ?>
    </div>

    <div class="nts__grid">
        <?php foreach ($cards as $card) : ?>
            <div class="nts__card">
                <?php if ($card['icon']) : ?><p class="nts__icon"><?php echo $card['icon']; ?></p><?php endif; ?>
                <?php if ($card['title']) : ?><h3 class="nts__card-title"><?php echo $card['title']; ?></h3><?php endif; ?>
                <?php if ($card['text']) : ?><p class="nts__card-text"><?php echo $card['text']; ?></p><?php endif; ?>
            </div>
        <?php endforeach; ?>
    </div>
</div>
