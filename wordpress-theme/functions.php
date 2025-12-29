<?php
/**
 * Tepovac Rental Theme Functions
 */

// Theme Setup
function tepovac_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'tepovac-rental'),
        'footer'  => __('Footer Menu', 'tepovac-rental'),
    ));
}
add_action('after_setup_theme', 'tepovac_theme_setup');

// Enqueue styles and scripts
function tepovac_enqueue_assets() {
    // Google Fonts - Poppins
    wp_enqueue_style(
        'google-fonts-poppins',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap',
        array(),
        null
    );
    
    // Theme stylesheet
    wp_enqueue_style(
        'tepovac-style',
        get_stylesheet_uri(),
        array('google-fonts-poppins'),
        wp_get_theme()->get('Version')
    );
    
    // Theme scripts
    wp_enqueue_script(
        'tepovac-scripts',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        wp_get_theme()->get('Version'),
        true
    );
}
add_action('wp_enqueue_scripts', 'tepovac_enqueue_assets');

// Theme Customizer Settings
function tepovac_customize_register($wp_customize) {
    // Contact Section
    $wp_customize->add_section('tepovac_contact', array(
        'title'    => __('Kontaktné údaje', 'tepovac-rental'),
        'priority' => 30,
    ));
    
    // Phone Number
    $wp_customize->add_setting('tepovac_phone', array(
        'default'           => '+421 903 123 456',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('tepovac_phone', array(
        'label'   => __('Telefónne číslo', 'tepovac-rental'),
        'section' => 'tepovac_contact',
        'type'    => 'text',
    ));
    
    // Email
    $wp_customize->add_setting('tepovac_email', array(
        'default'           => 'info@tepovac.sk',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('tepovac_email', array(
        'label'   => __('Email', 'tepovac-rental'),
        'section' => 'tepovac_contact',
        'type'    => 'email',
    ));
    
    // Address
    $wp_customize->add_setting('tepovac_address', array(
        'default'           => 'Námestie Hraničiarov 35, Bratislava - Petržalka',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('tepovac_address', array(
        'label'   => __('Adresa', 'tepovac-rental'),
        'section' => 'tepovac_contact',
        'type'    => 'text',
    ));
    
    // WhatsApp Number
    $wp_customize->add_setting('tepovac_whatsapp', array(
        'default'           => '421903123456',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('tepovac_whatsapp', array(
        'label'   => __('WhatsApp číslo (bez +)', 'tepovac-rental'),
        'section' => 'tepovac_contact',
        'type'    => 'text',
    ));
    
    // Hero Section
    $wp_customize->add_section('tepovac_hero', array(
        'title'    => __('Hero sekcia', 'tepovac-rental'),
        'priority' => 35,
    ));
    
    // Hero Background Image
    $wp_customize->add_setting('tepovac_hero_image', array(
        'default'           => '',
        'sanitize_callback' => 'esc_url_raw',
    ));
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'tepovac_hero_image', array(
        'label'   => __('Hero obrázok na pozadí', 'tepovac-rental'),
        'section' => 'tepovac_hero',
    )));
}
add_action('customize_register', 'tepovac_customize_register');

// Helper function to get theme option
function tepovac_get_option($option, $default = '') {
    return get_theme_mod($option, $default);
}

// Disable Gutenberg for front page
function tepovac_disable_gutenberg($use_block_editor, $post) {
    if ($post->post_type === 'page' && get_option('page_on_front') == $post->ID) {
        return false;
    }
    return $use_block_editor;
}
add_filter('use_block_editor_for_post', 'tepovac_disable_gutenberg', 10, 2);
