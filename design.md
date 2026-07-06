---
name: Verdant South
colors:
  surface: '#f8f9f9'
  surface-dim: '#d9dada'
  surface-bright: '#f8f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f4'
  surface-container: '#edeeee'
  surface-container-high: '#e7e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1c'
  on-surface-variant: '#414845'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#717974'
  outline-variant: '#c0c8c3'
  surface-tint: '#3c6658'
  primary: '#00241a'
  on-primary: '#ffffff'
  primary-container: '#0d3b2e'
  on-primary-container: '#79a694'
  inverse-primary: '#a3d0be'
  secondary: '#43655a'
  on-secondary: '#ffffff'
  secondary-container: '#c5ebdc'
  on-secondary-container: '#496b60'
  tertiary: '#18201f'
  on-tertiary: '#ffffff'
  tertiary-container: '#2d3534'
  on-tertiary-container: '#969e9c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#beedd9'
  primary-fixed-dim: '#a3d0be'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#234e40'
  secondary-fixed: '#c5ebdc'
  secondary-fixed-dim: '#a9cfc0'
  on-secondary-fixed: '#002018'
  on-secondary-fixed-variant: '#2b4d42'
  tertiary-fixed: '#dce4e2'
  tertiary-fixed-dim: '#c0c8c6'
  on-tertiary-fixed: '#151d1c'
  on-tertiary-fixed-variant: '#404847'
  background: '#f8f9f9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e3'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

The design system is centered on the concept of "Luxury in Nature." It targets high-end travelers seeking the serenity of South India’s Western Ghats, backwaters, and misty hill stations. The aesthetic is a fusion of **Minimalism** and **Glassmorphism**, emphasizing high-quality photography of lush greenery and rain-drenched landscapes against a backdrop of sophisticated white space.

The UI should evoke a sense of calm and invitation, using generous whitespace to allow the rich, natural imagery to breathe. Interactions should feel fluid—mimicking the slow movement of mist or water—to reinforce the serene brand personality.

## Colors

The palette is inspired by the monsoon landscapes of Kerala and Karnataka. 

- **Primary (Deep Forest Green):** Used for typography and primary calls to action. It provides a grounded, luxurious foundation.
- **Secondary (Misty Sage):** Used for accents, subtle dividers, and icons.
- **Tertiary (Soft Fern):** A very light, desaturated green used for large background sections to reduce visual fatigue from pure white.
- **Neutral (Crisp White/Cloud):** The primary surface color to maintain a clean, premium feel.
- **Mist (Blue-Grey):** Used for glassmorphism effects and background blurs to simulate the rainy, atmospheric mood.

## Typography

This design system utilizes a pairing of **Plus Jakarta Sans** for headings and **Manrope** for body text. 

- **Headlines:** Use Plus Jakarta Sans to provide a modern, friendly, yet sophisticated character. The larger display sizes use tighter letter-spacing to feel more editorial.
- **Body:** Manrope is chosen for its exceptional readability and clean, geometric structure, which maintains the "modern professional" look.
- **Labels:** Use uppercase Manrope with increased letter-spacing for small metadata, such as "DESTINATION" or "DATES," to provide a structured hierarchy.

## Layout & Spacing

The layout follows a **Fluid Grid** system based on an 8px spacing power-of-two scale. 

- **Grid:** 12-column grid for desktop, 4-column for mobile.
- **Margins:** Large outer margins (64px+) are encouraged on desktop to create an "art gallery" feel for travel photography.
- **Rhythm:** Use vertical spacing of 80px-120px between major sections to emphasize the "Lush/Misty" openness of the brand.
- **Adaptive Rules:** On tablet and mobile, card-based layouts should transition from multi-column grids to vertical stacks with horizontal scrolling "peek" behavior for image galleries.

## Elevation & Depth

This design system uses **Glassmorphism** and **Tonal Layers** rather than heavy shadows to create depth.

- **Surface Strategy:** Deep Green surfaces are used for primary sections, while white or mist-colored cards sit on top.
- **Depth:** Use very soft, low-opacity shadows (Color: Deep Forest Green, Opacity: 4%, Blur: 40px) to make cards appear as if they are floating gently on a bed of mist.
- **Glass Effects:** Navigation bars and over-image overlays must use a `backdrop-filter: blur(12px)` with a semi-transparent white (rgba 255, 255, 255, 0.7) to simulate rain-streaked glass or morning fog.

## Shapes

The shape language is organic and soft, reflecting the natural curves of hills and water droplets.

- **Primary Radius:** A default of 16px (rounded-lg) for standard cards and input fields.
- **Large Radius:** Use 24px or 32px (rounded-xl) for main hero containers and large image galleries to emphasize a premium, friendly feel.
- **Interactive Elements:** Buttons should use a fully rounded (pill-shaped) style to contrast against the softer rectangles of the cards.

## Components

- **Buttons:** Primary buttons are solid Deep Forest Green with white text, pill-shaped. Secondary buttons use a Misty Gray ghost style with a subtle 1px border.
- **Cards:** The core of the UI. Travel cards feature full-bleed imagery with a 16px border radius. Typography overlays should use the glassmorphism effect at the bottom of the card.
- **Input Fields:** Search bars should be oversized and pill-shaped with a soft inner shadow or a subtle Sage border. 
- **Chips:** Used for "Tags" (e.g., #Luxury, #Backwaters). These are light Tertiary Green with Primary Green text, using an 8px radius.
- **Progressive Disclosure:** Use smooth accordion transitions for itinerary details, mimicking the fluid unfolding of a map.
- **Interactive Map:** A custom-styled map using a grayscale or "Misty" base layer with Deep Green markers for destinations.