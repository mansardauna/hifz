# Ankabit UI Design & Architecture Guidelines

This document outlines the strict UI and UX standards that MUST be adhered to across all pages, components, and modules in the Ankabit codebase.

---

## 1. Icon Rules: Direct Inline Icons (STRICT)

> **NO ICON BACKGROUND CONTAINERS OR SHAPES**
> Do NOT encase icons in decorative background circles, rounded squares, or colored boxes.

### ❌ Forbidden Patterns:
```tsx
// NEVER DO THIS:
<div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
  <ShieldCheck className="w-5 h-5" />
</div>

<span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
  <Video className="w-4 h-4" />
</span>
```

### ✅ Mandatory Pattern:
Render icons cleanly, directly, and inline with their colored utility class:
```tsx
<ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
<Video className="w-5 h-5 text-blue-600 shrink-0" />
```

---

## 2. Card Padding & Spacing (STRICT)

> The base `<Card>` component has **zero default padding (`p-0`)**.
> Any card rendered without explicit padding will cause its inner elements to touch the card border.

### ✅ Mandatory Pattern:
Always provide explicit padding on `<Card>`:
```tsx
<Card className="p-6 sm:p-7 space-y-5">
  {/* Content */}
</Card>
```

---

## 3. Action Buttons & Labels (STRICT)

> Keep button labels **concise, direct, and human**. Never use verbose developer descriptions.

### ❌ Forbidden:
- "Save All White-labeling Settings"
- "Save LiveKit Cloud Keys"
- "Persist Classroom Defaults"
- "Execute Payment Gateway Update"

### ✅ Mandatory:
- **`Save`**
- **`Cancel`**
- **`Update`**
- **`Connect`**
- **`Delete`**

---

## 4. Tabbed Organization for Long Forms & Settings (STRICT)

> Never present lengthy multi-section settings forms as a continuous 600+ line vertical scroll.
> Always organize complex settings into clear, focused tabs with horizontal tab bars.

### Example:
- `BrandingWhiteLabeling`: Brand & Palette | Sign-In Portal | Preloader Screen | Registration Fields | Custom CSS
- `GeneralSettings`: Academy Identity | Domain & URLs | Security & Access | Live Classroom Defaults

---

## 5. API Keys & Live Integrations (STRICT)

> When a user attempts to use a feature whose API key is missing or not configured, the application **must explicitly notify the user** rather than failing silently or presenting deceptive fake success.

1. **Persist All Keys**: API credentials and gateway configurations must be stored in `tenant.paymentGateways` or `tenant.settings.integrations` via `updateTenantConfig`.
2. **Checkout & Payments Guard**: When selecting an unconnected gateway, display:
   `"⚠️ Payment Gateway Not Connected: [Provider] has not been configured with live API keys for this academy."`
   Block checkout submission with a clear error prompt directing the admin to Settings.
3. **WebRTC LiveKit Guard**: If LiveKit Cloud credentials are missing, visibly inform the user that the room is running on local P2P browser fallback.
4. **Email / SMS Guard**: If email/SMS gateways are enabled without API keys, warn that delivery cannot proceed until keys are provided.
