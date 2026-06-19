-- Run this in your Supabase SQL Editor to create the users table
-- Drop existing policies first to allow re-running safely
DROP POLICY IF EXISTS "Allow anonymous inserts" ON users;
DROP POLICY IF EXISTS "Allow anonymous selects" ON users;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile TEXT NOT NULL,
  unique_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS entirely so form submissions work without role issues
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
