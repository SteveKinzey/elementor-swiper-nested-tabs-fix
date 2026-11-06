# Elementor Swiper Nested Tabs Fix

A focused compatibility project for troubleshooting and correcting Swiper slider behavior inside nested Elementor tabs.

## Overview

Elementor layouts can combine tabbed content with carousels powered by [Swiper](https://swiperjs.com/). When a slider is initialized while its parent tab is hidden, its container dimensions may not yet be measurable. Depending on the Elementor and Swiper versions and the widget configuration, this can produce incorrect slide widths, clipped content, misplaced navigation, or a carousel that does not respond correctly until the layout changes.

This repository is intended to house a targeted fix for that class of issue, without modifying Elementor core files.

> **Project status:** The fix's implementation, packaging, and supported versions have not yet been documented in this repository. The behavior described below is the intended scope, not a claim of verified functionality.

## Problem symptoms

Common symptoms worth investigating include:

- A carousel looks correct in the first visible tab but breaks in another tab.
- Slides are too wide, too narrow, overlapping, or partially hidden after switching tabs.
- Navigation or pagination appears out of sync with the active slides.
- The carousel corrects itself only after resizing the window.
- Nested tabs work in the editor but behave differently on the published page.

These symptoms can also result from CSS, caching, script optimization, or conflicting plugins. They are not, by themselves, proof of a Swiper initialization problem.

## Intended approach

A robust fix should:

1. Detect when the relevant Elementor tab becomes visible.
2. Locate Swiper instances associated with sliders inside that tab.
3. Wait until the tab's content can be measured.
4. Recalculate the affected instance's size and layout through supported Swiper APIs.
5. Avoid repeatedly initializing sliders, affecting unrelated instances, or introducing duplicate event listeners.

When nested tabs are involved, the implementation must account for both parent and child visibility changes.

## Installation

Installation instructions will be added once the implementation and its distribution format have been confirmed.

Do **not** assume this repository is a ready-to-install WordPress plugin or paste an unreviewed script into a production website.

For development, clone the repository:

```bash
git clone https://github.com/SteveKinzey/elementor-swiper-nested-tabs-fix.git
cd elementor-swiper-nested-tabs-fix
```

Review the available files and commits before deploying any code.

## Verification checklist

Test against the specific Elementor, Elementor Pro (if installed), WordPress, and Swiper versions used by the target site.

- [ ] The carousel displays correctly in the initially visible tab.
- [ ] Switching between tabs preserves correct slide sizing and positioning.
- [ ] Nested parent/child tab changes work in both directions.
- [ ] Navigation, pagination, autoplay, and breakpoints behave as configured.
- [ ] Repeated tab changes do not create duplicate instances or listeners.
- [ ] Layout works on desktop, tablet, and mobile.
- [ ] The browser console shows no new JavaScript errors.
- [ ] Unrelated Elementor sliders remain unaffected.
- [ ] Behavior is rechecked with page caching and script optimization enabled.

## Troubleshooting

**Slider only fixes itself after a browser resize:** Investigate whether Swiper is calculating its dimensions before the tab becomes visible.

**Problem occurs only on the live site:** Compare editor and front-end script loading, cache output, deferred JavaScript, and optimization settings.

**Some sliders work and others do not:** Check each widget's markup, initialization timing, and the active tab hierarchy.

**A fix stops working after an update:** Check Elementor's rendered markup and the Swiper API available in the installed release before changing selectors or event handling.

## Compatibility

Compatibility has **not yet been verified** against specific WordPress, Elementor, Elementor Pro, or Swiper releases. Record tested versions and known limitations as implementation and testing progress.

## Contributing

Issues and pull requests are welcome. For reproducible bug reports, include:

- WordPress, Elementor, Elementor Pro, and browser versions.
- The slider widget and nested tab structure being used.
- Expected and actual behavior.
- Steps to reproduce the issue.
- Relevant console errors and a minimal reproduction, if available.

Avoid including credentials, personal information, or private site data.

## Maintainer

**Stephen J. Kinzey, Ph.D.**  
[SK America LLC](https://sk-america.com/)  
[GitHub: @SteveKinzey](https://github.com/SteveKinzey)

## License

No license has been declared in this repository. A license should be added before representing the code as open-source or specifying reuse rights.

---

*Elementor and Swiper are trademarks or product names of their respective owners. This is an independent project and is not an official Elementor or Swiper release.*
