# Ankabit Autonomous LMS — Platform Features & Navigation Guide
> **Executive Presentation & Product Walkthrough Deck**  
> *Prepared for Institutional Stakeholders, Academy Directors & Product Demos*

---

## Executive Summary

**Ankabit LMS** is an enterprise multi-tenant educational operating system built for specialized institutions. Unlike legacy, one-size-fits-all LMS platforms, Ankabit natively adapts its instructional workflows, user interfaces, and assessment tools to three distinct educational verticals:
1. **Madrasat & Islamic Institutes** (Medina Mushaf reader, audio recitation loopers, live halaqahs, Sanad & Ijazah verification).
2. **Code Academies & Software Bootcamps** (In-browser Monaco code sandboxes, automated unit test runners, algorithm challenges).
3. **Vocational, Trade & Universal Schools** (Practical milestone proof submissions, rubric grading, automated term report cards).

---

## 1. Platform Core Capabilities & Feature Catalog

### 🏢 Multi-Tenant Workspace & Brand Isolation
- **Subdomain & Custom Domain Routing**: Every academy gets `https://{subdomain}.ankabit.app` or custom domains (e.g., `https://learn.academy.edu`) via automatic CNAME proxying and SSL.
- **Strict Data Isolation (Zero Data Bleed)**: Each registered institution operates in an authentic, isolated database partition. Newly created academies initialize with clean `$0.00` and zero-learner states—never polluted with demo data.
- **Dynamic Niche Workspace Skinning**: The platform automatically re-skins terminology, icons, and tools according to the institution's track (`quran`, `coding`, `vocational`).

---

### 🎛️ Executive Admin Command Hub (`/{subdomain}/admin`)
An executive command center designed with a fluid `w-11/12 mx-auto` layout and direct inline icons:
- **Real-time KPI Scorecards**: Total Tuition Revenue, Enrolled Student Count, Faculty Roster, and Course Completion Rates with zero-fallback integrity.
- **Financial Analytics & Growth Trajectories**: 6-month and 12-month Recharts AreaCharts tracking gross tuition volume and BarCharts tracking student intake.
- **Interactive Academic Calendar**: Multi-day scheduling grid displaying upcoming halaqahs, cohort exams, and faculty milestones.
- **Administrative Task & Action Queue**: Filterable checklist (`All`, `Pending`, `Done`) with priority badges (`High`, `Medium`, `Normal`) and inline modal task creation.
- **Exportable Institutional Reports**: One-click instant CSV export for tuition ledgers, attendance summaries, gradebook assessments, and faculty teaching logs.
- **Live Activity Feed**: Real-time event stream logging admissions, tuition settlements, homework submissions, and automated backups.

---

### 🎨 Visual Drag-and-Drop Page Builder (`RealGrapesBuilder`)
- **GrapesJS Visual Canvas**: No-code landing page editor featuring pre-styled academy components (Hero Headers, Course Grids, Halaqah Schedules, Testimonial Carousels).
- **Dual-Pane Interface**: Dark-mode block sidebar with high-contrast text and a crisp, pure-white editing canvas.
- **Live Viewport Switching**: 1-click preview across Desktop, Tablet, and Mobile screen sizes.
- **Direct HTML/CSS Engine**: Real-time serialization directly to the academy’s public portal.

---

### 📋 Admissions & Intake Form Studio (`VisualFormBuilder`)
- **Dynamic Form Designer**: Multi-field drag-and-drop form creation with custom validation, help text, and placeholder configuration.
- **5 Aesthetic Themes**: Choose between `Material UI`, `Glassmorphism`, `Minimalist`, `Islamic Heritage`, or `Cyber Dark`.
- **Automated Student Onboarding**: Form submissions route to the Admissions CRM with 1-click promotion from applicant to enrolled student.
- **Embeddable Scripts**: Generates embed codes and iframe snippets to place application forms on any external website.

---

### 🎥 Carrier-Grade WebRTC Live Classrooms (`LiveClassroomHub`)
- **LiveKit Cloud SFU Streaming**: Carrier-grade selective forwarding unit supporting up to 500 simultaneous participants per halaqah without Zoom or third-party software.
- **Automatic P2P Mesh Fallback**: Seamless client-side peer-to-peer WebRTC fallback if cloud tokens or keys are unavailable.
- **Classroom Toolset**: Screen sharing, interactive whiteboard, live participant roster, hand-raising, in-session chat, and latency monitors.

---

### 💳 Autonomous Tuition Billing & Multi-Gateway Checkout
- **Direct Merchant Gateways**: Connect **Flutterwave**, **Paystack**, **Stripe**, **Moyasar**, or Direct Bank Wire transfers.
- **0% Platform Commission**: 100% of student tuition deposits straight into the academy's merchant account.
- **Integrations Guard**: Intelligently alerts students and admins if a gateway has not been configured with live API keys, preventing silent checkout failures.
- **Student Billing Portal**: In-app invoice viewer, downloadable payment receipts, and automated payment status webhooks.

---

### 🏷️ 100% White-Labeling & Academy Customization
Organized into a clean 4-tab settings architecture:
1. **Brand & Palette**: Custom logo upload, favicon, primary/accent color pickers.
2. **Sign-In Portal**: Branded login titles, custom welcome messages, and support desk links.
3. **Preloader Screen**: Institutional loading animations, custom spinner styling, and academy mottos.
4. **Custom CSS Overrides**: Custom typography imports (Google Fonts) and bespoke styling sheets.

---

### 📜 Sanad & Ijazah Credential Studio (`SanadCertificateBuilder`)
- **Traditional Islamic Sanad Chains**: Document authentic teacher-to-student chains of recitation transmission linking back to classical scholars.
- **QR Code Verification**: Every issued certificate embeds a cryptographic QR verification link pointing to `/verify/[id]`.
- **Printable Vector PDF / SVG**: High-resolution certificate generation with classical calligraphy borders.

---

### 🎓 Niche-Specific Student LMS Portals (`/{subdomain}/lms`)

#### 1. Quran & Madrasat LMS
- **114 Surahs Medina Mushaf**: Native Arabic Quran reader with ayah-by-ayah navigation, translation toggles, and Tajweed markers.
- **Audio Recitation Looper**: World-renowned Qaris (Minshawi, Husary, Afasy) with custom repeat counts (`1x`, `3x`, `5x`, `10x`) for memorization (Hifz).
- **Oral Recitation Recording Studio**: In-browser audio recorder allowing students to record their Surah recitation and submit it directly to their Sheikh for feedback.

#### 2. Code Academy LMS
- **In-Browser Monaco Code Editor**: Syntax-highlighted code editor for JavaScript, TypeScript, and Python.
- **Automated Unit Test Assertions**: Students write code and run live test assertions with immediate pass/fail feedback.
- **Problem Set Ladder**: Algorithmic challenges with difficulty ratings, hints, and automated progress unlocking.

#### 3. Vocational & Trade SIS
- **Practical Task Submissions**: Photo and video upload studio for mechanical, culinary, or technical craftsmanship tasks.
- **Rubric-Based Gradebook**: Multi-criterion evaluation matrices for instructors.
- **Automated Academic Transcripts**: Automated calculation of GPA, term honors, and skill mastery.

---

### 🛡️ Platform SuperAdmin Hub (`/super-admin`)
- **Global Oversight**: Master registry of all registered academies, student totals, and server health.
- **Subscription Tier Management**: Configure Starter ($29/mo), Pro ($79/mo), and Enterprise ($199/mo) quotas.
- **1-Click Tenant Impersonation**: Jump directly into any academy's dashboard to troubleshoot or assist administrators.

---

## 2. Navigation Sitemap & URL Routing Directory

```
                                  ANKABIT LMS SITEMAP
                                 
                                     [ / ] (Root)
                              Platform SaaS Landing Page
                                          │
         ┌────────────────────────────────┼────────────────────────────────┐
         ▼                                ▼                                ▼
   [ /docs ] & [ /doc ]         [ /create-academy ]                  [ /login ]
 Interactive Technical Doc       Instant Academy Setup            Unified Sign-In Portal
         │                                │
         │                                ▼
         │                     [ /{subdomain}/admin ]
         │                    Academy Executive Console
         │            ┌───────────────────┼───────────────────┐
         │            ▼                   ▼                   ▼
         │      Overview & KPIs      Curriculum &        Admissions &
         │     (AreaChart, Tasks)    Course Builder       Leads CRM
         │            │                   │                   │
         │            ▼                   ▼                   ▼
         │       Live Classroom      Payment Setup      GrapesJS Page
         │     (LiveKit WebRTC)     (Stripe, Moyasar)    Builder Studio
         │            │                   │                   │
         │            ▼                   ▼                   ▼
         │      Sanad / Ijazah      Staff & Roles       White-Labeling
         │       Certificates          Roster          (Themes & CSS)
         │
         └────────────────────────────────┬────────────────────────────────┐
                                          ▼                                ▼
                                 [ /{subdomain}/lms ]             [ /super-admin ]
                                Student LMS Workspace         Platform Master Console
                             (Mushaf, Code, Practical)         (Tenants, MRR, Health)
```

---

### Complete URL Directory & Permissions Table

| Route URL | Persona / Role | Key Features & Screen Purpose |
| :--- | :--- | :--- |
| **`http://localhost:3000/`** | Public Visitor | Platform SaaS homepage, 3 specialized tracks showcase, pricing tiers, FAQs, and academy registration CTA. |
| **`http://localhost:3000/docs`** | Developers & Clients | Interactive searchable documentation, architecture diagrams, API tester, Prisma schema, and `doc.md` download. |
| **`http://localhost:3000/create-academy`** | Prospective Director | 2-step setup wizard: subdomain selection, institution niche (`quran`, `coding`, `vocational`), and admin credentials. |
| **`http://localhost:3000/login`** | All Accounts | Scoped authentication boundary preventing cross-tenant login leaks. |
| **`http://localhost:3000/super-admin`** | SuperAdmin | Global platform analytics, tenant directory, subscription billing tiers, and live service status. |
| **`http://localhost:3000/{subdomain}`** | Academy Students & Public | Bespoke institutional landing page rendered via the academy's GrapesJS template. |
| **`http://localhost:3000/{subdomain}/admin`** | Academy Admin & Teachers | Complete executive command center (Analytics, CRM, GrapesJS Builder, LiveKit Rooms, Finance). |
| **`http://localhost:3000/{subdomain}/lms`** | Enrolled Students | Dedicated learning studio (Medina Mushaf reader, Monaco coding sandbox, practical assignments). |
| **`http://localhost:3000/verify/{id}`** | Public Verifier | Public cryptographic verification portal for student graduation credentials and Sanad Ijazahs. |

---

## 3. Step-by-Step Live Presentation Demo Script

### 🎬 Slide 1: The Problem & The Solution (2 Minutes)
- **Problem**: Quran institutions, bootcamps, and trade schools struggle with standard LMS platforms (Moodle, Canvas) that lack domain-specific tools (Arabic Mushaf loopers, code sandboxes, practical rubrics).
- **Solution**: Ankabit LMS—an autonomous educational OS that provides turn-key branding, isolated tenant subdomains, and purpose-built learning studios.

---

### 🎬 Slide 2: The Executive Command Hub (3 Minutes)
- **Navigate to**: `http://localhost:3000/al-bayaan/admin`
- **Highlight**:
  1. **Top KPI Scorecards**: Transparent tuition revenue, student headcount, faculty roster, and active course tracks.
  2. **Zero-Fallback Integrity**: New academies display authentic zero states—never misleading fake numbers.
  3. **Revenue Trajectory Chart**: 6-month & 12-month area chart visualizing tuition cash flows.
  4. **Calendar & Halaqahs Widget**: Daily timetable with "Join Live" classroom links.
  5. **Workflow Tasks Table**: Administrative checklist with inline creation and status toggling.
  6. **Reports Download**: Click "Download" to generate a live institutional CSV ledger.

---

### 🎬 Slide 3: Visual Studios (3 Minutes)
- **Navigate to**: *Page Builder* tab (`RealGrapesBuilder`)
  - Demonstrate dragging headers, course cards, and testimonials directly onto the pure-white canvas.
  - Toggle between Desktop, Tablet, and Mobile views.
- **Navigate to**: *Form Builder* tab (`VisualFormBuilder`)
  - Show the 5 theme presets (`Material UI`, `Islamic Heritage`, `Cyber Dark`).
  - Demonstrate adding custom fields and generating the public embed code.

---

### 🎬 Slide 4: Real-time LiveKit Classroom (2 Minutes)
- **Navigate to**: *Live Classroom* tab (`LiveClassroomHub`)
  - Show the integrated WebRTC classroom interface.
  - Explain the dual architecture: **LiveKit Cloud SFU** for ultra-low latency broadcasting (up to 500 users) with automatic **P2P Browser Mesh Fallback**.

---

### 🎬 Slide 5: The Student Learning Experience (3 Minutes)
- **Navigate to**: `http://localhost:3000/al-bayaan/lms`
  - **Quran Track**: Open the 114 Surahs Medina Mushaf reader; demonstrate verse looping with Qari audio recitation.
  - **Code Track**: Open the Monaco editor; demonstrate running unit test assertions in-browser.
  - **Tuition Portal**: Open student invoices and show payment options (Flutterwave, Paystack, Stripe, Moyasar).

---

### 🎬 Slide 6: White-Labeling & Multi-Gateway Finance (2 Minutes)
- **Navigate to**: *Settings* ➔ *Branding & White-Labeling*
  - Show the 4 organized tabs: Brand Palette, Sign-in Portal, Preloader Screen, and Custom CSS.
- **Navigate to**: *Payment Gateways*
  - Show live API key configuration for Stripe, Paystack, Flutterwave, and Moyasar with 0% platform fee.

---

## 4. Key Talking Points & Competitive Advantages

1. **Zero Data Bleed**: Unlike competitors that clone templates with fake sample data, Ankabit initializes clean, authentic databases.
2. **0% Transaction Fee**: Academies keep 100% of their tuition revenue through direct merchant accounts.
3. **No Zoom Fees**: Built-in WebRTC video conferencing eliminates expensive third-party video licenses.
4. **Autonomous White-Labeling**: Custom domains, custom color palettes, and custom loading screens in under 5 minutes.
5. **Modern Technical Stack**: Next.js 14 App Router, Prisma ORM, MySQL, Tailwind CSS, LiveKit WebRTC, and Recharts.

---

*Document compiled and verified for Ankabit LMS v2.4.*
