// NextAuth configuration for secure admin authentication
import { NextAuthOptions } from 'next-auth';
import { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Authorized admin email from environment variable
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@mindmosaic.app';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mindmosaic2024';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'admin@mindmosaic.app' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verify admin credentials
        if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
          return {
            id: '1',
            email: ADMIN_EMAIL,
            name: 'MindMosaic Admin',
            role: 'admin'
          };
        }

        return null;
      }
    })
  ],
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  
  pages: {
    signIn: '/admin/login',
    error: '/admin/login'
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'mindmosaic-nextauth-secret-2024'
};

// Type augmentation for NextAuth
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  
  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
