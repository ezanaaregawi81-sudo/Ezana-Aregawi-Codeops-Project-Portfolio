# Business Profile Card - Bole Specialty Coffee

A single, self-contained, responsive profile card component built for a fictional Addis Ababa business as part of the CodeOps CSS Foundations module (Day 13).

## 🏢 Business Overview
* **Business Name:** Bole Specialty Coffee
* **Location:** Bole Road, Addis Ababa, Ethiopia
* **Services:** Specialty single-origin roasts, coffee ceremony, workspace area, TeleBirr payments.

## 🛠️ CSS Concepts & Techniques Used
1. **CSS Custom Properties (`:root` Variables):**
   - Centralized color palette using `hsl()` and `hsla()` formulas.
   - Consistent spacing scale (`--space-xs` through `--space-xl`).
   - Global font-stack and radius tokens.

2. **Box Model & Reset:**
   - Universal `box-sizing: border-box` declaration across `*`, `*::before`, and `*::after`.
   - Card dimensions managed using `max-width`, `padding`, `border`, and `border-radius`.

3. **Typography & Hierarchy:**
   - Imported external web font (`Inter`) from Google Fonts.
   - Clear size and weight distinctions between title (`1.5rem`), body (`0.95rem`), and tagline (`0.875rem`).
   - Unitless line-height scaling (`1.6`).

4. **Interactive State & HSL Lightness Hover:**
   - Primary button styled with `:hover` state modifying only the lightness channel (`hsl(212, 68%, 33%)` -> `hsl(212, 68%, 45%)`).
   - Accessible `:focus` state preserved with focus outline offset.

5. **Pseudo-Elements:**
   - Utilized `::before` pseudo-element on the card wrapper to create a top accent bar without extra HTML clutter.