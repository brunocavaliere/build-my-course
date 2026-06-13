import { env } from '@/env';

export { createSupabaseBrowserClient } from '@/lib/supabase/browser';
export { createSupabaseServerClient } from '@/lib/supabase/server';
export type { Database } from '@/lib/supabase/types';

export function isSupabaseConfigured() {
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
