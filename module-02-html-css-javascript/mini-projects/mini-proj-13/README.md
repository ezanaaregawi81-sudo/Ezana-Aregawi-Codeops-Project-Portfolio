# Bole Cafe - Business Profile Card

A responsive, single-page business profile card built for **Bole Cafe**, a fictional coffee and pastry shop located in Addis Ababa, Ethiopia.

##  CSS Techniques Used (Day 13 Foundations)

1. **CSS Variables (`:root`):**
   - Centralized palette with HSL colors and a consistent spacing scale (`--space-xs` through `--space-xl`).
   - Accessed using `var()` across structural and typography styles.

2. **Global Resets & Box Model:**
   - Universal selector `* { box-sizing: border-box; }` applied to ensure predictable element sizing.
   - Controlled box layer dimensions utilizing `padding`, `margin`, `border`, and `border-radius`.

3. **Color Systems & HSL Lightness Hover:**
   - Colors formatted in HSL (`hsl(hue, saturation, lightness)`).
   - `:hover` effect on the Contact button modifies **only** the lightness value (33% to 45%).

4. **Typography & Hierarchy:**
   - Implemented `rem` sizing relative to root font size.
   - Configured line-height to `1.6` for readable body text.
   - Web font imported directly from Google Fonts (`Inter`).

5. **Selectors & Combinators:**
   - Structured styling using classes (`.card`, `.btn`).
   - Used direct child combinators (`.info-list > li`) to handle list item styling safely.

6. **Pseudo-classes & Pseudo-elements:**
   - Pseudo-classes: Used `:hover` for interactive button states and maintained accessibility with explicit `:focus` outlines.
   - Pseudo-elements: Added a decorative accent line before `.card-header` using `::before` and an icon accent using `::after`.