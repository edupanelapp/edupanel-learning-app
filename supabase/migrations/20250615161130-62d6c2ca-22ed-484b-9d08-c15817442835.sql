
-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'hod');

-- Create enum for verification status
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected');

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student profiles table
CREATE TABLE public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  roll_number TEXT UNIQUE,
  department TEXT NOT NULL,
  semester INTEGER NOT NULL,
  batch TEXT NOT NULL,
  phone_number TEXT,
  address TEXT,
  guardian_name TEXT,
  guardian_phone TEXT,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create faculty profiles table
CREATE TABLE public.faculty_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER,
  phone_number TEXT,
  address TEXT,
  specialization TEXT,
  approved_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create HOD profiles table
CREATE TABLE public.hod_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  employee_id TEXT UNIQUE,
  department TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience_years INTEGER,
  phone_number TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification requests table
CREATE TABLE public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES public.users(id),
  status verification_status DEFAULT 'pending',
  request_type user_role NOT NULL,
  comments TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hod_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for student_profiles table
CREATE POLICY "Students can view their own profile" ON public.student_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" ON public.student_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Faculty can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'hod')
    )
  );

-- RLS Policies for faculty_profiles table
CREATE POLICY "Faculty can view their own profile" ON public.faculty_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Faculty can insert their own profile" ON public.faculty_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Faculty can update their own profile" ON public.faculty_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "HOD can view faculty profiles" ON public.faculty_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'hod'
    )
  );

-- RLS Policies for hod_profiles table
CREATE POLICY "HOD can view their own profile" ON public.hod_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "HOD can insert their own profile" ON public.hod_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "HOD can update their own profile" ON public.hod_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for verification_requests table
CREATE POLICY "Users can view their own verification requests" ON public.verification_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own verification requests" ON public.verification_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Faculty can view student verification requests" ON public.verification_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'hod')
    ) AND request_type = 'student'
  );

CREATE POLICY "HOD can view faculty verification requests" ON public.verification_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'hod'
    ) AND request_type = 'faculty'
  );

CREATE POLICY "Approvers can update verification requests" ON public.verification_requests
  FOR UPDATE USING (
    (auth.uid() = approver_id) OR 
    (EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role IN ('faculty', 'hod')
    ))
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')::user_role,
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update email verification status
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.users 
    SET email_verified = TRUE, updated_at = NOW()
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email verification
CREATE TRIGGER on_email_verified
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_email_verification();
