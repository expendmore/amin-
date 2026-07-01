---
name: Sensy AI Design System
colors:
  surface: '#fcf8fa'
  surface-dim: '#dcd9db'
  surface-bright: '#fcf8fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7e9'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#fcf8fa'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: '0'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a premium, AI-native automation environment. It prioritizes clarity, high-density utility, and a "luxury-utility" aesthetic that bridges the gap between high-end consumer hardware interfaces and professional enterprise software. 

The visual language is a refined mix of **Minimalism** and **Corporate Modernism**, characterized by extreme typographic precision, generous whitespace, and a strict hierarchy of attention. The emotional response is one of absolute reliability, calm under heavy data loads, and sophisticated intelligence.

**Key Principles:**
- **Calculated Restraint:** Color is used as a functional tool, not decoration. 80% of the interface remains neutral to allow content and AI-driven insights to lead.
- **Pixel-Perfect Rigor:** Alignment and spacing follow a strict mathematical rhythm reminiscent of high-end developer tools.
- **AI Sophistication:** AI features are denoted by subtle Sky Blue accents, distinguishing "system" actions from "intelligent" suggestions.

## Colors

The palette is anchored in Deep Midnight Navy to establish authority, using WhatsApp Green strictly as a functional catalyst for momentum and success.

**Functional Application:**
- **Action Strategy:** Use `#25D366` (WhatsApp Green) exclusively for "Go" signals: starting a workflow, successful completion, and primary action buttons.
- **Intelligence Strategy:** Use `#3B82F6` (Sky Blue) for AI-generated content, sparkle icons, and automated suggestions.
- **Hierarchy:** Maintain an 80/15/5 ratio. 80% Neutral (Whites/Grays), 15% Deep Navy (Text/Structure), 5% Green (Conversion/Success).

**Dark Mode Behavior:**
In Dark Mode, the background shifts to a deep `#020617`. Surface elements use `#0F172A` with subtle `#1E293B` borders to maintain depth without relying on heavy shadows.

## Typography

This design system utilizes **Inter** for its systematic, neutral, and highly legible characteristics. It is paired with **JetBrains Mono** for technical metadata and AI-processing strings to reinforce the "automation" narrative.

**Usage Guidelines:**
- **Tracking:** Apply slight negative letter-spacing (-1% to -2%) for headlines to achieve a high-end, "tight" editorial look.
- **Hierarchy:** Use `Secondary Text` (#475569) for body copy to reduce visual vibration against pure white backgrounds, reserving `Primary Text` (#0F172A) for headings and UI labels.
- **Mobile:** Scale `display-lg` down to 32px and `headline-lg` to 24px on mobile devices.

## Layout & Spacing

The system employs a strict **8px grid** for vertical rhythm and a **12-column fluid grid** for desktop layouts.

**Layout Rules:**
- **Desktop:** 12 columns, 24px gutters, 40px minimum side margins. Content is typically centered in a 1280px max-width container.
- **Sidebars:** Fixed-width sidebars (240px or 280px) are preferred over fluid ones to maintain icon and label alignment.
- **Density:** Use "Comfortable" spacing for landing and dashboard overviews (24px - 32px gaps) and "Compact" spacing for data tables and workflow builders (8px - 12px gaps).
- **Whitespace:** Use whitespace as a structural element to group related AI insights without needing excessive borders.

## Elevation & Depth

The design system uses **Tonal Layering** and **Micro-Shadows** to indicate hierarchy, avoiding heavy skeuomorphism.

**Surface Levels:**
- **Level 0 (Background):** Light Slate (#F8FAFC). Provides a neutral foundation.
- **Level 1 (Cards/Main Content):** Pure White (#FFFFFF). Uses a 1px border of #E2E8F0. No shadow or a very faint 2px ambient blur.
- **Level 2 (Dropdowns/Modals):** Pure White with a "Sophisticated Lift"—a dual shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **AI Elevation:** Elements containing AI insights should use a subtle Sky Blue inner-glow or a faint 1px Sky Blue border to suggest they are "active" and intelligent.

## Shapes

The shape language is **Soft** and precise. It avoids the playfulness of fully rounded "pill" shapes for primary containers, opting for a professional, architecturally-sound corner radius.

**Radius Specs:**
- **Standard (Components):** 6px (0.375rem) for buttons, inputs, and small cards.
- **Large (Containers):** 8px (0.5rem) for main dashboard cards and modals.
- **Extra Large:** 12px (0.75rem) for outer application shells or featured marketing sections.
- **Pill:** Reserved exclusively for "Status Chips" (e.g., "Active", "Pending").

## Components

### Buttons
- **Primary:** Navy (#0F172A) background, White text. Hover state includes a subtle Green (#25D366) outer glow (shadow-drop) to signal "ready for action."
- **Success/Action:** WhatsApp Green (#25D366) background, White text. Used for "Run Workflow," "Deploy," or "Send."
- **Secondary:** White background, 1px Navy border, Navy text.
- **AI Action:** White background, 1px Sky Blue border, Sky Blue text + Sparkle icon.

### Inputs & Fields
- **Default:** 1px border (#E2E8F0), 6px radius. Focus state: 1px border Navy (#0F172A) with a 2px soft Navy focus ring.
- **AI Search:** Features a faint Sky Blue tint (#EFF6FF) and a "Sparkle" leading icon.

### Cards
- Pure White background, 1px border (#E2E8F0). No shadow in rest state. On hover, apply "Level 2" elevation and transition the border to Deep Navy.

### Chips & Badges
- **Status:** Pill-shaped. Green for "Live," Amber for "Paused," Red for "Error."
- **AI Tag:** Light Sky Blue background, Deep Blue text, used to label automated steps.

### Lists & Data Tables
- Row height: 48px (Standard) or 40px (Compact).
- Hover state: Light Slate (#F1F5F9) background.
- Border: Only horizontal separators using #F1F5F9. No vertical grid lines.