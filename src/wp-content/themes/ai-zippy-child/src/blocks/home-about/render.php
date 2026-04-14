<?php

defined('ABSPATH') || exit;

$image_url     = esc_url($attributes['imageUrl'] ?? '');
$image_caption = nl2br(esc_html($attributes['imageCaption'] ?? ''));
$eyebrow       = esc_html($attributes['eyebrow'] ?? '');
$heading       = wp_kses_post(nl2br($attributes['heading'] ?? ''));
$description   = esc_html($attributes['description'] ?? '');

$features = array_values(array_filter([
    trim(wp_strip_all_tags($attributes['featureOne'] ?? '')),
    trim(wp_strip_all_tags($attributes['featureTwo'] ?? '')),
    trim(wp_strip_all_tags($attributes['featureThree'] ?? '')),
    trim(wp_strip_all_tags($attributes['featureFour'] ?? '')),
]));

$wrapper = get_block_wrapper_attributes(['class' => 'nta']);
?>

<div <?php echo $wrapper; ?>>
    <div class="nta__inner">
        <div class="nta__media">
            <div class="nta__image-wrap">
                <?php if ($image_url) : ?>
                    <img class="nta__image" src="<?php echo $image_url; ?>" alt="" loading="lazy" />
                <?php else : ?>
                    <div class="nta__placeholder">Select section image</div>
                <?php endif; ?>
            </div>

            <?php if ($image_caption) : ?>
                <p class="nta__caption"><?php echo $image_caption; ?></p>
            <?php endif; ?>
        </div>

        <div class="nta__content">
            <?php if ($eyebrow) : ?>
                <p class="nta__eyebrow"><?php echo $eyebrow; ?></p>
            <?php endif; ?>

            <?php if ($heading) : ?>
                <h2 class="nta__title"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if ($description) : ?>
                <p class="nta__body"><?php echo $description; ?></p>
            <?php endif; ?>

            <?php if (!empty($features)) : ?>
                <div class="nta__features">
                    <?php foreach ($features as $feature) : ?>
                        <div class="nta__feature">
                            <span class="nta__dot"></span>
                            <p class="nta__feature-text"><?php echo esc_html($feature); ?></p>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
