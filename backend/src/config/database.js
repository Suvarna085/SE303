const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Client with service role (for admin operations)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client with anon key (for regular operations)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

module.exports = {
  supabase,
  supabaseAdmin,
};
