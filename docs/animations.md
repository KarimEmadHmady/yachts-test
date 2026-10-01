# Scroll reveal animations

A reveal system built from CSS and one `IntersectionObserver`. It adds no dependencies.

- **CSS**: the tokens and states are in `src/app/globals.css`, under "Scroll reveal".
- **Observer**: `src/components/animations/ScrollReveal.tsx` is a client component that renders `null`. It is mounted once in `src/app/layout.tsx`.
- **Wrapper**: `src/components/animations/Reveal.tsx` is an optional Server Component that writes the attributes for you.

## How it works

1. With JS enabled, any element with `data-reveal` starts hidden (`opacity: 0` plus a small transform) from the first paint. The CSS checks `@media (scripting: enabled)` to decide this, so it doesn't need to change `<html>` and hydration stays clean.
2. `ScrollReveal` watches those elements with a single shared observer (`rootMargin: 0px 0px -10% 0px`). When an element enters the viewport, the observer sets `data-revealed="true"` and stops watching it. Each element plays **once**.
3. Elements that are already in view on load, like a hero, reveal right away without waiting for a scroll.
4. A `MutationObserver` picks up elements added later, for example after client navigation or when content renders dynamically.
5. Only `opacity` and `transform` are animated (the `blur` variant also animates `filter`). The transition and `will-change` are active only while an element reveals. Afterwards `data-reveal-done` is set, and the element's own Tailwind transitions and hover effects apply again.

**Fallbacks**

- **JS disabled**: nothing is hidden.
- **JS bundle fails**: a CSS failsafe shows the content after 4s.
- **`prefers-reduced-motion: reduce`**: nothing is hidden or moved.
- **Print**: nothing is hidden.

## Variants: `data-reveal="…"`

| Value | Effect |
|---|---|
| `up` (default, also bare `data-reveal`) | Fades in while rising 24px |
| `down` | Fades in while dropping 24px |
| `start` | Slides in from the inline-start side (left in LTR, right in RTL) |
| `end` | Slides in from the inline-end side (right in LTR, left in RTL) |
| `fade` | Opacity only |
| `scale` | Scales from 0.96 to 1 |
| `blur` | Goes from blurred to sharp, with a 12px rise |
| `none` | Disabled: the element is always visible |

## Attributes

| Attribute | Meaning |
|---|---|
| `data-reveal-delay="200"` | Extra delay in ms |
| `data-reveal-duration="1200"` | Duration in ms (default 1000) |
| `data-reveal-stagger` / `data-reveal-stagger="120"` | Set on a parent. `[data-reveal]` children that reveal together are staggered, 110ms apart by default |
| `style={{ '--reveal-index': 3 } as React.CSSProperties}` | Sets a child's stagger position by hand |

Global tokens are on `:root` in `globals.css`: `--reveal-duration`, `--reveal-easing`, `--reveal-distance`, `--reveal-scale`, `--reveal-blur`, `--reveal-stagger-step`.

## Examples

A single element:

```tsx
<h2 data-reveal>Title</h2>
<img data-reveal="scale" data-reveal-delay="150" src="…" alt="…" />
```

A staggered grid. Items that enter the viewport together are staggered, and each later row starts its own stagger:

```tsx
<ul className="grid grid-cols-3 gap-6" data-reveal-stagger>
  {items.map((item) => (
    <li key={item.id} data-reveal="up">…</li>
  ))}
</ul>
```

A whole section, using the wrapper:

```tsx
import Reveal from "@/components/animations/Reveal";

<Reveal as="section" variant="fade" className="py-20">
  …
</Reveal>

<Reveal as="ul" variant="none" stagger={120} className="grid gap-6">
  <Reveal as="li">…</Reveal>
</Reveal>
```

### RTL

Use `start` and `end` for horizontal motion. Don't pick left or right per locale. The direction comes from the nearest `dir=""` ancestor, so this already flips inside any `dir="rtl"` section:

```tsx
<section dir={lang === "ar" ? "rtl" : "ltr"}>
  <div data-reveal="start">…</div>   {/* from the left in English, from the right in Arabic */}
</section>
```

**Horizontal scroll caveat:** on this site `<html>` is always LTR and only the sections carry `dir="rtl"`. An element that sits at the page's right edge and starts offset toward the right can briefly add a horizontal scrollbar before it reveals. That happens with `start` in Arabic and `end` in English. Use horizontal variants only when the start offset points inward, for example `start` on an end-side column. Otherwise use `up`, `fade` or `scale`.

## Hydration

`ScrollReveal` mounts with the root layout, so it runs before the page's streamed content has hydrated. It waits until React has hydrated each element before adding any `data-reveal-*` attribute or style, which keeps hydration clean. Elements are taken over after at most 10s even if that check never passes.

## Disabling animation for one element

Remove `data-reveal`, or set `data-reveal="none"` (`<Reveal variant="none">`).
