# GearUp Backend 🏋️

REST API for a sports & outdoor gear rental platform. Built for the Programming Hero / Apollo Backend Assignment 4.

## Tech Stack

- **Node.js + Express + TypeScript** — REST API
- **PostgreSQL + Prisma** — database + ORM
- **JWT** — authentication
- **Stripe** — payment processing
- **Zod** — request validation

## Roles

- **Customer** — browse gear, place rentals, pay, review
- **Provider** — manage gear inventory, fulfill orders
- **Admin** — manage users, oversee platform

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Environment Variables

See `.env.example` for the full list. You'll need:
- A Postgres database (e.g. [Neon](https://neon.tech))
- A [Stripe](https://dashboard.stripe.com) test-mode secret key
- For local webhook testing: [Stripe CLI](https://stripe.com/docs/stripe-cli) → `stripe listen --forward-to localhost:5000/api/payments/webhook`

## Admin Credentials

Created automatically by the seed script: