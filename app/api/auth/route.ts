import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../src/server/services/authService';
import { apiSuccess, apiError, handleApiError } from '../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, action, name, subdomain } = body;

    if (!email) {
      return apiError('Email is required', 400);
    }

    let result;
    if (action === 'register') {
      result = await AuthService.register({
        email,
        password,
        name,
        role,
        subdomain,
      });
    } else {
      result = await AuthService.authenticate({
        email,
        password,
        role,
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
