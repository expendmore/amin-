---
name: Nexus Growth System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbcbb9'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#869584'
  outline-variant: '#3c4a3d'
  surface-tint: '#3de273'
  primary: '#4ff07f'
  on-primary: '#003915'
  primary-container: '#25d366'
  on-primary-container: '#005523'
  inverse-primary: '#006d2f'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#80e5d5'
  on-tertiary: '#003731'
  tertiary-container: '#63c9b9'
  on-tertiary-container: '#005249'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#66ff8e'
  primary-fixed-dim: '#3de273'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005322'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#8ff4e3'
  tertiary-fixed-dim: '#72d8c8'
  on-tertiary-fixed: '#00201c'
  on-tertiary-fixed-variant: '#005047'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-xs:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.1em
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
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is engineered for a high-performance WhatsApp Business API platform. It centers on a **Corporate Modern** aesthetic infused with **Glassmorphism** to reflect transparency, speed, and the fluid nature of real-time communication. 

The brand personality is authoritative yet innovative—balancing the established reliability of WhatsApp with the cutting-edge automation of a SaaS power tool. The interface must evoke a sense of "organized momentum," where complex business workflows feel effortless and scalable. Visuals are grounded in deep, ink-like backgrounds to provide a premium feel, while cyan and teal highlights act as kinetic energy, guiding the user toward growth and expansion.

## Colors

This design system utilizes a high-contrast dark theme to minimize eye strain during long periods of dashboard management and to make the brand's vibrant greens "pop."

- **Primary (#25D366):** Used for primary actions, success states, and growth indicators. It directly connects the product to the WhatsApp ecosystem.
- **Secondary (#00E5FF):** A digital cyan inspired by the logo's gradients. Used for automation-specific features, data visualizations, and active highlight states.
- **Tertiary (#128C7E):** A deep teal used for secondary buttons, subtle borders, and background accents to provide depth.
- **Neutral (#0A0A0A):** The foundation of the UI. Deep blacks and charcoal grays form the container system, ensuring the vibrant brand colors remain professional and legible.

## Typography

The typography strategy prioritizes precision and technical clarity.

- **Hanken Grotesk** is used for headlines to provide a sharp, modern, and high-tech feel. Its bold weights convey the "Expand" narrative effectively.
- **Inter** handles the heavy lifting for body copy and messaging interfaces, chosen for its exceptional legibility in SaaS environments.
- **Geist** is reserved for labels, metadata, and technical indicators (like API keys or message counts), reinforcing the developer-friendly and automated nature of the platform.

All typography should maintain high contrast against the dark background, using pure white for headers and off-white/gray for body text to manage hierarchy.

## Layout & Spacing

The design system employs a **Fluid Grid** model with a strict 8px baseline rhythm. This ensures that the interface feels "automated" and engineered rather than hand-drawn.

- **Desktop:** 12-column grid with a 24px gutter. Content is typically housed in "Cards" that span 4, 6, or 12 columns.
- **Tablet:** 8-column grid with a 16px gutter.
- **Mobile:** 4-column grid with a 16px margin. Vertical stacking is the default for all card components.

Sidebar navigation is fixed at 280px on desktop to provide a consistent anchor for the user’s journey, while the main dashboard area expands to fill the viewport.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Glassmorphism**. Shadows are used sparingly; instead, depth is created by making elements closer to the user lighter in color.

- **Level 0 (Background):** #0A0A0A. The lowest base.
- **Level 1 (Surfaces):** #161616. Used for primary dashboard panels.
- **Level 2 (Interactive):** #222222. Used for cards and input fields.
- **Glass Effects:** Overlays and modals use a background blur (20px) with a semi-transparent fill of the primary teal (8-12% opacity) to create a sophisticated, airy feel.
- **Borders:** Subtle 1px solid borders using #2A2A2A are preferred over shadows to maintain a clean, "pro" aesthetic.

## Shapes

The shape language reflects the "X" in the logo—dynamic but structured. 

A **Rounded (0.5rem)** standard is applied to most UI components to balance professional rigidity with the approachability of a messaging app. However, large container cards should use `rounded-xl` (1.5rem) to create a distinct, modern framing for data and chat interfaces. Elements representing "Growth" or "Automation" (like progress bars or success chips) can utilize fully rounded (pill) shapes to suggest movement.

## Components

- **Buttons:** Primary buttons use a gradient of Primary Green to Secondary Cyan. Secondary buttons use a Ghost style with a Tertiary Teal border. All buttons have a high-gloss finish.
- **Chips:** Used for message status (e.g., "Delivered", "Read"). These should be small, with semi-transparent backgrounds matching the status color (Success Green, Info Cyan, Warning Amber).
- **Input Fields:** Dark background (#1A1A1A) with a subtle 1px border. On focus, the border transitions to the Primary Cyan with a soft outer glow.
- **Lists:** Message logs and contact lists use Level 1 surfaces with clear dividers. Hover states should highlight the row with a 5% Primary Cyan tint.
- **Cards:** The primary container for analytics and tools. They feature a 1px border and a very subtle inner shadow to look inset into the dashboard.
- **Automation Nodes:** Specific to this platform, nodes in a workflow builder should have distinct icons and use the Secondary Cyan as their primary accent color to differentiate "Logic" from "Content."