<?php

if (! defined('ABSPATH')) {
    exit;
}

if (! defined('AI_ZIPPY_CHILD_PRODUCT_ENQUIRY_OPTION')) {
    define('AI_ZIPPY_CHILD_PRODUCT_ENQUIRY_OPTION', 'ai_zippy_child_enable_product_enquiry');
}

function ai_zippy_child_is_product_enquiry_enabled(): bool
{
    return get_option(AI_ZIPPY_CHILD_PRODUCT_ENQUIRY_OPTION, 'yes') === 'yes';
}

function ai_zippy_child_add_product_action_setting(array $settings, string $current_section): array
{
    if ($current_section !== '') {
        return $settings;
    }

    $setting = [
        'title'   => __('Use enquiry buttons on product cards', 'ai-zippy-child'),
        'desc'    => __('Show enquiry buttons in the Shop Category Section block. Disable this to show add-to-cart buttons instead.', 'ai-zippy-child'),
        'id'      => AI_ZIPPY_CHILD_PRODUCT_ENQUIRY_OPTION,
        'default' => 'yes',
        'type'    => 'checkbox',
    ];

    $insert_after = 'woocommerce_enable_ajax_add_to_cart';

    foreach ($settings as $index => $existing_setting) {
        if (($existing_setting['id'] ?? '') === $insert_after) {
            array_splice($settings, $index + 1, 0, [$setting]);
            return $settings;
        }
    }

    $settings[] = $setting;

    return $settings;
}
add_filter('woocommerce_get_settings_products', 'ai_zippy_child_add_product_action_setting', 20, 2);

function ai_zippy_child_register_product_action_rest_route(): void
{
    register_rest_route('ai-zippy-child/v1', '/product-card-actions', [
        'methods'             => 'GET',
        'callback'            => static fn() => [
            'enquiryEnabled' => ai_zippy_child_is_product_enquiry_enabled(),
        ],
        'permission_callback' => static fn() => current_user_can('edit_posts'),
    ]);
}
add_action('rest_api_init', 'ai_zippy_child_register_product_action_rest_route');
