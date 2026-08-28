import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS admin_fcm_tokens (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
      );
    `
  });
  
  if (error) {
    console.error("Error creating table via RPC, you might need to create it manually:", error.message);
  } else {
    console.log("Table admin_fcm_tokens created or already exists.");
  }
}

setup();
