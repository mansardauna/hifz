import { jobQueue, JobType } from '../lib/queue';

// Register core asynchronous background workers
jobQueue.registerWorker('SEND_EMAIL', async (job) => {
  const { to, subject, body, fromName } = job.data;
  console.log(`[Worker:Email] Dispatching to ${to}: "${subject}" from "${fromName || 'Ankabit LMS'}"`);
  // In production, invoke Resend API, AWS SES, or SMTP transporter
});

jobQueue.registerWorker('SEND_WHATSAPP', async (job) => {
  const { to, message, templateName } = job.data;
  console.log(`[Worker:WhatsApp] Dispatching template "${templateName}" to ${to}`);
  // In production, invoke Meta WhatsApp Cloud API / Twilio endpoint
});

jobQueue.registerWorker('GENERATE_CERTIFICATE', async (job) => {
  const { studentName, courseTitle, sanadChain, certificateId } = job.data;
  console.log(`[Worker:Certificate] Rendering PDF Sanad ${certificateId} for ${studentName} (${courseTitle})`);
  // In production, render headless PDF buffer and upload to Cloudflare R2 / S3
});

jobQueue.registerWorker('PROCESS_PAYMENT_WEBHOOK', async (job) => {
  const { gateway, eventId, payload } = job.data;
  console.log(`[Worker:Webhook] Processing ${gateway} event ${eventId}`);
  // In production, update invoice status idempotently in database
});

export const queueService = {
  async dispatchEmail(to: string, subject: string, body: string, tenantId?: string) {
    return jobQueue.enqueue('SEND_EMAIL', { to, subject, body }, tenantId);
  },

  async dispatchWhatsApp(to: string, message: string, templateName = 'enrollment_notice', tenantId?: string) {
    return jobQueue.enqueue('SEND_WHATSAPP', { to, message, templateName }, tenantId);
  },

  async generateSanadCertificate(data: {
    studentName: string;
    courseTitle: string;
    sanadChain: string[];
    certificateId: string;
    tenantId?: string;
  }) {
    return jobQueue.enqueue('GENERATE_CERTIFICATE', data, data.tenantId);
  },

  async enqueueWebhookEvent(gateway: string, eventId: string, payload: any, tenantId?: string) {
    return jobQueue.enqueue('PROCESS_PAYMENT_WEBHOOK', { gateway, eventId, payload }, tenantId);
  },
};
