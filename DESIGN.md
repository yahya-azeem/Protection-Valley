---
name: Protection Valley Design System
description: OLED Ironworks - High-contrast rugged industrial workgear storefront
colors:
  primary: "#D4AF37"
  gold-light: "#F5E0A3"
  gold-dark: "#A67C00"
  secondary: "#0066CC"
  background: "#000000"
  surface: "#0A0A0A"
  surface-elevated: "#111111"
  text-primary: "#FFFFFF"
  text-muted: "#A1A1AA"
  border: "#1F1F1F"
typography:
  display:
    fontFamily: "Fraunces, Georgia, serif"
    fontSize: "clamp(2.5rem, 7vw, 4.5rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  container: "1280px"
  gutter: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.background}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "14px 24px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: Protection Valley

## 1. Overview

**Creative North Star: "OLED Ironworks"**

Protection Valley uses a high-contrast absolute black OLED design combined with a rugged, premium industrial aesthetic inspired by heritage workgear and heavy industry. Spacing is tight and structured, and typography pairs classical serif weights with robust sans-serif details.

The system explicitly rejects soft pastel colors, rounded card layouts, and low-contrast grey text in order to mirror the rugged strength of the professional tools and leather gear it showcases.

### Key Characteristics:
- **Absolute Contrast**: True `#000000` background with sharp, clean white text and gold highlight lines.
- **Tactile Shapes**: Low border radii, sharp edges, and solid, heavy block elements.
- **Spec-Driven Hierarchy**: Industrial detail focus prioritizing model numbers, SKUs, and material labels.

---

## 2. Colors

A minimal, high-impact palette featuring deep blacks, raw metal gold, and technical blue highlights.

### Primary
- **Refined Gold** (`#D4AF37` / oklch(76% 0.16 84)): Used for primary actions, highlight accents, badges, and high-visibility status tags. Represents raw durability and craftsmanship.

### Secondary
- **Klein Blue** (`#0066CC` / oklch(48% 0.22 262)): Used specifically for technical specs, variant SKUs, and mechanical details to provide a distinct contrast against gold.

### Neutral
- **OLED Black** (`#000000`): The base screen background. Reduces power consumption on mobile devices and provides infinite contrast.
- **Onyx Surface** (`#0A0A0A`): Used for product cards, page sections, and tables to establish containment without using borders.
- **Elevated Surface** (`#111111`): Used for dropdowns, modals, and tooltips.
- **Pure White** (`#FFFFFF`): Primary typography color ensuring optimal readability.
- **Muted Steel** (`#A1A1AA`): Secondary text, labels, and borders.

### Named Rules
**The Gold Restraint Rule.** The primary gold accent is limited to ≤10% of any given page surface. Its rarity and contrast are the key to its premium feel.

---

## 3. Typography

**Display Font:** Fraunces (with serif fallbacks)
**Body Font:** Inter (with system-ui sans-serif fallbacks)

### Character
Display titles are rendered in the elegant, heavy weights of Fraunces with tight letter spacing for an editorial look, while body copy and product specs use the clean, legible lines of Inter.

### Hierarchy
- **Display** (300, clamp(2.5rem, 7vw, 4.5rem), 1.1): Used for main page titles, headers, and hero headlines.
- **Headline** (400, 2rem, 1.2): Used for sections and product titles.
- **Title** (600, 1.25rem, 1.3): Used for cards, variant sections, and table heads.
- **Body** (400, 1rem, 1.5): Main content body text, capped at 65–75ch for readable flow.
- **Label** (900, 0.75rem, uppercase, 0.2em letter-spacing): Used for eyebrows, SKUs, buttons, and short technical details.

---

## 4. Elevation

The design system is flat by default with depth represented by sharp tonal layers. Ambient shadows are kept to a minimum, and glowing accents are reserved for hover responses.

### Shadow Vocabulary
- **Gold Ambient Glow** (`0 4px 24px rgba(212, 175, 55, 0.12)`): Used specifically as a soft glow behind active buttons and focused cards.

### Named Rules
**The Layering Rule.** Depth is created through background tone changes (Black `#000000` -> Onyx `#0A0A0A` -> Elevated `#111111`) rather than blurred drop shadows.

---

## 5. Components

### Buttons
- **Shape:** Sharp corners with minimal radius (2px).
- **Primary:** Refined Gold background, black text, uppercase label with wide spacing.
- **Secondary:** Transparent background, white border, white text, uppercase label.
- **Hover / Focus:** Primary transitions smoothly to Gold Light (`#F5E0A3`) with a soft gold shadow; secondary transitions to a solid white background with black text.

### Cards / Containers
- **Corner Style:** Sharp corners (2px).
- **Background:** Onyx Surface (`#0A0A0A`) with a thin white/5 border.
- **Shadow Strategy:** Flat at rest; subtle translate-y and gold glow on hover.
- **Internal Padding:** 24px (`p-6`).

### Inputs / Fields
- **Style:** Onyx Surface background with a 1px border.
- **Focus:** 1px primary gold border with no outline.

---

## 6. Do's and Don'ts

### Do:
- **Do** wrap code elements (SKUs, sizes) in technical monospace typography using Klein Blue for emphasis.
- **Do** maintain a strict 4.5:1 contrast ratio by pairing Muted Steel only with pure white highlights.
- **Do** balance heavy serif display fonts with clean, spacious sans-serif body text.

### Don't:
- **Don't** use border-left or border-right accent lines (side-stripes) on callout boxes or product alerts.
- **Don't** apply any hover scale or rotate animation to images within product cards.
- **Don't** use warm cream, sand, or beige backgrounds. The interface must remain OLED black.
