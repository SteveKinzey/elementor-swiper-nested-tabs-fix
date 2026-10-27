# Elementor Nested Tabs Swiper Drag Fix

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![WordPress 5.0+](https://img.shields.io/badge/WordPress-5.0%2B-blue.svg)
![PHP 7.4+](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)
![Elementor 4.2.0–4.3.4](https://img.shields.io/badge/Elementor-4.2.0%E2%80%934.3.4-orange.svg)

Restores drag/swipe on Swiper-based carousels (Loop Carousel, Image Carousel, Nested Carousel, etc.) placed inside **Elementor Nested Tabs**. Arrows and pagination keep working after a tab switch; drag does not. This plugin fixes that.

**Status (2026-10-27):** still unfixed upstream as of Elementor Core 4.3.4 / Pro 4.3.2. Regression was introduced between Core 4.1.5 and 4.2.0.

## The bug

Swiper binds its touch/pointer drag listeners once at init to a stored element reference. Nested Tabs' show/hide cycle leaves those bindings stale on every non-initial panel. `swiper.update()` recalculates layout but never rebinds events, so it can't repair it.

## The fix

On `elementor/nested-tabs/activate`, for each `.swiper` in the activated panel:

1. `detachEvents()` → `attachEvents()` → `update()` (cheap, usually enough)
2. Fallback: `destroy(true, false)` and re-init with `observer: true` / `observeParents: true`

A version guard (`MAX_BROKEN_VERSION` in `assets/js/fix.js`) makes the plugin a no-op on Elementor versions newer than the last one confirmed broken, so it retires itself once an official fix lands.

## Install

**Zip (recommended)**
1. Download the latest zip from [Releases](https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix/releases)
2. WordPress → Plugins → Upload Plugin → Activate

**Git**
```bash
cd wp-content/plugins
git clone https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix.git
```
Then activate in WordPress.

**No plugin? Use the snippet.** Paste `assets/js/fix.js` wrapped in `<script>` tags into Elementor → Custom Code, Location `</body>` End, Display Conditions: Entire Site.

**Purge page/JS cache before testing.** A stale bundle is the #1 reason this appears not to work.

## Verify

1. Page with Nested Tabs, a Swiper carousel in at least two panels
2. Switch to tab 2 → drag the carousel → it moves
3. Without the plugin, step 2 fails; arrows/dots still work

## Compatibility

| | Tested |
|---|---|
| Elementor Core | 4.2.0 – 4.3.4 |
| Elementor Pro | 4.2.0 – 4.3.2 |
| WordPress | 5.0+ |
| PHP | 7.4+ |
| Swiper | 8.x, 9.x |

## Maintenance

When a new Elementor release ships, re-test. Still broken → bump `MAX_BROKEN_VERSION` and cut a release. Fixed → add a deprecation note here; the guard already disables the plugin on that version.

Known caveat: Loop Carousel is a Pro widget but the guard reads the Core version. A one-release overlap is harmless (the repair is idempotent).

## Contributing

Open an [issue](https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix/issues) with WordPress, Elementor Core and Pro versions, steps, and a console screenshot if there are errors.

## License

MIT — see [LICENSE](LICENSE).

Not affiliated with Elementor. Community workaround for an upstream regression.
