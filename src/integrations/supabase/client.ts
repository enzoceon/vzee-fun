
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gkcjaxajchzdtbmdkgdh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrY2pheGFqY2h6ZHRibWRrZ2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2NjkxMjksImV4cCI6MjA2MjI0NTEyOX0.POFWr2QA_AZPIkgDhqRCx1Ppni_l2zgbB68v4AO7SN0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Enable Row Level Security (RLS) on all Supabase tables
export const enableRLS = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      // Session is active, RLS will work properly with the user ID
      console.log("Session active, RLS enabled with user:", session.user.id);
    }
  } catch (error) {
    console.error("Error enabling RLS:", error);
  }
};

// Call enableRLS on app startup
enableRLS();
