import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-anon-key')
);

// Fallback dummy client if credentials are not configured yet
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const COLLEGE_CONFIG = {
  name: process.env.NEXT_PUBLIC_COLLEGE_NAME || 'Apex Institute of Technology',
  code: process.env.NEXT_PUBLIC_COLLEGE_CODE || 'AIT',
  allowedDomains: (process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || '.edu,.ac.in').split(','),
  established: '1984',
  campusLocation: 'North Campus Hub',
};
