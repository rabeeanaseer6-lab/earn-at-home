# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: JWT (jsonwebtoken) for admin panel

## Artifacts

### Earn at Home (`artifacts/earn-at-home`)
React + Vite web app — Pakistan's #1 screenshot verification platform. Pakistani localization with EasyPaisa/JazzCash payouts.

**Public Pages:**
- `/` — Pakistani hero ("Pakistan's #1 Screenshot Processing Platform"), Join Now WhatsApp CTA, income estimator slider, live stats bar (workers/screenshots/PKR paid), EasyPaisa/JazzCash/Bank Transfer payment logos, scrolling live payout ticker, leaderboard top 10, worker search, training section with WhatsApp CTA, recent blog posts, FAQ (Pakistani context), floating WhatsApp button (03092821856)
- `/training` — Free training page: 4-step process, WhatsApp join CTA, benefits grid, FAQ about EasyPaisa/JazzCash payments
- `/leaderboard` — Public verification portal with worker search + full stats (uploads, valid, duplicates, payable)
- `/calculator` — Earnings calculator with 3 sliders (screenshots/day, working days, accuracy %)
- `/blog` — Blog listing with category filter tabs
- `/blog/:slug` — Blog post detail with HTML content and related posts sidebar
- `/help` — Help center with 4 accordion sections
- `/privacy` — Privacy Policy
- `/terms` — Terms of Service
- `/disclaimer` — Earning Disclaimer

**Admin Panel:**
- `/admin` — Login with password
- `/admin/dashboard` — 6 tabs: Overview, Workers, Payments, Pending Payouts, Blog, Upload Stats

**Admin Features:**
- Pending Payouts tab: Shows all pending payments with "Mark as Paid via EasyPaisa/JazzCash/Bank" buttons
- Upload Stats tab includes ZIP Batch Upload auto-checker: upload a worker's ZIP → system extracts images, detects exact duplicates via SHA-256 hash, auto-updates worker stats (totalUploads, validCount, duplicateCount)

**Design:** Navy `#1a2744`, Gold `#c9a227`, Montserrat font, mobile-responsive

### API Server (`artifacts/api-server`)
Express 5 API server.

**Routes:**
- Workers CRUD + search
- Worker stats (totalUploads, validCount, duplicateCount) — PATCH `/workers/:id/stats/update`
- Payments CRUD with auto balance update
- Admin login/verify (JWT)
- Leaderboard — includes `screenshotsProcessed` aggregate
- Blog CRUD (slug-based, public read / admin write)

Rate: **Rs 5 per valid screenshot** (`RATE_PER_IMAGE` constant in workers.ts)

## Database Schema

### workers
- `id` (serial, PK)
- `worker_id` (text, unique) — public facing ID like "WRK001"
- `name` (text)
- `balance` (numeric 12,2) — cumulative earnings in Rs
- `total_uploads`, `valid_count`, `duplicate_count` (integer) — upload stats
- `created_at`, `updated_at` (timestamptz)

### payments
- `id` (serial, PK)
- `worker_id` (integer, FK → workers.id)
- `amount` (numeric 12,2) — payment amount in Rs
- `description` (text)
- `created_at` (timestamptz)

### blog_posts
- `id` (serial, PK)
- `slug` (text, unique)
- `title`, `excerpt`, `content` (text — content is HTML)
- `category` (text)
- `tags` (text[])
- `featured_image_url` (text, nullable)
- `published` (boolean)
- `published_at` (timestamptz, nullable)
- `created_at` (timestamptz)

## Key Commands

- `pnpm run typecheck:libs` — typecheck libs only
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec (ALWAYS fix `lib/api-zod/src/index.ts` after to remove the duplicate export)
- `pnpm --filter @workspace/db run push` — push DB schema changes
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Important Notes

- `lib/api-zod/src/index.ts` must only export: `export * from "./generated/api";` — never add `./generated/types` (duplicate exports)
- Admin password defaults to `admin123`, configurable via `ADMIN_PASSWORD` env var
- Admin auth uses JWT stored in localStorage under key `admin_token`
- `setAuthTokenGetter` is wired in `artifacts/earn-at-home/src/lib/utils.ts` (imported in App.tsx to trigger side effect)
- `formatRupee` utility uses `Intl.NumberFormat en-IN INR`
- Blog content is stored as HTML and rendered with `dangerouslySetInnerHTML`
