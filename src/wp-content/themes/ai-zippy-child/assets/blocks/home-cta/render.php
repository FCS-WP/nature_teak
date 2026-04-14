<?php

defined('ABSPATH') || exit;

$heading    = esc_html($attributes['heading'] ?? '');
$body       = esc_html($attributes['description'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$wrapper    = get_block_wrapper_attributes(['class' => 'ntc']);
?>

<div <?php echo $wrapper; ?>>
    <div>
        <?php if ($heading) : ?><h2 class="ntc__title"><?php echo $heading; ?></h2><?php endif; ?>
        <?php if ($body) : ?><p class="ntc__body"><?php echo $body; ?></p><?php endif; ?>
    </div>
    <?php if ($button_txt) : ?>
        <a class="ntc__button" href="<?php echo $button_url; ?>"><?php echo $button_txt; ?></a>
    <?php endif; ?>
</div>
