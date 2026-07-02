---
name: Nexus Growth Light
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#3c4a3d'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#6c7b6b'
  outline-variant: '#bbcbb9'
  surface-tint: '#006d2f'
  primary: '#006d2f'
  on-primary: '#ffffff'
  primary-container: '#25d366'
  on-primary-container: '#005523'
  inverse-primary: '#3de273'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#8cf1e1'
  on-secondary-container: '#006f64'
  tertiary: '#00668a'
  on-tertiary: '#ffffff'
  tertiary-container: '#48c4ff'
  on-tertiary-container: '#004f6c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#66ff8e'
  primary-fixed-dim: '#3de273'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005322'
  secondary-fixed: '#8ff4e3'
  secondary-fixed-dim: '#72d8c8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#c4e7ff'
  tertiary-fixed-dim: '#7cd0ff'
  on-tertiary-fixed: '#001e2c'
  on-tertiary-fixed-variant: '#004c69'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
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
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
---

## Brand & Style
The design system focuses on a high-clarity, professional SaaS aesthetic. It is built for efficiency, growth, and transparency. By transitioning to a light theme, the brand emphasizes airiness and accessibility while maintaining its "high-performance" DNA.

The style is **Modern Corporate Minimalism**. It leverages heavy whitespace, crisp edges, and a focused color palette to reduce cognitive load. The emotional response should be one of reliability and momentum—a tool that feels invisible yet powerful, allowing data and actions to take center stage.

## Colors
The palette is anchored by a vibrant WhatsApp Green, symbolizing growth and active communication. In this light mode configuration, the primary color is used sparingly for key actions and success states to maintain a professional, rather than overwhelming, presence.

- **Primary:** #25D366 (Action-oriented, growth, connectivity)
- **Secondary:** #128C7E (Deep teal for hover states and subtle emphasis)
- **Neutral/Text:** Deep Charcoal (#121212) provides maximum contrast against the white background for peak readability.
- **Surface:** Pure White (#FFFFFF) is used for the main canvas, while Light Gray (#F8F9FA) differentiates sidebar elements and secondary containers.

## Typography
This design system utilizes **Hanken Grotesk** across all levels to ensure a unified, modern, and sharp technical feel. The typeface’s geometry is balanced with excellent legibility, making it ideal for data-dense SaaS environments.

Headlines use tighter letter-spacing and heavier weights to create a strong visual anchor. Body text is set with generous line-height to facilitate long-form reading and data scanning. Labels and small captions utilize medium-to-semibold weights to ensure they remain crisp even at reduced sizes.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for desktop. To maintain the "airy" feel, the system uses a base-8 spacing scale, prioritizing generous margins and gutters to prevent information density from becoming overwhelming.

- **Desktop (1440px+):** 12 columns, 24px gutters, 48px side margins.
- **Tablet (768px - 1439px):** 8 columns, 20px gutters, 32px side margins.
- **Mobile (Under 768px):** 4 columns, 16px gutters, 16px side margins.

Content containers should use vertical rhythm based on the `md` (24px) unit to create a predictable flow of information.

## Elevation & Depth
In this light-themed design system, depth is communicated through **Tonal Layers** and **Soft Ambient Shadows**. 

1.  **Level 0 (Base):** #FFFFFF. The primary background.
2.  **Level 1 (Surface):** #F8F9FA. Used for sidebars, headers, or inset cards to create a subtle distinction from the base.
3.  **Level 2 (Floating):** White cards with a very soft, diffused shadow (`y: 4, blur: 12, color: rgba(0,0,0,0.05)`). This is used for interactive elements like dropdowns, modals, and primary dashboard widgets.
4.  **Level 3 (Overlays):** Used for modals. Employs a backdrop blur (12px) with a semi-transparent light overlay (`rgba(255,255,255,0.8)`) to maintain focus.

Avoid heavy borders; use subtle 1px lines in #E9ECEF for structural separation.

## Shapes
The design system adopts a **Rounded** shape language (`0.5rem` or `8px` base radius). This specific radius strikes a balance between the precision of a sharp-edged corporate tool and the approachability of a modern startup.

- **Buttons & Inputs:** 8px (Rounded)
- **Cards & Sections:** 16px (Rounded-lg)
- **Modals & Large Containers:** 24px (Rounded-xl)
- **Chips/Badges:** Full pill-shape for maximum distinction from buttons.

## Components
- **Buttons:** Primary buttons use the #25D366 background with white text. Secondary buttons use a transparent background with a #E9ECEF border and charcoal text.
- **Input Fields:** Use a #F8F9FA background with a subtle 1px border (#E9ECEF). On focus, the border transitions to #25D366 with a soft green glow (2px spread).
- **Cards:** Elevate cards slightly with Level 2 shadows. Content within cards should have 24px internal padding.
- **Chips:** Small, pill-shaped indicators. Use light green tints (`#E9FBEF`) with deep green text for success statuses.
- **Lists:** Use 1px horizontal dividers (#E9ECEF). Interactive list items should have a #F8F9FA hover state with a 4px primary-colored vertical accent on the left edge.
- **Checkboxes & Radios:** When active, these should be solid #25D366.
- **Navigation:** The sidebar should utilize the #F8F9FA surface color to clearly separate navigation from the main workspace. Active nav items use a bold weight and primary color icon.