import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bdmxzqdmkextlfvszwxd.supabase.co';
const supabaseAnonKey = 'sb_publishable_jDnsZB90G9AruodQbV7r0A_rYwy_VHc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);