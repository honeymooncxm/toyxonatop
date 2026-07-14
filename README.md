# To'yxonaTop

Uzbekistan's largest online marketplace for wedding banquet halls — search, compare, and contact venues; owners list halls for admin approval; admins moderate listings, reviews, users and ads.

## Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Next.js Route Handlers (no separate server)
- **Database**: SQLite via Prisma (dev) — swap to PostgreSQL for production (see below)
- **Auth**: JWT (jose) in an httpOnly cookie, bcrypt password hashing
- **i18n**: next-intl — Uzbek (default), Russian, English at `/uz`, `/ru`, `/en`
- **Images**: Cloudinary (optional; falls back to locally-rendered SVG placeholders when unconfigured)
- **Maps**: key-free Google Maps embed (`maps.google.com/maps?...&output=embed`)

## Getting started

```bash
npm install
npx prisma migrate deploy   # create dev.db
npx prisma db seed          # seed services, categories, ~24 demo venues, users
npm run dev
```

Open http://localhost:3000.

## Seeded accounts

All passwords are set in `.env` (`ADMIN_PASSWORD`) or hardcoded in `prisma/seed.ts` for demo accounts.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@toyxonatop.uz` | value of `ADMIN_PASSWORD` in `.env` |
| Owner | `owner1@toyxonatop.uz` … `owner10@toyxonatop.uz` | `Owner123!` |
| Customer | `customer1@toyxonatop.uz` … `customer6@toyxonatop.uz` | `Customer123!` |

## Environment variables

See `.env.example`. Everything works out of the box with SQLite and no third-party keys. To go further:

- **Postgres**: change `provider` in `prisma/schema.prisma` to `"postgresql"`, set `DATABASE_URL`, run `npx prisma migrate deploy`.
- **Cloudinary**: set `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` to enable real image uploads via `/api/upload`.
- **Google Maps**: not required — the embed and "open in maps" links work without a key.

## Project structure

```
app/[locale]/        localized pages (home, search, venue detail, auth, owner, admin)
app/api/              route handlers (auth, venues, reviews, favorites, admin, upload)
components/           layout, ui, venue, home, search, owner, admin, providers
lib/                  prisma client, auth, validations, regions, maps, cloudinary
prisma/               schema, migrations, seed script
messages/             uz.json / ru.json / en.json translation dictionaries
store/                zustand stores (favorites, compare)
```

## Deployment

Designed for Vercel: push to a repo, import into Vercel, set env vars (swap `DATABASE_URL` to a hosted Postgres), and deploy.

For a full step-by-step guide (Postgres setup, production seeding without demo data, Cloudinary, custom domain, security checklist), see [DEPLOY.md](./DEPLOY.md) (in Russian).
# toyxonatop
