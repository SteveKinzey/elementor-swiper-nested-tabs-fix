/**
 * Elementor Nested Tabs + Swiper Carousel Drag Fix
 *
 * Root cause: Swiper binds touch/pointer drag listeners once at init to a
 * stored element reference. When Nested Tabs switches panels, the show/hide
 * cycle leaves those bindings stale. Arrows and pagination use click handlers
 * on re-queried elements and survive; drag does not. swiper.update() only
 * recalculates layout and never rebinds events, so it cannot repair this.
 *
 * Fix: on `elementor/nested-tabs/activate`, rebind Swiper events for every
 * carousel in the activated panel. Falls back to destroy + re-init with
 * observers enabled if the cheap rebind fails.
 *
 * Version guard: runs on Elementor <= MAX_BROKEN_VERSION, dormant on newer.
 * Still broken as of Core 4.3.4 / Pro 4.3.2 (2026-10-27).
 */
(function () {
	'use strict';

	// Last Elementor Core version confirmed still broken. Bump on each
	// re-test that fails; drop the plugin once an official fix ships.
	var MAX_BROKEN_VERSION = '4.3.4';

	function parseVersion( v ) {
		return String( v || '' ).split( '.' ).map( function ( n ) {
			return parseInt( n, 10 ) || 0;
		} );
	}

	function isAtMost( a, b ) {
		var av = parseVersion( a ), bv = parseVersion( b );
		for ( var i = 0; i < 3; i++ ) {
			if ( ( av[ i ] || 0 ) < ( bv[ i ] || 0 ) ) return true;
			if ( ( av[ i ] || 0 ) > ( bv[ i ] || 0 ) ) return false;
		}
		return true;
	}

	function getElementorVersion() {
		if ( window.elementorFrontendConfig && window.elementorFrontendConfig.version ) {
			return window.elementorFrontendConfig.version;
		}
		if ( window.elementorFrontend && window.elementorFrontend.config ) {
			return window.elementorFrontend.config.version;
		}
		return null;
	}

	function reinitSwiper( el ) {
		var swiper = el.swiper;
		if ( ! swiper || swiper.destroyed ) return;

		// Attempt 1: rebind the stale touch/drag listeners.
		try {
			swiper.detachEvents();
			swiper.attachEvents();
			swiper.update();
			if ( swiper.params && swiper.params.allowTouchMove !== false ) {
				return;
			}
		} catch ( err ) {
			// fall through to full re-init
		}

		// Attempt 2: full destroy + re-init with observers so Swiper
		// self-heals on future visibility/DOM changes.
		try {
			var params = Object.assign( {}, swiper.params, {
				observer: true,
				observeParents: true,
			} );
			swiper.destroy( true, false );
			new Swiper( el, params );
		} catch ( err ) {
			if ( window.console && console.warn ) {
				console.warn( '[nested-tabs carousel fix] re-init failed:', err );
			}
		}
	}

	function fixSwipersIn( container ) {
		if ( ! container ) return;
		var node = container instanceof Element ? container : ( container[ 0 ] || null );
		if ( ! node ) return;
		node.querySelectorAll( '.swiper' ).forEach( reinitSwiper );
	}

	function boot() {
		var version = getElementorVersion();

		// Only run on known-broken versions. If detection fails, run anyway —
		// the repair is idempotent and harmless.
		if ( version && ! isAtMost( version, MAX_BROKEN_VERSION ) ) {
			return;
		}

		jQuery( document ).on( 'elementor/nested-tabs/activate', function ( e, content ) {
			// Short delay lets the panel finish becoming visible so Swiper
			// measures real dimensions instead of a hidden container.
			setTimeout( function () {
				fixSwipersIn( content );
			}, 100 );
		} );
	}

	if ( window.jQuery ) {
		jQuery( window ).on( 'elementor/frontend/init', boot );
	} else {
		document.addEventListener( 'DOMContentLoaded', function () {
			if ( window.jQuery ) {
				jQuery( window ).on( 'elementor/frontend/init', boot );
			}
		} );
	}
})();
