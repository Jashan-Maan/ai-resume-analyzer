# ✦ KIRA — AI Resume Analyzer And Job Tracker

**Optimize your resume. Ace the ATS. Land the interview.**

🚀 **Live Application:** [https://ai-resume-analyzer-ten-wheat.vercel.app/](https://ai-resume-analyzer-ten-wheat.vercel.app/)

Kira is an AI-powered resume analysis and job tracking platform built with Next.js 16, Google Gemini, and MongoDB.
Upload your resume, paste a job description, and get an instant ATS compatibility score
with actionable improvement suggestions — all in seconds.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?logo=mongodb)](https://www.mongodb.com/atlas)
[![Gemini](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Authentication](#-authentication)
- [AI Integration](#-ai-integration)
- [Rate Limiting](#-rate-limiting)
- [Deployment](#-deployment)
- [License](#-license)

---

## ✨ Features

### 🌐 Landing Page

- Fully designed marketing landing page with animated sections
- Hero section, stats bar, feature showcase, how-it-works guide, testimonials, and call-to-action
- Smooth Framer Motion scroll animations
- Responsive navbar with sign-in link

### 🔍 AI Resume Analysis

- Upload your resume as a PDF (up to 4 MB)
- Optionally paste a target job description for tailored analysis
- Receive an **ATS compatibility score (0–100)** powered by Gemini 2.5 Flash
- Get detailed strengths, weaknesses, and missing keyword reports
- Prioritized, actionable improvement suggestions (high / medium / low)
- Resume section detection (experience, education, skills, projects, summary)

### 🎤 Mock Interview Prep

- Upload your resume + optional job description to generate AI-powered interview questions
- **5 Technical questions** with difficulty levels (easy / medium / hard) and topic tags
- **3 Behavioral questions** with tips on what the interviewer is looking for
- **3 Project-based questions** tied to your specific resume projects
- Expandable question cards with coaching tips
- Powered by Gemini 3.5 Flash for advanced reasoning

### 📊 Analytics Dashboard

- Overview cards: total applications, interviews, rejections, and offers
- **Application status donut chart** (Recharts)
- **ATS score trend line chart** tracking your progress over time
- Quick-access stats: total analyses, average score, best score

### 📝 Job Application Tracker

- Full CRUD for job applications (company, role, status, job description, notes)
- Status management: `Applied` → `Interview` → `Offer` / `Rejected`
- Sortable table with status badges and inline actions (edit, delete)
- Zod-validated input on both client and server

### 👤 User Profile

- Profile page with avatar, name, email, role badge, and member-since date
- Career statistics grid: total analyses, jobs applied, avg ATS score, best score, interviews, offers
- Application breakdown with status percentages and progress bar
- ATS score summary panel
- Sign-out button

### 🔐 Authentication

- **Three sign-in methods:** Google OAuth, GitHub OAuth, and email/password credentials
- **Email/password signup** with Zod-validated registration form (name, email, password, confirm password)
- **Email verification** via 6-digit OTP code sent through NodeMailer + Gmail (10-minute expiry)
- OTP input with auto-advance, backspace navigation, and paste support
- JWT-based sessions — no server-side session store required
- Middleware-protected routes: unauthenticated users are redirected to `/login`
- Automatic user provisioning on first OAuth sign-in
- Password hashing with bcrypt (12 salt rounds)

### 📄 Analysis History

- Browse all past analyses with expandable detail cards
- Summary stats (total analyses, average ATS score, best score)
- Sorted by most recent, with analysis number badges

### 🛡️ Rate Limiting

- Per-user rate limiting powered by **Upstash Redis**
- **Resume analysis:** 5 requests per 3 hours
- **Interview questions:** 5 requests per 3 hours
- **Job CRUD:** 100 requests per 15 minutes
- Friendly error messages with reset countdown
- `X-RateLimit-Remaining` headers on API responses

---

## 🛠 Tech Stack

| Layer              | Technology                                                                                         |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router, React Server Components)                            |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/)                                                    |
| **Styling**        | [Tailwind CSS 4](https://tailwindcss.com/)                                                         |
| **UI Components**  | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)                        |
| **Animations**     | [Framer Motion](https://www.framer.com/motion/)                                                    |
| **Charts**         | [Recharts](https://recharts.org/)                                                                  |
| **Icons**          | [Lucide React](https://lucide.dev/)                                                                |
| **Auth**           | [NextAuth.js v5](https://authjs.dev/) (Google + GitHub OAuth + Credentials)                        |
| **Database**       | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose 9](https://mongoosejs.com/)           |
| **AI**             | [Google Gemini API](https://ai.google.dev/) (2.5 Flash + 3.5 Flash)                                |
| **Rate Limiting**  | [Upstash Redis](https://upstash.com/) + [@upstash/ratelimit](https://github.com/upstash/ratelimit) |
| **PDF Parsing**    | [unpdf](https://github.com/nicolo-ribaudo/unpdf)                                                   |
| **Email**          | [NodeMailer](https://nodemailer.com/) + [Gmail](https://www.gmail.com/)                            |
| **Password Hash**  | [bcryptjs](https://github.com/dcodeIO/bcrypt.js)                                                   |
| **Validation**     | [Zod 4](https://zod.dev/)                                                                          |
| **Date Utilities** | [date-fns](https://date-fns.org/)                                                                  |
| **Font**           | [Geist](https://vercel.com/font) (Sans + Mono)                                                     |

---

## 🏗 Architecture

```
┌────────────────────────────────────────────────────────┐
│                      Client (Browser)                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ Landing  │  │Dashboard │  │ Analyze  │  ...pages   │
│  │  Page    │  │          │  │          │             │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘             │
│       │              │             │                   │
│       ▼              ▼             ▼                   │
│  ┌─────────────────────────────────────────────┐       │
│  │           Next.js App Router (RSC)          │       │
│  │  Server Components + Client Components      │       │
│  └─────────────────┬───────────────────────────┘       │
└────────────────────┼───────────────────────────────────┘
                     │
         ┌───────────┼───────────────┐
         ▼           ▼               ▼
   ┌──────────┐ ┌──────────┐ ┌────────────┐
   │ NextAuth │ │ API      │ │ Middleware  │
   │ (OAuth + │ │ Routes   │ │ (Auth)     │
   │  Creds)  │ │          │ │            │
   └────┬─────┘ └────┬─────┘ └────────────┘
        │             │
        ▼             ├──────────────┬──────────────┐
   ┌──────────┐  ┌────▼─────┐  ┌────▼─────┐  ┌────▼─────┐
   │ MongoDB  │  │ Gemini   │  │ Upstash  │  │ NodeMailer │
   │ Atlas    │  │ AI       │  │ Redis    │  │ Gmail    │
   └──────────┘  └──────────┘  └──────────┘  └──────────┘
```

**Data Flow — Resume Analysis:**

1. User uploads PDF + optional job description → client sends `multipart/form-data` to `POST /api/analyze`
2. Rate limiter checks the user's request count against Upstash Redis
3. Server extracts text from PDF using `unpdf`
4. Extracted text + job description are sent to **Gemini 2.5 Flash** with a structured prompt
5. Gemini returns JSON with ATS score, strengths, weaknesses, missing keywords, suggestions, and section detection
6. Result is saved to MongoDB under the user's ID
7. Client renders the analysis result with score gauge, strength/weakness lists, and suggestion cards

**Data Flow — Mock Interview:**

1. User uploads PDF + optional job description → client sends `multipart/form-data` to `POST /api/interview`
2. Rate limiter checks the user's request count against Upstash Redis
3. Server extracts text from PDF using `unpdf`
4. Extracted text + job description are sent to **Gemini 3.5 Flash** with an interview prompt
5. Gemini returns JSON with technical, behavioral, and project-based questions
6. Client renders expandable question cards with tips and difficulty badges

**Data Flow — Signup & Email Verification:**

1. User submits name, email, password, and confirm password on `/signup`
2. Server validates input with Zod, hashes password with bcrypt, generates a 6-digit OTP
3. OTP is stored on the User document with a 10-minute expiry
4. Verification email is sent via **NodeMailer** using **Gmail**
5. User enters the 6-digit code on `/verify-email`
6. Server verifies the code, marks the user as verified, and redirects to `/login`

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── middleware.ts                 # Auth middleware — protects /dashboard routes
├── next.config.ts               # Next.js config (remote image patterns, redirect rules)
├── postcss.config.mjs           # PostCSS configuration for Tailwind CSS v4
├── components.json              # shadcn/ui configuration
├── eslint.config.mjs            # ESLint configuration
├── package.json                 # Project scripts and dependencies
├── tsconfig.json                # TypeScript configuration
├── .env.example                 # Required environment variables template
│
├── public/                      # Static assets
│   ├── logo.svg                 # Application logo
│   ├── google.svg               # Google provider icon
│   └── github.svg               # GitHub provider icon
│
└── src/
    ├── auth.ts                  # NextAuth.js v5 configuration
    │
    ├── app/
    │   ├── globals.css          # Global CSS containing Tailwind v4 directives
    │   ├── layout.tsx           # Root layout with typography and theme providers
    │   ├── page.tsx             # Landing/Marketing page
    │   │
    │   ├── login/
    │   │   ├── page.tsx         # Sign-in page with OAuth & Credentials
    │   │   └── actions.ts       # Server actions for OAuth
    │   │
    │   ├── signup/
    │   │   └── page.tsx         # Account registration page
    │   │
    │   ├── verify-email/
    │   │   └── page.tsx         # OTP verification page (email verification)
    │   │
    │   ├── dashboard/
    │   │   ├── layout.tsx       # Dashboard shell containing Sidebar and navigation
    │   │   ├── page.tsx         # Dashboard overview (stats, charts, summaries)
    │   │   ├── analyze/
    │   │   │   └── page.tsx     # Resume upload & analysis page
    │   │   ├── interview/
    │   │   │   └── page.tsx     # Mock interview questions generator page
    │   │   ├── analyses/
    │   │   │   └── page.tsx     # Analysis history listing
    │   │   ├── jobs/
    │   │   │   └── page.tsx     # Job application tracker table
    │   │   └── profile/
    │   │       └── page.tsx     # User profile page
    │   │
    │   └── api/
    │       ├── auth/
    │       │   ├── [...nextauth]/
    │       │   │   └── route.ts # NextAuth authentication API handler
    │       │   ├── signup/
    │       │   │   └── route.ts # Email/password sign-up API endpoint
    │       │   └── verify-email/
    │       │       └── route.ts # OTP verification API endpoint
    │       ├── analyze/
    │       │   └── route.ts     # Resume upload, parse and analysis API
    │       ├── interview/
    │       │   └── route.ts     # Mock interview generation API endpoint
    │       ├── jobs/
    │       │   ├── route.ts     # Jobs CRUD API (list/create)
    │       │   └── [id]/
    │       │       └── route.ts # Job item CRUD API (update/delete)
    │       └── user/
    │           └── route.ts     # User profile and stats API endpoint
    │
    ├── components/
    │   ├── ui/                  # UI design system components (Button, Card, Input, etc.)
    │   ├── auth/
    │   │   └── CredentialsForm.tsx # Credentials login and registration forms
    │   ├── email/
    │   │   └── VerificationEmail.tsx # React Email OTP verification template
    │   ├── shared/              # Landing page shared visual components
    │   │   ├── Navbar.tsx       # Navigation bar
    │   │   ├── Hero.tsx         # Hero section
    │   │   ├── StatsBar.tsx     # Statistics metrics highlight bar
    │   │   ├── Features.tsx     # Key features grid
    │   │   ├── HowItWorks.tsx   # Visual how-it-works block
    │   │   ├── Testimonials.tsx # Customer testimonials carousel
    │   │   ├── CallToAction.tsx # Call to action bar
    │   │   └── Footer.tsx       # Main footer
    │   └── dashboard/           # Dashboard-specific views
    │       ├── Sidebar.tsx      # Persistent dashboard sidebar
    │       ├── DashboardShell.tsx # Main dashboard layout wrapper
    │       ├── StatsCard.tsx    # Summary metrics card
    │       ├── StatusChart.tsx  # Donut status distribution chart
    │       ├── ScoreTrendChart.tsx # ATS trend chart
    │       ├── FileUpload.tsx   # PDF dropzone uploader
    │       ├── AnalysisResult.tsx # Detailed score & review breakdown
    │       ├── AnalysisCard.tsx # History summary card
    │       ├── InterviewResult.tsx # Custom question card layout
    │       ├── JobTable.tsx     # Responsive applications table
    │       ├── AddJobModal.tsx  # New job submission form modal
    │       ├── StatusBadge.tsx  # Styled state badge
    │       └── SignOutButton.tsx # Profile log-out trigger
    │
    ├── config/
    │   └── auth.config.ts       # NextAuth credential and OAuth configuration options
    │
    ├── helper/
    │   └── verifyCode.ts       # Code generation utilities (expiry validation)
    │
    ├── lib/
    │   ├── ai.ts               # Gemini Model integration (parsing structured responses)
    │   ├── dbConnect.ts        # Database connection reuse logic
    │   ├── pdfParser.ts        # Text extractor (unpdf wrapper)
    │   ├── rateLimiter.ts      # Rate limiter settings using Upstash Redis
    │   └── utils.ts            # Common helpers (clsx tailwind merging)
    │
    ├── models/
    │   ├── User.ts             # User document schema definition
    │   ├── Analysis.ts         # Resume analysis result model
    │   └── Job.ts              # Job application tracking model
    │
    ├── schemas/
    │   ├── AuthSchema.ts       # Login/Register validation rules
    │   └── JobSchema.ts        # Application fields validation rules
    │
    ├── services/
    │   └── email.ts            # NodeMailer transaction handling layer
    │
    └── types/
        ├── ApiResponse.ts      # Structured backend-frontend wrapper interface
        └── next-auth.d.ts      # User attributes types extension
```

---

## 🚀 Getting Started

### Prerequisites

| Tool                          | Version                             |
| ----------------------------- | ----------------------------------- |
| **Node.js**                   | 18.x or later                       |
| **npm**                       | 9.x or later (or yarn / pnpm / bun) |
| **MongoDB Atlas**             | Free tier (M0) works fine           |
| **Google Cloud Console**      | OAuth 2.0 client credentials        |
| **GitHub Developer Settings** | OAuth App credentials               |
| **Google AI Studio**          | Gemini API key                      |
| **Upstash**                   | Redis database (free tier works)    |
| **NodeMailer**                | Gmail account (free tier works)     |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Jashan-Maan/ai-resume-analyzer.git
cd ai-resume-analyzer

# 2. Install dependencies
npm install
```

### Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Then update `.env` with your values:

```env
# MongoDB — get your connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Google OAuth — create credentials at https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth — create an app at https://github.com/settings/developers
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# NextAuth — generate a random secret: openssl rand -base64 32
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# Gemini AI — get your API key from https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# Upstash Redis — get credentials from https://console.upstash.com
UPSTASH_REDIS_REST_URL=your_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_redis_rest_token

# Gmail API
GMAIL_CLIENT_ID=your_client_id
GMAIL_CLIENT_SECRET=your_client_secret
GMAIL_REFRESH_TOKEN=your_refresh_token
EMAIL_USER=your_email_id
```

**📌 Setting Up OAuth Providers (step-by-step)**

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** into your `.env`

#### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL** to `http://localhost:3000`
4. Set **Authorization callback URL** to `http://localhost:3000/api/auth/callback/github`
5. Copy **Client ID** and **Client Secret** into your `.env`

#### Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click **Create API Key**
3. Copy the key into your `.env` as `GEMINI_API_KEY`

#### Upstash Redis

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new **Redis** database (any region, free tier is fine)
3. Copy the **REST URL** and **REST Token** from the database details page
4. Paste them into your `.env` as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

#### Gmail API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use an existing one)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set **Application type** to "Web application"
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy **Client ID** and **Client Secret** into your `.env`

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll see the landing page — click **Get Started** to sign in or **Sign up free** to create an account.

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start development server (with hot reload) |
| `npm run build` | Create optimized production build          |
| `npm run start` | Start production server                    |
| `npm run lint`  | Run ESLint                                 |

---

## 📡 API Reference

All API routes are protected by NextAuth.js session authentication (except signup and verify-email). Unauthorized requests return `401`. Rate-limited requests return `429`.

### Authentication

#### `POST /api/auth/signup`

Register a new user with email and password. Sends a 6-digit OTP verification email via Gmail.

| Field             | Type     | Required | Description                  |
| ----------------- | -------- | -------- | ---------------------------- |
| `name`            | `string` | ✅       | Full name (min 2 characters) |
| `email`           | `string` | ✅       | Valid email address          |
| `password`        | `string` | ✅       | Password (min 6 characters)  |
| `confirmPassword` | `string` | ✅       | Must match `password`        |

**Content-Type:** `application/json`

**Response** `201 Created`:

```json
{
  "success": true,
  "message": "Account created! Please check your email to verify your account."
}
```

**Error** `400 Bad Request`:

```json
{
  "success": false,
  "message": "Email already registered"
}
```

#### `POST /api/auth/verify-email`

Verify a user's email with the 6-digit OTP code.

| Field   | Type     | Required | Description               |
| ------- | -------- | -------- | ------------------------- |
| `email` | `string` | ✅       | User's email address      |
| `code`  | `string` | ✅       | 6-digit verification code |

**Content-Type:** `application/json`

**Response** `200 OK`:

```json
{
  "success": true,
  "message": "Account verified successfully! You can now log in."
}
```

---

### Resume Analysis

#### `POST /api/analyze`

Upload a resume PDF for AI-powered analysis.

| Parameter        | Type         | Required | Description                                  |
| ---------------- | ------------ | -------- | -------------------------------------------- |
| `resume`         | `File` (PDF) | ✅       | Resume file (max 4 MB, PDF only)             |
| `jobDescription` | `string`     | ❌       | Target job description for tailored analysis |

**Content-Type:** `multipart/form-data`
**Rate Limit:** 5 requests per 3 hours per user

**Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "userId": "...",
    "atsScore": 72,
    "summary": "Strong technical resume with good project experience...",
    "strengths": ["Strong technical skills section", "..."],
    "weaknesses": ["Missing quantifiable achievements", "..."],
    "missingKeywords": ["CI/CD", "Agile", "..."],
    "suggestions": [
      {
        "priority": "high",
        "suggestion": "Add metrics to your experience bullets..."
      }
    ],
    "sectionsFound": {
      "experience": true,
      "education": true,
      "skills": true,
      "projects": true,
      "summary": false
    },
    "createdAt": "2026-06-02T10:30:00.000Z"
  },
  "remaining": 4
}
```

#### `GET /api/analyze`

Fetch the authenticated user's last 10 analyses.

**Response** `200 OK`:

```json
{
  "success": true,
  "data": [{ "...analysis objects..." }]
}
```

---

### Mock Interview Questions

#### `POST /api/interview`

Upload a resume PDF to generate AI-powered mock interview questions.

| Parameter        | Type         | Required | Description                                 |
| ---------------- | ------------ | -------- | ------------------------------------------- |
| `resume`         | `File` (PDF) | ✅       | Resume file (max 4 MB, PDF only)            |
| `jobDescription` | `string`     | ❌       | Job description for role-specific questions |

**Content-Type:** `multipart/form-data`
**Rate Limit:** 5 requests per 3 hours per user

**Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "technical": [
      {
        "question": "Explain how you would design a rate limiter...",
        "difficulty": "medium",
        "topic": "System Design"
      }
    ],
    "behavioral": [
      {
        "question": "Tell me about a time you handled a disagreement...",
        "tip": "Interviewer wants to see conflict resolution skills"
      }
    ],
    "projectBased": [
      {
        "question": "Walk me through the architecture of your KIRA project...",
        "project": "AI Resume Analyzer"
      }
    ]
  }
}
```

---

### User Profile

#### `GET /api/user`

Fetch the authenticated user's profile and aggregated career statistics.

**Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Jashan Maan",
      "email": "jashan@example.com",
      "image": "https://...",
      "role": "user",
      "createdAt": "2026-05-01T00:00:00.000Z"
    },
    "stats": {
      "totalJobs": 12,
      "totalAnalyses": 8,
      "avgAtsScore": 74,
      "bestScore": 92,
      "interviews": 4,
      "offers": 2,
      "applied": 5,
      "rejected": 1
    }
  }
}
```

---

### Job Applications

#### `GET /api/jobs`

Fetch all job applications for the authenticated user (sorted by most recent).

**Rate Limit:** 100 requests per 15 minutes per user

**Response** `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "company": "Google",
      "role": "Software Engineer",
      "status": "interview",
      "jobDescription": "...",
      "note": "Phone screen scheduled",
      "appliedDate": "2026-05-15T00:00:00.000Z"
    }
  ]
}
```

#### `POST /api/jobs`

Create a new job application. Request body is validated with Zod.

**Rate Limit:** 100 requests per 15 minutes per user

| Field            | Type                                                | Required | Description              |
| ---------------- | --------------------------------------------------- | -------- | ------------------------ |
| `company`        | `string`                                            | ✅       | Company name             |
| `role`           | `string`                                            | ✅       | Job title / role         |
| `status`         | `"applied" \| "interview" \| "rejected" \| "offer"` | ❌       | Defaults to `"applied"`  |
| `jobDescription` | `string`                                            | ✅       | Job description text     |
| `note`           | `string`                                            | ❌       | Personal notes           |
| `appliedDate`    | `Date`                                              | ❌       | Defaults to current date |

#### `PUT /api/jobs/:id`

Update an existing job application. Only the job owner can update it.

#### `DELETE /api/jobs/:id`

Delete a job application. Only the job owner can delete it.

---

## 🗄 Database Models

### User

| Field              | Type                | Description                                              |
| ------------------ | ------------------- | -------------------------------------------------------- |
| `name`             | `String`            | User's display name                                      |
| `email`            | `String`            | Unique, lowercase, validated email                       |
| `password`         | `String?`           | Hashed password (absent for OAuth-only accounts)         |
| `image`            | `String?`           | Profile picture URL (from OAuth provider)                |
| `role`             | `"user" \| "admin"` | User role (defaults to `"user"`)                         |
| `analysisCount`    | `Number`            | Total analyses performed (auto-incremented)              |
| `isVerified`       | `Boolean`           | Whether the user's email is verified (defaults to false) |
| `verifyCode`       | `String?`           | 6-digit OTP code for email verification                  |
| `verifyCodeExpiry` | `Date?`             | OTP expiry timestamp (10 minutes from generation)        |
| `createdAt`        | `Date`              | Auto-generated timestamp                                 |
| `updatedAt`        | `Date`              | Auto-generated timestamp                                 |

### Analysis

| Field             | Type                            | Description                                |
| ----------------- | ------------------------------- | ------------------------------------------ |
| `userId`          | `String`                        | Reference to User                          |
| `atsScore`        | `Number`                        | ATS compatibility score (0–100)            |
| `summary`         | `String`                        | 2–3 sentence assessment                    |
| `strengths`       | `String[]`                      | List of resume strengths                   |
| `weaknesses`      | `String[]`                      | List of resume weaknesses                  |
| `missingKeywords` | `String[]`                      | Keywords missing from resume               |
| `suggestions`     | `Array<{priority, suggestion}>` | Prioritized improvement suggestions        |
| `sectionsFound`   | `Object`                        | Boolean flags for detected resume sections |
| `createdAt`       | `Date`                          | Auto-generated timestamp                   |

### Job

| Field            | Type      | Description                                            |
| ---------------- | --------- | ------------------------------------------------------ |
| `userId`         | `String`  | Reference to User                                      |
| `company`        | `String`  | Company name                                           |
| `role`           | `String`  | Job title / role                                       |
| `status`         | `Enum`    | `"applied"`, `"interview"`, `"rejected"`, or `"offer"` |
| `jobDescription` | `String`  | Full job description                                   |
| `note`           | `String?` | Optional personal notes                                |
| `appliedDate`    | `Date`    | When the application was submitted                     |
| `createdAt`      | `Date`    | Auto-generated timestamp                               |

---

## 🔐 Authentication

KIRA uses [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with the **JWT strategy** and supports three authentication methods:

### OAuth Providers

- **Google OAuth 2.0** — sign in with your Google account
- **GitHub OAuth** — sign in with your GitHub account
- OAuth users are automatically verified (`isVerified: true`) and provisioned in MongoDB on first sign-in

### Credentials (Email/Password)

- Users can register with name, email, and password via the `/signup` page
- Passwords are hashed with **bcrypt** (12 salt rounds) before storage
- Registration requires **email verification** via a 6-digit OTP sent through **NodeMailer** using **Gmail**
- OTP codes expire after **10 minutes**
- Unverified users cannot sign in until they complete email verification
- The OTP input supports auto-advance, backspace navigation, and clipboard paste

### Session & Middleware

- **Session handling:** JWT tokens stored in HTTP-only cookies (no database sessions)
- **Middleware:** The `middleware.ts` file intercepts requests:
  - `/dashboard/*` routes → redirect to `/login` if unauthenticated
  - `/login` → redirect to `/dashboard` if already authenticated
- **Type safety:** NextAuth session types are augmented in `src/types/next-auth.d.ts` to include `user.id`

### Validation

- Signup input is validated with Zod (`src/schemas/AuthSchema.ts`):
  - Name: min 2 characters
  - Email: valid email format
  - Password: min 6 characters
  - Confirm password: must match password

---

## 🤖 AI Integration

KIRA integrates with the **Google Gemini API** through two models:

### Gemini 2.5 Flash — Resume Analysis

Used in `analyzeResume()` for fast, structured resume evaluation:

- Receives the full extracted resume text + job description
- Returns a structured JSON response with ATS score, strengths, weaknesses, missing keywords, suggestions, and section detection
- Scoring criteria:
  - **80–100:** Excellent match
  - **60–79:** Good match, minor improvements needed
  - **40–59:** Average match, significant improvements needed
  - **0–39:** Poor match, major revision required

### Gemini 3.5 Flash — Mock Interview Questions

Used in `generateInterviewQuestions()` for generating tailored interview prep:

- Generates personalized interview questions based on the resume and job description
- Returns three categories:
  - **Technical questions** (5) with difficulty level and topic
  - **Behavioral questions** (3) with tips on what the interviewer is looking for
  - **Project-based questions** (3) tied to specific resume projects

---

## 🛡️ Rate Limiting

KIRA uses [Upstash Redis](https://upstash.com/) with the `@upstash/ratelimit` package to protect API routes from abuse:

| Route                 | Limit                   | Strategy       |
| --------------------- | ----------------------- | -------------- |
| `POST /api/analyze`   | 5 requests per 3 hours  | Sliding window |
| `POST /api/interview` | 5 requests per 3 hours  | Sliding window |
| `GET/POST /api/jobs`  | 100 requests per 15 min | Sliding window |

- Rate limits are applied **per authenticated user** (keyed by user ID)
- Exceeded limits return `429 Too Many Requests` with a message indicating when the limit resets
- Analytics are enabled for monitoring via the Upstash dashboard
- Configuration is centralized in `src/lib/rateLimiter.ts`

---

## 🚢 Deployment

**Live Link:** [https://ai-resume-analyzer-ten-wheat.vercel.app/](https://ai-resume-analyzer-ten-wheat.vercel.app/)

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env` to the Vercel project settings
4. Update `NEXTAUTH_URL` to your production domain
5. Update OAuth redirect URIs in Google Cloud Console and GitHub Developer Settings to point to your production domain
6. Deploy

### Other Platforms

KIRA is a standard Next.js application and can be deployed on any platform that supports Node.js:

- **AWS Amplify** / **EC2**
- **Railway**
- **Render**
- **Docker** (use `next build` + `next start`)

> **Important:** Ensure `NEXTAUTH_URL` always matches your deployment URL, and update all OAuth redirect URIs accordingly.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by [Jashan Maan](https://github.com/Jashan-Maan)**
