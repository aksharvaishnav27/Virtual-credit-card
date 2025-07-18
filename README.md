# 💳 Virtual Credit Card Generator

A full-stack Next.js application to securely generate one-time-use virtual credit cards for safe e-commerce transactions.

## 🚀 Features

### 🔐 Virtual Card Generation
- Create unique virtual cards (number, CVV, expiry date, limit)
- Optional merchant locking to a single domain
- Auto-expiry or deactivation after usage/spend limit

### 💸 Spending & Expiry Control
- Set per-card spending caps
- Configure expiration (minutes, hours, or days)

### 📊 Transaction History
- View complete card usage logs
- Track merchant, amount, time, and status

### 🧾 Card Dashboard
- Overview of active and expired cards
- Card filtering and status badges
- View detailed transaction history
- Disable or delete cards anytime

### 👤 Authentication & Authorization
- Email-based sign-up/login
- JWT-powered session management
- Secure user data handling

---

## 🧱 Tech Stack

| Layer       | Tech                  |
|-------------|------------------------|
| Frontend    | Next.js + React        |
| Backend     | Node.js API Routes     |
| Styling     | TailwindCSS            |
| Database    | PostgreSQL + Prisma    |
| Payments    | Stripe API             |
| Auth        | JWT                    |

---

## 🛠️ Getting Started

### ✅ Prerequisites
- Node.js (v18+)
- PostgreSQL
- Stripe Account (test keys)

### 📦 Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/virtual-credit-card.git
cd virtual-credit-card
