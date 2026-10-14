import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../src/server/services/authService';
import { apiSuccess, apiError, handleApiError } from '../../../src/server/lib/apiResponse';
import { redisClient } from '../../../src/lib/redis';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown-client';
    const body = await request.json();
    const { email, password, action, name, subdomain } = body;

    if (!email) {
      return apiError('Email is required', 400);
    }

    const rateKey = action === 'register' ? `register:${ip}` : `login:${email.toLowerCase().trim()}:${ip}`;
    const rateCheck = await redisClient.checkRateLimit(rateKey, action === 'register' ? 5 : 8, 60);
    if (!rateCheck.allowed) {
      return apiError(
        action === 'register'
          ? 'Too many registration requests. Please wait a minute before retrying.'
          : 'Too many failed login attempts. Please wait 60 seconds before trying again.',
        429
      );
    }

    let result;
    if (action === 'register') {
      result = await AuthService.register({
        email,
        password,
        name,
        role: 'student', // Public registration role is strictly enforced to student
        subdomain,
      });
    } else {
      result = await AuthService.authenticate({
        email,
        password,
        subdomain,
      });
    }

    const response = NextResponse.json({
      success: true,
      user: result.user,
      token: result.token,
    });

    // Set secure HTTP-Only session cookie
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
