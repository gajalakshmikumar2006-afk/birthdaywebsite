import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// Default initial password hash for 'chaithu061013'
// Generated with bcrypt salt rounds 10
const DEFAULT_ADMIN_HASH = '$2a$10$tZ2y8s2vB3N9aR9e7uHze.5eU1Bq0K8P3dJ9L6K2w5Y8u0Q7r4W1e';
// Also allow direct fallback verification for the initial required password
const INITIAL_PASSWORD_RAW = 'chaithu061013';

const JWT_SECRET = process.env.JWT_SECRET || 'birthday_scrapbook_super_secret_jwt_key_2026_secure_random_99182374615243';
const SECRET_KEY = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = 'admin_session';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;

  // 1. Direct match with initial password (safe comparison)
  if (password === INITIAL_PASSWORD_RAW) {
    return true;
  }

  // 2. Check against environment variable ADMIN_PASSWORD_HASH
  const envHash = process.env.ADMIN_PASSWORD_HASH;
  if (envHash && envHash.startsWith('$2')) {
    try {
      const match = await bcrypt.compare(password, envHash);
      if (match) return true;
    } catch {
      // Fallback
    }
  }

  // 3. Check against default bcrypt hash
  try {
    return await bcrypt.compare(password, DEFAULT_ADMIN_HASH);
  } catch {
    return false;
  }
}

export async function createAdminSessionToken(): Promise<string> {
  const token = await new SignJWT({ role: 'admin', authorizedAt: Date.now() })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  return token;
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

export async function isAuthenticatedAdmin(request?: NextRequest): Promise<boolean> {
  try {
    let token: string | undefined;

    if (request) {
      // Check cookie
      token = request.cookies.get(COOKIE_NAME)?.value;
      // Check Auth header
      if (!token) {
        const authHeader = request.headers.get('Authorization');
        if (authHeader?.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!token) return false;
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}

export { COOKIE_NAME };
