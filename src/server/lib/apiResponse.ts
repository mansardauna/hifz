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
    if (error.name === 'SyntaxError' && error.message.toLowerCase().includes('json')) {
      return apiError('Invalid JSON payload in request body', 400);
    }
    if (error.message.toLowerCase().includes('authentication required') || error.message.toLowerCase().includes('invalid email or password')) {
      return apiError(error.message, 401);
    }
    if (error.message.toLowerCase().includes('already exists') || error.message.toLowerCase().includes('taken')) {
      return apiError(error.message, 409);
    }
    if (error.message.toLowerCase().includes('required') || error.message.toLowerCase().includes('must be at least')) {
      return apiError(error.message, 400);
    }
    if (error.message.toLowerCase().includes('forbidden')) {
      return apiError(error.message, 403);
    }
    return apiError(error.message, 400);
  }
  return apiError('An unexpected server error occurred', 500);
}
