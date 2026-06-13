import { createBrowserClient } from '@supabase/ssr';

import { env } from '@/env';
import type { Database } from '@/lib/supabase/types';

function getSupabaseBrowserConfig() {
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase nao esta configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY antes de usar o client.'
    );
  }

  return {
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: env.NEXT_PUBLIC_SUPABASE_URL,
  };
}

export function createSupabaseBrowserClient() {
  const { anonKey, url } = getSupabaseBrowserConfig();

  return createBrowserClient<Database>(url, anonKey);
}
