import { createClient } from '@supabase/supabase-js';

/*
 * Supabase client initialization.
 *
 * We read the project URL and public anon key from Vite environment variables.
 * These variables should be configured in your Vercel project settings.  See README for details.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);