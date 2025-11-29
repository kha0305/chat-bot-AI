
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.error('CRITICAL ERROR: Missing SUPABASE_URL or SUPABASE_KEY environment variables.');
  // Return a mock object that throws errors when used, to prevent app crash on startup
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Server Configuration Error: Missing Database Credentials' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Server Configuration Error: Missing Database Credentials' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Server Configuration Error: Missing Database Credentials' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Server Configuration Error: Missing Database Credentials' } }),
      eq: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
      single: function() { return this; },
      ilike: function() { return this; },
      or: function() { return this; }
    })
  };
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('CRITICAL ERROR: Failed to initialize Supabase client:', error.message);
    // Fallback to mock to prevent crash
    supabase = {
       from: () => ({
         select: () => Promise.resolve({ data: null, error: { message: 'Database Connection Failed' } }),
         // ... simple mock
       })
    };
  }
}

module.exports = supabase;
