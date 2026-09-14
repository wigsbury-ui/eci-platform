-- Two-tier introduction partner access (agents & rainmakers).
-- Applicants can review ECI, why partner, and sample contracts.
-- Accepted partners unlock marketing resources and investor promotional materials.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS partner_status text
    CHECK (partner_status IS NULL OR partner_status IN ('applicant', 'accepted')),
  ADD COLUMN IF NOT EXISTS partner_channel text
    CHECK (partner_channel IS NULL OR partner_channel IN ('agent', 'rainmaker'));

-- Existing agents default to accepted so current partners keep resource access.
UPDATE profiles
SET partner_status = 'accepted',
    partner_channel = COALESCE(partner_channel, 'agent')
WHERE role = 'agent'
  AND partner_status IS NULL;

COMMENT ON COLUMN profiles.partner_status IS
  'Introduction partners: applicant = pre-acceptance briefing; accepted = marketing unlock.';
COMMENT ON COLUMN profiles.partner_channel IS
  'Whether the introduction partner is an agent or rainmaker.';
