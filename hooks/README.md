# Reusable hooks

[Back to the project README](../README.md) · [Component conventions](../components/README.md)

This folder contains browser-only interaction helpers. It does not own Shopify data or global commerce state.

| Hook | Purpose and consumers |
| --- | --- |
| `useMediaQuery(query)` | Subscribes to `matchMedia`, starts with `false` during server rendering, then updates after hydration. Use only in client components when CSS alone cannot control behavior. |
| `useModalFocus(open, panelRef, onClose)` | Focuses a preferred `[data-modal-initial-focus]` target (or first focusable/panel), traps Tab, closes on Escape and returns focus to the previously focused element. Used by the mobile menu, cart drawer, collection filter sheet and product size guide. |

Both hooks clean up browser listeners in their effects. `useModalFocus` also cancels its pending animation frame. Its panel must be mounted when `open` becomes true, be focusable with `tabIndex={-1}`, and carry dialog semantics in the component. The hook does not set `aria-modal`, lock body scrolling or manage stacked dialogs; the caller owns those concerns. Avoid opening overlapping modal surfaces until stacking/focus behavior has been explicitly designed and tested.

Prefer the existing hook over a second partial keyboard handler. When adding a modal, check Escape, forward/backward Tab wrap, focus return, screen-reader label, reduced motion and mobile scrolling.
