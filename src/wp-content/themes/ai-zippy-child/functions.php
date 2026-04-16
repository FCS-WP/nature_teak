<?php

/**
 * AI Zippy Child Theme Functions
 *
 * Add project-specific customizations here.
 * The parent theme (ai-zippy) handles Vite assets and core setup.
 */

defined('ABSPATH') || exit;

/**
 * Load all child theme hook files from inc/hooks.
 */
function ai_zippy_child_load_hook_files(): void
{
    $hooks_dir = get_stylesheet_directory() . '/inc/hooks';

    if (!is_dir($hooks_dir)) {
        return;
    }

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($hooks_dir, FilesystemIterator::SKIP_DOTS)
    );

    foreach ($iterator as $file) {
        if (!$file->isFile() || $file->getExtension() !== 'php') {
            continue;
        }

        require_once $file->getPathname();
    }
}

ai_zippy_child_load_hook_files();

/**
 * Enable classic WordPress menu management for this child theme.
 */
function ai_zippy_child_setup_menus(): void
{
    add_theme_support('menus');

    register_nav_menus([
        'primary' => __('Primary Menu', 'ai-zippy-child'),
        'footer'  => __('Footer Menu', 'ai-zippy-child'),
    ]);
}
add_action('after_setup_theme', 'ai_zippy_child_setup_menus', 20);

/**
 * Provide menu data to custom editor blocks.
 *
 * Some block-theme setups do not expose the core menu REST endpoints consistently,
 * so the child header block uses these lightweight endpoints instead.
 */
function ai_zippy_child_register_menu_rest_routes(): void
{
    register_rest_route('ai-zippy-child/v1', '/menus', [
        'methods'             => 'GET',
        'callback'            => 'ai_zippy_child_get_menus',
        'permission_callback' => static fn() => current_user_can('edit_theme_options'),
    ]);

    register_rest_route('ai-zippy-child/v1', '/menus/(?P<id>\d+)/items', [
        'methods'             => 'GET',
        'callback'            => 'ai_zippy_child_get_menu_items',
        'permission_callback' => static fn() => current_user_can('edit_theme_options'),
        'args'                => [
            'id' => [
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
}
add_action('rest_api_init', 'ai_zippy_child_register_menu_rest_routes');

function ai_zippy_child_get_menus(): array
{
    $menus = wp_get_nav_menus(['hide_empty' => false]);

    if (empty($menus) || is_wp_error($menus)) {
        return [];
    }

    return array_map(
        static fn($menu) => [
            'id'   => (int) $menu->term_id,
            'name' => $menu->name,
            'slug' => $menu->slug,
        ],
        $menus
    );
}

function ai_zippy_child_get_menu_items(WP_REST_Request $request): array
{
    $menu_id = absint($request['id']);
    $items   = wp_get_nav_menu_items($menu_id);

    if (empty($items) || is_wp_error($items)) {
        return [];
    }

    return array_values(array_map(
        static fn($item) => [
            'id'     => (int) $item->ID,
            'label'  => $item->title,
            'url'    => $item->url,
            'parent' => (int) $item->menu_item_parent,
            'order'  => (int) $item->menu_order,
        ],
        $items
    ));
}

/**
 * Enqueue child theme styles after parent.
 */
function ai_zippy_child_enqueue_assets(): void
{
    // Vite outputs child-style.css into the parent theme dist folder.
    $child_css_rel = '/assets/dist/css/child-style.css';
    $child_css_abs = get_template_directory() . $child_css_rel;
    $child_css_uri = get_template_directory_uri() . $child_css_rel;

    if (!file_exists($child_css_abs)) {
        $child_css_rel = '/assets/dist/css/style.css';
        $child_css_abs = get_template_directory() . $child_css_rel;
        $child_css_uri = get_template_directory_uri() . $child_css_rel;
    }

    if (file_exists($child_css_abs)) {
        wp_enqueue_style(
            'ai-zippy-child-style',
            $child_css_uri,
            ['ai-zippy-theme-css-0'],
            filemtime($child_css_abs)
        );
    }
}
add_action('wp_enqueue_scripts', 'ai_zippy_child_enqueue_assets', 20);

/**
 * Register child theme custom Gutenberg blocks from assets/blocks.
 *
 * Parent theme already registers its own blocks from ai-zippy/assets/blocks.
 * This keeps child blocks isolated in ai-zippy-child/assets/blocks.
 */
function ai_zippy_child_register_blocks(): void
{
    $blocks_dir = get_stylesheet_directory() . '/assets/blocks';

    if (!is_dir($blocks_dir)) {
        return;
    }

    foreach (glob($blocks_dir . '/*/block.json') as $block_json) {
        register_block_type(dirname($block_json));
    }
}
add_action('init', 'ai_zippy_child_register_blocks', 20);
