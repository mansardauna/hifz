import { TenantConfig, Lead, Course, RecitationSubmission, LeadStatus, Lesson } from '../types';
import { MOCK_TENANTS, MOCK_COURSES, MOCK_LEADS, MOCK_RECITATIONS, MOCK_ANALYTICS } from './mockData';
import { isDemoTenant } from '../lib/tenants';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_PHP_API_URL ||
  '/api';

class HifzApiClient {
  private apiBaseUrl: string = API_BASE_URL;
  private tenantInFlight: Map<string, Promise<TenantConfig>> = new Map();

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('auth_token') || localStorage.getItem('ankabit_auth_token');
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (e) {}
    }
    return headers;
  }

  // Resolve tenant based on hostname or subdomain key with request deduplication
  async getTenantConfig(subdomain: string = 'al-furqan'): Promise<TenantConfig> {
    const key = (subdomain || 'al-furqan').toLowerCase().trim();
    if (this.tenantInFlight.has(key)) {
      return this.tenantInFlight.get(key)!;
    }

    const requestPromise = (async () => {
      if (this.apiBaseUrl) {
        try {
          const response = await fetch(`${this.apiBaseUrl}/tenant?subdomain=${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: this.getAuthHeaders(),
          });
          if (response.ok) {
            const data = await response.json();
            return data.tenant || data;
          }
        } catch (err) {
          console.warn('API getTenantConfig failed:', err);
        } finally {
          setTimeout(() => this.tenantInFlight.delete(key), 500);
        }
      }

      let resolvedKey = key;
      if (resolvedKey === 'hifz') resolvedKey = 'hifz-academy';
      if (resolvedKey === 'code') resolvedKey = 'code-academy';

      if (isDemoTenant(resolvedKey)) {
        const mockTenant = MOCK_TENANTS[resolvedKey] || MOCK_TENANTS['demo'];
        if (mockTenant) {
          return { ...mockTenant };
        }
      }

      // Default clean, unpopulated configuration for real signed-up user academies
       const primaryColor = key.includes('code') ? '#2563eb' : key.includes('school') ? '#7c3aed' : '#059669';
       const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
      const cleanTenant: TenantConfig = {
        id: `tenant-${key}`,
        name: key.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
        nameAr: key,
        tagline: 'Autonomous Educational Institution',
        taglineAr: 'منصة تعليمية ذكية',
        subdomain: key,
        customDomain: `${key}.${rootDomain}`,
        niche: key.includes('code') ? 'coding' : key.includes('school') ? 'school' : 'madrasat',
        logoUrl: '',
        faviconUrl: '',
        theme: {
          primaryColor,
          primaryHover: primaryColor,
          secondaryColor: '#0f172a',
          accentColor: '#10b981',
          backgroundColor: '#ffffff',
          surfaceColor: '#f8fafc',
          textColor: '#0f172a',
          borderRadius: 'rounded-xl',
          fontFamily: 'Inter',
        },
        heroBadgeText: 'Admissions Open',
        heroBadgeTextAr: 'التسجيل متاح',
        aboutText: `Welcome to ${key}.`,
        aboutTextAr: `مرحباً بكم في ${key}.`,
        admissionsOpen: true,
        pageBlocks: [],
        pricingPlans: [],
        paymentGateways: [],
        forms: [],
        customFormFields: [],
        subscriptionPlan: 'free',
        contactEmail: `admin@${key}.${rootDomain}`,
        contactPhone: '',
        defaultDirection: 'ltr',
      };
      return cleanTenant;
    })();

    this.tenantInFlight.set(key, requestPromise);
    return requestPromise;
  }

  // Submit dynamic admissions/contact form
  async submitAdmissionsForm(tenantId: string, formData: Record<string, any>): Promise<{ success: boolean; leadId: string; message: string }> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ tenantId, ...formData }),
        });
        if (response.ok) {
          const data = await response.json();
          return {
            success: true,
            leadId: data.id || data.leadId,
            message: 'Application submitted successfully to your academy!',
          };
        }
      } catch (err) {
        console.warn('API submitAdmissionsForm failed:', err);
      }
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId,
      name: formData.name || formData.studentName || 'Anonymous Student',
      studentName: formData.name || formData.studentName || 'Anonymous Student',
      email: formData.email || '',
      phone: formData.phone || '',
      country: formData.country || 'Global',
      courseInterest: formData.courseInterest || 'General Admission',
      preferredSchedule: formData.preferredSchedule || 'Flexible',
      priorHifzLevel: formData.priorHifzLevel || 'Beginner',
      status: 'New',
      paymentStatus: 'Pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes || 'Submitted via online admissions form.'
    };

    if (isDemoTenant(tenantId)) {
      MOCK_LEADS.unshift(newLead);
    }

    return {
      success: true,
      leadId: newLead.id,
      message: 'Application submitted successfully!'
    };
  }

  // Create a lead directly in DB
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(leadData),
        });
        if (response.ok) {
          const data = await response.json();
          return data.lead || data;
        }
      } catch (err) {
        console.warn('API createLead failed:', err);
      }
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || leadData.studentName || 'Anonymous Student',
      studentName: leadData.name || leadData.studentName || 'Anonymous Student',
      email: leadData.email || '',
      phone: leadData.phone || '',
      country: leadData.country || 'Global',
      courseInterest: leadData.courseInterest || 'Sacred Knowledge Track',
      preferredSchedule: leadData.preferredSchedule || 'Evening',
      priorHifzLevel: leadData.priorHifzLevel || 'Beginner',
      status: leadData.status || 'New',
      paymentStatus: leadData.paymentStatus || 'Pending',
      selectedPlanId: leadData.selectedPlanId,
      selectedPlanName: leadData.selectedPlanName,
      tuitionAmount: leadData.tuitionAmount,
      notes: leadData.notes || 'Created directly via registration portal.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoices: leadData.invoices || [],
    };

    if (isDemoTenant(leadData.tenantId)) {
      MOCK_LEADS.unshift(newLead);
    }
    return newLead;
  }

  // Fetch leads for Tenant Admin CRM
  async getLeads(tenantId: string): Promise<Lead[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.leads || (Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('API getLeads failed:', err);
      }
    }

    const cleanSubdomain = tenantId.replace('tenant-', '');
    if (isDemoTenant(cleanSubdomain)) {
      return MOCK_LEADS.filter((lead) => lead.tenantId === tenantId || lead.tenantId === `tenant-${cleanSubdomain}`);
    }
    return [];
  }

  // Update lead status via PUT
  async updateLeadStatus(leadId: string, newStatus: LeadStatus, notes?: string): Promise<Lead> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ id: leadId, status: newStatus, notes }),
        });
        if (response.ok) {
          const data = await response.json();
          return data.lead || data;
        }
      } catch (err) {
        console.warn('API updateLeadStatus failed:', err);
      }
    }

    const lead = MOCK_LEADS.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    lead.status = newStatus;
    if (notes) lead.notes = notes;
    return { ...lead };
  }

  // Fetch courses with curriculum hierarchy
  async getCourses(tenantId: string): Promise<Course[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/courses?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.courses || (Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('API getCourses failed:', err);
      }
    }

    const cleanSubdomain = tenantId.replace('tenant-', '');
    if (isDemoTenant(cleanSubdomain)) {
      return MOCK_COURSES.filter((c) => c.tenantId === tenantId || c.tenantId === `tenant-${cleanSubdomain}`);
    }
    return [];
  }

  // Update course hierarchy / modules in DB
  async saveCourseHierarchy(course: Course): Promise<Course> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/courses`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(course),
        });
        if (response.ok) {
          const data = await response.json();
          return data.course || data;
        }
      } catch (err) {
        console.warn('API saveCourseHierarchy failed:', err);
      }
    }

    const idx = MOCK_COURSES.findIndex((c) => c.id === course.id);
    if (idx !== -1) {
      MOCK_COURSES[idx] = { ...course };
    } else {
      MOCK_COURSES.push(course);
    }
    return { ...course };
  }

  // Fetch real analytics from DB / backend
  async getAnalytics(tenantId: string): Promise<any> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/analytics?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('API getAnalytics failed:', err);
      }
    }

    const cleanSubdomain = tenantId.replace('tenant-', '');
    if (isDemoTenant(cleanSubdomain)) {
      return MOCK_ANALYTICS;
    }

    return {
      totalLeads: 0,
      enrolledStudents: 0,
      recitationSubmissions: 0,
      completionRatePercent: 0,
      monthlyRevenue: 0,
      monthlyEnrollment: [],
      juzDistribution: [],
    };
  }

  // Fetch student recitation submissions
  async getSubmissions(tenantId?: string, studentId?: string): Promise<RecitationSubmission[]> {
    if (this.apiBaseUrl) {
      try {
        const url = `${this.apiBaseUrl}/submissions?${tenantId ? `tenantId=${encodeURIComponent(tenantId)}` : ''}${studentId ? `&studentId=${encodeURIComponent(studentId)}` : ''}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: this.getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          return data.submissions || (Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('API getSubmissions failed:', err);
      }
    }

    const cleanSubdomain = tenantId?.replace('tenant-', '');
    if (cleanSubdomain && isDemoTenant(cleanSubdomain)) {
      return MOCK_RECITATIONS;
    }
    return [];
  }

  // Upload student audio recitation homework blob
  async uploadRecitationAudio(submission: Omit<RecitationSubmission, 'id' | 'submittedAt' | 'status'> & { audioBlob?: Blob }): Promise<RecitationSubmission> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/submissions`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify(submission),
        });
        if (response.ok) {
          const data = await response.json();
          return data.submission || data;
        }
      } catch (err) {
        console.warn('API uploadRecitationAudio failed:', err);
      }
    }

    const newSubmission: RecitationSubmission = {
      ...submission,
      id: `rec-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    if (isDemoTenant(submission.tenantId)) {
      MOCK_RECITATIONS.unshift(newSubmission);
    }
    return newSubmission;
  }

  // Grade student recitation submission via PUT /api/submissions
  async gradeSubmission(
    id: string,
    updates: {
      score?: number;
      feedback?: string;
      status?: string;
      teacherAudioFeedbackUrl?: string;
      teacherAudioFeedbackDuration?: number;
    }
  ): Promise<any> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/submissions`, {
          method: 'PUT',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({ id, ...updates }),
        });
        if (response.ok) {
          return await response.json();
        }
      } catch (err) {
        console.warn('API gradeSubmission failed:', err);
      }
    }

    return { success: true, id, ...updates };
  }
}

export const api = new HifzApiClient();
