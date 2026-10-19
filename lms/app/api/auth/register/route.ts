import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../src/server/services/authService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';
import { redisClient } from '../../../../src/lib/redis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-client';
    const rateCheck = await redisClient.checkRateLimit(`register:${ip}`, 5, 60);
    if (!rateCheck.allowed) {
      return apiError('Too many registration requests from this IP. Please wait a minute before retrying.', 429);
    }

    const body = await request.json();
    const { email, password, name, subdomain } = body;

    if (!email) {
      return apiError('Email is required', 400);
    }
    if (!password) {
      return apiError('Password is required', 400);
    }

    const result = await AuthService.register({
      email,
      password,
      name,
      role: 'student', // Public registration role is strictly enforced to student
      subdomain,
    });

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    }, { status: 201 });

    response.cookies.set('hifz_session', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return handleApiError(error);
  }
}
