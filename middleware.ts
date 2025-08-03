import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Additional middleware logic can go here
    console.log('Admin route accessed:', req.nextUrl.pathname);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to admin routes only for authenticated admin users
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
