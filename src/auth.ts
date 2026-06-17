import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
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

export const isGitHubAuthConfigured = Boolean(githubProvider);
export const isAuthReady = isDatabaseConfigured && isGitHubAuthConfigured;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter:
    db && isDatabaseConfigured
      ? DrizzleAdapter(db, {
          usersTable: users,
          accountsTable: accounts,
        })
      : undefined,
  secret: env.AUTH_SECRET ?? 'development-auth-secret',
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
  providers: githubProvider ? [githubProvider] : [],
});
