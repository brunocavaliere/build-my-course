import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

import { env } from '@/env';
import type { Database } from '@/lib/supabase/types';

async function getSupabaseServerConfig() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase nao esta configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY antes de usar o client.'
    );
  }

  const cookieStore = await cookies();

  return {
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    cookieStore,
    url: env.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export async function createSupabaseServerClient() {
  const { anonKey, cookieStore, url } = await getSupabaseServerConfig();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components podem nao permitir escrita de cookies.
        }
      },
    },
  });
}
