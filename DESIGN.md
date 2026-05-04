---
name: Luminous Elegance
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4d4545'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7f7574'
  outline-variant: '#d0c4c3'
  surface-tint: '#645d5c'
  primary: '#070404'
  on-primary: '#ffffff'
  primary-container: '#221d1d'
  on-primary-container: '#8c8484'
  inverse-primary: '#cec4c4'
  secondary: '#78555d'
  on-secondary: '#ffffff'
  secondary-container: '#ffd1da'
  on-secondary-container: '#7a575f'
  tertiary: '#120005'
  on-tertiary: '#ffffff'
  tertiary-container: '#43001f'
  on-tertiary-container: '#ca6687'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ebe0e0'
  primary-fixed-dim: '#cec4c4'
  on-primary-fixed: '#1f1a1a'
  on-primary-fixed-variant: '#4c4545'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#e7bbc4'
  on-secondary-fixed: '#2d141b'
  on-secondary-fixed-variant: '#5e3e45'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c7'
  on-tertiary-fixed: '#3e001c'
  on-tertiary-fixed-variant: '#7c2748'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: notoSerif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: notoSerif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: notoSerif
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: publicSans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: publicSans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: publicSans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.1em
spacing:
  unit: 4px
  container-max: 1440px
  gutter: 24px
  margin-edge: 40px
  stack-sm: 16px
  stack-md: 32px
  stack-lg: 64px
---

## Brand & Style

This design system embodies an aura of modern luxury and effortless femininity. It is crafted for a discerning audience that values both high-fashion aesthetics and seamless functionality. The visual narrative is built on the principles of **Minimalism** and **Editorial Design**, where the UI serves as a sophisticated frame for high-quality, emotive photography.

The emotional response should be one of indulgence and confidence. By utilizing generous whitespace and a restricted color palette, the interface recedes to let the products take center stage, creating an environment that feels like a high-end boutique. Every interaction is designed to be whisper-quiet yet deliberate, emphasizing a premium e-commerce journey.

## Colors

The color strategy is anchored in high-contrast sophistication. 
- **Primary:** A deep, near-black ebony (#221D1D) is used for typography and structural elements to provide grounding and authority.
- **Secondary:** A soft, petal pink (#F3C6CF) serves as the primary brand signifier, used for soft backgrounds and subtle highlighting.
- **Tertiary:** A rich, muted rose (#AF5071) is reserved for meaningful actions and accents that require more visual weight.
- **Neutrals:** Crisp whites and very light grays are utilized to maintain a clean, breathable atmosphere.

Avoid overusing the pink tones; they are most effective when punctuating a predominantly black-and-white canvas.

## Typography

The typography pairings are a study in contrast. **Noto Serif** provides a timeless, literary quality to headlines and editorial callouts, evoking the feel of a luxury fashion magazine. **Public Sans** is utilized for body copy and navigational elements, offering a clean, utilitarian clarity that balances the decorative nature of the serif.

To maintain the high-end feel:
- Use all-caps with generous letter-spacing for labels and small buttons.
- Ensure body text maintains a comfortable line height to preserve the sense of whitespace.
- Use the serif font sparingly for maximum impact.

## Layout & Spacing

This design system utilizes a **fixed-width grid** for desktop viewing, centered within the viewport to create a structured, gallery-like feel. 

- **Grid Model:** A 12-column grid with a 24px gutter provides the architectural foundation.
- **Rhythm:** Spacing follows a 4px baseline, but emphasizes large vertical "breathing gaps" (stack-lg) between sections to prevent the UI from feeling cluttered.
- **Photography:** Images should frequently break the standard padding to bleed to the edge of containers, emphasizing a tactile, "full-bleed" editorial experience.

## Elevation & Depth

To maintain a clean and modern aesthetic, this design system avoids heavy shadows and traditional skeuomorphism. Depth is achieved through **Tonal Layers** and **Low-contrast Outlines**:

- **Surfaces:** Use subtle shifts between pure white (#FFFFFF) and soft pink (#F3C6CF) to define different content zones.
- **Borders:** Extremely thin (1px) borders in a light gray or semi-transparent black are used for form inputs and card containers.
- **Shadows:** When necessary (e.g., for floating menus), use a "Whisper Shadow"—a very large blur radius (30px+) with extremely low opacity (3-5%) to mimic natural, ambient light without creating harsh edges.

## Shapes

The shape language is primarily **Sharp (0px)** to reflect a sleek, architectural precision. Rectangular forms communicate a sense of modernism and high-end structure. 

While the majority of elements use sharp corners, **Pill-shaped (3)** buttons are used exclusively for secondary decorative elements or specialized "New Arrival" tags to provide a soft, feminine counterpoint to the rigid grid. This juxtaposition creates visual interest and guides the eye toward specific calls to action.

## Components

### Buttons
Primary buttons are sleek, sharp-edged rectangles with a solid #221D1D background and white uppercase text. Secondary buttons utilize a thin 1px border with no fill. Hover states should involve a subtle color shift to #AF5071 or a slight expansion of the element's inner padding.

### Input Fields
Inputs are minimalist, consisting of a single bottom border (1px) or a very thin surrounding stroke. Labels should be small and uppercase, sitting just above the field. Focus states are indicated by the border darkening to the primary brand color.

### Navigation
The main navigation is centered and airy. Top-level categories use Public Sans in a medium weight. A "Utility Bar" sits at the very top for subtle links like account login and store locator, set in a smaller font size to maintain hierarchy.

### Product Cards
Cards are borderless, relying on the product photography to define the space. The price and title are set in a clean stack below the image, utilizing Noto Serif for the price to emphasize the "luxury" of the item.

### Chips & Tags
Used for sizes or color swatches, these should be sharp-edged squares or small circles. For "New" or "Sale" badges, use a delicate pill shape with the secondary pink background to stand out softly.