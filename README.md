# GroupBuy Tools

Premium SEO tools platform — public marketing site, user dashboard, admin panel, Stripe subscriptions, and automated tool access.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **NextAuth.js** (email/password credentials)
- **PostgreSQL** via Supabase + **Prisma** ORM
- **Stripe** (Milestone 2)
- **React Hook Form** + **Zod**

## Prerequisites

- Node.js 18+
- PostgreSQL database (Supabase recommended)

## Setup

1. **Clone and install**

   ```bash
   npm install
   ```

2. **Configure environment**

   Copy `.env.example` to `.env` and fill in:

   - `DATABASE_URL` — your Supabase PostgreSQL connection string
   - `NEXTAUTH_URL` — `http://localhost:3000` for local dev
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`

3. **Run database migrations and seed**

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Milestone 1 — What's Included

- Design system (brand colors, Inter font, component rules)
- Public pages: Home, Pricing, About, Contact, Legal
- Auth: Signup, Login (NextAuth credentials + bcrypt)
- Route protection middleware for `/dashboard/*` and `/admin/*`
- Empty dashboard shell after login
- Prisma schema + seed data (3 plans, 6 tools)

## Project Structure

```
app/
  (marketing)/     # Public site with Navbar + Footer
  (auth)/          # Login & Signup
  dashboard/       # User dashboard (Milestone 1 shell)
  api/auth/        # NextAuth + signup endpoint
components/        # Reusable UI components
lib/               # Prisma client, auth config, validations
prisma/            # Schema, migrations, seed
```

## Demo Flow (Milestone 1)

1. Visit homepage → browse pricing
2. Sign up with name, email, password
3. Log in → redirected to `/dashboard` (empty state)
4. Unauthenticated users cannot access `/dashboard`

## License

Private — Ahmad Safdar / GroupBuy Tools
