# GearUp Backend

REST API for a sports & outdoor gear rental platform. Built for the Programming Hero / Apollo Backend Assignment 4.

Live URL: https://gearup-backend-1-2w94.onrender.com

## Tech Stack

- **Node.js + Express + TypeScript** — REST API
- **PostgreSQL + Prisma** — database + ORM
- **JWT** — authentication
- **Stripe** — payment processing
- **Zod** — request validation

## Features by Role

### Customer
- Browse and search gear
- Place rental orders
- Cancel orders (PLACED/CONFIRMED)
- Pay via Stripe
- Review returned gear

### Provider
- Manage gear inventory
- View incoming orders
- Update order status

### Admin
- Manage users (suspend/activate)
- Manage categories
- Oversee gear and rentals

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Environment Variables

See `.env.example` for the full list. You'll need:
- A Postgres database (e.g. [Neon](https://neon.tech))
- A [Stripe](https://dashboard.stripe.com) test-mode secret key
- For local webhook testing: [Stripe CLI](https://stripe.com/docs/stripe-cli) — `stripe listen --forward-to localhost:5000/api/payments/webhook`
- Optional: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`

## Endpoint Table

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Any | Current user |
| GET | /api/categories | Public | List categories |
| GET | /api/gear | Public | List gear (optional pagination) |
| GET | /api/gear/:id | Public | Gear details |
| POST | /api/provider/gear | Provider | Create gear |
| GET | /api/provider/gear | Provider | My gear |
| PUT | /api/provider/gear/:id | Provider | Update gear |
| DELETE | /api/provider/gear/:id | Provider | Delete gear |
| POST | /api/rentals | Customer | Create rental |
| GET | /api/rentals | Customer | My rentals |
| GET | /api/rentals/:id | Customer/Provider/Admin | Rental details |
| PATCH | /api/rentals/:id/cancel | Customer | Cancel rental |
| GET | /api/provider/orders | Provider | Incoming orders |
| PATCH | /api/provider/orders/:id | Provider | Update order status |
| POST | /api/payments/create | Customer | Create payment session |
| GET | /api/payments | Customer | My payments |
| GET | /api/payments/:id | Customer | Payment details |
| POST | /api/payments/webhook | Stripe | Webhook |
| POST | /api/reviews | Customer | Create review |
| GET | /api/admin/users | Admin | List users |
| PATCH | /api/admin/users/:id | Admin | Update user status |
| GET | /api/admin/gear | Admin | List all gear |
| GET | /api/admin/rentals | Admin | List all rentals |
| POST | /api/admin/categories | Admin | Create category |
| PATCH | /api/admin/categories/:id | Admin | Update category |
| DELETE | /api/admin/categories/:id | Admin | Delete category |