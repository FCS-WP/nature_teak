<?php

defined('ABSPATH') || exit;

$title      = esc_html($attributes['title'] ?? '');
$subtitle   = esc_html($attributes['subtitle'] ?? '');
$button_txt = esc_html($attributes['buttonText'] ?? '');
$button_url = esc_url($attributes['buttonUrl'] ?? '#');
$filters    = [];

foreach (['One', 'Two', 'Three', 'Four', 'Five'] as $key) {
    $label = trim(wp_strip_all_tags($attributes["filter{$key}Label"] ?? ''));
    $url   = esc_url($attributes["filter{$key}Url"] ?? '#');

    if ($label !== '') {
        $filters[] = [
            'label' => $label,
            'url'   => $url,
        ];
    }
}

$wrapper = get_block_wrapper_attributes(['class' => 'sph']);
?>

<div <?php echo $wrapper; ?>>
    <div class="sph__header">
        <div>
            <?php if ($title) : ?><h1 class="sph__title"><?php echo $title; ?></h1><?php endif; ?>
            <?php if ($subtitle) : ?><p class="sph__subtitle"><?php echo $subtitle; ?></p><?php endif; ?>
        </div>

        <?php if ($button_txt) : ?>
            <a class="sph__button" href="<?php echo $button_url; ?>"><?php echo $button_txt; ?></a>
        <?php endif; ?>
    </div>

    <?php if (!empty($filters)) : ?>
        <div class="sph__filters">
            <?php foreach ($filters as $index => $filter) : ?>
                <a class="sph__filter<?php echo $index === 0 ? ' is-active' : ''; ?>" href="<?php echo $filter['url']; ?>">
                    <?php echo esc_html($filter['label']); ?>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>
