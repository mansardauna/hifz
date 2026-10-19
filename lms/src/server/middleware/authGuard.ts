import { NextRequest } from 'next/server';
import { AuthService, AuthUserPayload } from '../services/authService';

export interface AuthContext {
  user: AuthUserPayload;
}

export async function getAuthSession(req: NextRequest): Promise<AuthUserPayload | null> {
  // 1. Check Bearer Authorization Header
  const authHeader = req.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const user = AuthService.verifyToken(token);
    if (user) return user;
  }

  // 2. Check Cookie Session
  const cookie = req.cookies.get('hifz_session');
  if (cookie?.value) {
    const user = AuthService.verifyToken(cookie.value);
    if (user) return user;
  }

  return null;
}

export async function requireAuth(
  req: NextRequest,
  allowedRoles?: string[]
): Promise<AuthUserPayload> {
  const user = await getAuthSession(req);

  if (!user) {
    throw new Error('Unauthorized: Authentication session required');
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    throw new Error(`Forbidden: Role '${user.role}' is not authorized for this resource`);
  }

  return user;
}
