import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use your custom SECRET key name here
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseSecretKey) {
  console.error("Supabase Service Key or URL is missing in Production!");
}

// This client is for BACKGROUND tasks like webhooks
export const supabase = createClient(supabaseUrl!, supabaseSecretKey!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
