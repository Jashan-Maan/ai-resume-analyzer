# ✦ KIRA — AI Resume Analyzer And Job Tracker

**Optimize your resume. Ace the ATS. Land the interview.**

An AI-powered resume analysis platform built with Next.js 16, Google Gemini, and MongoDB.
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

- OAuth sign-in via **Google** and **GitHub** (NextAuth.js v5)
- JWT-based sessions — no server-side session store required
- Middleware-protected routes: unauthenticated users are redirected to `/login`
- Automatic user provisioning on first sign-in

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

| Layer              | Technology                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16](https://nextjs.org/) (App Router, React Server Components)                  |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/)                                          |
| **Styling**        | [Tailwind CSS 4](https://tailwindcss.com/)                                               |
| **UI Components**  | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)              |
| **Animations**     | [Framer Motion](https://www.framer.com/motion/)                                          |
| **Charts**         | [Recharts](https://recharts.org/)                                                        |
| **Icons**          | [Lucide React](https://lucide.dev/)                                                      |
| **Auth**           | [NextAuth.js v5](https://authjs.dev/) (Google + GitHub OAuth)                            |
| **Database**       | [MongoDB Atlas](https://www.mongodb.com/atlas) via [Mongoose 9](https://mongoosejs.com/) |
| **AI**             | [Google Gemini API](https://ai.google.dev/) (2.5 Flash + 3.5 Flash)                      |
| **Rate Limiting**  | [Upstash Redis](https://upstash.com/) + [@upstash/ratelimit](https://github.com/upstash/ratelimit) |
| **PDF Parsing**    | [unpdf](https://github.com/nicolo-ribaudo/unpdf)                                         |
| **Validation**     | [Zod 4](https://zod.dev/)                                                                |
| **Date Utilities** | [date-fns](https://date-fns.org/)                                                        |
| **Font**           | [Geist](https://vercel.com/font) (Sans + Mono)                                           |

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
   │ (OAuth)  │ │ Routes   │ │ (Auth)     │
   └────┬─────┘ └────┬─────┘ └────────────┘
        │             │
        ▼             ├──────────────┐
   ┌──────────┐  ┌────▼─────┐  ┌────▼─────┐
   │ MongoDB  │  │ Gemini   │  │ Upstash  │
   │ Atlas    │  │ AI       │  │ Redis    │
   └──────────┘  └──────────┘  └──────────┘
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

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── middleware.ts                 # Auth middleware — protects /dashboard routes
├── next.config.ts               # Next.js config (remote image patterns)
├── package.json
├── tsconfig.json
├── .env.example                 # Required environment variables template
│
├── public/                      # Static assets (logo, OAuth provider icons)
│   ├── logo.svg
│   ├── google.svg
│   └── github.svg
│
└── src/
    ├── auth.ts                  # NextAuth.js v5 configuration (Google + GitHub)
    │
    ├── app/
    │   ├── globals.css          # Global styles + Tailwind base
    │   ├── layout.tsx           # Root layout (Geist font, metadata)
    │   ├── page.tsx             # Landing page (Hero, Features, Testimonials, etc.)
    │   │
    │   ├── login/
    │   │   ├── page.tsx         # OAuth sign-in page (Google + GitHub buttons)
    │   │   └── actions.ts       # Server actions for sign-in
    │   │
    │   ├── dashboard/
    │   │   ├── layout.tsx       # Dashboard shell (sidebar + main content)
    │   │   ├── page.tsx         # Dashboard overview (stats, charts)
    │   │   ├── analyze/
    │   │   │   └── page.tsx     # Resume upload + AI analysis form
    │   │   ├── interview/
    │   │   │   └── page.tsx     # Mock interview question generator
    │   │   ├── analyses/
    │   │   │   └── page.tsx     # Analysis history listing
    │   │   ├── jobs/
    │   │   │   └── page.tsx     # Job application tracker
    │   │   └── profile/
    │   │       └── page.tsx     # User profile + career statistics
    │   │
    │   └── api/
    │       ├── auth/
    │       │   └── [...nextauth]/
    │       │       └── route.ts # NextAuth API route handler
    │       ├── analyze/
    │       │   └── route.ts     # POST: analyze resume / GET: fetch analyses
    │       ├── interview/
    │       │   └── route.ts     # POST: generate mock interview questions
    │       ├── jobs/
    │       │   ├── route.ts     # GET: list jobs / POST: create job
    │       │   └── [id]/
    │       │       └── route.ts # PUT: update job / DELETE: delete job
    │       └── user/
    │           └── route.ts     # GET: user profile + aggregated stats
    │
    ├── components/
    │   ├── ui/                  # shadcn/ui primitives (Button, Card, Badge, etc.)
    │   ├── shared/              # Landing page components
    │   │   ├── Navbar.tsx       # Landing page navigation bar
    │   │   ├── Hero.tsx         # Hero section with CTA
    │   │   ├── StatsBar.tsx     # Stats counter bar
    │   │   ├── Features.tsx     # Feature showcase grid
    │   │   ├── HowItWorks.tsx   # Step-by-step guide section
    │   │   ├── Testimonials.tsx # User testimonials carousel
    │   │   ├── CallToAction.tsx # Bottom CTA section
    │   │   └── Footer.tsx       # Page footer
    │   └── dashboard/           # Dashboard-specific components
    │       ├── Sidebar.tsx      # Navigation sidebar with user avatar
    │       ├── StatsCard.tsx    # Stat card with icon + trend text
    │       ├── StatusChart.tsx  # Application status donut chart
    │       ├── ScoreTrendChart.tsx # ATS score trend line chart
    │       ├── FileUpload.tsx   # Drag-and-drop PDF upload component
    │       ├── AnalysisResult.tsx # Full analysis result display
    │       ├── AnalysisCard.tsx # Expandable analysis history card
    │       ├── InterviewResult.tsx # Mock interview questions display
    │       ├── JobTable.tsx     # Job applications table with actions
    │       ├── AddJobModal.tsx  # Modal form for adding new jobs
    │       ├── StatusBadge.tsx  # Colored status badge component
    │       └── SignOutButton.tsx # Sign-out button for profile page
    │
    ├── lib/
    │   ├── ai.ts               # Gemini AI integration (analysis + interview questions)
    │   ├── dbConnect.ts        # MongoDB connection singleton
    │   ├── pdfParser.ts        # PDF text extraction using unpdf
    │   ├── rateLimiter.ts      # Upstash Redis rate limiters (analyze, interview, jobs)
    │   └── utils.ts            # Utility functions (cn helper)
    │
    ├── models/
    │   ├── User.ts             # User model (name, email, image, role, analysisCount)
    │   ├── Analysis.ts         # Analysis model (ATS score, strengths, weaknesses, etc.)
    │   └── Job.ts              # Job model (company, role, status, jobDescription, notes)
    │
    ├── schemas/
    │   └── JobSchema.ts        # Zod validation schemas for job CRUD
    │
    └── types/
        └── next-auth.d.ts      # NextAuth type augmentation (adds user.id to session)
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

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You'll see the landing page — click **Get Started** to sign in.

| Command         | Description                                |
| --------------- | ------------------------------------------ |
| `npm run dev`   | Start development server (with hot reload) |
| `npm run build` | Create optimized production build          |
| `npm run start` | Start production server                    |
| `npm run lint`  | Run ESLint                                 |

---

## 📡 API Reference

All API routes are protected by NextAuth.js session authentication. Unauthorized requests return `401`. Rate-limited requests return `429`.

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

| Parameter        | Type         | Required | Description                                        |
| ---------------- | ------------ | -------- | -------------------------------------------------- |
| `resume`         | `File` (PDF) | ✅       | Resume file (max 4 MB, PDF only)                   |
| `jobDescription` | `string`     | ❌       | Job description for role-specific questions         |

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

| Field           | Type                | Description                                 |
| --------------- | ------------------- | ------------------------------------------- |
| `name`          | `String`            | User's display name                         |
| `email`         | `String`            | Unique, lowercase, validated email          |
| `image`         | `String?`           | Profile picture URL (from OAuth provider)   |
| `role`          | `"user" \| "admin"` | User role (defaults to `"user"`)            |
| `analysisCount` | `Number`            | Total analyses performed (auto-incremented) |
| `createdAt`     | `Date`              | Auto-generated timestamp                    |
| `updatedAt`     | `Date`              | Auto-generated timestamp                    |

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

KIRA uses [NextAuth.js v5 (Auth.js)](https://authjs.dev/) with the **JWT strategy**:

- **Providers:** Google OAuth 2.0 and GitHub OAuth
- **Session handling:** JWT tokens stored in HTTP-only cookies (no database sessions)
- **Middleware:** The `middleware.ts` file intercepts requests:
  - `/dashboard/*` routes → redirect to `/login` if unauthenticated
  - `/login` → redirect to `/dashboard` if already authenticated
- **User provisioning:** On first sign-in, a new `User` document is created in MongoDB automatically
- **Type safety:** NextAuth session types are augmented in `src/types/next-auth.d.ts` to include `user.id`

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

| Route              | Limit                     | Strategy        |
| ------------------ | ------------------------- | --------------- |
| `POST /api/analyze`   | 5 requests per 3 hours | Sliding window  |
| `POST /api/interview` | 5 requests per 3 hours | Sliding window  |
| `GET/POST /api/jobs`  | 100 requests per 15 min | Sliding window |

- Rate limits are applied **per authenticated user** (keyed by user ID)
- Exceeded limits return `429 Too Many Requests` with a message indicating when the limit resets
- Analytics are enabled for monitoring via the Upstash dashboard
- Configuration is centralized in `src/lib/rateLimiter.ts`

---

## 🚢 Deployment

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
