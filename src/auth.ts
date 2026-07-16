import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { DrizzleAdapter } from '@auth/drizzle-adapter';

import { db, isDatabaseConfigured } from '@/db';
import { accounts, users } from '@/db/schema';
import { env } from '@/env';

const githubProvider =
  env.AUTH_GITHUB_ID && env.AUTH_GITHUB_SECRET
    ? GitHub({
        clientId: env.AUTH_GITHUB_ID,
        clientSecret: env.AUTH_GITHUB_SECRET,
      })
    : null;

const googleProvider =
  env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET
    ? Google({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    : null;

const authProviders = [githubProvider, googleProvider].flatMap((provider) =>
  provider ? [provider] : []
);

export const isGitHubAuthConfigured = Boolean(githubProvider);
export const isGoogleAuthConfigured = Boolean(googleProvider);
export const isAnyAuthProviderConfigured = authProviders.length > 0;
export const isAuthReady = isDatabaseConfigured && isAnyAuthProviderConfigured;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter:
    db && isDatabaseConfigured
      ? DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
        })
      : undefined,
  secret: env.AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? token.sub ?? '';
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: authProviders,
});
