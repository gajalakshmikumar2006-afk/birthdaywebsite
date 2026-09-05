import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createAdminSessionToken,
  isAuthenticatedAdmin,
  verifyAdminPassword,
} from '@/lib/auth';

export const dynamic = 'force-dynamic';

// GET: Check authentication status
export async function GET(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  return NextResponse.json({ authenticated: isAuth });
}

// POST: Login / Logout
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'login';

    if (action === 'logout') {
      const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    if (action === 'login') {
      const password = body.password;
      if (!password) {
        return NextResponse.json(
          { success: false, error: 'Password is required' },
          { status: 400 }
        );
      }

      const isValid = await verifyAdminPassword(password);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid admin credentials' },
          { status: 401 }
        );
      }

      const token = await createAdminSessionToken();
      const response = NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
      });

      // Set secure HTTP-only cookie
      response.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Authentication failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
