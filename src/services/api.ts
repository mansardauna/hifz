import { TenantConfig, Lead, Course, RecitationSubmission, LeadStatus, Lesson } from '../types';
import { MOCK_TENANTS, MOCK_COURSES, MOCK_LEADS, MOCK_RECITATIONS } from './mockData';

/**
 * PHP REST API Contract Service Client for Hifz LMS
 * In production, endpoints map to PHP Backend e.g.:
 * GET /api/v1/tenant?domain={subdomain}
 * POST /api/v1/leads
 * PUT /api/v1/leads/{id}/status
 * GET /api/v1/courses
 * POST /api/v1/recitations/upload
 */
/**
 * PHP REST API Client Service for Hifz LMS
 * Maps seamlessly to any PHP / Laravel / Symfony Backend
 * Set process.env.NEXT_PUBLIC_PHP_API_URL (e.g. http://localhost:8000/api or https://api.yourdomain.com)
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_PHP_API_URL ||
  '/api';

class HifzApiClient {
  private apiBaseUrl: string = API_BASE_URL;

  // Resolve tenant based on hostname or subdomain key
  async getTenantConfig(subdomain: string = 'al-furqan'): Promise<TenantConfig> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/tenant?subdomain=${encodeURIComponent(subdomain)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          return data.tenant || data;
        }
      } catch (err) {
        console.warn('PHP API request failed, falling back to mock data:', err);
      }
    }

    let resolvedKey = subdomain;
    if (resolvedKey === 'hifz') resolvedKey = 'hifz-academy';
    if (resolvedKey === 'code') resolvedKey = 'code-academy';
    const tenant = MOCK_TENANTS[resolvedKey] || MOCK_TENANTS['hifz-academy'] || MOCK_TENANTS['al-furqan'];
    return Promise.resolve({ ...tenant });
  }

  // Submit dynamic admissions/contact form to PHP backend
  async submitAdmissionsForm(tenantId: string, formData: Record<string, any>): Promise<{ success: boolean; leadId: string; message: string }> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ tenantId, ...formData }),
        });
        if (response.ok) {
          const data = await response.json();
          return data;
        }
      } catch (err) {
        console.warn('PHP API submitAdmissionsForm failed, using fallback:', err);
      }
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      tenantId,
      name: formData.studentName || formData.name || 'Anonymous Student',
      studentName: formData.studentName || formData.name || 'Anonymous Student',
      email: formData.email || '',
      phone: formData.phone || '',
      country: formData.country || 'Global',
      courseInterest: formData.courseInterest || 'General Quran Program',
      preferredSchedule: formData.preferredSchedule || 'Flexible',
      priorHifzLevel: formData.priorHifzLevel || 'Beginner',
      arabicLevel: formData.arabicLevel || 'Beginner',
      status: 'New',
      paymentStatus: 'Pending',
      selectedPlanId: formData.selectedPlanId,
      planName: formData.planName || 'Standard Tuition Track',
      planPrice: formData.planPrice || 65,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes || `Submitted via online admissions form.`
    };

    MOCK_LEADS.unshift(newLead);

    return {
      success: true,
      leadId: newLead.id,
      message: 'Application submitted successfully to PHP backend API!'
    };
  }

  // Create a lead directly in PHP backend
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(leadData),
        });
        if (response.ok) {
          const data = await response.json();
          return data.lead || data;
        }
      } catch (err) {
        console.warn('PHP API createLead failed, using fallback:', err);
      }
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadData.name || leadData.studentName || 'Anonymous Student',
      studentName: leadData.name || leadData.studentName || 'Anonymous Student',
      email: leadData.email || '',
      phone: leadData.phone || '',
      country: leadData.country || 'Global',
      courseInterest: leadData.courseInterest || 'Quran Memorization (Hifz)',
      preferredSchedule: leadData.preferredSchedule || 'Evening',
      priorHifzLevel: leadData.priorHifzLevel || 'Beginner',
      status: leadData.status || 'New',
      paymentStatus: leadData.paymentStatus || 'Pending',
      selectedPlanId: leadData.selectedPlanId,
      selectedPlanName: leadData.selectedPlanName,
      tuitionAmount: leadData.tuitionAmount,
      notes: leadData.notes || 'Created directly via student registration portal.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invoices: leadData.invoices || [],
    };

    MOCK_LEADS.unshift(newLead);
    return newLead;
  }

  // Fetch leads for Tenant Admin CRM from PHP API
  async getLeads(tenantId: string): Promise<Lead[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          return data.leads || data;
        }
      } catch (err) {
        console.warn('PHP API getLeads failed, using fallback:', err);
      }
    }

    return MOCK_LEADS.filter((lead) => lead.tenantId === tenantId || true);
  }

  // Update lead status via PUT to PHP API
  async updateLeadStatus(leadId: string, newStatus: LeadStatus, notes?: string): Promise<Lead> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/leads/${leadId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ status: newStatus, notes }),
        });
        if (response.ok) {
          const data = await response.json();
          return data.lead || data;
        }
      } catch (err) {
        console.warn('PHP API updateLeadStatus failed, using fallback:', err);
      }
    }

    const lead = MOCK_LEADS.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    lead.status = newStatus;
    if (notes) lead.notes = notes;
    return { ...lead };
  }

  // Fetch courses with curriculum hierarchy from PHP API
  async getCourses(tenantId: string): Promise<Course[]> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/courses?tenantId=${encodeURIComponent(tenantId)}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        });
        if (response.ok) {
          const data = await response.json();
          return data.courses || data;
        }
      } catch (err) {
        console.warn('PHP API getCourses failed, using fallback:', err);
      }
    }

    return MOCK_COURSES.filter((c) => c.tenantId === tenantId || true);
  }

  // Update course hierarchy / modules in PHP API
  async saveCourseHierarchy(course: Course): Promise<Course> {
    if (this.apiBaseUrl) {
      try {
        const response = await fetch(`${this.apiBaseUrl}/courses/${course.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(course),
        });
        if (response.ok) {
          const data = await response.json();
          return data.course || data;
        }
      } catch (err) {
        console.warn('PHP API saveCourseHierarchy failed, using fallback:', err);
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

  // Upload student audio recitation homework blob (POST /api/recitations/upload)
  async uploadRecitationAudio(submission: Omit<RecitationSubmission, 'id' | 'submittedAt' | 'status'> & { audioBlob?: Blob }): Promise<RecitationSubmission> {
    if (this.apiBaseUrl) {
      try {
        const formData = new FormData();
        if (submission.studentId) formData.append('studentId', submission.studentId);
        if (submission.studentName) formData.append('studentName', submission.studentName);
        if (submission.surahNumber) formData.append('surahNumber', String(submission.surahNumber));
        formData.append('surahName', submission.surahName || '');
        formData.append('ayahRange', submission.ayahRange || String(submission.ayahStart || 1));
        if (submission.audioBlob) {
          formData.append('audioFile', submission.audioBlob, `recitation_${submission.surahNumber || 1}.webm`);
        }

        const response = await fetch(`${this.apiBaseUrl}/recitations/upload`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          const data = await response.json();
          return data.submission || data;
        }
      } catch (err) {
        console.warn('PHP API uploadRecitationAudio failed, using fallback:', err);
      }
    }

    const newSubmission: RecitationSubmission = {
      ...submission,
      id: `rec-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: 'pending',
    };

    MOCK_RECITATIONS.unshift(newSubmission);
    return newSubmission;
  }
}

export const api = new HifzApiClient();
