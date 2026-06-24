# IMPLEMENTATION_PLAN.md — ApnaKamra Frontend

Build in order. **Do not jump ahead.** At the end of each phase, summarise what changed, show mobile (375px) + desktop screenshots, and **stop for my approval.** All design/quality rules come from `AGENTS.md`.

---

## Phase 0 — Setup & foundations
**Goal:** a running, empty, correctly-configured project connected to the API.

Tasks:
- Scaffold Next.js (latest stable, App Router, TypeScript, `src/` dir, Tailwind).
- Initialise **shadcn/ui** (`new-york`, base `neutral`, CSS variables). Confirm current setup via Context7 first.
- Set up `src/lib/api/` client reading `NEXT_PUBLIC_API_BASE_URL` / `API_BASE_URL`. Create `.env.example`; put real values in `.env.local`. (Ask me for the API base URL + auth method — see AGENTS.md §3.)
- Add `next/font` for the two faces (AGENTS.md §4.4). Add the colour + radius tokens to `globals.css` `@theme` (AGENTS.md §4.3).
- Base layout, `<html lang="en">`, metadata defaults, favicon placeholder.
- `.gitignore` (`.env.local`, etc.). First commit.

**Done when:** the app runs, fonts + tokens load, the API client can reach one real endpoint (or is clearly stubbed pending my API details), and a Lighthouse run on the blank page is clean.

---

## Phase 1 — Design system + `/style` page  ← get my sign-off on the LOOK here
**Goal:** lock the visual identity before building real pages.

Tasks:
- Run the design process in AGENTS.md §6 (brainstorm tokens → critique against the anti-AI list §5 → justify) and show me the short plan.
- Theme the shadcn primitives we'll need: Button, Input, Select, Badge, Card, Sheet/Drawer, Skeleton, Tabs, Tooltip, Dialog.
- Build the **signature `StayCard`** component (real photo 4:3, price/month, Verified badge, sharing type, distance-to-landmark, food/AC chips with lucide icons — no emoji).
- Build a `/style` route: a kitchen-sink page showing all tokens (colours, type scale, spacing, radii), every primitive in its states, and a few `StayCard`s with sample data.

**Done when:** `/style` looks polished at mobile + desktop, matches AGENTS.md, has zero items from the anti-AI list, and **I've approved the look.** Do not start Phase 2 before that.

---

## Phase 2 — Discovery flow (the priority surface)
**Goal:** a student can go from landing → city → browse → listing detail.

Tasks:
- **Home / landing:** a city-first photographic hero (real rooms, not a gradient blob), city picker, a short trust line. (AGENTS.md §4.1.)
- **City listing page** (`/[city]` or similar): the `StayCard` grid + a `FilterBar` (search by name, budget, area/locality, sharing type, Food, AC, Verified) + sort. Filtered search uses TanStack Query on the client; initial load is server-rendered/SSG where possible. Handle loading (skeleton cards), empty, and error states (AGENTS.md §3, §8).
- **Stay detail page** (`/[city]/[stay]`): photo gallery, price, what's included, locality + (real map *or* nothing — no fake map), amenities (`AmenityList`), and a clear **Contact owner / Book** action.
- Wire pagination/infinite scroll to the API.

**Done when:** the full browse → detail journey works against the real API, every state is handled, pages are SSG/ISR where possible, and it's verified responsive + accessible.

---

## Phase 3 — Owner portal
**Goal:** an owner can sign in and manage listings. (Confirm auth method with me first.)

Tasks:
- Auth screens (login / signup) matching the design system.
- **Dashboard:** "My listings" with status, edit/delete.
- **List a property:** a clean multi-step form (details → photos → location → price/amenities → review) with **image upload** to the API, inline validation, and a friendly success state.
- Protect portal routes; redirect unauthenticated users.

**Done when:** an owner can create, view, edit, and delete a listing end-to-end against the real API, with validation and all states handled.

---

## Phase 4 — Polish & performance pass
**Goal:** make a senior designer assume a studio built it.

Tasks:
- Image audit: every photo via `next/image` with correct `sizes`; confirm no layout shift.
- Run Lighthouse on mobile; hit the AGENTS.md §10 targets; fix regressions.
- Accessibility sweep (keyboard, focus, contrast, alt text, heading order).
- Re-verify every screen at 375px / tablet / desktop; fix spacing/type inconsistencies against the references (AGENTS.md §12).
- Confirm loading/empty/error states exist on every data-driven view.
- SEO: per-page metadata, Open Graph, `sitemap.xml`, `robots.txt`.

**Done when:** Lighthouse targets met, no visual inconsistencies, no items from the anti-AI list anywhere.

---

## Phase 5 — Ship
**Goal:** live on Vercel.

Tasks:
- Deploy to Vercel; set env vars in the dashboard.
- Connect domain; add privacy-friendly analytics (e.g. Vercel Analytics).
- Final production smoke test on a real phone.

**Done when:** the production URL loads fast on a mobile connection and both surfaces work.
