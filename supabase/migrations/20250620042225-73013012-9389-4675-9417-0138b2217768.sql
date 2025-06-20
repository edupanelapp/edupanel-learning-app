
-- Create separate tables for role-specific profile data
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  student_id TEXT UNIQUE,
  semester INTEGER,
  batch TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.faculty_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  employee_id TEXT UNIQUE,
  designation TEXT,
  qualification TEXT,
  experience_years INTEGER,
  specialization TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove role-specific columns from main profiles table since we'll use separate tables
-- But keep the commonly needed ones
ALTER TABLE public.profiles DROP COLUMN IF EXISTS student_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS employee_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS semester;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS batch;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS designation;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS qualification;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS experience_years;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS guardian_name;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS guardian_phone;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS specialization;

-- Enable RLS on new tables
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own student profile" ON public.student_profiles FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage their own student profile" ON public.student_profiles FOR ALL USING (
  user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Faculty and HOD can view student profiles" ON public.student_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('faculty', 'hod'))
);

CREATE POLICY "Users can view their own faculty profile" ON public.faculty_profiles FOR SELECT USING (
  user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can manage their own faculty profile" ON public.faculty_profiles FOR ALL USING (
  user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "HOD can view faculty profiles" ON public.faculty_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Update the handle_new_user function to properly set role from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

-- Create the trigger if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
