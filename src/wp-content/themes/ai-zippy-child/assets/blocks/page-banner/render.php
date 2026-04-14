<?php

defined('ABSPATH') || exit;

$eyebrow          = esc_html($attributes['eyebrow'] ?? '');
$heading          = esc_html($attributes['heading'] ?? '');
$description      = esc_html($attributes['description'] ?? '');
$background_color = sanitize_hex_color($attributes['backgroundColor'] ?? '');

$wrapper_args = ['class' => 'pbn'];

if ($background_color) {
    $wrapper_args['style'] = 'background-color:' . $background_color . ';';
}

$wrapper = get_block_wrapper_attributes($wrapper_args);
?>

<div <?php echo $wrapper; ?>>
    <div class="pbn__inner">
        <?php if ($eyebrow) : ?><p class="pbn__eyebrow"><?php echo $eyebrow; ?></p><?php endif; ?>
        <?php if ($heading) : ?><h1 class="pbn__title"><?php echo $heading; ?></h1><?php endif; ?>
        <?php if ($description) : ?><p class="pbn__desc"><?php echo $description; ?></p><?php endif; ?>
    </div>
</div>
