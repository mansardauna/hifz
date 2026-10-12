import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../src/server/services/authService';
import { apiError, handleApiError } from '../../../../src/server/lib/apiResponse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role = 'admin', subdomain } = body;

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
      role,
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
