export const DEFAULT_SUPABASE_URL = 'https://sjsyfinfapgypuphvmed.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqc3lmaW5mYXBneXB1cGh2bWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTMzNTQsImV4cCI6MjEwODc2OTM1NH0.DCqBiNZqinHaawGv_ZDzzQCDeQ6okiGG2YO5_u_zwF8';

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}
