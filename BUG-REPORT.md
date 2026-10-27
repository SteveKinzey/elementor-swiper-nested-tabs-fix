# Upstream bug report (paste into https://github.com/elementor/elementor/issues/new?template=bug_report.yml)

**Title:** Swiper carousels inside Nested Tabs lose drag/swipe after a tab switch (regression 4.1.5 → 4.2.0, still present in 4.3.4)

## Description
Any Swiper-based carousel (Loop Carousel, Image Carousel, Nested Carousel) placed inside a Nested Tabs panel stops responding to touch/pointer drag on every non-initial panel once the user has switched tabs. Previous/next arrows and pagination bullets keep working. `swiper.update()` does not restore drag.

## Steps to reproduce
1. New page, add a Nested Tabs widget with two tabs.
2. Put a Loop Carousel (or Image Carousel) in Tab 1 and another in Tab 2.
3. View on the frontend. Drag the carousel in Tab 1 — works.
4. Click Tab 2. Drag that carousel — nothing happens. Arrows/dots still work.
5. Click back to Tab 1 and drag — still works (it was the initial panel).

Reproduction is 100% consistent across desktop pointer drag and mobile touch.

## Expected
Drag works on every panel regardless of tab switching.

## Root cause (from investigation)
Swiper binds its touch/pointer listeners once at init to a stored reference of the touch target. The Nested Tabs show/hide cycle leaves those listeners stale (attached while the panel had no layout / to a detached reference). Arrows and pagination are click handlers on re-queried elements, so they survive. `update()` only recalculates sizes and positions and never rebinds events, which is why it doesn't help.

## Working workaround
On `elementor/nested-tabs/activate`, for each `.swiper` in the activated panel call `detachEvents()` + `attachEvents()` + `update()`, falling back to `destroy()` + re-init with `observer: true`. Packaged as a plugin with repro notes: https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix

Suggested upstream fix: have the Nested Tabs frontend handler rebind Swiper events (or initialize carousels lazily on first panel activation) rather than relying on `update()`.

## Environment
- Elementor Core: 4.2.0 (first seen) — still present on 4.3.4
- Elementor Pro: 4.2.0 — still present on 4.3.2
- Last known good: Core 4.1.5
- WordPress: 7.1
- Browsers: Chrome, Safari (desktop + iOS)
- Features: Container + Nested Elements active
- Theme / other plugins: reproduces on Hello theme with no other plugins
