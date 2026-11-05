import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

export async function createClient() {
  const cookieStore = await cookies();
  const cleanUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!cleanUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    return createServerClient(cleanUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
          }
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize server Supabase client:', err);
    return null;
  }
}
