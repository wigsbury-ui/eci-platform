-- Allow agent role for introduction agents who connect ECI with investors.
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN (
    'investor',
    'school_partner',
    'employee',
    'board_member',
    'admin',
    'super_admin',
    'agent'
  ));
