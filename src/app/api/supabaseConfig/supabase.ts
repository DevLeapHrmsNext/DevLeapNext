import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://bbiamotvmxkondwnqgko.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiaWFtb3R2bXhrb25kd25xZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE4MjU2NjksImV4cCI6MjAzNzQwMTY2OX0.s_k0uxO8wB5_N2AhMWtXSKE078bc8aN1dveixgFmmGE";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are required!");
}

const supabase = await createClient(supabaseUrl, supabaseAnonKey,{auth: {
  persistSession: true,
  // autoRefreshToken: true,
  // debug: true,
},});

export default supabase;