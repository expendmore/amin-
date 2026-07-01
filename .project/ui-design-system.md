# ExpendMore — Enterprise Design System Specifications

> **Version**: 1.0.0  
> **Theme**: Premium Dark & Glassmorphic  
> **Brand Accents**: Neon Cyan (Turquoise) & Emerald Green  

This design system standardizes colors, typography, sizing, component tokens, shadows, and spacing rules across all ExpendMore dashboards and public pages.

---

## 🎨 1. Color Palette System

| Color Token | Variable Name | Default HEX (Dark) | Intent / Semantic Use |
|-------------|---------------|-------------------|-----------------------|
| **Background** | `bg-background` | `#020617` | Standard dark canvas background |
| **Surface** | `bg-surface` | `#090f1e` | Container surface cards and panels |
| **Glass** | `bg-glass` | `rgba(15, 23, 42, 0.4)` | Translucent overlays with blur effects |
| **Primary** | `text-primary` | `#00F0D0` (Teal) | Active titles, highlights, main taglines |
| **Secondary** | `text-secondary` | `#059669` (Green) | Success actions, completed stats, verification |
| **Border** | `border-border` | `rgba(255, 255, 255, 0.06)`| Soft, low-contrast container edges |
| **Muted** | `text-muted` | `#94a3b8` | Subtext, labels, helper captions |

---

## 📐 2. Dimensions & Spacing

### Border Radii
- **S (Small)**: `4px` (`rounded`) — Small tags, checkmarks, badges.
- **M (Medium)**: `8px` (`rounded-lg`) — Action items, tooltips, list widgets.
- **L (Large - Interactive)**: `12px` (`rounded-xl`) — Standard buttons, input text fields, selectors.
- **XL (Container)**: `16px` (`rounded-2xl`) — Bento grids, cards, dropdown menus, modal dialogs.

### Spacing Scale
Follows a clean 4px/8px baseline grid layout:
- **Base (xs)**: `4px` (`p-1` / `m-1`)
- **Small (sm)**: `8px` (`p-2` / `m-2`)
- **Medium (md)**: `16px` (`p-4` / `m-4`)
- **Large (lg)**: `24px` (`p-6` / `m-6`)
- **Extra Large (xl)**: `32px` (`p-8` / `m-8`)

---

## ✍ 3. Typography & Weight

- **Primary Font**: `Inter` or `Plus Jakarta Sans` for clean, professional B2B reading.
- **Mono Font**: `JetBrains Mono` for developer tables, credit counts, API log timestamps.
- **Visual Weight Guidelines**:
  - Headings should use a two-tone text emphasis: standard weight leading into a bold accent.
  - Tracking rules: Sub-labels and meta tags use `tracking-wider` or `tracking-widest` uppercase styles.

---

## ✨ 4. Tactical Component States

### Inputs & Selectors
- **Normal state**: `bg-white/[0.02]` fill with `border-white/[0.06]` border.
- **Hover state**: `border-white/[0.12]` border.
- **Focus state**: `border-primary/40` border with a subtle cyan glow outline ring.
- **Disabled state**: `opacity-40` with `cursor-not-allowed`.

### Buttons
- **Primary**: Gradient fill from `emerald-650` to `teal-650`. Hover: subtle brightness scale (`brightness-105`), active: `scale-[0.98]`.
- **Secondary**: `bg-white/[0.02]`, border `border-white/[0.08]`. Hover: `bg-white/[0.06]`.
- **Ghost**: Transparent bg. Hover: `bg-white/[0.04]` text white.
- **Danger**: Red tint with white text.
