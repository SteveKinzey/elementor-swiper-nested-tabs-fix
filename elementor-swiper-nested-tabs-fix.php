<?php
/**
 * Plugin Name: Elementor Nested Tabs Swiper Drag Fix
 * Plugin URI:  https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix
 * Description: Restores drag/swipe on Swiper carousels inside Elementor Nested Tabs after a tab switch (Elementor 4.2.0 – 4.3.4 regression). Self-disables on newer versions.
 * Version:     1.0.1
 * Author:      Steve Kinzey / SK America
 * Author URI:  https://sk-america.com
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: elementor-swiper-nested-tabs-fix
 * Requires at least: 5.0
 * Requires PHP: 7.4
 * Elementor tested up to: 4.3.4
 * Elementor Pro tested up to: 4.3.2
 */

namespace ElementorSwiperNestedTabsFix;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

final class Plugin {

	const VERSION = '1.0.1';

	private static $instance = null;

	public static function instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	private function __construct() {
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue' ) );
		add_action( 'admin_notices', array( $this, 'elementor_missing_notice' ) );
	}

	public function enqueue() {
		if ( ! did_action( 'elementor/loaded' ) ) {
			return;
		}
		wp_enqueue_script(
			'elementor-swiper-nested-tabs-fix',
			plugin_dir_url( __FILE__ ) . 'assets/js/fix.js',
			array( 'jquery', 'elementor-frontend' ),
			self::VERSION,
			true
		);
	}

	public function elementor_missing_notice() {
		if ( did_action( 'elementor/loaded' ) || ! current_user_can( 'activate_plugins' ) ) {
			return;
		}
		printf(
			'<div class="notice notice-warning"><p><strong>%s</strong> %s</p></div>',
			esc_html__( 'Elementor Nested Tabs Swiper Drag Fix:', 'elementor-swiper-nested-tabs-fix' ),
			esc_html__( 'Elementor is not active, so this plugin is doing nothing.', 'elementor-swiper-nested-tabs-fix' )
		);
	}
}

Plugin::instance();
