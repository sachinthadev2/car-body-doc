# Car Body Doc

Website and back office for **Car Body Doc** — mobile smash repairs across Sydney.

Next.js 15 (App Router) · TypeScript · Tailwind v4 · Prisma 7 · Neon Postgres · MailerSend

---

## Quick start

```bash
npm install
```

Copy `.env.example` to `.env` and fill it in, then:

```bash
npm run db:migrate
```

```bash
npm run db:seed
```

```bash
npm run dev
```

Site: http://localhost:3000 · Admin: http://localhost:3000/admin/login

---

## Environment variables

| Variable | What it does |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string |
| `AUTH_SECRET` | Signs the session cookie. Generate with `openssl rand -base64 32` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` | Used by `npm run db:seed` to create or update the admin login |
| `MAILERSEND_API_TOKEN` | MailerSend API token. **Leave blank and emails are logged to the console instead** — handy in development |
| `MAIL_FROM_EMAIL` / `MAIL_FROM_NAME` | Sender identity (the domain must be verified in MailerSend) |
| `MAIL_ADMIN_TO` | Where new quote / booking / enquiry notifications land |
| `NEXT_PUBLIC_SITE_URL` | Public site URL — used in emails, sitemap and metadata |

> **Security:** the Neon password was shared in plain text during development. Rotate it in the Neon console before going live and update `DATABASE_URL`. `.env` is git-ignored; never commit it.

---

## Pages

**Public** — `/` home · `/services` + a page per service · `/quote` (multi-step form with photo upload) · `/book` · `/gallery` · `/about` · `/service-areas` · `/contact` · `/faq` · `/privacy` · `/terms`

**Customer** — `/login`, `/register`, `/account` (quotes + bookings), `/account/quotes/[id]` (see the price, accept and book)

**Admin** — `/admin/login`, `/admin` (dashboard), `/admin/quotes` + detail, `/admin/bookings` + detail, `/admin/customers`, `/admin/messages`, `/admin/settings`

Guests can quote and book without an account. When someone registers with the same email, their earlier guest quotes and bookings are attached to the new account automatically.

---

## Editing content

Nearly all site copy lives in **`src/lib/site.ts`** — phone number, email, hours, services and prices, suburbs, FAQs, testimonials and the gallery. Change it there and it updates everywhere, including emails and structured data.

**Photos.** The gallery is deliberately hardcoded (no admin screen to maintain):

1. Drop your images into `public/gallery/`
2. Update the `gallery` array in `src/lib/site.ts` — each entry takes a `before`, `after`, `title`, `service` and `suburb`

The placeholder artwork currently in `public/` (`hero.svg`, `trailer.svg`, `gallery/*.svg`) is stand-in only. Replace it with real photos — the trailer shot is the strongest trust asset you have — then point `business.heroImage` and `business.trailerImage` at the new files.

---

## Emails

Sent through MailerSend from `src/lib/mail.ts`:

| Trigger | Goes to |
|---|---|
| Quote request submitted | Customer (confirmation + reference) and admin |
| Admin sends a price | Customer, with a one-click booking link |
| Booking requested | Customer and admin |
| Admin confirms / reschedules / completes | Customer (optional tick box) |
| Contact form | Admin, with reply-to set to the customer |

With no API token set, every email is logged to the server console instead of being sent — nothing breaks. A failed send never fails the customer's submission.

---

## Damage photos

Uploads are validated (JPG/PNG/WEBP/HEIC, max 5 files, 8MB each) and written to `public/uploads/YYYY/MM/`.

**This needs a server with a writable, persistent disk** — a VPS, a Docker volume or a Render disk. On a read-only serverless filesystem (Vercel) the uploads will fail. Swapping to object storage means rewriting one function: `savePhotos` in `src/lib/uploads.ts`.

---

## Dates

Booking dates are calendar dates, not timestamps: stored in a Postgres `DATE` column as UTC midnight and always read and formatted in UTC (`src/lib/dates.ts`). This is deliberate — with local-time handling, a booking date silently shifts a day each time an admin saves it from a timezone ahead of UTC, which is exactly what Sydney is.

---

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:seed` | Create/update the admin account from `.env` |
| `npm run db:studio` | Prisma Studio — browse the database |
| `npm run db:reset-demo` | Delete all customer data, keep admin logins |
| `npm run lint` | ESLint |

---

## Deploying

1. Rotate the Neon password and set all environment variables on the host
2. `npm run db:deploy` to apply migrations
3. `npm run db:seed` once to create the admin login, then change `ADMIN_PASSWORD`
4. Verify your sending domain in MailerSend and set the token
5. Set `NEXT_PUBLIC_SITE_URL` to the live domain (it feeds the sitemap and email links)
6. Point `/public/uploads` at persistent storage

Before launch, have the `/privacy` and `/terms` pages reviewed — they are a sensible starting point, not legal advice.
