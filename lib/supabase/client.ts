import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseUrl, getSupabaseAnonKey } from './config';

export function createClient() {
  const cleanUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!cleanUrl || !supabaseAnonKey) {
    return null;
  }

  try {
    return createBrowserClient(cleanUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize browser Supabase client:', err);
    return null;
  }
}
