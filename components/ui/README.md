# UI primitives

[Back to the project README](../../README.md) · [Component overview](../README.md)

This folder contains branded controls and asynchronous-state presentation shared across commerce features.

## Components

| Component | Use |
| --- | --- |
| `ExploreButton` | Branded radial-interaction link for category exploration |
| `DiscoverButton` | Expanding-circle link for editorial discovery CTAs |
| `BuyNowButton` | Full-width animated purchase button with loading/price tooltip behavior |
| `BrandLoader` | Full-screen or inline branded loader; CSS Module |
| `HouseLoader` | Compatibility wrapper around `BrandLoader` |
| `InlineLoader` | Compact status mark for buttons/actions |
| `SectionLoader` | Section-level text/line loading indicator |
| `ImageWithLoader` | `next/image` wrapper with skeleton and error states |
| `ProductCardSkeleton` | One product-card placeholder |
| `ProductGridSkeleton` | Section loader plus a configurable skeleton grid |
| `ProductDetailsSkeleton` | PDP route placeholder |

`BuyNowButton` and `BrandLoader` use CSS Modules. Other primitive styles live in `app/globals.css` under their feature class names.

## Reuse rules

- Use `ExploreButton`/`DiscoverButton` for navigation because they render Next.js links.
- Use `BuyNowButton` only through the checkout action unless another caller supplies equivalent pending/disabled/error control.
- Use `ImageWithLoader` where an image-loading transition/error state is useful; pass all normal Next.js `ImageProps`, including `sizes`.
- Prefer existing skeleton shapes so route-level and client-level loading states remain consistent.
- Use `components/common/BackButton.tsx` for explicit parent navigation rather than adding another arrow-link primitive.

Create a new primitive only when semantics or interaction differs materially. A one-off spacing/color variant should normally be a prop or scoped class, not a duplicate component.

## Accessibility and motion

- Loading components use status semantics and screen-reader labels.
- Navigation controls require real `Link` elements; actions require buttons.
- Preserve disabled and `aria-busy` behavior on purchase controls.
- New interactive controls need visible focus styles and at least 44px touch targets where used on mobile.
- All animation must stop or simplify under `prefers-reduced-motion`; Framer Motion components should use `useReducedMotion`.
- Do not hide meaningful text behind hover-only behavior on touch devices.

## Brand rules

Use the `--hoa-*` palette from the root README. Orange/random demo colors and raw third-party snippet styles do not belong here. Interaction effects should remain restrained: small lift/translate, muted-gold border/accent, short durations, and no neon or continuous animation.

## Known limitations

- There is no formal Storybook/component-test environment.
- Some primitives depend on global class definitions, so they are not isolated packages.
- `HouseLoader` exists mainly for compatibility and currently adds no behavior beyond `BrandLoader`.

