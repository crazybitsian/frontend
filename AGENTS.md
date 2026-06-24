# AGENTS.md — ApnaKamra Frontend

> This is the single source of truth for how to build this frontend.
> Both **Claude Code** and **Google Antigravity** read this file automatically at the start of every session. Read it fully before writing any code.
> The phased build order lives in `IMPLEMENTATION_PLAN.md`. The way you kick off work lives in `KICKOFF_PROMPT.md`.

---

## 1. What we are building

ApnaKamra is a stays marketplace for students in India — "OYO for hostels / PGs." Think *finding a room when you move to a new city for college, coaching, or your first job.* The product name means "your own room"; the emotional job of the product is **relief and belonging** — taking an anxious student and getting them to *"I found a place I trust."*

There are exactly **two surfaces**:

1. **Discovery (public, the priority):** A student picks a city → browses real rooms/PGs/hostels → filters by what they actually decide on (budget, area/locality near their college or metro, sharing type, food, AC, verified) → opens a listing → contacts or books it. This must be fast and SEO-friendly: students will find it by Googling things like *"PG in Thaltej Ahmedabad."*
2. **Owner portal (private, behind auth):** Hostel/PG owners log in → list a property (photos, price, amenities, location) → manage their listings.

**The backend API already exists. We are building the frontend only.** Never invent backend logic; always talk to the real API.

### Audience reality (design for this, not for a US tech demo)
- Students aged ~17–24, often moving cities alone for the first time. Budget-conscious.
- **Mobile-first on mid/low-end Android phones, sometimes on patchy data.** This is why "loads in seconds" is a hard requirement, not a nice-to-have.
- The real anxieties: *Is it a scam? Is it safe? How far from my college/metro? Is food included? AC or non-AC? How many sharing?* Surface these everywhere.

---

## 2. Tech stack (locked — do not change without asking the human)

- **Framework:** Next.js (latest stable), **App Router**, **React Server Components by default**. `"use client"` only when a component genuinely needs interactivity/state.
- **Language:** TypeScript (strict).
- **Styling:** **Tailwind CSS v4** (CSS-first `@theme` in `globals.css`).
- **Components:** **shadcn/ui** (style: `new-york`, base color: `neutral`, CSS variables on). These are copied into our repo and owned by us — restyle them freely to match the design system below. Do **not** add a component library like MUI, Chakra, Ant, or Bootstrap.
- **Icons:** **lucide-react** only. (See the no-emoji rule in §5.)
- **Data fetching:** Prefer fetching in Server Components against the API (cacheable, less JS). Use **TanStack Query** only on the client where live/interactive data is needed (e.g. filtered search as the user types).
- **Animation:** **`motion`** (Framer Motion) — used sparingly, for at most one or two intentional moments. Most transitions should be plain CSS.
- **Deploy target:** Vercel.

**Before using any of the above, confirm the current API / setup via Context7** (their docs change). Do not guess version-specific syntax.

---

## 3. API integration rules

- All API calls go through **one typed client** in `src/lib/api/`. No `fetch` calls scattered through components.
- The base URL comes from an env var: `NEXT_PUBLIC_API_BASE_URL` (or server-only `API_BASE_URL` for server-side calls). **Never hardcode URLs or secrets.** Put real values in `.env.local` (gitignored) and document required vars in `.env.example`.
- Every API response shape gets a **TypeScript type/interface**.
- Every data fetch has three states handled in the UI: **loading** (skeleton, never a bare spinner-on-blank), **empty** (a useful, on-brand message — see §8 Voice), and **error** (plain language + a way to retry).

API base URL	https://apna-kamra.up.railway.app/api
Auth method	Mobile + password sent as query string params (?mobile=...&password=...) for owner endpoints. No JWT, no cookies. Student side uses mobile number stored in localStorage (no auth required).
List cities	GET /api/cities
List stays by city + filters	`GET /api/properties?city=&q=&sort=price_asc
Stay detail by slug	GET /api/properties/<slug>
Owner: login	POST /api/owner/login — body: { mobile, password }
Owner: list-mine	GET /api/owner/properties?mobile=...&password=...
Owner: create/update/delete	Not yet implemented (the "Add Property" button just shows alert('Contact support'), "Edit" button is a no-op)
Image upload	Not yet implemented
Pagination style	None — all results are returned at once (no page/limit/cursor)
Additional endpoints already in use:
Endpoint	Method	Purpose
/api/events	POST	Track city visits & property views ({ mobile, city, event_type })
/api/impressions	POST	Track card impressions ({ ids: [...] })
/api/leads	POST	Submit contact leads
/api/owner/property-visitors	GET	Owner's lead list (with ?mobile=...&password=...)

## 4. Design system

> **The look is the product.** Our current prototype looks AI-made (dark theme, purple gradient, emoji buttons, a glowing fake "map" box). We are doing the opposite of all of that. Read §5 before §4 sinks in.

### 4.1 Direction: "Found your place" — honest, photographic, trust-first
The rooms are the heroes, shown honestly (real photos, not glossy hotel stock). The interface is calm, bright, and information-rich because a student is making a careful, slightly anxious decision. Boldness is spent in exactly one place: the **information-rich stay card** and the **city-first photographic hero**. Everything else stays quiet and disciplined.

The **signature element** = a stay card that front-loads the three things a student actually decides on: a real photo, **price / month**, and a trust+fit row (Verified badge · sharing type · distance to a landmark · food/AC chips). Locality/neighbourhood is prominent everywhere, because *"near my college / metro"* is the real decision driver.

### 4.2 Mode
**Light by default.** Bright and trustworthy reads as legitimate for accommodation and makes real photos look good. Dark mode is optional and secondary; if built, it must be **warm-neutral, never navy/purple.**

### 4.3 Color tokens (recommended starting palette — paste into `globals.css` `@theme`)
One confident brand colour: a **deep forest/emerald green** tied to the *verified / safe / fresh-start* theme. You may shift the green's hue (e.g. toward deep teal) but keep it to **one** brand colour. **Never** introduce violet/indigo (AI tell) and **never** the terracotta-on-cream combo (current AI cliché — see §5).

```css
/* Light (default) */
--background: #FAFAF9;        /* clean warm-neutral paper — NOT cream #F4F1EA */
--foreground: #18181B;        /* near-black charcoal */
--card: #FFFFFF;
--card-foreground: #18181B;
--muted: #F2F2EF;
--muted-foreground: #6B6B6B;
--border: #E6E6E1;            /* hairline */
--input: #E6E6E1;
--primary: #16683E;           /* deep emerald — buttons, brand, active */
--primary-foreground: #FFFFFF;
--secondary: #F2F2EF;
--secondary-foreground: #18181B;
--accent: #E9F2EC;            /* pale green wash — badges, active chips */
--accent-foreground: #16683E;
--verified: #16683E;          /* trust signal */
--destructive: #B42318;
--ring: #16683E;              /* focus = brand */
--radius: 0.625rem;           /* 10px base */

/* Dark (optional, warm-neutral — NEVER navy/purple) */
--background: #141413;
--foreground: #F4F3EF;
--card: #1C1C1A;
--muted: #232320;
--muted-foreground: #A6A39B;
--border: #2A2A26;
--primary: #3FA873;
--primary-foreground: #0E1A13;
--accent: #1E2A22;
--accent-foreground: #9FE3BC;
--ring: #3FA873;
```
Radii: small (buttons/inputs) ~8px, medium ~10px, cards ~14px. Keep it consistent; do not make everything a full pill.
Shadows: flat by default with hairline borders. One soft shadow on hover only:
`--shadow-card-hover: 0 10px 30px -14px rgba(24,24,27,0.18);` No glows, ever.

### 4.4 Typography
Personality lives in the headlines; body stays quiet and hyper-legible (dense info on small/cheap screens).
- **Display (H1/H2, hero):** **Bricolage Grotesque** — characterful, contemporary, confident. (Not a serif — the serif-display look is an AI cliché. Not default Inter.)
- **Body / UI:** **Inter** (or Geist) — clean, legible, fast.
- Load both with **`next/font`** (self-hosted, zero layout shift). No external font CDNs.
- *Acceptable simpler alternative if you prefer one family:* **Hanken Grotesk** for both display + body with weight contrast. Pick one approach, justify it, and stay consistent.

Type scale (mobile-first):
```
H1/display: clamp(2rem, 6vw, 3.5rem), weight 600–700, tight tracking, font-display
H2:         clamp(1.5rem, 4vw, 2.25rem), font-display
H3:         1.25rem, weight 600
Body:       1rem–1.0625rem, line-height 1.6, Inter
Caption:    0.8125–0.875rem, muted-foreground
Price:      1.125–1.25rem, weight 600, tabular-nums
```

### 4.5 Spacing & rhythm
- **8px system.** Use multiples of 4, prefer multiples of 8 for layout (8 / 12 / 16 / 24 / 32 / 48 / 64 / 96).
- Generous whitespace. Consistent vertical rhythm between sections. Don't crowd; don't center everything — use real alignment and hierarchy.

### 4.6 Imagery
- Real, honest room photos are the design. Consistent aspect ratios (cards **4:3**, hero **3:2** or **16:9**).
- **Always `next/image`** with proper `sizes`, lazy-loaded below the fold. This is our single biggest speed lever — non-negotiable.
- Gentle treatment only. A subtle dark gradient is allowed solely for text-over-image legibility. No heavy filters.

### 4.7 Motion
150–200ms, ease-out. Hover lift of 1–2px on cards. Optional one scroll-reveal on the hero. No springs/bounce everywhere. **Respect `prefers-reduced-motion`.**

---

## 5. Anti-AI rules (READ THIS — it is the whole point)

A senior designer must not be able to tell this was AI-built. These are the habits that give it away. **Never do any of these:**

**The three current AI-image clichés — avoid all three:**
1. Warm cream background (~#F4F1EA) + high-contrast **serif** display + **terracotta** accent.
2. Near-black background + a single bright **acid-green/vermilion** accent.
3. Broadsheet layout: hairline rules everywhere, zero border-radius, dense newspaper columns.

**The tells from our own rejected prototype — fix every one:**
4. Dark-by-default for the consumer site. (We are **light** by default.)
5. Purple/violet/indigo brand colour or gradient buttons/active states.
6. **Emoji inside buttons, badges, or filters.** Replace with lucide icons: food → `UtensilsCrossed`, AC → `Snowflake`, verified → `BadgeCheck`, map → `Map`, search → `Search`.
7. Glowing / neon boxes (our fake "Interactive Map Coming Soon" glow). If a feature isn't ready, omit it cleanly — never ship a glowing placeholder.
8. Glassmorphism / heavy blur panels.
9. Full-width gradient "blob" hero.
10. More than **one** accent colour; multiple competing shadows; heavy drop shadows.
11. The default Inter-everywhere look with no display face.
12. "A card grid and nothing else." Vary rhythm: a strong photographic hero, a city section, lists, and real detail pages.

If you catch yourself drifting toward any of these, stop and choose the option grounded in *this* product instead.

---

## 6. Design process you must follow before building UI (from the design playbook)

Do this in your own reasoning, then show the human only when confident:
1. **Brainstorm a compact token system** for the screen: 4–6 named hex colours, the 2 type roles, a one-sentence layout concept (+ an ASCII wireframe), and the one signature element.
2. **Critique it against §5 and against "would I produce this exact thing for any similar brief?"** If a choice is a generic default rather than a decision made for ApnaKamra, revise it and note what changed and why.
3. Only then write code, deriving **every** colour and type decision from the locked plan.
4. Watch CSS specificity (type-based `.section` vs element selectors cancelling paddings/margins).

---

## 7. Code conventions

- `src/components/ui/*` → shadcn primitives (owned, themed).
- `src/components/*` → feature components, e.g. `StayCard`, `CityHero`, `FilterBar`, `AmenityList`, `StayGallery`.
- `src/lib/*` → api client, utils (`cn`), types.
- `src/app/*` → routes (App Router).
- One component per file; keep files under ~200 lines — split when larger.
- **No duplicated UI logic.** Extract shared pieces. Reuse the design tokens, never hardcode hex values in components.
- Use the `cn()` helper + Tailwind classes. No inline style objects except for genuinely dynamic values.
- Server Components by default; mark client components explicitly and keep them small.

---

## 8. Voice & copy (words are design material)

- Write from the student's side of the screen, plain and warm, sentence case, active voice.
- Buttons name the action and keep that name through the flow: **"Find rooms"** (not "Submit"), **"List your property"**, **"Contact owner."**
- Empty state is direction, not mood: *"No rooms match these filters yet — try widening your budget or area."* (Not "No data.")
- Error state explains + offers a fix: *"Couldn't load rooms. Check your connection and try again."* (Errors don't apologise and are never vague.)
- Indian context is fine and good (PG, sharing, mess/food, "near [landmark]") — but never cringe or slangy.

---

## 9. Accessibility (quality floor — always)

Semantic HTML, correct heading order, labels on every input, descriptive `alt` on images, visible `:focus-visible` states, AA colour contrast, full keyboard navigation. Radix (under shadcn) handles much of the interactive a11y — don't break it.

---

## 10. Performance budget (this is a feature)

- `next/image` for every photo; `next/font` for fonts.
- **SSG/ISR** for city, listing, and detail pages (cached at the edge → instant + great SEO). Cache API responses sensibly.
- Minimise client JS; import lucide icons individually; no heavy libraries.
- Targets: Lighthouse **Performance ≥ 90, Accessibility ≥ 95**, measured **mobile**. CLS ≈ 0 (no layout shift). It should feel instant on a mid-range Android.

---

## 11. Definition of done (every screen)

Not done until **all** of these are true:
- Verified responsive at **375px**, tablet, and desktop.
- Loading skeleton, empty state, and error state all implemented.
- Light mode polished (dark mode optional).
- Accessibility pass (§9).
- Uses only design tokens (§4) — no stray colours, no AI tells (§5).
- Self-verified in a browser with screenshots at mobile + desktop, compared against the references in §12.

---

## 12. Working rules & references

- **Work strictly phase-by-phase per `IMPLEMENTATION_PLAN.md`.** At the end of each phase: summarise what changed, show mobile + desktop screenshots, and **stop for the human's approval** before the next phase.
- **Build a `/style` kitchen-sink page early** (Phase 1) showing every token and component. Get the human to sign off on the *look* there before building real pages.
- **Use the browser to verify your own work** (Antigravity's built-in browser, or Playwright MCP in Claude Code): screenshot at mobile + desktop, compare to references, fix inconsistencies, repeat.
- **Use Context7** for current docs of any library before using version-specific APIs. (Brave Search is not available — that's fine; references below are named so no open-ended searching is needed.)
- **Ask the human before:** changing the stack, adding a heavy dependency, changing the design system, or restructuring folders.
- Commit after each phase with a clear message.

**References — for these specific qualities, not to copy:**
- *Airbnb* — honest photo-forward stays UX and trust signals.
- *Linear* — restraint, spacing discipline, typographic confidence.
- *Vercel* — clean surfaces and crisp neutrals.
- *Stripe* — clarity and documentation-grade polish.
- *Notion* — comfortable, readable typography.
