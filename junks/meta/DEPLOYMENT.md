# 🚀 Ankabit LMS Production Cloud Deployment Guide

This document provides a comprehensive, production-grade guide for deploying **Ankabit LMS** to handle 1,000,000+ active students, multi-tenant academy subdomains (`*.ankabit.app`), live WebRTC classrooms, and global payment processing.

---

## 🏗️ Architecture Overview

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Web Frontend & API** | Next.js 14 Standalone (Node 20 Alpine) | Server-rendered UI, REST APIs, dynamic tenant routing |
| **Reverse Proxy & SSL** | External Caddy, Nginx, or managed proxy | TLS termination, wildcard routing, and WebSockets |
| **Primary Database** | MySQL 8.0 / MariaDB 10.11+ (UTF8mb4) | ACID compliance, Quranic diacritics, high concurrent reads |
| **Distributed Cache** | Redis 7 Alpine | Rate limiting, session store, cached tenant resolutions |
| **Virtual Classrooms** | LiveKit WebRTC SFU (Cloud or Self-Hosted) | Sub-100ms ultra-low latency audio/video, screenshare, recitation recording |
| **Object Storage** | Cloudflare R2 / AWS S3 | Audio recitations, student submissions, academy branding logos |
| **Global Billing** | Stripe (Global) & Moyasar (Saudi Mada / GCC) | Recurring subscriptions, one-time fees, Apple Pay |
| **Notifications** | Resend (Email) & Meta WhatsApp Cloud API | Automated admission receipts, lesson reminders, attendance alerts |

---

## 🌐 1. DNS & Wildcard Domain Setup

Before launching the server, configure your domain DNS records (e.g. at Cloudflare, Namecheap, or AWS Route 53):

| Type | Name / Host | Target / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or `ankabit.app`) | `<YOUR_SERVER_PUBLIC_IP>` | Root platform domain |
| **A** | `*` (or `*.ankabit.app`) | `<YOUR_SERVER_PUBLIC_IP>` | **Wildcard subdomains** for all academies |
| **CNAME** | `www` | `ankabit.app` | WWW redirect |

> [!IMPORTANT]
> **If using Cloudflare Proxy (Orange Cloud):**
> 1. Set SSL/TLS encryption mode to **Full (Strict)**.
> 2. Ensure WebSockets are enabled under **Network** settings.
> 3. Configure wildcard TLS and WebSocket forwarding in your chosen external reverse proxy.

---

## 🖥️ 2. Option A: Zero-Downtime VPS Deployment (Recommended)

Supported on Ubuntu 22.04 LTS / 24.04 LTS or Debian 12 (Hetzner, DigitalOcean, AWS EC2, Linode).

### Step 1: Connect to Server and Clone Repo
```bash
ssh root@<YOUR_SERVER_IP>
git clone https://github.com/your-org/ankabit-lms.git /var/www/ankabit
cd /var/www/ankabit
```

### Step 2: Initialize Server Environment
Run the automated initialization script to install Docker, configure UFW firewall, and set up fail2ban:
```bash
chmod +x junks/*.sh
sudo ./junks/setup-production.sh
```

### Step 3: Configure Production Environment Variables
Copy the template and fill in your production credentials:
```bash
cp lms/.env.production.template lms/.env.production
nano lms/.env.production
```

Ensure you update:
- `JWT_SECRET`: Generate with `openssl rand -base64 32`
- `DB_ROOT_PASSWORD` & `DB_PASSWORD`: Strong passwords
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Live keys (`sk_live_...`, `pk_live_...`)
- `STRIPE_WEBHOOK_SECRET`: Signing secret from Stripe Dashboard
- `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- `NEXT_PUBLIC_ROOT_DOMAIN`: Your primary domain (e.g. `ankabit.app`)

### Step 4: Run 1-Click Deployment
```bash
./junks/deploy.sh
```
The deploy script automatically:
1. Validates environment configurations.
2. Creates swap memory if needed to prevent build OOM errors.
3. Builds the standalone Docker container.
4. Starts MySQL 8 (with UTF8mb4 character set for Quranic text) and Redis.
5. Runs Prisma database migrations (`prisma migrate deploy`).
6. Starts the Next.js app and supporting services.
7. Leaves TLS termination and wildcard routing to your external reverse proxy.

---

## ☁️ 3. Option B: Vercel + Managed Database Deployment

If you prefer hosting on Vercel:

### Step 1: Managed MySQL Database
1. Provision a high-availability MySQL / MariaDB database on **Aiven**, **PlanetScale**, **AWS RDS Aurora**, or **DigitalOcean Managed Database**.
2. Copy the pooled connection string:
   ```
   DATABASE_URL="mysql://username:password@db-host:3306/ankabit_lms?sslaccept=strict&connection_limit=20"
   ```

### Step 2: Initialize a new non-production database
```bash
npx prisma db push
```

### Step 3: Deploy to Vercel
1. Import repository into [Vercel Dashboard](https://vercel.com).
2. Set Framework Preset to **Next.js**.
3. Add Environment Variables from `.env.production.template`.
4. In **Settings -> Domains**:
   - Add `ankabit.app` (Apex)
   - Add `*.ankabit.app` (Wildcard Domain)
5. Vercel automatically routes all tenant subdomains through `middleware.ts`.

---

## 💳 4. Payment Gateways: Live Mode Setup

### Stripe Live Activation
1. Navigate to [Stripe Dashboard](https://dashboard.stripe.com).
2. Switch toggle to **Live Mode**.
3. Copy **Publishable key** (`pk_live_...`) -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
4. Copy **Secret key** (`sk_live_...`) -> `STRIPE_SECRET_KEY`.
5. Configure Webhook:
   - Go to **Developers -> Webhooks -> Add destination**.
   - URL: `https://ankabit.app/api/webhooks/stripe`
   - Events to listen for:
     - `checkout.session.completed`
     - `invoice.paid`
     - `customer.subscription.deleted`
   - Copy **Signing secret** (`whsec_...`) -> `STRIPE_WEBHOOK_SECRET`.

### Moyasar Live Activation (Saudi Mada & Apple Pay)
1. Go to [Moyasar Dashboard](https://dashboard.moyasar.com).
2. Copy Live Secret Key -> `MOYASAR_SECRET_KEY`.
3. Copy Live Publishable Key -> `NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY`.
4. Webhook URL: `https://ankabit.app/api/webhooks/moyasar`.

---

## 📹 5. LiveKit WebRTC SFU Setup

### Strategy 1: LiveKit Cloud (Recommended)
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io).
2. Create project: `ankabit-production`.
3. Copy:
   - Server URL: `wss://<project-id>.livekit.cloud` -> `LIVEKIT_URL` & `NEXT_PUBLIC_LIVEKIT_URL`
   - API Key -> `LIVEKIT_API_KEY`
   - API Secret -> `LIVEKIT_API_SECRET`
4. LiveKit Cloud handles global edge routing and dynamic scaling for halaqat worldwide.

### Strategy 2: Self-Hosted SFU
To host LiveKit alongside the app on your VPS:
```bash
docker compose --profile livekit up -d
```
Ensure firewall ports `7880/tcp`, `7881/tcp`, and `50000-50100/udp` are allowed in UFW and VPS security groups.

---

## 🗄️ 6. Automated Database Backups & Maintenance

### Daily Backups
The initialization script automatically installs a daily 03:00 AM cron job. You can also trigger an immediate backup anytime:
```bash
./junks/backup-db.sh
```
- Backups are stored in `/var/backups/ankabit/`.
- Compressed using `gzip -9`.
- Backups older than 14 days are automatically pruned.

### Restoring a Backup
```bash
gunzip < /var/backups/ankabit/ankabit_db_YYYYMMDD_HHMMSS.sql.gz | docker compose exec -T mysql mysql -u root -p<ROOT_PASSWORD> ankabit_lms
```

---

## 🔄 7. Updating Code in Production

To deploy updates with zero downtime:
```bash
cd /var/www/ankabit
git pull origin main
./junks/deploy.sh
```

---

## 🩺 8. Troubleshooting & Health Verification

| Check | Command |
| :--- | :--- |
| **Container Status** | `docker compose ps` |
| **Application Logs** | `docker compose logs -f --tail=100 app` |
| **Application Logs** | `docker compose logs -f app` |
| **MySQL Health** | `docker compose exec mysql mysqladmin ping -h localhost` |
| **Local App Probe** | `curl -I http://127.0.0.1:3000/` |
