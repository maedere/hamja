import fs from 'fs/promises';
import path from 'path';
import { UserProfile, HostingRequest, RequestStatus } from '@/types/database';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

import { getSupabaseUrl, getSupabaseAnonKey, getSupabaseServiceRoleKey } from '@/lib/supabase/config';

const DB_FILE_PATH = path.join(process.cwd(), 'data', 'hamja_db.json');

// Check if Supabase credentials are configured
export function isSupabaseEnabled(): boolean {
  return Boolean(
    getSupabaseUrl() &&
    (getSupabaseServiceRoleKey() || getSupabaseAnonKey())
  );
}

function getSupabase() {
  const cleanUrl = getSupabaseUrl();
  const key = getSupabaseServiceRoleKey() || getSupabaseAnonKey();
  if (!cleanUrl || !key) return null;
  try {
    return createSupabaseClient(cleanUrl, key);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

interface LocalDatabaseSchema {
  users: UserProfile[];
  requests: HostingRequest[];
}

const DEFAULT_DB: LocalDatabaseSchema = {
  users: [],
  requests: [],
};

// Memory cache for local file store to avoid race conditions
let memCache: LocalDatabaseSchema | null = null;

async function ensureLocalDb(): Promise<LocalDatabaseSchema> {
  if (memCache) return memCache;

  try {
    const dir = path.dirname(DB_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    const content = await fs.readFile(DB_FILE_PATH, 'utf-8');
    memCache = JSON.parse(content) as LocalDatabaseSchema;
    if (!Array.isArray(memCache.users)) memCache.users = [];
    if (!Array.isArray(memCache.requests)) memCache.requests = [];
    return memCache;
  } catch (err: any) {
    memCache = { ...DEFAULT_DB };
    return memCache;
  }
}

async function persistLocalDb(data: LocalDatabaseSchema): Promise<void> {
  memCache = data;
  try {
    const dir = path.dirname(DB_FILE_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    // Read-only filesystem in serverless environments (Vercel)
  }
}

// ==========================================
// User / Profile Operations
// ==========================================

export async function getAllUsers(): Promise<UserProfile[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase getAllUsers error:', error);
      // Fallback to local
    } else if (data) {
      return data as UserProfile[];
    }
  }

  const db = await ensureLocalDb();
  return db.users;
}

export async function getUserById(id: string): Promise<UserProfile | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (data) {
      return data as UserProfile;
    }

    if (!error) {
      return null;
    }
  }

  const db = await ensureLocalDb();
  return db.users.find((u) => u.id === id) || null;
}

export async function getUserByUsername(identifier: string): Promise<UserProfile | null> {
  const clean = identifier.trim().toLowerCase();
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.${clean},phone.eq.${clean},instagram.ilike.${clean}`)
      .limit(1);

    if (data && data.length > 0) {
      return data[0] as UserProfile;
    }

    if (!error) {
      return null;
    }
  }

  const db = await ensureLocalDb();
  return (
    db.users.find(
      (u) =>
        u.username?.toLowerCase() === clean ||
        u.phone?.replace(/\s+/g, '') === clean ||
        u.instagram?.toLowerCase() === clean
    ) || null
  );
}

export async function createUser(profile: UserProfile): Promise<UserProfile> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase createUser error:', error);
      throw new Error(error.message || 'خطا در ذخیره‌سازی اطلاعات در دیتابیس ابری');
    } else if (data) {
      return data as UserProfile;
    }
  }

  const db = await ensureLocalDb();
  // Filter out any duplicate ID just in case
  const updatedUsers = [profile, ...db.users.filter((u) => u.id !== profile.id)];
  await persistLocalDb({ ...db, users: updatedUsers });
  return profile;
}

export async function updateUser(
  id: string,
  updates: Partial<UserProfile>
): Promise<UserProfile | null> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (data) {
      return data as UserProfile;
    }

    if (!error) {
      return null;
    }
  }

  const db = await ensureLocalDb();
  const index = db.users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  const updated: UserProfile = { ...db.users[index], ...updates };
  db.users[index] = updated;
  await persistLocalDb(db);
  return updated;
}

export async function clearAllUsers(): Promise<void> {
  const supabase = getSupabase();
  if (supabase) {
    await supabase.from('profiles').delete().neq('id', '');
    await supabase.from('hosting_requests').delete().neq('id', '');
  }

  const db = await ensureLocalDb();
  await persistLocalDb({ users: [], requests: [] });
}

// ==========================================
// Hosting Request Operations
// ==========================================

export async function getAllRequests(): Promise<HostingRequest[]> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('hosting_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      return data as HostingRequest[];
    }
    if (error) {
      console.error('Supabase getAllRequests error:', error);
    }
  }

  const db = await ensureLocalDb();
  return db.requests;
}

export async function createRequest(req: HostingRequest): Promise<HostingRequest> {
  const isoCreatedAt =
    req.created_at && !isNaN(new Date(req.created_at).getTime())
      ? new Date(req.created_at).toISOString()
      : new Date().toISOString();

  const formattedReq: HostingRequest = {
    ...req,
    created_at: isoCreatedAt,
  };

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('hosting_requests')
      .insert([formattedReq])
      .select()
      .maybeSingle();

    if (!error && data) {
      const db = await ensureLocalDb();
      await persistLocalDb({
        ...db,
        requests: [data as HostingRequest, ...db.requests.filter((r) => r.id !== req.id)],
      });
      return data as HostingRequest;
    }

    if (error) {
      console.error('Supabase createRequest error:', error);
    }
  }

  const db = await ensureLocalDb();
  const updated = [formattedReq, ...db.requests.filter((r) => r.id !== req.id)];
  await persistLocalDb({ ...db, requests: updated });
  return formattedReq;
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  exactAddress?: string
): Promise<HostingRequest | null> {
  const updates: Partial<HostingRequest> = { status };
  if (exactAddress) updates.exact_address_unlocked = exactAddress;

  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from('hosting_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (data) {
      const db = await ensureLocalDb();
      const updated = db.requests.map((r) => (r.id === id ? (data as HostingRequest) : r));
      await persistLocalDb({ ...db, requests: updated });
      return data as HostingRequest;
    }

    if (error) {
      console.error('Supabase updateRequestStatus error:', error);
    }
  }

  const db = await ensureLocalDb();
  const index = db.requests.findIndex((r) => r.id === id);
  if (index !== -1) {
    db.requests[index] = { ...db.requests[index], ...updates };
    await persistLocalDb(db);
    return db.requests[index];
  }
  return null;
}
