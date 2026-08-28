---
name: Kinetic Ledger
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '450'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding-desktop: 40px
  container-padding-mobile: 16px
  gutter: 16px
---

## Brand & Style

The design system is engineered for efficiency, clarity, and momentum. It targets students and young professionals who need to manage high-volume job applications without cognitive overhead. 

The aesthetic sits at the intersection of **Minimalism** and **Modern Corporate**, drawing inspiration from high-performance developer tools. The interface prioritizes content over chrome, utilizing generous whitespace and a restricted color palette to ensure that critical status updates and upcoming interviews remain the focal point. The emotional response is one of organized calm—transforming a chaotic job search into a structured, manageable workflow.

## Colors

The palette is anchored by a high-energy Indigo primary, used sparingly for calls to action and active states. 

- **Light Mode:** Uses a pure white base (`#FFFFFF`) with off-white surfaces (`#F8FAFC`) to define sections. Borders are kept subtle to maintain the minimal aesthetic.
- **Dark Mode:** Employs a deep charcoal/black base (`#09090B`) to reduce eye strain, with slightly lifted surfaces (`#18181B`) for card elements.
- **Semantic Status:** These colors are inviolable. They must be used consistently for badges, progress rings, and indicators to provide instant scannability of application stages.

## Typography

The design system utilizes **Inter** for all UI elements to ensure maximum legibility across pixel densities. 

Visual hierarchy is established through weight and tight letter-spacing on larger headings. For data-heavy views or metadata (like date applied), a secondary monospace font (JetBrains Mono) can be used to provide a technical, precise feel. On mobile devices, display sizes are scaled down to prevent awkward text wrapping, maintaining a compact and readable information density.

## Layout & Spacing

This design system is built on an **8px linear grid**. All dimensions, padding, and margins must be multiples of 8 (with 4px used only for tight internal component spacing).

- **Desktop (1440px):** Utilizes a 12-column fluid grid. The sidebar is fixed at 280px, while the main content area expands. Cards and data tables follow a modular "bento" layout.
- **Mobile (375px):** Shifts to a single-column layout. The sidebar transforms into a bottom navigation bar or a slide-out drawer to maximize vertical workspace.
- **Rhythm:** Generous 32px or 40px gaps between major sections ensure the minimal aesthetic doesn't feel cramped.

## Elevation & Depth

Depth is communicated through **low-contrast outlines** combined with **subtle ambient shadows**.

In both light and dark modes, surfaces use a 1px border (`#E2E8F0` light / `#27272A` dark) to define boundaries. Shadows are extremely soft (blur radius 12-24px) and low-opacity (4-8%), intended to lift cards slightly off the background rather than create a heavy 3D effect. In dark mode, depth is primarily achieved through tonal shifts (darker background, lighter surface) rather than shadows, which become less visible.

## Shapes

The shape language is "Soft-Modern." Most containers, cards, and input fields use an **8px (0.5rem)** corner radius. 

- **Small elements** (chips/badges) use a 4px or fully rounded pill shape depending on the context. 
- **Large elements** (modals/main cards) can use the `rounded-xl` (1.5rem) setting to create a more friendly, approachable container for high-level data.

## Components

### Status Badges
Badges use a "Tinted" style: a 10% opacity background of the status color with a 100% opacity text color. They feature a `rounded-full` (pill) shape and `label-caps` typography.

### Stat Cards
Stat cards (e.g., "Total Applications") feature a 1px border, `headline-md` for the number, and `label-caps` for the description. They should include a subtle trend indicator (icon + percentage) in the corner.

### Input Fields
Inputs use a white/deep-charcoal background with a 1px border. On focus, the border transitions to Primary Indigo with a soft 2px outer glow. Labels sit above the field in `body-sm` semibold.

### Sidebar
The sidebar uses a slightly different background color (`surface`) to differentiate navigation from the work area. Nav items feature a 4px rounded active state indicator and use `body-sm` for text.

### Action Buttons
- **Primary:** Solid Indigo background, white text, 8px rounded.
- **Secondary:** Transparent background, 1px border, `body-sm` medium text.
- **Ghost:** No background or border until hover; used for utility actions in lists.