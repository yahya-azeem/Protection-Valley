Method: dual-agent (A: f3d39393-e48c-4dfc-bbfc-3eae462d21c6 · B: a0384fcc-0696-40d3-a433-265ac8f5c630)

# Design Critique: Home.svelte

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Carousel auto-slides/teleports without page indicators; no loading feedback on page transition. |
| 2 | Match System / Real World | 3 | Uses standard terminology and navigation patterns, though brand descriptions are brief. |
| 3 | User Control and Freedom | 2 | Carousel cannot be paused on mobile/touch screens; no manual indicator navigation. |
| 4 | Consistency and Standards | 2 | Custom button styles (`btn-primary`) are bypassed in favor of raw styling on brand cards. |
| 5 | Error Prevention | 3 | Carousel auto-sliding on mobile risks accidental clicks. |
| 6 | Recognition Rather Than Recall | 3 | Triplicating the same 8 items in the carousel causes user confusion and repetition. |
| 7 | Flexibility and Efficiency | 1 | No keyboard navigation or accelerators; carousel lacks tabindex and focus control. |
| 8 | Aesthetic and Minimalist Design | 2 | Saturated AI tells (uppercase section eyebrows and hover-zoom image scale animation). |
| 9 | Error Recovery | 3 | No errors can occur on the page; fallback state not robust. |
| 10 | Help and Documentation | 2 | No search or inline documentation available. |
| **Total** | | **23/40** | **Acceptable (Significant improvements needed before users are happy)** |

## Anti-Patterns Verdict

**AI Slop Verdict:** FAILED

**LLM Assessment:**
The page exhibits multiple distinct AI slop tells. Most prominent are:
1. **Tiny uppercase tracked eyebrows**: Each section begins with a kicker (e.g., `ESTABLISHED QUALITY`, `CRAFTED LEGACY`) that has wide tracking and uppercase text. This is a common AI scaffolding tell.
2. **Child image hover scaling**: The "Shop by Brand" cards animate their internal `<img>` elements on hover using `group-hover:scale-110`. This is a Gemini-specific animation pattern that violates primary design system rules.
3. **Lazy loop triplication**: Repeating the first 8 products three times (`[...products, ...products, ...products]`) to build a looping carousel is a lazy structural tell that ignores proper infinite layout systems.

**Detector Findings:**
The static detector returned `[]` because `Home.svelte` is a nested component without standard `<html>` or `<body>` layout boundaries. However, manual audit rules flagged:
1. Banned image hover animation on `.group:hover .group-hover:scale-110` inside the brand grid.
2. Banned kickers/eyebrows in headers (`ESTABLISHED QUALITY` and `CRAFTED LEGACY`).
3. Uniform, monotonous spacing (`py-24` on all major sections).
4. Contrast hazard during image overlay opacity transition (`opacity-50` -> `opacity-70`).

## Overall Impression
The interface has a strong dark foundation ("OLED Ironworks" design system) and beautiful typography matching the premium branding. However, it suffers from standard AI scaffolding anti-patterns, accessible navigation traps, and disorienting auto-slide behavior that prevents it from feeling like a truly high-end product.

## What's Working
1. **Rich OLED Aesthetic:** The choice of absolute black (`#000000`/`#0A0A0A`) with elegant serif headlines (`Fraunces`) conveys a rugged, high-quality, professional craftsman tone.
2. **Clear Layout Structure:** The stack (Hero -> Carousel -> Brand Collections) is logical, clean, and highlights product offerings directly.

## Priority Issues
1. **[P0] Mobile Auto-Scroll Hijack**
   - *Why it matters*: The carousel auto-scrolls every 5 seconds. On touchscreens, there is no mouse hover (`mouseenter` / `mouseleave`) to pause it, meaning the content shifts while users are reading or attempting to tap, causing high frustration.
   - *Fix*: Disable the automatic scrolling interval on mobile/tablet user agents, or implement swipe/touch listeners that clear the interval.
2. **[P1] Gemini-Specific Defect: Image Hover Zoom**
   - *Why it matters*: The brand button cards trigger a `group-hover:scale-110` animation on the background image. This violates the primary design system guidelines ("Don't apply any hover scale or rotate animation to images") and reads as an AI tell.
   - *Fix*: Remove the hover scale transition from the images. Animate the card borders or background glow instead.
3. **[P1] Horizontal Carousel Content Triplication**
   - *Why it matters*: Multiplying the first 8 products 3 times to build a 24-item list confuses the user with redundant, repeating signature products.
   - *Fix*: Use a non-looping layout that ends naturally, or implement dynamic DOM duplication only when reaching scroll limits.
4. **[P2] Accessible Keyboard Navigation Gaps**
   - *Why it matters*: The carousel has no tabindex or focus indicators, preventing keyboard-only users from scrolling it.
   - *Fix*: Add `tabindex="0"` to the carousel container and style custom keyboard focus outlines.

## Persona Red Flags

### Jordan (First-Timer)
- **Auto-Slide Distraction**: Jordan is trying to read the first product card when the carousel shifts, pulling it out of view. Jordan gets disoriented and abandons.
- **Brand Context Gap**: Clicking "Western Heritage" immediately takes Jordan to the catalog with no prior explanation of what makes this collection unique.

### Casey (Distracted Mobile User)
- **Tapping Misclicks**: As Casey goes to tap a product card on a bumpy train ride, the carousel auto-scrolls, causing Casey to click the wrong product card.
- **Large Touch Targets**: The brand buttons are massive (`h-[350px]`) and stacked vertically, requiring Casey to scroll through screens of layout just to pass the section.

### Riley (Stress Tester)
- **Seamless Teleportation Glitch**: Riley swipes back and forth rapidly, causing the teleportation code to jump the scroll position instantly, creating noticeable layout stutters.
- **Empty State Loop**: If the database returns 0 products, the loop width is 0, causing `singleSetWidth = 0` and dividing by zero or entering an infinite layout loop.

## Minor Observations
- The `gap-4 md:gap-4` class contains redundant duplicate parameters.
- Redundant Svelte auto-slide effect triggers on every render if state is updated elsewhere.

## Questions to Consider
- What if the carousel had pagination dots or count markers so users had a visual map of the signature items?
- Should the "Shop by Brand" cards be semantic links (`<a>`) instead of `<button>` tags wrapped around large layout blocks?
