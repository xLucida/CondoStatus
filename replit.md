# CertAnalyzer

## Overview
AI-powered extraction and analysis tool for Ontario condo documents. Users upload multiple PDFs per property (status certificate + attachments) and receive a consolidated risk analysis in under 2 minutes. The platform is designed for real estate lawyers, agents, and buyers.

## Positioning
Turn messy condo status certificates and attachments into a clear, standardized risk report in minutes so deals close faster and surprises don't show up after firm conditions.

## Product Model
- **Property-based**: Users upload multiple PDFs per property (typically 4-15 documents)
- **1 Property Review** = Status certificate + all attachments (budget, financials, reserve fund study, insurance, by-laws, etc.)
- **Limits**: Up to 20 PDFs, 75MB total per property review

## Project Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS with custom design tokens
- **Fonts**: Source Serif 4 (headings), Inter (body)
- **Error Tracking**: Sentry (optional, only enabled if NEXT_PUBLIC_SENTRY_DSN is set)
- **AI Integration**: Venice.ai API with GLM-4.7 model for multi-document analysis

## Project Structure
```
app/                    # Next.js app router pages
├── page.tsx           # Landing/marketing page
├── analyze/           # Multi-document upload and analysis
├── pricing/           # Pricing tiers page
├── how-it-works/      # Product walkthrough
├── about/             # Company info
├── contact/           # Contact form
├── privacy/           # Privacy policy
├── terms/             # Terms of service
├── demo/              # Demo report
├── report/[id]/       # Dynamic report pages with property header
├── api/               # Backend API endpoints
│   ├── analyze/       # Multi-PDF analysis endpoint
│   └── health/        # Health check endpoint
components/            # React components
├── Navigation.tsx     # Site-wide navigation
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
- `VENICE_API_KEY` (required): Venice.ai API key for AI analysis with GLM-4.7 model

## Pages
- `/` - Landing page with hero, value props, risk features, trust signals
- `/analyze` - Multi-PDF upload with property container (address/unit), doc-type tagging
- `/pricing` - Three tiers (Pay-as-you-go $49, Small Practice $149/mo, Firm $299/mo) with Property Review as unit
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

## Multi-Document Upload Features
- **Property Container**: Address + unit fields to group documents
- **Drag-and-Drop**: Multi-file upload with visual feedback
- **File List**: Displays filename, size, doc-type dropdown, remove button
- **Doc-Type Tagging**: Status Certificate, Budget, Financial Statements, Reserve Fund Study, Insurance, Declaration/By-laws, Other
- **Size Validation**: 75MB total limit with real-time counter
- **Progress Tracking**: Shows upload and analysis progress per file

## Report Features
- **Property Header**: Shows address + unit, document count, total pages, total size
- **Document-Aware Page References**: Page badges show "DocName p.X" format (e.g., "Reserve Fund Summary p.3") with document name and original page number
- **Multi-Document Tracking**: Each page tracks documentName, pageInDocument, and globalPage for accurate navigation across combined documents
- **Fuzzy Quote Matching**: 4-stage matching (exact → normalized → word-overlap → first words) handles OCR text errors
- **PDF Navigation**: Clicking page badges opens and navigates to that page in the PDF viewer
- **Split View**: Report page shows analysis on left, PDF viewer on right for easy verification
- **Client Letter Generator**: Professional lawyer-style letters with three-way value classification
- **OCR Support**: Automatic OCR fallback for scanned/image-based PDFs using pdftoppm (poppler) + Tesseract.js for reliable image extraction

## Client Letter Generator
The letter generator uses a robust three-way classification system to prevent misstating facts:

### Helper Functions
- **isConfirmedNone()**: Staged parsing - exact matches → dollar amounts → keyword-adjacent amounts → phrase whitelist
- **isUnknownValue()**: Detects ambiguous/unavailable data (N/A, not provided, see attached, etc.)
- **hasMeaningfulValue()**: Returns true when value exists, isn't confirmed zero, and isn't unknown

### Letter Format
1. Professional opening with legal description
2. Payment status (common elements confirmed/arrears requiring attention)
3. PAP/utilities reminder for closing
4. Reserve fund details with study dates
5. Litigation status and potential claims
6. Unit alterations and by-laws reminder
7. Professional closing

## Recent Changes
- January 8, 2026: **Fixed OCR for scanned PDFs** - Replaced pdfjs+node-canvas with pdftoppm (poppler) for reliable rendering of image-based PDFs
- January 8, 2026: **Document-aware page references** - Page badges now show document name + page (e.g., "Reserve Fund p.3") instead of global page numbers
- January 8, 2026: **Fuzzy quote matching** - 4-stage matching algorithm handles OCR errors while maintaining accuracy
- January 8, 2026: **Enhanced AI prompts** - Stronger instructions for exact verbatim quotes to improve page reference reliability
- January 8, 2026: **Graceful PDF error handling** - Analysis continues even if some PDFs fail to parse, with warnings shown on report
- January 8, 2026: **Pricing page overhaul** - Lawyer-first, usage-only pricing with Property Review as the unit of value
- January 8, 2026: Three plans: Pay-as-you-go ($49), Small Practice ($149/mo, 10 reviews), Firm ($299/mo, 35 reviews)
- January 8, 2026: Added definition block explaining Property Review, shared features section, updated FAQ
- January 7, 2026: **Multi-document property-based UX** - Users now upload multiple PDFs per property with address/unit fields
- January 7, 2026: Added property container with address, unit, and city fields
- January 7, 2026: Implemented multi-file upload with doc-type dropdown per file
- January 7, 2026: Updated backend API to handle up to 20 PDFs, 75MB total per property
- January 7, 2026: Combined analysis across all documents with document markers for AI context
- January 7, 2026: Report header now shows "Property Review: {address} #{unit}" with documents summary
- January 7, 2026: Updated all site-wide CTAs to "Analyze Condo Documents"
- January 7, 2026: Updated pricing copy to reflect multi-PDF property model
- January 7, 2026: Unified actual report page (/report/[id]) design to match demo page styling
- January 7, 2026: Added jsonrepair library to automatically fix malformed AI JSON responses
- January 7, 2026: Complete design system overhaul with premium legal aesthetic (navy/slate/cream/brass)
- January 7, 2026: Built marketing site with landing, pricing, how-it-works, about pages
- January 7, 2026: Added visible page reference badges (p.X format) to all report items
- January 7, 2026: Initial Replit setup - configured for port 5000
