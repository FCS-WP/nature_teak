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
