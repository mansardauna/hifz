'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Server,
  Layers,
  ShieldCheck,
  Video,
  CreditCard,
  Palette,
  Code2,
  Database,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft,
  FileText,
  FileCode,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  Users,
  Settings,
  Lock,
  Download
} from 'lucide-react';
import { AnkabitLogo } from '../brand/AnkabitLogo';
import { Card, Badge, Button } from '../ui';

// Type for Doc Section
interface DocSection {
  id: string;
  category: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
  content: React.ReactNode;
}

export function DocsPortal() {
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBlock(id);
    setTimeout(() => setCopiedBlock(null), 2500);
  };

  const sections: DocSection[] = useMemo(() => [
    {
      id: 'overview',
      category: 'Getting Started',
      title: 'Platform Architecture & Pillars',
      description: 'Distributed educational operating system for specialized academies, bootcamps, and schools.',
      icon: Layers,
      tags: ['overview', 'architecture', 'nextjs', 'pillars', 'principles'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Platform Architecture & Core Principles</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Ankabit LMS is designed as an autonomous, enterprise-grade educational operating system powered by{' '}
              <strong className="text-slate-900">Next.js 14 App Router</strong>, <strong className="text-slate-900">Prisma ORM</strong>,{' '}
              <strong className="text-slate-900">MySQL</strong>, and <strong className="text-slate-900">Tailwind CSS</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-semibold text-slate-900">Strict Multi-Tenancy</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Complete data scoping, subdomain routing, and workspace partitioning across independent educational institutions.
              </p>
            </Card>

            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-semibold text-slate-900">Zero Data Bleed</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Newly created academies initialize with authentic empty database records, completely immune to cross-tenant leakages.
              </p>
            </Card>

            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <Video className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-semibold text-slate-900">LiveKit Cloud SFU</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Carrier-grade WebRTC conferencing with live screen share, dual camera looper, and seamless local browser P2P mesh fallback.
              </p>
            </Card>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-slate-950 text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-semibold capitalize tracking-wider text-emerald-400">System Topology Diagram</span>
              <button
                onClick={() => copyToClipboard(`
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
`, 'arch-diagram')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copiedBlock === 'arch-diagram' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBlock === 'arch-diagram' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed p-2">
{`┌─────────────────────────────────────────────────────────────┐
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
└─────────────────────────────────────────────────────────────┘`}
            </pre>
          </Card>
        </div>
      )
    },
    {
      id: 'multi-tenant',
      category: 'Architecture',
      title: 'Multi-Tenant Subdomain Routing',
      description: 'Automated tenant resolution, custom domain routing, and zero-leakage state scoping.',
      icon: Globe,
      tags: ['subdomain', 'tenant', 'routing', 'cname', 'isolation'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Multi-Tenant Isolation & Workspace Routing</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Every educational academy on Ankabit operates within its own dedicated namespace with isolated routing.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 text-lg">Routing Hierarchy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-emerald-700 capitalize tracking-wider block mb-1">Production Subdomain</span>
                <code className="text-sm font-mono text-slate-800 font-semibold block mb-2">https://{'{subdomain}'}.liwanlms.com</code>
                <p className="text-xs text-slate-500">Extracted automatically from HTTP host headers by Next.js middleware.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-emerald-700 capitalize tracking-wider block mb-1">Custom Domain (CNAME)</span>
                <code className="text-sm font-mono text-slate-800 font-semibold block mb-2">https://portal.academy.edu</code>
                <p className="text-xs text-slate-500">Proxied through your configured domain and external TLS provider.</p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-xs font-semibold text-emerald-700 capitalize tracking-wider block mb-1">Local Development</span>
                <code className="text-sm font-mono text-slate-800 font-semibold block mb-2">http://localhost:3000/{'{subdomain}'}</code>
                <p className="text-xs text-slate-500">Path-based simulation for testing multiple academies on a single port.</p>
              </div>
            </div>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">Resolution Workflow & Prevention of State Bleed</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
              <li><strong className="text-slate-900">URL Resolution:</strong> In development, URL path prefixes (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/al-bayaan</code>) resolve the tenant config from MySQL.</li>
              <li><strong className="text-slate-900">Edge Middleware Scoping:</strong> In production, host header subdomains (<code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">academy.liwanlms.com</code>) are validated against registered tenants.</li>
              <li><strong className="text-slate-900">Clean Initialization:</strong> Newly created academies receive an authentic empty database state via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">createCleanTenantConfig(subdomain)</code>.</li>
              <li><strong className="text-slate-900">Demo Isolation:</strong> Seeded demo data is strictly guarded with <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">isDemoTenant(subdomain)</code>, ensuring demo records never appear in client academies.</li>
            </ol>
          </Card>
        </div>
      )
    },
    {
      id: 'rbac',
      category: 'Authentication',
      title: 'Authentication & Role-Based Access Control (RBAC)',
      description: 'JWT sessions, multi-role partitioning, and tenant boundary enforcement.',
      icon: ShieldCheck,
      tags: ['auth', 'rbac', 'jwt', 'roles', 'superadmin', 'teacher', 'student'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Authentication & Role-Based Access Control (RBAC)</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Authentication is handled through JWT-secured endpoints combined with client-side session contexts.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs capitalize font-semibold text-slate-600">
                <tr>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Access Scope</th>
                  <th className="py-3 px-4">Primary Dashboard Route</th>
                  <th className="py-3 px-4">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-purple-700">superadmin</td>
                  <td className="py-3.5 px-4 text-slate-700">Platform-wide oversight, tenant quotas, global billing</td>
                  <td className="py-3.5 px-4 font-mono text-xs">/super-admin</td>
                  <td className="py-3.5 px-4"><Badge variant="default" className="bg-purple-100 text-purple-800">Unrestricted</Badge></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-emerald-700">admin</td>
                  <td className="py-3.5 px-4 text-slate-700">Director, curriculum manager, staff provisioning, finance</td>
                  <td className="py-3.5 px-4 font-mono text-xs">/{'{subdomain}'}/admin</td>
                  <td className="py-3.5 px-4"><Badge variant="default" className="bg-emerald-100 text-emerald-800">Tenant Admin</Badge></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-blue-700">teacher</td>
                  <td className="py-3.5 px-4 text-slate-700">Cohort instruction, gradebook assessment, halaqah hosting</td>
                  <td className="py-3.5 px-4 font-mono text-xs">/{'{subdomain}'}/admin (scoped)</td>
                  <td className="py-3.5 px-4"><Badge variant="default" className="bg-blue-100 text-blue-800">Assigned Cohorts</Badge></td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 font-mono font-semibold text-amber-700">student</td>
                  <td className="py-3.5 px-4 text-slate-700">Course syllabus, video classrooms, homework, tuition portal</td>
                  <td className="py-3.5 px-4 font-mono text-xs">/{'{subdomain}'}/lms</td>
                  <td className="py-3.5 px-4"><Badge variant="default" className="bg-amber-100 text-amber-800">Student Portal</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>

          <Card className="p-6 sm:p-7 border border-amber-200/80 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-700 shrink-0" />
              <h4 className="font-semibold text-amber-900">Workspace Authentication Boundary</h4>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">
              Users cannot cross-login into academies they do not belong to. Attempting to sign into Academy B with an account registered under Academy A returns HTTP 400 Bad Request with a clear redirect notice.
            </p>
          </Card>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
            <h4 className="font-semibold text-slate-900">Verified Platform SuperAdmin Credentials</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">SuperAdmin Email</span>
                <span className="font-mono font-semibold text-slate-800">superadmin@liwanlms.com</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-xs text-slate-500 block">Default Password</span>
                <span className="font-mono font-semibold text-slate-800">Admin12345!</span>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'dashboards',
      category: 'Dashboards',
      title: 'Executive Admin Command Hub & Student LMS',
      description: 'Analytics, revenue streams, interactive calendar, tasks, and student interfaces.',
      icon: LayoutDashboard,
      tags: ['dashboard', 'admin', 'revenue', 'calendar', 'tasks', 'reports', 'lms'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Executive Admin Dashboard & LMS Workspaces</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Tailored high-performance workspaces configured with fluid <code className="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-xs font-semibold">w-11/12 mx-auto</code> responsive layout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-semibold text-slate-900">Executive Admin Hub</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>4 Executive KPI Cards:</strong> Gross Revenue, Active Enrollment, Staff Roster, Completion Rate.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Dual Analytics Charts:</strong> Recharts 6-month Revenue AreaChart & Intake BarChart.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Interactive Calendar:</strong> Cohort exams, halaqah schedules, and milestone events.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Task Checklist & Exportable Reports:</strong> CSV export, status filters, and live activity stream.
                </li>
              </ul>
            </Card>

            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-semibold text-slate-900">Student LMS Workspace</h3>
              </div>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Medina Mushaf Reader:</strong> 114 Surahs, ayah navigation, and verse audio loopers.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Interactive Code Sandboxes:</strong> Monaco editor, JavaScript & Python in-browser runtimes.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Vocational Proofs:</strong> Practical submission portal, photo/video uploads, rubrics.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <strong>Tuition Invoices & Receipts:</strong> Direct multi-gateway payments with instant verification.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'studios',
      category: 'Builders',
      title: 'Visual Page Builders & Form Studios',
      description: 'GrapesJS drag-and-drop canvas, multi-form admissions builder, and landing page embeds.',
      icon: FileCode,
      tags: ['builder', 'grapesjs', 'canvas', 'forms', 'admissions'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Visual Page Builders & Admissions Form Studios</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Empower academy administrators to build bespoke landing pages and dynamic intake questionnaires with zero code.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
              <h3 className="font-semibold text-slate-900 text-base">GrapesJS Landing Page Builder</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Integrated visual canvas with pre-built academy blocks (Hero headers, Course Cards, Testimonials, Live Halaqah embeds).
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• High-contrast toolbar with dark-mode sidebar blocks and pure-white editing canvas.</p>
                <p>• Real-time HTML and CSS serialization directly into academy configuration.</p>
                <p>• Responsive viewport toggle: Desktop, Tablet, and Mobile views.</p>
              </div>
            </Card>

            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
              <h3 className="font-semibold text-slate-900 text-base">Admissions & Intake Form Studio</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visual multi-step form builder for student admissions, course evaluations, and lead capture.
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>• Dynamic field types: Text, Dropdown, Radio, File Upload, Phone, Date.</p>
                <p>• Automated student profile provisioning upon admission approval.</p>
                <p>• Dedicated submission repository with status pipeline (Pending, Under Review, Accepted).</p>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'webrtc',
      category: 'Real-time',
      title: 'Real-time Classrooms & LiveKit SFU',
      description: 'WebRTC video architecture, LiveKit Cloud token generation, and P2P fallback.',
      icon: Video,
      tags: ['webrtc', 'livekit', 'video', 'halaqah', 'sfu', 'p2p'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Real-time WebRTC Classrooms & LiveKit SFU</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Native in-browser video classrooms requiring zero external software downloads.
            </p>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">LiveKit Cloud Token Generation Endpoint</h3>
            <p className="text-sm text-slate-600">
              Generate time-limited participant tokens with scoped publish and subscribe grants:
            </p>
            <div className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto">
              POST /api/livekit/token?room=halaqah-tajweed-101&username=Ustadh_Zayd&role=teacher
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600 shrink-0" />
                <h4 className="font-semibold text-slate-900">Selective Forwarding Unit (SFU)</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                When LiveKit API keys (<code className="font-mono text-slate-800">LIVEKIT_API_KEY</code> & <code className="font-mono text-slate-800">LIVEKIT_API_SECRET</code>) are configured, participants stream to an ultra-low latency edge server, scaling smoothly up to 500 simultaneous participants per halaqah.
              </p>
            </div>

            <div className="p-5 border border-slate-200 rounded-xl bg-white space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <h4 className="font-semibold text-slate-900">Automatic P2P Mesh Fallback</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If LiveKit Cloud credentials are omitted or temporarily offline, the classroom seamlessly transitions to local browser WebRTC mesh mode with explicit notification in the UI.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'payments',
      category: 'Commerce',
      title: 'Payment Gateways & Tuition Billing',
      description: 'Flutterwave, Paystack, Stripe, and Moyasar multi-gateway processing with 0% platform fee.',
      icon: CreditCard,
      tags: ['payments', 'tuition', 'stripe', 'paystack', 'flutterwave', 'moyasar'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Payment Gateways & Automated Tuition Billing</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Academies connect their own merchant gateways. 100% of student tuition deposits directly into the institution's account with 0% platform cut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-semibold text-slate-900 text-sm">Flutterwave</h4>
              <p className="text-xs text-slate-500 mt-1">Multi-currency pan-African processing (NGN, KES, GHS, USD, EUR).</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-semibold text-slate-900 text-sm">Paystack</h4>
              <p className="text-xs text-slate-500 mt-1">Cards, Bank Transfers, USSD, and Mobile Money integration.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-semibold text-slate-900 text-sm">Stripe</h4>
              <p className="text-xs text-slate-500 mt-1">Global credit cards, Apple Pay, Google Pay, and recurring SEPA.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="font-semibold text-slate-900 text-sm">Moyasar</h4>
              <p className="text-xs text-slate-500 mt-1">Direct Saudi Arabia payment rails (Mada, Visa, Mastercard, Apple Pay).</p>
            </div>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
            <h3 className="font-semibold text-slate-900 text-base">Payment Gateway Verification Rule</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              In accordance with platform UI standards, if an academy enables a gateway without supplying API keys, the checkout modal will warn the student and block payment submission rather than failing silently.
            </p>
          </Card>
        </div>
      )
    },
    {
      id: 'branding',
      category: 'Customization',
      title: 'White-Labeling & Academy Branding',
      description: 'Domain white-labeling, color palettes, custom logos, and preloader animations.',
      icon: Palette,
      tags: ['branding', 'whitelabel', 'custom css', 'palette', 'themes'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">White-Labeling & Academy Branding</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Transform Ankabit into your institution's custom-branded platform in minutes.
            </p>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">White-Label Setting Tabs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">1. Brand & Palette</span>
                <p className="text-xs text-slate-500">Logo URL, Favicon, Primary, Secondary & Accent color swatches.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">2. Sign-In Portal</span>
                <p className="text-xs text-slate-500">Custom login headlines, welcome banners, and support contact details.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">3. Preloader Screen</span>
                <p className="text-xs text-slate-500">Branded loading spinner, title text, and background animation.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">4. Custom CSS Injection</span>
                <p className="text-xs text-slate-500">Institutional font stylesheets and custom CSS overrides.</p>
              </div>
            </div>
          </Card>
        </div>
      )
    },
    {
      id: 'api',
      category: 'API Reference',
      title: 'REST API Endpoints Reference',
      description: 'Comprehensive endpoint documentation, request parameters, and response schemas.',
      icon: Terminal,
      tags: ['api', 'rest', 'endpoints', 'curl', 'json', 'post', 'get'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">REST API Endpoints Reference</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Base URL: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-emerald-800">http://localhost:3000/api</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono font-semibold text-emerald-800">https://{'{subdomain}'}.liwanlms.com/api</code>
            </p>
          </div>

          <div className="space-y-4">
            {/* API Endpoint 1 */}
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-emerald-100 text-emerald-800 font-mono font-semibold">GET</Badge>
                  <code className="text-sm font-mono font-semibold text-slate-900">/api/tenant?subdomain={'{subdomain}'}</code>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "http://localhost:3000/api/tenant?subdomain=al-bayaan"`, 'curl-tenant')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  {copiedBlock === 'curl-tenant' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBlock === 'curl-tenant' ? 'Copied cURL' : 'Copy cURL'}
                </button>
              </div>
              <p className="text-xs text-slate-600">Resolves full configuration, white-label settings, and feature flags for the requested tenant.</p>
              <div className="p-3 bg-slate-900 text-slate-100 font-mono text-xs rounded-xl overflow-x-auto">
{`{
  "tenant": {
    "id": "tenant-001",
    "name": "Al-Bayaan Islamic Academy",
    "subdomain": "al-bayaan",
    "theme": { "primary": "#047857" },
    "track": "madrasat"
  }
}`}
              </div>
            </Card>

            {/* API Endpoint 2 */}
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-blue-100 text-blue-800 font-mono font-semibold">POST</Badge>
                  <code className="text-sm font-mono font-semibold text-slate-900">/api/auth/register</code>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X POST "http://localhost:3000/api/auth/register" -H "Content-Type: application/json" -d '{"email":"student@test.com","password":"Password123!","name":"Zayd","role":"student","subdomain":"al-bayaan"}'`, 'curl-register')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  {copiedBlock === 'curl-register' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBlock === 'curl-register' ? 'Copied cURL' : 'Copy cURL'}
                </button>
              </div>
              <p className="text-xs text-slate-600">Registers a new student or teacher scoped exclusively to the specified tenant subdomain.</p>
            </Card>

            {/* API Endpoint 3 */}
            <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="bg-emerald-100 text-emerald-800 font-mono font-semibold">GET</Badge>
                  <code className="text-sm font-mono font-semibold text-slate-900">/api/admin/analytics</code>
                </div>
                <button
                  onClick={() => copyToClipboard(`curl -X GET "http://localhost:3000/api/admin/analytics?subdomain=al-bayaan"`, 'curl-analytics')}
                  className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
                >
                  {copiedBlock === 'curl-analytics' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedBlock === 'curl-analytics' ? 'Copied cURL' : 'Copy cURL'}
                </button>
              </div>
              <p className="text-xs text-slate-600">Retrieves real-time KPIs, 6-month revenue trends, calendar events, tasks, and audit logs.</p>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'schema',
      category: 'Database',
      title: 'Database Schema & Persistence Layer',
      description: 'Prisma schema structure, relational scoping, and index optimization.',
      icon: Database,
      tags: ['schema', 'prisma', 'mysql', 'database', 'models', 'migrations'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Database Schema & Persistence Layer</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Persisted via MySQL 8.0 / MariaDB with high-performance indexes on tenant keys.
            </p>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-slate-950 text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold capitalize tracking-wider text-emerald-400">prisma/schema.prisma Snippet</span>
              <button
                onClick={() => copyToClipboard(`model Tenant {
  id              String         @id @default(cuid())
  name            String
  subdomain       String         @unique
  customDomain    String?        @unique
  status          String         @default("active")
  themeConfig     String?        @db.Text
  users           User[]
  courses         Course[]
  enrollments     Enrollment[]
  payments        Payment[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}`, 'prisma-snippet')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                {copiedBlock === 'prisma-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBlock === 'prisma-snippet' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300/90 overflow-x-auto leading-relaxed p-2">
{`model Tenant {
  id              String         @id @default(cuid())
  name            String
  subdomain       String         @unique
  customDomain    String?        @unique
  status          String         @default("active")
  themeConfig     String?        @db.Text
  users           User[]
  courses         Course[]
  enrollments     Enrollment[]
  payments        Payment[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}`}
            </pre>
          </Card>
        </div>
      )
    },
    {
      id: 'deployment',
      category: 'Operations',
      title: 'Docker & Production Deployment',
      description: 'Containerized deployment guide with an external reverse proxy and TLS provider.',
      icon: Server,
      tags: ['deployment', 'docker', 'production', 'nginx', 'ssl'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Docker & Production Deployment</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Standard production topology using Docker Compose behind an external reverse proxy.
            </p>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-slate-950 text-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold capitalize tracking-wider text-emerald-400">Quickstart Production Command</span>
              <button
                onClick={() => copyToClipboard(`docker compose up -d --build`, 'docker-cmd')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
              >
                {copiedBlock === 'docker-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedBlock === 'docker-cmd' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="font-mono text-xs text-emerald-300/90 p-2">
              docker compose up -d --build
            </pre>
          </Card>
        </div>
      )
    },
    {
      id: 'superadmin',
      category: 'Platform Operations',
      title: 'SuperAdmin Console & System Administration',
      description: 'Platform oversight, tenant management, subscription tiers, and system monitoring.',
      icon: Lock,
      tags: ['superadmin', 'credentials', 'quotas', 'tenants', 'billing'],
      content: (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">SuperAdmin Console & System Administration</h2>
            <p className="text-slate-600 mt-1.5 leading-relaxed">
              Global administration hub accessible at <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded font-semibold">/super-admin</code>.
            </p>
          </div>

          <Card className="p-6 sm:p-7 border border-slate-200/80 bg-white space-y-4">
            <h3 className="font-semibold text-slate-900 text-base">SuperAdmin Capabilities</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong>Tenant Provisioning:</strong> Instant academy creation, custom subdomain binding, quota assignment.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong>Subscription Management:</strong> Manage Starter ($29/mo), Pro ($79/mo), and Enterprise ($199/mo) plans.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong>Tenant Impersonation:</strong> One-click jump into any tenant admin console for customer support.
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <strong>System Health:</strong> Real-time database connection monitoring and WebRTC telemetry.
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/super-admin"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-md transition-colors"
              >
                <Lock className="w-4 h-4 shrink-0" />
                Open SuperAdmin Console
              </Link>
            </div>
          </Card>
        </div>
      )
    }
  ], [copiedBlock]);

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.toLowerCase();
    return sections.filter(
      (s) =>
        s.title.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.category.toLowerCase().includes(query) ||
        s.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [sections, searchQuery]);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      {/* 1. TOP NAVBAR (Strictly w-11/12 mx-auto) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="w-11/12 mx-auto h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
              <AnkabitLogo size="md" />
            </Link>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 capitalize tracking-wide">
              Documentation
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500 shrink-0" />
              Platform Home
            </Link>

            <Link
              href="/login"
              className="px-4 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white py-10 border-b border-emerald-950">
        <div className="w-11/12 mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              Ankabit v2.4 Technical Reference
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Ankabit LMS Documentation</h1>
            <p className="text-emerald-100/80 text-sm leading-relaxed">
              Architecture blueprints, multi-tenant workspace routing, LiveKit WebRTC SFU, GrapesJS studios, and REST APIs.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="/doc.md"
              download="doc.md"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 backdrop-blur-sm transition-all"
            >
              <Download className="w-4 h-4 shrink-0" />
              Download doc.md
            </a>
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE (Strictly w-11/12 mx-auto) */}
      <div className="w-11/12 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SIDEBAR NAVIGATION (3 cols) */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 shrink-0" />
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Navigation List */}
            <nav className="bg-white rounded-2xl border border-slate-200/80 p-2 space-y-1 shadow-xs max-h-[72vh] overflow-y-auto">
              {filteredSections.map((sec) => {
                const IconComponent = sec.icon;
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      setActiveSectionId(sec.id);
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-semibold'
                        : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                      <span className="truncate">{sec.title}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-emerald-700 shrink-0 ml-1" />}
                  </button>
                );
              })}

              {filteredSections.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  No matching topics found for &quot;{searchQuery}&quot;.
                </div>
              )}
            </nav>

            {/* Quick Live System Health Pill */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
              <span className="font-semibold text-slate-900 block">System Services Status</span>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> MySQL DB (3306)
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ONLINE
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> LiveKit SFU
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  READY
                </span>
              </div>
            </div>
          </aside>

          {/* MAIN DOCUMENTATION CONTENT (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Active Content Body */}
            {activeSection.content}

            {/* Footer Navigation within Docs */}
            <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
              <span>Ankabit Autonomous LMS — Enterprise Documentation v2.4</span>
              <div className="flex items-center gap-3">
                <Link href="/" className="hover:text-emerald-700 font-semibold transition-colors">
                  Platform
                </Link>
                <span>•</span>
                <Link href="/create-academy" className="hover:text-emerald-700 font-semibold transition-colors">
                  Create Academy
                </Link>
                <span>•</span>
                <Link href="/super-admin" className="hover:text-emerald-700 font-semibold transition-colors">
                  SuperAdmin
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
