
-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_email_verified ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_email_verification();

-- Drop all tables that depend on the enums (in correct order)
DROP TABLE IF EXISTS public.verification_requests CASCADE;
DROP TABLE IF EXISTS public.student_profiles CASCADE;
DROP TABLE IF EXISTS public.faculty_profiles CASCADE;
DROP TABLE IF EXISTS public.hod_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop all enums
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;

-- Clear any remaining policies (though they should be dropped with tables)
-- This ensures we have a completely clean slate
