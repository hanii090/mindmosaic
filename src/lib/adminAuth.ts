// Admin authentication utilities
'use server';

import { NextRequest, NextResponse } from 'next/server';

// Authorized admin email (replace with your email)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mindmosaic.app';

// Simple JWT secret for demo purposes - in production use proper JWT setup
const JWT_SECRET = process.env.JWT_SECRET || 'mindmosaic-admin-secret-2024';

export interface AdminUser {
  email: string;
  name: string;
  authenticated: boolean;
}

/**
 * Check if user is authenticated admin
 */
export async function verifyAdminAuth(request: NextRequest): Promise<AdminUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('admin-session');
    
    if (!authHeader && !sessionCookie) {
      return null;
    }

    // Simple authentication check - in production, use proper JWT verification
    if (sessionCookie?.value === 'authenticated-admin') {
      return {
        email: ADMIN_EMAIL,
        name: 'Admin',
        authenticated: true
      };
    }

    return null;
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return null;
  }
}

/**
 * Middleware to protect admin routes
 */
export async function adminAuthMiddleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Skip auth for login page
  if (url.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check authentication for admin routes
  if (url.pathname.startsWith('/admin')) {
    const user = await verifyAdminAuth(request);
    
    if (!user) {
      // Redirect to login
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

/**
 * Simple login function for demo purposes
 */
export async function loginAdmin(email: string, password: string): Promise<boolean> {
  // Simple check - in production, use proper authentication
  if (email === ADMIN_EMAIL && password === 'mindmosaic2024') {
    return true;
  }
  return false;
}

/**
 * Generate admin session
 */
export function createAdminSession(): { success: boolean; message: string } {
  return {
    success: true,
    message: 'Admin authenticated successfully'
  };
}

/**
 * Clear admin session
 */
export function clearAdminSession(): void {
  // In a real app, this would clear JWT tokens
  console.log('Admin session cleared');
}
