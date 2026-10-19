// Distributed Asynchronous Background Queue Layer

export type JobType =
  | 'SEND_EMAIL'
  | 'SEND_WHATSAPP'
  | 'GENERATE_CERTIFICATE'
  | 'PROCESS_PAYMENT_WEBHOOK'
  | 'TRANSCODE_AUDIO';

export interface BackgroundJob<T = any> {
  id: string;
  type: JobType;
  tenantId?: string;
  data: T;
  attempts: number;
  maxAttempts: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  error?: string;
}

type JobHandler<T = any> = (job: BackgroundJob<T>) => Promise<void>;

class AsyncJobQueue {
  private handlers = new Map<JobType, JobHandler>();
  private queue: BackgroundJob[] = [];
  private isProcessing = false;

  // Register worker handler for a specific job type
  registerWorker<T = any>(type: JobType, handler: JobHandler<T>): void {
    this.handlers.set(type, handler);
  }

  // Enqueue a new background job
  async enqueue<T = any>(
    type: JobType,
    data: T,
    tenantId?: string,
    maxAttempts = 3
  ): Promise<string> {
    const job: BackgroundJob<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      type,
      tenantId,
      data,
      attempts: 0,
      maxAttempts,
      status: 'queued',
      createdAt: new Date().toISOString(),
    };

    this.queue.push(job);
    this.processNext();
    return job.id;
  }

  private async processNext(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;
    this.isProcessing = true;

    const job = this.queue.shift();
    if (!job) {
      this.isProcessing = false;
      return;
    }

    const handler = this.handlers.get(job.type);
    if (!handler) {
      console.warn(`[Queue] No worker registered for job type: ${job.type}`);
      this.isProcessing = false;
      return;
    }

    job.status = 'processing';
    job.attempts += 1;

    try {
      await handler(job);
      job.status = 'completed';
    } catch (err: any) {
      job.error = err?.message || 'Unknown execution error';
      if (job.attempts < job.maxAttempts) {
        job.status = 'queued';
        // Exponential backoff retry
        setTimeout(() => {
          this.queue.push(job);
          this.processNext();
        }, Math.pow(2, job.attempts) * 1000);
      } else {
        job.status = 'failed';
        console.error(`[Queue] Job ${job.id} (${job.type}) failed permanently:`, job.error);
      }
    } finally {
      this.isProcessing = false;
      this.processNext();
    }
  }
}

export const jobQueue = new AsyncJobQueue();
