-- Guestbook — run once in Supabase → SQL Editor.
--
-- Moderation lives here, not in the front-end. Anyone can read and sign;
-- only a logged-in session for the admin email can delete. The site logs in
-- through Supabase Auth, so the password never ships in the JS bundle.
--
-- Before running: Authentication → Users → "Add user" with the email below
-- and a strong password (tick "Auto confirm"). That password is what the
-- admin dot on /guestbook asks for.

CREATE TABLE IF NOT EXISTS guestbook (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- Drop the old wide-open policy (anyone holding the public anon key could
-- wipe the table with a single DELETE request).
DROP POLICY IF EXISTS "delete_all"   ON guestbook;
DROP POLICY IF EXISTS "read_all"     ON guestbook;
DROP POLICY IF EXISTS "insert_all"   ON guestbook;
DROP POLICY IF EXISTS "admin_delete" ON guestbook;

CREATE POLICY "read_all" ON guestbook
  FOR SELECT USING (true);

-- Caps sit above the form limits (32 / 280 + sticker tag); they stop someone posting a 5 MB "message"
-- straight at the API.
CREATE POLICY "insert_all" ON guestbook
  FOR INSERT WITH CHECK (
    char_length(trim(name))    BETWEEN 1 AND 60 AND
    char_length(trim(message)) BETWEEN 1 AND 600
  );

CREATE POLICY "admin_delete" ON guestbook
  FOR DELETE TO authenticated
  USING ((auth.jwt() ->> 'email') = 'cvdinizramos@gmail.com');
