# CertAnalyzer

## Overview
AI-powered extraction and analysis tool for Ontario condo status certificates. Users can upload a PDF and receive a detailed breakdown in under 2 minutes.

## Project Architecture
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS
- **Error Tracking**: Sentry (optional, only enabled if NEXT_PUBLIC_SENTRY_DSN is set)
- **AI Integration**: OpenAI for PDF analysis

## Project Structure
```
app/                    # Next.js app router pages and API routes
├── api/               # Backend API endpoints
│   ├── analyze/       # PDF analysis endpoint
│   └── health/        # Health check endpoint
├── demo/              # Demo page
├── report/[id]/       # Dynamic report pages
├── page.tsx           # Main landing page
components/            # React components
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
- OpenAI API key may be required for the analyze functionality

## Recent Changes
- January 7, 2026: Initial Replit setup - configured for port 5000
