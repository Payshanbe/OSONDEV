# Sitan — Studio Website

A premium, dark-by-default marketing site and operations shell for **Sitan**,
an independent studio for design-led digital craft.

Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**,
**shadcn/ui**, **Framer Motion**, and **next-themes**.

---

## Stack

| Layer              | Choice                                  |
| ------------------ | --------------------------------------- |
| Framework          | Next.js 15 (App Router, React 19, RSC)  |
| Language           | TypeScript (strict)                     |
| Styling            | Tailwind CSS + CSS variables            |
| UI primitives      | shadcn/ui (new-york style)              |
| Motion             | Framer Motion                           |
| Theming            | next-themes (dark by default)           |
| Icons              | lucide-react                            |
| Fonts (next/font)  | Geist Sans · Instrument Serif · Geist Mono |

## Project structure

```
app/
  (marketing)/            # Public-facing route group
    layout.tsx              # Header + footer shell
    page.tsx                # Homepage
  (admin)/                # Reserved for future dashboard
    admin/
      layout.tsx
      page.tsx
  globals.css             # Global stylesheet (CSS vars + base layers)
  layout.tsx              # Root layout (fonts, theme, noise overlay)
  not-found.tsx
  icon.svg
components/               # Reusable, route-agnostic UI
  ui/                     # shadcn primitives (Button, …)
  gradient-backdrop.tsx
  noise-overlay.tsx
  reveal.tsx              # Framer Motion entrance primitive
  site-header.tsx
  site-footer.tsx
  theme-provider.tsx
  logo.tsx
sections/                 # Page-specific composition (Hero, etc.)
lib/                      # Pure utilities, config, metadata helpers
  fonts.ts
  metadata.ts
  site-config.ts
  utils.ts                # cn() and absolute URL helper
hooks/                    # Client hooks
  use-mounted.ts
  use-scroll.ts
  use-prefers-reduced-motion.ts
styles/                   # Opt-in / route-scoped CSS (see styles/README.md)
public/
```

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

### Scripts

| Command            | What it does                       |
| ------------------ | ---------------------------------- |
| `npm run dev`      | Start the dev server               |
| `npm run build`    | Production build                   |
| `npm run start`    | Start the production server        |
| `npm run lint`     | ESLint                             |
| `npm run type-check` | TypeScript noEmit pass           |
| `npm run format`   | Prettier (Tailwind-aware)          |

## Architecture notes

- **Route groups** isolate the public marketing site `(marketing)` from the
  future dashboard `(admin)`. Each group owns its own chrome, so the dashboard
  can evolve independently of the marketing surface.
- **Single source of truth for branding** lives in `lib/site-config.ts`
  (name, tagline, nav, CTA, social, etc).
- **Metadata** is built through `lib/metadata.ts → buildMetadata()` so every
  page composes its title/OG/canonical in one line.
- **Theming**: the root layout forces `dark` via `next-themes`. Light tokens
  remain in `globals.css` so a future theme toggle is one prop away.
- **Motion**: `components/reveal.tsx` is the standard entrance primitive and
  respects `prefers-reduced-motion` automatically.
- **Atmosphere**: `GradientBackdrop` + `NoiseOverlay` are the two pieces that
  give the dark canvas its premium feel — both are pointer-event neutral and
  layered cleanly behind the content.

## Adding shadcn/ui components

The project is already initialised (see `components.json`). To add more:

```bash
npx shadcn@latest add dialog tabs input
```

Components land in `components/ui` and pick up the existing tokens, fonts,
and aliases automatically.

## Roadmap

- [ ] Selected work — case studies under `app/(marketing)/work/[slug]`
- [ ] Journal — MDX under `app/(marketing)/journal`
- [ ] Contact — server action + email + spam guard
- [ ] Admin — auth, project list, journal authoring
