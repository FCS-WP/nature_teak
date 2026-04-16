<?php

defined('ABSPATH') || exit;

$eyebrow          = esc_html($attributes['eyebrow'] ?? '');
$heading          = esc_html($attributes['heading'] ?? '');
$form_shortcode   = trim((string) ($attributes['formShortcode'] ?? ''));
$response_note    = esc_html($attributes['responseNote'] ?? '');
$background_color = sanitize_hex_color($attributes['backgroundColor'] ?? '');

$location_title   = esc_html($attributes['locationTitle'] ?? '');
$location_name    = esc_html($attributes['locationName'] ?? '');
$location_address = esc_html($attributes['locationAddress'] ?? '');
$location_tagline = esc_html($attributes['locationTagline'] ?? '');

$map_image_url  = esc_url($attributes['mapImageUrl'] ?? '');
$map_alt        = esc_attr($attributes['mapAlt'] ?? '');
$map_embed_html = (string) ($attributes['mapEmbedHtml'] ?? '');
$map_title      = esc_html($attributes['mapTitle'] ?? '');
$map_subtitle   = esc_html($attributes['mapSubtitle'] ?? '');
$map_link_text  = esc_html($attributes['mapLinkText'] ?? '');
$map_link_url   = esc_url($attributes['mapLinkUrl'] ?? '#');

$hours_title = esc_html($attributes['hoursTitle'] ?? '');
$trade_title = esc_html($attributes['tradeTitle'] ?? '');
$follow_title = esc_html($attributes['followTitle'] ?? '');
$follow_button_text = esc_html($attributes['followButtonText'] ?? '');
$follow_button_url = esc_url($attributes['followButtonUrl'] ?? '#');

$hours = [];
foreach (['One', 'Two', 'Three', 'Four'] as $key) {
    $label = trim(wp_strip_all_tags($attributes["hoursLine{$key}Label"] ?? ''));
    $value = trim(wp_strip_all_tags($attributes["hoursLine{$key}Value"] ?? ''));

    if ($label !== '' || $value !== '') {
        $hours[] = [
            'label' => $label,
            'value' => $value,
        ];
    }
}

$trade_items = [];
foreach (['One', 'Two', 'Three', 'Four'] as $key) {
    $item = trim(wp_strip_all_tags($attributes["trade{$key}"] ?? ''));

    if ($item !== '') {
        $trade_items[] = $item;
    }
}

$wrapper_args = ['class' => 'cts'];

if ($background_color) {
    $wrapper_args['style'] = 'background-color:' . $background_color . ';';
}

$wrapper = get_block_wrapper_attributes($wrapper_args);
$allowed_map_embed_html = [
    'iframe' => [
        'src' => true,
        'width' => true,
        'height' => true,
        'style' => true,
        'allowfullscreen' => true,
        'loading' => true,
        'referrerpolicy' => true,
        'title' => true,
        'class' => true,
    ],
    'div' => [
        'class' => true,
        'style' => true,
    ],
    'small' => [
        'class' => true,
        'style' => true,
    ],
    'a' => [
        'href' => true,
        'target' => true,
        'rel' => true,
        'style' => true,
        'class' => true,
    ],
];
$map_embed_html = wp_kses($map_embed_html, $allowed_map_embed_html);
?>

<div <?php echo $wrapper; ?>>
    <div class="cts__grid">
        <div class="cts__form-col">
            <?php if ($eyebrow) : ?><p class="cts__eyebrow"><?php echo $eyebrow; ?></p><?php endif; ?>
            <?php if ($heading) : ?><h2 class="cts__title"><?php echo $heading; ?></h2><?php endif; ?>

            <div class="cts__form-shell">
                <?php if ($form_shortcode !== '') : ?>
                    <?php echo do_shortcode(shortcode_unautop($form_shortcode)); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php else : ?>
                    <div class="cts__form-empty">Add a contact form shortcode in the block settings to render your live form here.</div>
                <?php endif; ?>
            </div>

            <?php if ($response_note) : ?><p class="cts__response-note"><?php echo $response_note; ?></p><?php endif; ?>
        </div>

        <div class="cts__info-col">
            <div class="cts__panel">
                <?php if ($location_title) : ?><h3 class="cts__panel-title cts__panel-title--location"><?php echo $location_title; ?></h3><?php endif; ?>
                <div class="cts__location-copy">
                    <?php if ($location_name) : ?><p class="cts__location-name"><?php echo $location_name; ?></p><?php endif; ?>
                    <?php if ($location_address) : ?><p class="cts__location-address"><?php echo $location_address; ?></p><?php endif; ?>
                    <?php if ($location_tagline) : ?><p class="cts__location-tagline"><?php echo $location_tagline; ?></p><?php endif; ?>
                </div>

                <div class="cts__map-card">
                    <?php if ($map_embed_html !== '') : ?>
                        <div class="cts__map-embed"><?php echo $map_embed_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
                    <?php else : ?>
                        <?php if ($map_image_url) : ?><img src="<?php echo $map_image_url; ?>" alt="<?php echo $map_alt; ?>" class="cts__map-image" loading="lazy" /><?php endif; ?>
                        <?php if ($map_title) : ?><p class="cts__map-title"><?php echo $map_title; ?></p><?php endif; ?>
                        <?php if ($map_subtitle) : ?><p class="cts__map-subtitle"><?php echo $map_subtitle; ?></p><?php endif; ?>
                        <?php if ($map_link_text) : ?><a class="cts__map-link" href="<?php echo $map_link_url; ?>"><?php echo $map_link_text; ?></a><?php endif; ?>
                    <?php endif; ?>
                </div>
            </div>

            <div class="cts__panel">
                <?php if ($hours_title) : ?><h3 class="cts__panel-title cts__panel-title--hours"><?php echo $hours_title; ?></h3><?php endif; ?>
                <?php if (!empty($hours)) : ?>
                    <div class="cts__hours-list">
                        <?php foreach ($hours as $row) : ?>
                            <div class="cts__hours-row">
                                <span class="cts__hours-label"><?php echo esc_html($row['label']); ?></span>
                                <span class="cts__hours-value"><?php echo esc_html($row['value']); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="cts__panel">
                <?php if ($trade_title) : ?><h3 class="cts__panel-title cts__panel-title--trade"><?php echo $trade_title; ?></h3><?php endif; ?>
                <?php if (!empty($trade_items)) : ?>
                    <div class="cts__trade-list">
                        <?php foreach ($trade_items as $item) : ?>
                            <div class="cts__trade-item">
                                <span class="cts__trade-check"></span>
                                <p class="cts__trade-text"><?php echo esc_html($item); ?></p>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endif; ?>
            </div>

            <div class="cts__panel">
                <?php if ($follow_title) : ?><h3 class="cts__panel-title cts__panel-title--follow"><?php echo $follow_title; ?></h3><?php endif; ?>
                <?php if ($follow_button_text) : ?><a class="cts__follow-button" href="<?php echo $follow_button_url; ?>"><?php echo $follow_button_text; ?></a><?php endif; ?>
            </div>
        </div>
    </div>
</div>
