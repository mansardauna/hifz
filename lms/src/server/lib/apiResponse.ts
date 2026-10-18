import { NextResponse } from 'next/server';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export function apiSuccess<T>(data: T, message?: string, status: number = 200) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

export function apiError(message: string, status: number = 400, errors?: Record<string, string[]>) {
  const payload: ApiResponse = {
    success: false,
    error: message,
    message,
    errors,
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(payload, { status });
}

export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number = 400) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

export function handleApiError(error: unknown) {
  console.error('[API Error Caught]:', error);
  if (error instanceof HttpError) {
    return apiError(error.message, error.status);
  }
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (error.name === 'SyntaxError' && msg.includes('json')) {
      return apiError('Invalid JSON payload in request body', 400);
    }
    if (msg.includes('authentication required') || msg.includes('invalid email or password')) {
      return apiError(error.message, 401);
    }
    if (msg.includes('already exists') || msg.includes('taken')) {
      return apiError(error.message, 409);
    }
    if (msg.includes('required') || msg.includes('must be at least') || msg.includes('not found') || msg.includes('invalid')) {
      return apiError(error.message, 400);
    }
    if (msg.includes('forbidden') || msg.includes('unauthorized')) {
      return apiError(error.message, 403);
    }

    // Sanitize unhandled internal database/system exceptions in production
    if (process.env.NODE_ENV === 'production') {
      return apiError('An unexpected server error occurred. Please try again later.', 500);
    }
    return apiError(error.message, 500);
  }
  return apiError('An unexpected server error occurred', 500);
}
