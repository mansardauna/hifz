# Ankabit LMS - Quran Academy Platform

A multi-tenant Quran academy LMS platform featuring a GrapesJS visual page builder, Uthmani Tajweed reader, audio recitation tools, student admissions CRM, LiveKit classrooms, and Moyasar or Stripe tuition subscriptions.

## Features

- **Multi-Tenant Academy Subdomains**: Dedicated custom subdomains (`al-furqan.localhost:3000`) for each registered institute.
- **Visual GrapesJS Page Builder**: Drag-and-drop website editor with curated Islamic template bank and live admissions forms.
- **Uthmani Quran Tajweed LMS**: Authentic Uthmani script typography with verse audio looper (1x–10x), speed adjuster, and in-browser voice recorder.
- **Student Admissions CRM**: Multi-status lead pipeline (`New Inquiry`, `Trial Scheduled`, `Enrolled`, `Alumni`) with customizable intake forms.
- **Tuition Subscription Engine**: Moyasar (Mada & Apple Pay) and Stripe payment gateway management.
- **Bilingual Support**: English & Arabic RTL layout support.

## Requirements

- Node.js 20 or later
- MySQL 8 or MariaDB 10.11 for the included Prisma schema
- Redis and HTTPS for production deployments

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start the production server
npm run start
```

Copy `lms/.env.example` to `lms/.env.local` for local development. Use
`lms/.env.production.template` as the production configuration reference. Never
commit populated environment files or provider credentials.

## Distribution Package

The release tooling follows the reusable packaging workflow used by the PMS
project. It creates `MainFiles/ankabit-lms.zip` and `MainFiles.zip` while
excluding dependencies, build output, secrets, runtime data and release-only
files.

```bash
# Run these commands from the repository root.
chmod +x junks/distribute.sh
./junks/distribute.sh --dry-run
./junks/distribute.sh
```

See `DEPLOYMENT.md` for Docker, Caddy, database, LiveKit, payment and backup
configuration.
