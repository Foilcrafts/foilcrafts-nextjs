# Foil Crafts — Next.js + Supabase

A trade-partner website for **Foil Crafts** (Italian transfer foils, Noida) with real customer authentication, gated PDF library, and admin approval workflow.

**Tech stack:** Next.js 16 (App Router, TypeScript, server actions, middleware) + Supabase Auth + Postgres + hybrid local-file image storage.

---

## Quick start

### Prerequisites
- Node.js 22.x (the project uses Next 16 with React 19)
- A Supabase project (see `utils/supabase/SUPABASE-SETUP.md` — 20 min setup)

### Local dev

```bash
# 1. Install deps
npm install

# 2. Copy env example + fill in your Supabase URL + anon key
cp .env.local.example .env.local
# (then edit .env.local with the real values)

# 3. Run the dev server
npm run dev
```

Open http://localhost:3000.

### Production build

```bash
npm run build
npm run start
```

---

## Architecture overview

### Routes (18 total)

**Marketing pages (static, public)**
- `/` — Home (5-slide hero, manifesto, capabilities, catalog preview, CTA)
- `/about` — About page (two-col blocks + process grid + founders + heritage)
- `/foiling` — 14 foiling family cards (drill-down modal per card)
- `/digital-printing` — 10 print samples grid
- `/cut-plates-embossing` — 9 plate/die samples grid
- `/catalogs` — Catalog page (covers + download links to gated PDFs)
- `/contact` — Contact CTA + public "Request access" form + locked-library teaser

**Auth pages (static, public — but middleware redirects if already logged in)**
- `/login` — Sign in
- `/signup` — Request access (creates Supabase auth user + profile row with status='pending')
- `/forgot-password` — Send password reset email
- `/reset-password` — Set new password (linked from email)

**Auth flow routes (dynamic)**
- `/auth/confirm` — Supabase email confirmation redirect handler
- `/pending-approval` — Shown to logged-in users with status='pending'

**Protected routes (dynamic, gated by middleware)**
- `/library` — Customer library (catalog downloads + archive nav). Requires status='approved'.
- `/api/asset/[...path]` — Streams files from `/public/protected/`. Requires status='approved'.
- `/admin` — Admin approval queue. Requires role='admin'.

### Auth model

| User state | Can access |
|---|---|
| Anonymous | Marketing pages only |
| Signed up, email not confirmed | Sees Supabase email-confirmation flow |
| Confirmed, status='pending' | `/pending-approval` only (waits for admin) |
| status='approved', role='user' | All marketing pages + `/library` + `/api/asset/*` |
| status='approved', role='admin' | Everything above + `/admin` |

### Image / PDF storage strategy

**Public images** (marketing photography, product samples): in `/public/images/` — served statically by Next.js, cached by CDN. 100+ files, ~75 MB.

**Protected files** (catalog PDFs, future high-res archives): in `/public/protected/` — NOT served directly. Only accessible via `/api/asset/[...path]` which checks auth + approval status. The path prefix is meaningless at the URL level; the API route reads from `process.cwd()/public/protected/<requested-path>`.

This hybrid approach avoids paying for Supabase Storage (1 GB free tier → $25/mo for 100 GB) while keeping enforcement in the server-side middleware boundary.

---

## File map

```
foilcrafts-app/
├── README.md                         ← you are here
├── DEPLOY-GUIDE.md                   ← Vercel vs Hostinger deployment
├── TEST-CHECKLIST.md                 ← post-deploy verification checklist
├── package.json, tsconfig.json, …    ← Next.js config
├── proxy.ts                          ← auth + route gating (root level)
├── next.config.ts                    ← Next.js config
├── .env.local.example                ← env var template
│
├── app/
│   ├── layout.tsx                    ← root layout (Nav + Footer + fonts)
│   ├── globals.css                   ← all design CSS (preserved from static build)
│   ├── page.tsx                      ← Home
│   ├── about/, foiling/, …           ← 7 marketing pages
│   ├── login/, signup/, …            ← 4 auth pages
│   ├── pending-approval/             ← shown to status='pending' users
│   ├── library/                      ← gated customer library
│   ├── admin/                        ← admin approval queue
│   ├── auth/confirm/route.ts         ← Supabase email confirmation handler
│   ├── api/asset/[...path]/route.ts  ← protected file streamer
│   └── actions/                      ← server actions (auth, admin, access-request)
│
├── components/
│   ├── Nav.tsx                       ← sticky nav + hamburger drawer (client component)
│   ├── Footer.tsx                    ← footer (server component)
│   ├── HeroSlider.tsx                ← 5-slide auto-rotating hero (client)
│   ├── Marquee.tsx                   ← marquee strip (server)
│   ├── sections.tsx                  ← all static section components (server)
│   ├── CollectionsGrid.tsx           ← collection cards + drill-down modal (client)
│   ├── ItemsInline.tsx               ← uniform item grids for digital/cut-plates pages
│   ├── CustomerLoginSection.tsx      ← contact-page form (client)
│   ├── AuthCard.tsx                  ← shared auth-page layout (server)
│   └── auth-forms.tsx                ← LoginForm + SignupForm + … (client)
│
├── lib/
│   └── content.ts                    ← single source of truth — all site copy + image refs
│
├── utils/
│   └── supabase/
│       ├── client.ts                 ← browser Supabase client
│       ├── server.ts                 ← server Supabase client (Server Components, Actions)
│       ├── middleware.ts             ← session-refresh helper for proxy.ts
│       ├── schema.sql                ← paste into Supabase SQL Editor (creates tables + RLS)
│       └── SUPABASE-SETUP.md         ← step-by-step Supabase project setup (20 min)
│
└── public/
    ├── images/                       ← public marketing images (~75 MB, 200+ files)
    └── protected/                    ← PDFs + future gated content (only via /api/asset)
        └── catalogues/
            ├── foil-crafts-catalog-26.pdf
            └── foil-crafts-catalog-26-27.pdf
```

---

## Editing content

The site copy lives in **`lib/content.ts`** — a single TypeScript object exported as `content`. To change a tagline, swap an image path, add a foiling family, or update the address:

1. Open `lib/content.ts`
2. Find the field
3. Edit it
4. Save — the dev server hot-reloads instantly

For wholesale rewrites (e.g. adding a 15th foiling family), the file is auto-generated from `brief.yaml` in the original static build folder. Run the regen script if needed (it's in the static build's `scripts/` folder).

---

## Editing design

All CSS is in **`app/globals.css`** — preserved pixel-for-pixel from the static HTML build. CSS variables at the top control the design system:

```css
--bone: #F2EFE8;       /* warm off-white background */
--ink: #0E0E0C;        /* near-black text */
--gold: #C8A878;       /* accent + highlights */
--oxblood: #5C1A1B;    /* primary accent */
--serif: Fraunces;     /* display headings */
--sans: Inter;         /* body */
--mono: JetBrains Mono;/* meta + eyebrows */
```

Changes are global — touching one variable updates every section.

---

## Next steps for the developer

1. **Set up Supabase** — follow `utils/supabase/SUPABASE-SETUP.md` (20 min).
2. **Deploy** — follow `DEPLOY-GUIDE.md` (10 min via Vercel, 30 min via Hostinger).
3. **Promote your account to admin** — see `utils/supabase/SUPABASE-SETUP.md` Step 7.
4. **Test the flow end-to-end** — follow `TEST-CHECKLIST.md`.
5. **Hand the staging URL to the client** for review.
6. **Go live** — see "Going-live cutover plan" in DEPLOY-GUIDE.md.

---

## Authoritative facts (do NOT change)

- **HQ address:** B-37, Sector 57, Noida, UP 201301 (the v1 static brief had wrong address — already corrected here)
- **Founder:** Gaurav Kapoor (NOT Gautam — easy to mis-spell)
- **Phone:** +91 9899 71 9197
- **Email:** info@foilcrafts.com
- **Tagline:** Transferring Value To Surface
- **Distributor relationship:** Authorised C.F.M. (Cartiere Filtrazioni Materie, Lombardy, Italy) since 1994

---

## License / ownership

Built for Foil Crafts (Gaurav Kapoor). All code, copy, and assets are property of Foil Crafts.

Built by [RAAY Creative](https://raay.in) — Anisha Dogra + Abhigyan Mahanta.
