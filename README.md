# Kind Curve — kindcurve.co.uk

> Giving, shaped by you. Create your personalised charitable portfolio in seconds.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** (donut chart, line graphs)
- **Zustand** (state with localStorage persistence)
- **Framer Motion** (page animations)
- **Lucide React** (icons)
- **Supabase** (client ready, optional for v1)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open http://localhost:3000
```

## Project Structure

```
app/
  page.tsx                    # Landing screen
  layout.tsx                  # Root layout + theme provider
  globals.css                 # Tailwind + custom styles
  onboarding/
    q1/page.tsx              # "What do you care about?"
    q2/page.tsx              # "How do you want to give?"
  pie/page.tsx               # Your Kind Curve Pie (donut + sliders)
  consistency/page.tsx       # The Power of Consistency
  success/page.tsx           # Confirmation screen
  dashboard/page.tsx         # Sample Impact Dashboard

components/
  KCLogo.tsx                 # SVG logo component
  ThemeToggle.tsx            # Light/dark mode toggle
  ThemeProvider.tsx           # Applies dark class to DOM
  ui/shared.tsx              # BackButton, TealButton, Card, PageShell

lib/
  charityDatabase.ts         # 32 charities with theme + scope tags
  portfolioGenerator.ts      # Deterministic portfolio generation
  impactProjection.ts        # Chart data generators
  store.ts                   # Zustand store (persisted to localStorage)
  constants.ts               # Theme options, colors, labels
  supabase.ts                # Supabase client (optional)
  utils.ts                   # cn() helper
```

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add -A && git commit -m "Initial commit"
gh repo create kindcurve --public --push

# 2. Connect to Vercel
#    Go to vercel.com → New Project → Import your repo
#    Framework: Next.js (auto-detected)
#    No env vars required for v1

# 3. Add custom domain
#    In Vercel dashboard → Settings → Domains → kindcurve.co.uk
```

## Env Variables (optional)

Copy `.env.local.example` to `.env.local` and fill in Supabase credentials if needed:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Features

- ✅ Light / Dark mode toggle
- ✅ 5 cause themes, 3 scope options
- ✅ Deterministic portfolio generator (same input → same output)
- ✅ Interactive donut chart with proportional slider redistribution
- ✅ Reset to recommended / Equal split
- ✅ Monthly gift breakdown
- ✅ Impact projection graph (Kind Curve vs Irregular)
- ✅ Success summary with cause tags
- ✅ Sample dashboard with stats, trend, charity list, impact feed
- ✅ State persisted to localStorage via Zustand
- ✅ Mobile responsive
- ✅ Framer Motion page animations
