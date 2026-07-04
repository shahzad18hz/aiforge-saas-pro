# 🤖 AIForge — Full Stack AI SaaS Content Generator

A production-ready AI SaaS application built with Next.js 15, TypeScript, MongoDB, NextAuth, OpenAI, and Stripe.

---

## ✨ Features

### 🔐 Authentication
- Email/password registration & login
- Google OAuth sign-in
- Forgot/reset password (email link)
- JWT session management
- Protected routes via middleware

### 📊 Dashboard
- Usage statistics & credit tracker
- Generation history with filters
- Tool breakdown analytics
- Subscription status

### 🤖 AI Tools (5 Tools)
| Tool | Credits | Description |
|------|---------|-------------|
| Blog Generator | 3 | SEO-optimized blog posts |
| Product Description | 1 | Conversion-focused copy |
| Social Media Post | 1 | Platform-optimized posts |
| Email Generator | 2 | High-converting emails |
| SEO Meta Tags | 1 | Rank higher on Google |

### 💳 Subscriptions
| Plan | Price | Credits |
|------|-------|---------|
| Free | $0/mo | 10/month |
| Pro | $29/mo | 500/month |

### 🛡️ Admin Panel
- User management (edit plan, credits, role)
- Revenue & analytics dashboard
- Subscription management
- Real-time stats

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key
- Stripe account
- Google OAuth credentials (optional)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/ai-saas.git
cd ai-saas
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Fill in your values (see [Environment Variables](#-environment-variables)).

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

Create `.env.local` with these values:

```env
# ── Required ──────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-min-32-chars   # openssl rand -base64 32

MONGODB_URI=mongodb+srv://...              # MongoDB Atlas connection string

OPENAI_API_KEY=sk-...                      # OpenAI API key

# ── Google OAuth (optional but recommended) ───────────
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxx

# ── Stripe (required for payments) ────────────────────
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...

# ── Email (for password reset) ────────────────────────
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=you@gmail.com
EMAIL_PASS=your-app-password             # Gmail App Password
EMAIL_FROM=noreply@yourapp.com

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
ADMIN_EMAIL=admin@yourapp.com
```

### Getting API Keys

**OpenAI:** https://platform.openai.com/api-keys

**Stripe:**
1. https://dashboard.stripe.com/apikeys
2. Create a Product → Price (recurring monthly $29)
3. Copy the Price ID → `STRIPE_PRO_MONTHLY_PRICE_ID`
4. Webhook: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

**Google OAuth:**
1. https://console.cloud.google.com
2. Create project → Credentials → OAuth 2.0
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

**MongoDB:**
1. https://cloud.mongodb.com → Create free cluster
2. Database Access → Create user
3. Network Access → Allow 0.0.0.0/0 (or your IP)
4. Connect → Drivers → Copy URI

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── (auth pages)     # /auth/login, /register, /forgot-password
│   ├── dashboard/       # Main user dashboard
│   ├── tools/           # 5 AI tool pages
│   ├── admin/           # Admin panel
│   └── api/             # All API routes
│       ├── auth/        # NextAuth + register + reset
│       ├── generate/    # 5 AI generation endpoints
│       ├── stripe/      # Checkout, webhook, portal
│       └── users/       # Profile, stats, history
├── components/
│   ├── layout/          # Sidebar, Header, Providers
│   ├── tools/           # Shared ToolWrapper
│   └── ui/              # Button, Card, Badge, Modal...
├── hooks/               # React Query hooks
├── lib/                 # MongoDB, Auth, OpenAI, Stripe, Utils
├── store/               # Zustand global state
├── styles/              # Global CSS
└── types/               # TypeScript types
```

---

## 🐳 Docker Deployment

### Build and run with Docker Compose

```bash
# Copy and fill env vars
cp .env.example .env.local

# Start app + MongoDB
docker-compose up -d

# With MongoDB Express UI
docker-compose --profile tools up -d
```

Access:
- App: http://localhost:3000
- MongoDB Express: http://localhost:8081 (admin/admin123)

---

## ▲ Vercel Deployment

### One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Manual steps

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXTAUTH_SECRET
vercel env add MONGODB_URI
# ... (all required vars)

# Deploy to production
vercel --prod
```

### Stripe Webhook for Production

```bash
# In Stripe Dashboard → Webhooks → Add endpoint
# URL: https://yourapp.vercel.app/api/stripe/webhook
# Events: checkout.session.completed, customer.subscription.*,  invoice.payment_succeeded
```

---

## 🔒 Security Features

- JWT authentication with NextAuth
- Route protection via Next.js middleware
- Role-based access control (user/admin)
- Rate limiting (60 req/min API, 30 req/min generation)
- Input validation with Zod on all endpoints
- Password hashing with bcrypt (12 rounds)
- Security headers (X-Frame-Options, CSP, etc.)
- Stripe webhook signature verification

---

## 🛠 Make Your First Admin

After registering your account, run in MongoDB:

```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Or set `ADMIN_EMAIL=your@email.com` in `.env.local` and use the seed script:

```bash
npm run seed:admin
```

---

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | Custom + shadcn patterns |
| Auth | NextAuth v4 |
| Database | MongoDB + Mongoose |
| AI | OpenAI GPT-4o-mini |
| Payments | Stripe |
| State | Zustand + React Query |
| Validation | Zod |
| Forms | React Hook Form |
| Charts | Recharts |
| Animations | Framer Motion |
| Email | Nodemailer |
| Deployment | Vercel / Docker |

---

## 📄 License

MIT © AIForge
