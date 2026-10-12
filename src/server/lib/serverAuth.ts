import { NextRequest } from 'next/server';
import { AuthService, AuthUserPayload } from '../services/authService';

/**
 * Extracts and verifies the authenticated user from the HTTP-Only session cookie
 * or Authorization: Bearer <token> header.
 */
export function getAuthenticatedUser(request: NextRequest): AuthUserPayload | null {
  // 1. Check HTTP-Only cookie 'hifz_session'
  const sessionCookie = request.cookies.get('hifz_session')?.value;
  if (sessionCookie) {
    const verified = AuthService.verifyToken(sessionCookie);
    if (verified) return verified;
  }

  // 2. Check Authorization Header (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    const verified = AuthService.verifyToken(bearerToken);
    if (verified) return verified;
  }

  return null;
}

import { HttpError } from './apiResponse';

/**
 * Asserts that the request is authenticated and that the user holds one of the required roles.
 * Throws an HttpError if unauthorized, which is caught and returned as HTTP 401/403.
 */
export function requireAuth(
  request: NextRequest,
  allowedRoles?: string[]
): AuthUserPayload {
  const user = getAuthenticatedUser(request);
  if (!user) {
    throw new HttpError('Authentication required. Please sign in to access this resource.', 401);
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      throw new HttpError(`Forbidden: Access requires one of the following roles: ${allowedRoles.join(', ')}`, 403);
    }
  }

  return user;
}
