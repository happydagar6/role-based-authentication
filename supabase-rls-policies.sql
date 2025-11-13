-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (run this if updating)
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Allow user signup" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can update any user" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Admins can create users" ON users;
DROP POLICY IF EXISTS "Allow service role access" ON users;

-- Policy 1: Allow service role full access (for backend API)
CREATE POLICY "Allow service role access" ON users
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Allow public signup (INSERT for new registrations)
CREATE POLICY "Allow user signup" ON users
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Policy 3: Users can view their own profile (when authenticated via JWT)
CREATE POLICY "Users can view own profile" ON users
FOR SELECT TO authenticated
USING (
  id::text = auth.jwt() ->> 'sub' OR
  id::text = (auth.jwt() -> 'user_metadata' ->> 'user_id')
);

-- Policy 4: Admins can view all users (when authenticated via JWT)
CREATE POLICY "Admins can view all users" ON users
FOR SELECT TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN'
);

-- Policy 5: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE TO authenticated
USING (
  id::text = auth.jwt() ->> 'sub' OR
  id::text = (auth.jwt() -> 'user_metadata' ->> 'user_id')
)
WITH CHECK (
  (id::text = auth.jwt() ->> 'sub' OR id::text = (auth.jwt() -> 'user_metadata' ->> 'user_id')) AND
  role = (SELECT role FROM users WHERE id::text = (auth.jwt() ->> 'sub' OR auth.jwt() -> 'user_metadata' ->> 'user_id'))
);

-- Policy 6: Admins can update any user
CREATE POLICY "Admins can update any user" ON users
FOR UPDATE TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN')
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

-- Policy 7: Only admins can delete users
CREATE POLICY "Admins can delete users" ON users
FOR DELETE TO authenticated
USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');

-- Policy 8: Admins can create users (for admin-created accounts)
CREATE POLICY "Admins can create users" ON users
FOR INSERT TO authenticated
WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'ADMIN');