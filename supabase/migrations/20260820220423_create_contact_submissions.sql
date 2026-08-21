/*
# Create contact_submissions table (single-tenant, public intake)

1. New Tables
- `contact_submissions`
  - `id` (uuid, primary key)
  - `name` (text, not null) — submitter's full name
  - `email` (text, not null) — submitter's email
  - `company` (text, nullable) — optional company name
  - `service` (text, nullable) — which ArtiCode service they're interested in
  - `budget` (text, nullable) — estimated budget band
  - `message` (text, not null) — project description
  - `status` (text, not null default 'new') — triage status (new / contacted / closed)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `contact_submissions`.
- INSERT: allow anon + authenticated to submit (public contact form). WITH CHECK (true).
- SELECT/UPDATE/DELETE: restricted to authenticated (staff triage). No anon read,
  so visitors cannot enumerate other people's submissions.

3. Notes
- This is a no-auth public intake form. Only INSERT is open to anon; reads are
  staff-only (authenticated) so submissions stay private.
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  service text,
  budget text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON contact_submissions;
CREATE POLICY "anon_insert_contact_submissions"
  ON contact_submissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact_submissions" ON contact_submissions;
CREATE POLICY "auth_select_contact_submissions"
  ON contact_submissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact_submissions" ON contact_submissions;
CREATE POLICY "auth_update_contact_submissions"
  ON contact_submissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact_submissions" ON contact_submissions;
CREATE POLICY "auth_delete_contact_submissions"
  ON contact_submissions FOR DELETE
  TO authenticated USING (true);
