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

export function handleApiError(error: unknown) {
  console.error('[API Error Caught]:', error);
  if (error instanceof Error) {
    return apiError(error.message, 500);
  }
  return apiError('An unexpected server error occurred', 500);
}
