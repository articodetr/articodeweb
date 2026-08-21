import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * `createClient` throws synchronously when the credentials are missing, and this
 * module is imported eagerly by the app shell — so letting it throw takes down
 * the entire site with a blank page. On a host where the env vars were never
 * set, degrade to a disabled contact form instead.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string, {
      auth: { persistSession: false },
    })
  : null;

if (!isSupabaseConfigured) {
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. These are inlined at ' +
      'build time, so they must be set in the host environment before building.'
  );
}
