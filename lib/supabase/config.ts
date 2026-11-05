export const DEFAULT_SUPABASE_URL = 'https://sjsyfinfapgypuphvmed.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqc3lmaW5mYXBneXB1cGh2bWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxOTMzNTQsImV4cCI6MjEwODc2OTM1NH0.DCqBiNZqinHaawGv_ZDzzQCDeQ6okiGG2YO5_u_zwF8';

export function getSupabaseUrl(): string {
  let raw = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (typeof raw === 'string') {
    raw = raw.trim().replace(/^["']|["']$/g, '');
  }

  if (
    !raw ||
    raw === 'undefined' ||
    raw === 'null' ||
    (!raw.startsWith('http://') && !raw.startsWith('https://'))
  ) {
    return DEFAULT_SUPABASE_URL;
  }

  try {
    const parsed = new URL(raw);
    return `${parsed.protocol}//${parsed.host}`;
  } catch {
    return DEFAULT_SUPABASE_URL;
  }
}

export function getSupabaseAnonKey(): string {
  let raw = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (typeof raw === 'string') {
    raw = raw.trim().replace(/^["']|["']$/g, '');
  }

  if (!raw || raw === 'undefined' || raw === 'null' || raw.length < 20) {
    return DEFAULT_SUPABASE_ANON_KEY;
  }

  return raw;
}

export function getSupabaseServiceRoleKey(): string | undefined {
  let raw = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (typeof raw === 'string') {
    raw = raw.trim().replace(/^["']|["']$/g, '');
  }

  if (!raw || raw === 'undefined' || raw === 'null' || raw.length < 20) {
    return undefined;
  }

  return raw;
}
