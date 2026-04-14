<?php

defined('ABSPATH') || exit;

$eyebrow            = esc_html($attributes['eyebrow'] ?? '');
$heading            = nl2br(esc_html($attributes['heading'] ?? ''));
$description        = esc_html($attributes['description'] ?? '');
$primary_btn_text   = esc_html($attributes['primaryBtnText'] ?? '');
$primary_btn_url    = esc_url($attributes['primaryBtnUrl'] ?? '#');
$secondary_btn_text = esc_html($attributes['secondaryBtnText'] ?? '');
$secondary_btn_url  = esc_url($attributes['secondaryBtnUrl'] ?? '#');

$stat_one_value   = esc_html($attributes['statOneValue'] ?? '');
$stat_one_label   = esc_html($attributes['statOneLabel'] ?? '');
$stat_two_value   = esc_html($attributes['statTwoValue'] ?? '');
$stat_two_label   = esc_html($attributes['statTwoLabel'] ?? '');
$stat_three_value = esc_html($attributes['statThreeValue'] ?? '');
$stat_three_label = esc_html($attributes['statThreeLabel'] ?? '');

$tile_teak_url   = esc_url($attributes['tileTeakUrl'] ?? '');
$tile_willow_url = esc_url($attributes['tileWillowUrl'] ?? '');
$tile_walnut_url = esc_url($attributes['tileWalnutUrl'] ?? '');
$tile_maple_url  = esc_url($attributes['tileMapleUrl'] ?? '');

$label_teak   = esc_html($attributes['labelTeak'] ?? 'teak');
$label_willow = esc_html($attributes['labelWillow'] ?? 'willow');
$label_walnut = esc_html($attributes['labelWalnut'] ?? 'walnut');
$label_maple  = esc_html($attributes['labelMaple'] ?? 'maple');

$location_title    = esc_html($attributes['locationTitle'] ?? '');
$location_subtitle = esc_html($attributes['locationSubtitle'] ?? '');

$tiles = [
    ['url' => $tile_teak_url, 'label' => $label_teak, 'class' => 'hh__tile--1'],
    ['url' => $tile_willow_url, 'label' => $label_willow, 'class' => 'hh__tile--2'],
    ['url' => $tile_walnut_url, 'label' => $label_walnut, 'class' => 'hh__tile--3'],
    ['url' => $tile_maple_url, 'label' => $label_maple, 'class' => 'hh__tile--4'],
];

$wrapper = get_block_wrapper_attributes(['class' => 'hh']);
?>

<div <?php echo $wrapper; ?>>
    <div class="hh__inner">
        <div class="hh__left">
            <?php if ($eyebrow) : ?>
                <p class="hh__eyebrow"><?php echo $eyebrow; ?></p>
            <?php endif; ?>

            <?php if ($heading) : ?>
                <h2 class="hh__title"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if ($description) : ?>
                <p class="hh__desc"><?php echo $description; ?></p>
            <?php endif; ?>

            <div class="hh__actions">
                <?php if ($primary_btn_text) : ?>
                    <a class="hh__btn hh__btn--primary" href="<?php echo $primary_btn_url; ?>"><?php echo $primary_btn_text; ?></a>
                <?php endif; ?>

                <?php if ($secondary_btn_text) : ?>
                    <a class="hh__btn hh__btn--outline" href="<?php echo $secondary_btn_url; ?>"><?php echo $secondary_btn_text; ?></a>
                <?php endif; ?>
            </div>

            <div class="hh__stats">
                <div class="hh__stat">
                    <p class="hh__stat-value"><?php echo $stat_one_value; ?></p>
                    <p class="hh__stat-label"><?php echo $stat_one_label; ?></p>
                </div>
                <div class="hh__stat">
                    <p class="hh__stat-value"><?php echo $stat_two_value; ?></p>
                    <p class="hh__stat-label"><?php echo $stat_two_label; ?></p>
                </div>
                <div class="hh__stat">
                    <p class="hh__stat-value"><?php echo $stat_three_value; ?></p>
                    <p class="hh__stat-label"><?php echo $stat_three_label; ?></p>
                </div>
            </div>
        </div>

        <div class="hh__right">
            <div class="hh__tiles">
                <?php foreach ($tiles as $index => $tile) : ?>
                    <div class="hh__tile <?php echo esc_attr($tile['class']); ?>">
                        <?php if (!empty($tile['url'])) : ?>
                            <img src="<?php echo esc_url($tile['url']); ?>" alt="" class="hh__tile-img" loading="lazy" />
                        <?php endif; ?>

                        <?php if (!empty($tile['label'])) : ?>
                            <span class="hh__wood-label"><?php echo $tile['label']; ?></span>
                        <?php endif; ?>

                        <?php if ($index === 1 && ($location_title || $location_subtitle)) : ?>
                            <div class="hh__location-badge">
                                <?php if ($location_title) : ?><p><?php echo $location_title; ?></p><?php endif; ?>
                                <?php if ($location_subtitle) : ?><p><?php echo $location_subtitle; ?></p><?php endif; ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
    </div>
</div>
