# Ankabit Autonomous LMS — Comprehensive Platform Documentation

Welcome to the official technical and architectural documentation for **Ankabit LMS**, an autonomous, enterprise-grade multi-tenant educational operating system built for specialized institutions, Quran & Hifz academies, coding bootcamps, and vocational schools.

---

## Table of Contents
1. [Platform Architecture & Core Principles](#1-platform-architecture--core-principles)
2. [Multi-Tenant Isolation & Workspace Routing](#2-multi-tenant-isolation--workspace-routing)
3. [Authentication & Role-Based Access Control (RBAC)](#3-authentication--role-based-access-control-rbac)
4. [Executive Admin Dashboard & Analytics](#4-executive-admin-dashboard--analytics)
5. [Visual Page Builders & Form Studios](#5-visual-page-builders--form-studios)
6. [Real-time WebRTC Classrooms & LiveKit SFU](#6-real-time-webrtc-classrooms--livekit-sfu)
7. [Payment Gateways & Automated Tuition Billing](#7-payment-gateways--automated-tuition-billing)
8. [White-Labeling & Academy Branding](#8-white-labeling--academy-branding)
9. [REST API Endpoints Reference](#9-rest-api-endpoints-reference)
10. [Database Schema & Persistence Layer](#10-database-schema--persistence-layer)
11. [Deployment, Infrastructure & Operations](#11-deployment-infrastructure--operations)
12. [SuperAdmin Console & System Administration](#12-superadmin-console--system-administration)

---

## 1. Platform Architecture & Core Principles

Ankabit LMS is designed as a modular, high-performance distributed web application powered by **Next.js 14 App Router**, **Prisma ORM**, **MySQL**, and **Tailwind CSS**.

### Key Architectural Pillars
- **Strict Multi-Tenancy**: Complete data scoping, subdomain routing, and workspace partitioning across educational institutions.
- **Zero Data Bleed**: Isolated database tenants where new academy registrations initialize with empty, authentic states rather than polluted demo templates.
- **Hybrid Real-Time Collaboration**: Dual WebRTC architecture featuring LiveKit Cloud SFU (Selective Forwarding Unit) with seamless local browser P2P mesh fallback.
- **Direct Inline UI Standards**: Strict design rules enforcing uncluttered layouts, explicit card padding (`p-6 sm:p-7`), and clean direct icons without enclosing shape wrappers.
- **Adaptive Niche Customization**: Dynamic workspace skins and tailored toolsets for **Madrasat & Quran**, **Code Academies**, and **Standard Vocational Schools**.

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Edge Middleware                  │
│       Subdomain Resolution & Tenant Context Extraction      │
└──────────────────────────────┬──────────────────────────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        ▼                      ▼                      ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│ Public Portal │      │ Admin Console │      │  Student LMS  │
│ Landing Pages │      │  & Executive  │      │ & Live Halaqah│
│   & Intake    │      │  Command Hub  │      │   Classroom   │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Server Services Layer                    │
│   TenantService │ AuthService │ LeadsService │ LiveKit      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Prisma ORM & MySQL Relational Vault             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Multi-Tenant Isolation & Workspace Routing

Every educational academy on Ankabit operates within its own dedicated namespace:
- **Platform Subdomain**: `https://{subdomain}.ankabit.app` (e.g. `https://al-furqan.ankabit.app`)
- **Custom Domain**: `https://portal.{academy}.edu` via CNAME pointing to `domains.ankabit.app`
- **Development Routing**: Path-based simulation on localhost: `http://localhost:3000/{subdomain}`

### Subdomain Resolution Engine
Tenant resolution occurs automatically in [`TenantContext.tsx`](src/context/TenantContext.tsx) and Next.js middleware:
1. In development, URL path prefixes (`/al-bayaan`, `/emerald-academy`) resolve the tenant config from MySQL.
2. In production, host header subdomains (`al-bayaan.ankabit.app`) are extracted.
3. Unregistered or root domains cleanly serve the public SaaS platform landing page (`/`).

### Preventing Cross-Tenant Data Bleed
- Newly created academies receive an authentic empty database state via `createCleanTenantConfig(subdomain)`.
- Demo data injection is strictly isolated using `isDemoTenant(subdomain)` in [`src/lib/tenants.ts`](src/lib/tenants.ts). Only tenants explicitly named `demo` or `sample-demo` display simulated data.
- API requests require tenant headers/query params, scoped via Prisma queries matching `tenantId`.

---

## 3. Authentication & Role-Based Access Control (RBAC)

Authentication is handled through JWT-secured server endpoints ([`/api/auth`](app/api/auth/route.ts)) combined with client-side session management ([`AuthContext.tsx`](src/context/AuthContext.tsx)).

### Supported Account Roles

| Role | Access Scope | Primary Dashboard Route |
| :--- | :--- | :--- |
| **`superadmin`** | Platform-wide institution oversight, tenant quotas, global billing | `/super-admin` |
| **`admin`** | Institutional director, curriculum manager, staff provisioning, finance | `/{subdomain}/admin` |
| **`teacher`** | Cohort instruction, gradebook assessment, halaqah hosting | `/{subdomain}/admin` (scoped) |
| **`student`** | Course syllabus, video classrooms, homework submissions, billing portal | `/{subdomain}/lms` |

### Workspace Authentication Boundary
Users cannot cross-login into academies they do not belong to. Attempting to sign into Academy B with an account registered under Academy A returns `HTTP 400 Bad Request`:
> *"This account belongs to [Academy Name]. Please sign in at your assigned academy URL."*

### SuperAdmin Account Provisioning
- **Default Master Email**: `superadmin@ankabit.app`
- **Initial Password**: Provisioned via `INITIAL_SUPERADMIN_PASSWORD` (or `INITIAL_ADMIN_PASSWORD` in `.env`). Administrators must rotate this password upon initial setup.
- **Access Route**: `/super-admin` or `/login`

---

## 4. Executive Admin Dashboard & Analytics

The administrative overview ([`AnalyticsDashboard.tsx`](src/components/admin/AnalyticsDashboard.tsx)) acts as the executive cockpit for academy leadership.

### Dashboard Sections
1. **Executive Stats Grid**:
   - **Total Tuition Revenue**: Formatted currency volume with percentage growth indicators and payment gateway tags.
   - **Enrolled Students**: Active learner headcount with recent intake velocity.
   - **Faculty & Teachers**: Teaching staff count with real-time live session status.
   - **Active Courses**: Published courses count with cohort completion rate percentage.
2. **Visual Analytics (Recharts)**:
   - **Tuition Revenue Trajectory**: Interactive AreaChart displaying monthly collection volume with 6-month and 12-month views.
   - **Student Intake Volume**: BarChart tracking new admissions by calendar month.
3. **Academic Calendar & Halaqahs**:
   - Monthly day selector with scheduled live classes, exams, and staff boards.
   - Direct `Join Live` link for active WebRTC rooms.
4. **Interactive Tasks Checklist**:
   - Administrative action queue with priority badges (`High`, `Medium`, `Normal`), assignees, and due dates.
   - One-click interactive checkbox toggles marking tasks completed in real time.
   - Quick modal to add new operational tasks.
5. **Institutional Reports & Audits Table**:
   - Official summaries covering Finance, Attendance, Assessments, and Faculty Hours.
   - One-click **`Download`** button with real client-side CSV file generation.
6. **Live Activity Stream**:
   - Real-time event notifications for student admissions, Stripe/Moyasar tuition payments, and assignment submissions.

---

## 5. Visual Page Builders & Form Studios

Ankabit incorporates three distinct page construction environments to give non-technical academy administrators full design control:

### 5.1 Modular Section Page Builder ([`ModularSectionPageBuilder.tsx`](src/components/builder/ModularSectionPageBuilder.tsx))
- Real-time split-screen canvas with live responsive iframe preview.
- Drag-and-drop section ordering: Hero banners, Track showcases, Curriculum cards, Pricing grids, Testimonials, FAQ accordions.
- Template switcher with pre-built niche designs (Madrasat Medina, Code Academy Dark, Academic SIS).

### 5.2 Real GrapesJS Studio ([`RealGrapesBuilder.tsx`](src/components/builder/RealGrapesBuilder.tsx))
- Full-featured WYSIWYG HTML/CSS block editor.
- High-contrast white canvas mode with dark block palette.
- Direct HTML source inspection and CSS rule overrides.

### 5.3 Custom Forms & Survey Studio ([`VisualFormBuilder.tsx`](src/components/builder/VisualFormBuilder.tsx))
- Multi-purpose questionnaire and intake form creator.
- Supported Field Types: Text, Email, Phone, Dropdowns, Checkboxes, File Uploads, Date pickers, Star ratings.
- Dedicated **Responses Vault** displaying student submissions in an exportable table.
- Direct iframe embed code generator for external website embedding.

---

## 6. Real-time WebRTC Classrooms & LiveKit SFU

The live learning environment ([`LiveClassroomHub.tsx`](src/components/classroom/LiveClassroomHub.tsx)) facilitates interactive 1-on-1 and group cohort sessions.

### Dual-Engine WebRTC Pipeline
1. **LiveKit Cloud SFU (Primary)**:
   - Low-latency selective forwarding unit capable of streaming HD multi-party video and audio.
   - Auto-configured via `/api/livekit/token` using tenant LiveKit API credentials.
2. **Real Browser WebRTC Mesh (Fallback)**:
   - Zero-dependency browser-to-browser P2P mesh using `RTCPeerConnection` and `BroadcastChannel` cross-tab signaling.
   - Activates automatically if cloud credentials are not supplied, alerting the user with an informative banner.

### In-Classroom Toolset
- **Multi-Participant Video Grid**: Responsive grid layout with active speaker highlighting.
- **Interactive Collaborative Whiteboard**: Real-time vector whiteboard with drawing tools, Quranic Ayah callouts, and code diagram templates.
- **Microphone Waveform Analyser**: AudioContext visualizer verifying recitation acoustics in real time.
- **Class Agenda & In-Call Chat**: Pinned curriculum objectives and cohort messaging stream.

---

## 7. Payment Gateways & Automated Tuition Billing

Ankabit supports comprehensive localized and global payment options configured in [`PaymentGatewaySetup.tsx`](src/components/admin/PaymentGatewaySetup.tsx) and [`IntegrationsManager.tsx`](src/components/admin/IntegrationsManager.tsx):

### Supported Payment Gateways

| Provider | Target Regions | Supported Payment Methods |
| :--- | :--- | :--- |
| **Stripe** | Global (US, UK, EU, Global) | Credit/Debit Cards, Apple Pay, Google Pay, SEPA |
| **Moyasar** | Saudi Arabia & GCC | Mada local debit cards, Visa/Mastercard, Apple Pay |
| **Flutterwave** | Africa (Nigeria, Kenya, Ghana) | Mobile Money, Bank Transfers, Cards |
| **Paystack** | West & South Africa | Cards, Bank Transfer, USSD |
| **Bank Wire** | Global | Direct IBAN / Swift wire instructions with automated ledger |

### Connection Validation Guards
When students or users attempt checkout in [`StudentEnrollmentModal.tsx`](src/components/checkout/StudentEnrollmentModal.tsx):
- The modal checks if the selected gateway is enabled and possesses valid API keys.
- If a method is not connected, a prominent warning banner is displayed:
  > *"⚠️ Payment Gateway Not Connected: This academy has not configured API keys for [Provider]."*
- Checkout submission is halted, preventing deceptive fake transaction processing and advising the student to contact academy administration.

---

## 8. White-Labeling & Academy Branding

Institutions can customize their visual identity in [`BrandingWhiteLabeling.tsx`](src/components/admin/settings/BrandingWhiteLabeling.tsx) organized into five clean tabs:

1. **Brand & Palette**: Primary brand colors, secondary accents, light/dark sidebar themes, typography (Inter, Cairo, Amiri, Poppins), and border radii.
2. **Sign-In Portal**: Split-screen, Centered Glass, and Minimal auth layouts with custom calligraphy quotes and background art.
3. **Preloader Screen**: Customized loading text, logo display, blur intensity, and animated pulse or orbit styles.
4. **Registration Fields**: Custom questions injected into public student application flows.
5. **Custom CSS**: Direct stylesheet overrides injected into public landing pages.

---

## 9. REST API Endpoints Reference

All API routes are served from Next.js server route handlers under [`app/api/`](app/api):

### Core API Endpoints

#### Authentication
- `POST /api/auth`: Authenticates user credentials against MySQL. Scopes session to tenant subdomain. Returns JWT and user profile.
- `POST /api/auth/register`: Provisions a new student or instructor account.

#### Tenant & Configuration
- `GET /api/tenant?subdomain={subdomain}`: Retrieves academy profile, themes, pricing plans, and payment gateway configs.
- `PUT /api/tenant`: Updates tenant settings, branding, or gateway keys (requires staff authorization).
- `GET /api/tenant/members?subdomain={subdomain}`: Lists enrolled students and faculty members.
- `GET /api/tenant/finance?subdomain={subdomain}`: Retrieves invoice logs and transaction records.

#### Curriculum & Submissions
- `GET /api/courses?tenantId={tenantId}`: Returns published course tracks and syllabus modules.
- `POST /api/courses`: Creates or updates curriculum content.
- `GET /api/submissions?tenantId={tenantId}`: Retrieves oral recitation recordings and graded assignments.

#### Real-time Video
- `GET /api/livekit/token?room={roomName}&username={username}`: Generates signed LiveKit JWT token for WebRTC classroom sessions.

#### Webhooks
- `POST /api/webhooks/stripe`: Receives Stripe invoice payment notifications, auto-activating student admission status.
- `POST /api/webhooks/moyasar`: Receives Mada payment receipts.

---

## 10. Database Schema & Persistence Layer

The database is managed via **Prisma ORM** connecting to a MySQL relational cluster defined in [`prisma/schema.prisma`](prisma/schema.prisma):

### Key Models
- **`Tenant`**: Stores academy profile, subdomain, custom domain, branding configuration, and payment gateway keys.
- **`User`**: Accounts for superadmins, academy administrators, instructors, and students with hashed passwords and role assignments.
- **`Course` & `Module` & `Lesson`**: Multi-tiered curriculum hierarchy with audio attachment URLs and tajweed rule tags.
- **`Lead` & `StudentInvoice`**: Admissions CRM leads and tuition invoice payment records.
- **`Submission`**: Graded homework, audio recitations, and assessment scores.
- **`Form` & `FormResponse`**: Custom intake questionnaires and isolated response vaults.

---

## 11. Deployment, Infrastructure & Operations

### Local Development Quickstart
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Generate Prisma client
npx prisma generate

# 4. Synchronize the schema for local development only
npx prisma db push

# 5. Build and start production server
npm run build
npm run start
```

### Production Docker & Microservices
The repository includes production deployment configurations:
- **`docker-compose.yml`**: Provisions Next.js, MySQL 8.0, and LiveKit SFU container clusters.
- **External reverse proxy**: Terminate HTTPS and route traffic to the application on port 3000.
- **`livekit.yaml`**: Standalone LiveKit WebRTC media server configuration for self-hosted instances.

---

## 12. SuperAdmin Console & System Administration

The SuperAdmin command console (`/super-admin`) provides global platform oversight:
- **Academy Directory**: View, filter, suspend, or provision new academy tenants.
- **Platform Analytics**: Global MRR, active students across all tenants, and bandwidth utilization.
- **System Health Monitor**: Live latency gauges for MySQL, LiveKit SFU, and email delivery nodes.
- **Tenant Quotas**: Manage custom domain limits, storage caps, and WebRTC participant allowances.

---

*Documentation Version: 2.4.0 (Enterprise Release)*  
*Maintained by the Ankabit Engineering Team*
