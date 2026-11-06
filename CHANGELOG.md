# Changelog

## [1.0.1] – 2026-10-27
- Upstream issue filed: [elementor/elementor#38057](https://github.com/elementor/elementor/issues/38057).
- Bumped `MAX_BROKEN_VERSION` to 4.3.4 — re-checked Core 4.2.1 → 4.3.4 and Pro 4.2.1 → 4.3.2 changelogs; no upstream fix shipped. The 1.0.0 guard (4.2.0) left the plugin dormant on every site updated past July 28.
- Script now depends on `elementor-frontend` so it never loads before Elementor's own bundle.
- Admin notice only shown to users who can activate plugins.

## [1.0.0] – 2026-09-17
- Initial release. Rebinds Swiper events on `elementor/nested-tabs/activate`; destroy/re-init fallback with observers; version guard at 4.2.0.
