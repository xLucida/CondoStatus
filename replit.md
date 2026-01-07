# CertAnalyzer

## Overview
AI-powered extraction and analysis tool for Ontario condo status certificates. Users can upload a PDF and receive a detailed risk analysis in under 2 minutes. The platform is designed for real estate lawyers, agents, and buyers.

## Positioning
Turn messy condo status certificates into a clear, standardized risk report in minutes so deals close faster and surprises don't show up after firm conditions.

## Project Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **Fonts**: Source Serif 4 (headings), Inter (body)
- **Error Tracking**: Sentry (optional, only enabled if NEXT_PUBLIC_SENTRY_DSN is set)
- **AI Integration**: OpenAI/Venice for PDF analysis

## Project Structure
```
app/                    # Next.js app router pages
├── page.tsx           # Landing/marketing page
├── analyze/           # Certificate upload and analysis
├── pricing/           # Pricing tiers page
├── how-it-works/      # Product walkthrough
├── about/             # Company info
├── contact/           # Contact form
├── privacy/           # Privacy policy
├── terms/             # Terms of service
├── demo/              # Demo report
├── report/[id]/       # Dynamic report pages
├── api/               # Backend API endpoints
│   ├── analyze/       # PDF analysis endpoint
│   └── health/        # Health check endpoint
components/            # React components
├── Navigation.tsx     # Site-wide navigation with trust bar
├── Footer.tsx         # Site-wide footer
├── PDFViewer.tsx      # PDF viewing component
├── Toast.tsx          # Notification component
├── ErrorBoundary.tsx  # Error handling component
hooks/                 # Custom React hooks
lib/                   # Core library functions
├── claude-analyzer.ts # AI analysis logic
├── pdf-parser.ts      # PDF parsing utilities
types/                 # TypeScript type definitions
```

## Development
- **Dev server**: Runs on port 5000 with `npm run dev`
- **Production**: Build with `npm run build`, start with `npm run start`

## Environment Variables
- `NEXT_PUBLIC_SENTRY_DSN` (optional): Sentry DSN for error tracking
- `SENTRY_ORG` (optional): Sentry organization
- `SENTRY_PROJECT` (optional): Sentry project name
- API key required for the analyze functionality (Venice/OpenAI)

## Pages
- `/` - Landing page with hero, value props, risk features, trust signals
- `/analyze` - Upload and analyze status certificates
- `/pricing` - Three tiers (Starter $49, Professional $149, Enterprise custom)
- `/how-it-works` - 4-step process walkthrough
- `/about` - Company mission and who we serve
- `/contact` - Contact form and email addresses
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/demo` - Demo report view

## Design System

### Philosophy
"Premium legal professional" aesthetic - communicates trust, precision, and credibility for lawyers and real estate professionals.

### Color Palette
- **Navy** (navy-900, navy-950): Primary brand color for headers, footers, trust elements
- **Slate**: Text and UI elements (slate-400 to slate-700)
- **Cream** (cream-50, cream-100): Warm backgrounds, accent areas
- **Brass** (brass-400 to brass-600): Gold accent color for CTAs, badges, emphasis

### Typography
- **Headings**: Source Serif 4 (serif) - elegant, professional
- **Body**: Inter (sans-serif) - clean, readable
- **Sizes**: text-headline (2.5rem), text-title (1.75rem), text-body (1rem)

### Components
- `.card`: White background, subtle border, refined shadow
- `.card-elevated`: Cream background with elevated shadow
- `.btn-primary`: Navy background, cream text
- `.btn-accent`: Brass/gold background for key CTAs
- `.badge-info`: Small info badges with cream background
- `.trust-badge`: Security/compliance indicators

### Layout
- `.container-wide`: 1200px max, responsive padding
- `.container-narrow`: 900px max for text-heavy pages
- `.section-padding`: 80px vertical on desktop, 48px on mobile

## Report Features
- **Page Reference Badges**: Each extracted item and issue shows a "p.X" badge indicating the source page in the PDF
- **PDF Navigation**: Clicking page badges in the report view opens and navigates to that page in the PDF viewer
- **Split View**: Report page shows analysis on left, PDF viewer on right for easy verification
- **Client Letter Generator**: One-click generation of client-ready summary letters

## Recent Changes
- January 7, 2026: Complete design system overhaul with premium legal aesthetic
- January 7, 2026: Added design tokens: navy/slate/cream/brass colors, Source Serif 4 + Inter fonts
- January 7, 2026: Redesigned navigation with dark trust bar (SOC 2, encryption badges)
- January 7, 2026: Updated all marketing pages with new design (landing, pricing, how-it-works, about)
- January 7, 2026: Redesigned footer with navy background and improved layout
- January 7, 2026: Added visible page reference badges (p.X format) to all report items and issues
- January 7, 2026: Page badges are now clickable and navigate to corresponding PDF page
- January 7, 2026: Built marketing site with landing, pricing, how-it-works, about pages
- January 7, 2026: Added navigation and footer components
- January 7, 2026: Moved upload tool to /analyze route
- January 7, 2026: Added contact, privacy, and terms pages
- January 7, 2026: Initial Replit setup - configured for port 5000
