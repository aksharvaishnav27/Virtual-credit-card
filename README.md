# Virtual Credit Card Generator

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

A full-stack application for generating virtual credit cards to enhance safety for e-commerce purchases.

## Features

- **Virtual Card Generation**

  - Generate one-time-use virtual credit cards
  - Each card has a unique card number, CVV, expiry date, and spending limit
  - Optional merchant lock (restrict card to one domain)

- **Spending Limit and Expiration Control**

  - Set maximum spending limits
  - Set expiry date/time (minutes, hours, days)
  - Cards become inactive after exceeding limit or expiry

- **Transaction History**

  - Store and display card usage logs
  - Track merchant name, amount spent, timestamp, and status

- **Card Dashboard**

  - List of all generated cards
  - Filter by active or expired
  - View detailed history per card
  - Delete or disable cards

- **Authentication and Authorization**
  - Sign up and login using email and password
  - JWT-based authentication
  - Secure user data management

## Tech Stack

- **Frontend**: Next.js with React
- **Backend**: Node.js API routes
- **Database**: PostgreSQL
- **Styling**: TailwindCSS
- **Payments**: Stripe API integration
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Stripe account (for API keys)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/virtual-credit-card.git
cd virtual-credit-card
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/virtual_cards
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

4. Run database migrations

```bash
npx prisma migrate dev
```

5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Security Considerations

- Secure storage of card data (tokenized)
- Masking of sensitive fields (showing only last 4 digits)
- HTTPS and CSRF protection
- JWT token validation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
