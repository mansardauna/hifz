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
class HifzApiClient {
  private apiBaseUrl: string = '/api/v1';

  // Resolve tenant based on hostname or tenant key
  async getTenantConfig(subdomain: string = 'al-furqan'): Promise<TenantConfig> {
    try {
      // Simulation of PHP endpoint: GET /api/v1/tenant?subdomain=...
      const tenant = MOCK_TENANTS[subdomain] || MOCK_TENANTS['al-furqan'];
      return Promise.resolve({ ...tenant });
    } catch (err) {
      console.warn('Falling back to default tenant due to API error:', err);
      return MOCK_TENANTS['al-furqan'];
    }
  }

  // Submit dynamic admissions/contact form to PHP backend
  async submitAdmissionsForm(tenantId: string, formData: Record<string, any>): Promise<{ success: boolean; leadId: string; message: string }> {
    console.log(`[PHP REST API POST ${this.apiBaseUrl}/leads] Submitting admissions lead:`, { tenantId, formData });
    
    // Simulate server processing time
    await new Promise((resolve) => setTimeout(resolve, 600));

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
      message: 'Application submitted successfully! Our admissions team will contact you shortly.'
    };
  }

  // Create a lead directly
  async createLead(leadData: Partial<Lead>): Promise<Lead> {
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

  // Fetch leads for Tenant Admin CRM
  async getLeads(tenantId: string): Promise<Lead[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_LEADS.filter((lead) => lead.tenantId === tenantId || true);
  }

  // Update lead status via PUT /api/v1/leads/{id}/status
  async updateLeadStatus(leadId: string, newStatus: LeadStatus, notes?: string): Promise<Lead> {
    console.log(`[PHP REST API PUT ${this.apiBaseUrl}/leads/${leadId}/status]`, { newStatus, notes });
    const lead = MOCK_LEADS.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    lead.status = newStatus;
    if (notes) lead.notes = notes;
    return { ...lead };
  }

  // Fetch courses with curriculum hierarchy
  async getCourses(tenantId: string): Promise<Course[]> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_COURSES.filter((c) => c.tenantId === tenantId || true);
  }

  // Update course hierarchy / modules
  async saveCourseHierarchy(course: Course): Promise<Course> {
    console.log(`[PHP REST API PUT ${this.apiBaseUrl}/courses/${course.id}] Saving curriculum hierarchy`);
    const idx = MOCK_COURSES.findIndex((c) => c.id === course.id);
    if (idx !== -1) {
      MOCK_COURSES[idx] = { ...course };
    } else {
      MOCK_COURSES.push(course);
    }
    return { ...course };
  }

  // Upload student audio recitation homework blob (POST /api/v1/recitations/upload)
  async uploadRecitationAudio(submission: Omit<RecitationSubmission, 'id' | 'submittedAt' | 'status'>): Promise<RecitationSubmission> {
    console.log(`[PHP REST API POST ${this.apiBaseUrl}/recitations/upload] Uploading audio homework blob...`);
    await new Promise((resolve) => setTimeout(resolve, 800));

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
