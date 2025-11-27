/*
  # Optimize RLS Policies and Remove Unused Indexes

  ## Changes Made
  
  1. RLS Policy Optimization
     - Updated `responses` table policy to use `(select auth.uid())` instead of `auth.uid()`
     - Updated `analytics_events` table policy to use `(select auth.uid())` instead of `auth.uid()`
     - Updated `admin_users` table policy to use `(select auth.uid())` instead of `auth.uid()`
     - This optimization prevents re-evaluation of auth functions for each row, improving query performance at scale
  
  2. Unused Index Removal
     - Dropped `responses_created_at_idx` index (not being used)
     - Dropped `analytics_events_session_idx` index (not being used)
     - Dropped `analytics_events_created_at_idx` index (not being used)
     - These indexes can be recreated later if query patterns change and they become necessary
  
  ## Security Notes
  - All RLS policies remain functionally identical
  - Security is maintained while improving performance
  - Admin users still can only view their own data
  - Authenticated admins still can view responses and analytics
*/

-- Drop and recreate optimized RLS policies for responses table
DROP POLICY IF EXISTS "Authenticated admins can view all responses" ON responses;

CREATE POLICY "Authenticated admins can view all responses"
  ON responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- Drop and recreate optimized RLS policies for analytics_events table
DROP POLICY IF EXISTS "Authenticated admins can view analytics" ON analytics_events;

CREATE POLICY "Authenticated admins can view analytics"
  ON analytics_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = (select auth.uid())
    )
  );

-- Drop and recreate optimized RLS policy for admin_users table
DROP POLICY IF EXISTS "Admins can view own data" ON admin_users;

CREATE POLICY "Admins can view own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- Drop unused indexes
DROP INDEX IF EXISTS responses_created_at_idx;
DROP INDEX IF EXISTS analytics_events_session_idx;
DROP INDEX IF EXISTS analytics_events_created_at_idx;