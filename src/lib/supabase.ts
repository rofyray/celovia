import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client (service role — full access)
export const serverClient = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client (anon key — limited access)
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}
