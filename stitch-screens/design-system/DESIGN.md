---
name: Sandou Kremas
colors:
  surface: '#fff8f6'
  surface-dim: '#f3d4c5'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1eb'
  surface-container: '#ffeae0'
  surface-container-high: '#ffe2d5'
  surface-container-highest: '#fcdccd'
  on-surface: '#28180f'
  on-surface-variant: '#49473f'
  inverse-surface: '#3f2c22'
  inverse-on-surface: '#ffede6'
  outline: '#7a776e'
  outline-variant: '#cac6bc'
  surface-tint: '#615e56'
  primary: '#615e56'
  on-primary: '#ffffff'
  primary-container: '#f8f3e8'
  on-primary-container: '#716f66'
  inverse-primary: '#cac6bc'
  secondary: '#675e41'
  on-secondary: '#ffffff'
  secondary-container: '#f0e2bd'
  on-secondary-container: '#6e6446'
  tertiary: '#765a1a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fff2e0'
  on-tertiary-container: '#896a29'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7e2d7'
  primary-fixed-dim: '#cac6bc'
  on-primary-fixed: '#1d1c15'
  on-primary-fixed-variant: '#49473f'
  secondary-fixed: '#f0e2bd'
  secondary-fixed-dim: '#d3c6a2'
  on-secondary-fixed: '#221b05'
  on-secondary-fixed-variant: '#4f462b'
  tertiary-fixed: '#ffdea2'
  tertiary-fixed-dim: '#e7c177'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5c4201'
  background: '#fff8f6'
  on-background: '#28180f'
  surface-variant: '#fcdccd'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
    letterSpacing: 0.03em
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 120px
---

## Brand & Style
The design system is a fusion of Caribbean heritage and high-European luxury. It captures the spirit of Haitian celebration through the lens of a Michelin-star concierge. The aesthetic is "Tropical Minimalist Luxury"—where the warmth of the ingredients meets the precision of a high-fashion editorial.

The style leans heavily into **Modern Minimalism** with **Glassmorphism** accents to mimic the condensation on a chilled bottle of Kremas. Every interaction should feel intentional, quiet, and sophisticated, evoking the tactile sensation of heavy linen and cold crystal. The target audience is the discerning epicurean who values provenance, craftsmanship, and the art of hosting.

## Colors
The palette is inspired by the creamy texture and aromatic spices of the product. 
- **Rich Cream Ivory (#F8F3E8):** Used as the primary canvas for most surfaces to maintain a warm, inviting atmosphere.
- **Warm Vanilla Cream (#F4E6C1):** Applied to subtle section breaks and hover states to add depth without introducing jarring contrast.
- **Soft Caramel Gold (#D8B36A):** Reserved for delicate accents, borders, and calls to action. It represents the "halo" of the brand.
- **Deep Espresso Brown (#2C1B12):** The anchor for all typography and grounding elements. It replaces traditional black to ensure the UI feels organic and premium.
- **Elegant White (#FFFFFF):** Used for negative space and card surfaces to provide clarity and a "fresh" feel.

## Typography
The typography strategy relies on the tension between the ornate Serif and the functional Sans-Serif. 
- **Headlines:** Use Playfair Display for all storytelling elements. It should be typeset with tight tracking for large displays to emphasize its elegant, high-contrast strokes.
- **Body:** Montserrat provides a clean, modern counterpoint. Use the "Light" weight (300) for long-form editorial content to increase the "luxury" feel.
- **Labels:** Small labels and sub-headers should always be in uppercase Montserrat with wide letter spacing to mimic high-end fragrance packaging.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop to ensure content is framed like a gallery, and a **Fluid Grid** for mobile. 
- **Desktop:** 12-column grid with an 80px side margin. The large margins are non-negotiable; they create the "luxury air" required for an editorial feel.
- **Section Gaps:** Vertical rhythm is intentionally slow. Use 120px - 160px gaps between sections to allow the brand photography to breathe.
- **Mobile:** 4-column grid with 20px margins. Headlines should be centered to maintain the premium "invitation" aesthetic.

## Elevation & Depth
Depth is communicated through **Tonal Layers** and **Soft Ambient Shadows**. 
- **Surfaces:** Use `#FFFFFF` for foreground cards against the `#F8F3E8` primary background.
- **Shadows:** Avoid harsh blacks. Use a 10% opacity version of the Espresso Brown (#2C1B12) for shadows, with a large blur radius (30px+) and 0 offset to create a "floating" effect.
- **Glassmorphism:** For navigation bars and overlay menus, use a 20px backdrop-blur with a 40% opaque White fill to simulate frosted glass, reminiscent of chilled beverage bottles.

## Shapes
The shape language is understated and architectural. We use "Soft" (0.25rem) roundedness to take the edge off the UI without making it feel bubbly or informal.
- **Primary Buttons:** Subtle 4px radius.
- **Image Containers:** These should remain sharp (0px) to mimic physical photography prints and editorial layouts.
- **Form Inputs:** Soft 4px radius to match the buttons.

## Components
- **Buttons:** Primary buttons use the Espresso Brown background with Ivory text. Secondary buttons use a 1px Caramel Gold border with uppercase spaced text.
- **Editorial Frames:** Photography should be wrapped in a 1px `#D8B36A` border with a 16px internal padding (the "Passpartout" effect).
- **Interactive Lists:** Used for menu or ingredient explorations. Items should have a subtle gold underline on hover that expands from the center.
- **Concierge Input Fields:** Single-line inputs with no background, only a bottom border in Gold (#D8B36A). Placeholder text should be in Italic Playfair Display.
- **Chips/Badges:** Small, uppercase Montserrat labels with a light Vanilla Cream background and Espresso text.
- **Cards:** White surfaces with a 1px border in `#F4E6C1` (Vanilla). No heavy shadows; the depth comes from the slight color shift.