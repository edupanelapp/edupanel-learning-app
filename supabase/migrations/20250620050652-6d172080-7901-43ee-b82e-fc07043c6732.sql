-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  head_of_department_id UUID REFERENCES public.profiles(id),
  established_year INTEGER,
  total_faculty INTEGER DEFAULT 0,
  total_students INTEGER DEFAULT 0,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  duration_years INTEGER NOT NULL DEFAULT 4,
  degree_type TEXT CHECK (degree_type IN ('Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate')),
  credits_required INTEGER DEFAULT 120,
  eligibility_criteria TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create semesters table
CREATE TABLE public.semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  semester_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(course_id, semester_number)
);

-- Update subjects table to reference courses and semesters
ALTER TABLE public.subjects 
ADD COLUMN course_id UUID REFERENCES public.courses(id),
ADD COLUMN semester_id UUID REFERENCES public.semesters(id),
ADD COLUMN subject_type TEXT CHECK (subject_type IN ('Core', 'Elective', 'Lab', 'Project')) DEFAULT 'Core',
ADD COLUMN prerequisites TEXT,
ADD COLUMN learning_outcomes TEXT,
ADD COLUMN assessment_criteria TEXT;

-- Create subject_chapters table
CREATE TABLE public.subject_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_objectives TEXT,
  estimated_hours INTEGER DEFAULT 4,
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(subject_id, chapter_number)
);

-- Create chapter_topics table
CREATE TABLE public.chapter_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.subject_chapters(id) ON DELETE CASCADE,
  topic_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  key_points TEXT[],
  examples TEXT,
  estimated_duration INTEGER DEFAULT 30, -- in minutes
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(chapter_id, topic_number)
);

-- Create topic_materials table
CREATE TABLE public.topic_materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.chapter_topics(id) ON DELETE CASCADE,
  material_type TEXT CHECK (material_type IN ('pdf', 'text', 'video', 'image', 'link', 'audio')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  content TEXT, -- for text content
  video_url TEXT, -- for video links
  duration INTEGER, -- in minutes for videos/audio
  file_size BIGINT, -- in bytes
  mime_type TEXT,
  tags TEXT[],
  is_downloadable BOOLEAN DEFAULT TRUE,
  access_level TEXT CHECK (access_level IN ('public', 'student', 'faculty', 'premium')) DEFAULT 'student',
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project_ideas table
CREATE TABLE public.project_ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  subject_id UUID REFERENCES public.subjects(id),
  topic_id UUID REFERENCES public.chapter_topics(id),
  difficulty_level TEXT CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')) NOT NULL,
  estimated_duration TEXT, -- e.g., "2 weeks", "1 month"
  technologies_used TEXT[],
  prerequisites TEXT[],
  learning_outcomes TEXT[],
  detailed_requirements TEXT,
  sample_code_url TEXT,
  reference_links TEXT[],
  max_team_size INTEGER DEFAULT 4,
  min_team_size INTEGER DEFAULT 1,
  is_group_project BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  target_semester INTEGER,
  department_id UUID REFERENCES public.departments(id),
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update assignments table structure
ALTER TABLE public.assignments 
ADD COLUMN semester_id UUID REFERENCES public.semesters(id),
ADD COLUMN section TEXT,
ADD COLUMN assignment_type TEXT CHECK (assignment_type IN ('Individual', 'Group', 'Lab', 'Project', 'Quiz')) DEFAULT 'Individual',
ADD COLUMN instructions TEXT,
ADD COLUMN submission_format TEXT[],
ADD COLUMN late_submission_penalty INTEGER DEFAULT 0, -- percentage
ADD COLUMN is_active BOOLEAN DEFAULT TRUE,
ADD COLUMN total_submissions INTEGER DEFAULT 0,
ADD COLUMN average_marks DECIMAL(5,2);

-- Create assignment_updates table (for tracking assignment lifecycle)
CREATE TABLE public.assignment_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.assignment_submissions(id),
  update_type TEXT CHECK (update_type IN ('submitted', 'reviewed', 'graded', 'returned', 'resubmitted')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_review', 'graded', 'returned', 'completed')) DEFAULT 'pending',
  marks_awarded DECIMAL(5,2),
  feedback TEXT,
  attachments TEXT[],
  updated_by UUID REFERENCES public.profiles(id),
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update notifications table structure
ALTER TABLE public.notifications 
ADD COLUMN target_audience TEXT CHECK (target_audience IN ('all', 'students', 'faculty', 'hod', 'department', 'semester', 'section')),
ADD COLUMN department_id UUID REFERENCES public.departments(id),
ADD COLUMN semester_id UUID REFERENCES public.semesters(id),
ADD COLUMN section TEXT,
ADD COLUMN priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN attachments TEXT[],
ADD COLUMN action_required BOOLEAN DEFAULT FALSE,
ADD COLUMN action_url TEXT;

-- Create class_schedule table
CREATE TABLE public.class_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  faculty_id UUID REFERENCES public.profiles(id),
  semester_id UUID REFERENCES public.semesters(id),
  section TEXT NOT NULL,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  classroom TEXT,
  class_type TEXT CHECK (class_type IN ('lecture', 'lab', 'tutorial', 'practical', 'seminar')) DEFAULT 'lecture',
  recurring_pattern TEXT CHECK (recurring_pattern IN ('weekly', 'biweekly', 'monthly', 'once')) DEFAULT 'weekly',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create student_progress table
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.subject_chapters(id),
  topic_id UUID REFERENCES public.chapter_topics(id),
  progress_type TEXT CHECK (progress_type IN ('chapter_completed', 'topic_completed', 'assignment_submitted', 'quiz_completed', 'material_viewed')) NOT NULL,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  time_spent INTEGER DEFAULT 0, -- in minutes
  score DECIMAL(5,2),
  max_score DECIMAL(5,2),
  attempts INTEGER DEFAULT 1,
  last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  milestones_achieved TEXT[],
  areas_of_improvement TEXT[],
  strengths TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id, chapter_id, topic_id, progress_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for departments
CREATE POLICY "Everyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "HOD can manage departments" ON public.departments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for courses
CREATE POLICY "Everyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "HOD can manage courses" ON public.courses FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for semesters
CREATE POLICY "Everyone can view semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "HOD can manage semesters" ON public.semesters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for subject_chapters
CREATE POLICY "Everyone can view subject chapters" ON public.subject_chapters FOR SELECT USING (true);
CREATE POLICY "Faculty can manage chapters for their subjects" ON public.subject_chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.subjects WHERE id = subject_chapters.subject_id AND faculty_id = auth.uid())
);
CREATE POLICY "HOD can manage all chapters" ON public.subject_chapters FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for chapter_topics
CREATE POLICY "Everyone can view chapter topics" ON public.chapter_topics FOR SELECT USING (true);
CREATE POLICY "Faculty can manage topics for their subjects" ON public.chapter_topics FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.subjects s 
    JOIN public.subject_chapters sc ON s.id = sc.subject_id 
    WHERE sc.id = chapter_topics.chapter_id AND s.faculty_id = auth.uid()
  )
);
CREATE POLICY "HOD can manage all topics" ON public.chapter_topics FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for topic_materials
CREATE POLICY "Students can view materials for enrolled subjects" ON public.topic_materials FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.student_subjects ss
    JOIN public.subjects s ON ss.subject_id = s.id
    JOIN public.subject_chapters sc ON s.id = sc.subject_id
    JOIN public.chapter_topics ct ON sc.id = ct.chapter_id
    WHERE ct.id = topic_materials.topic_id AND ss.student_id = auth.uid()
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('faculty', 'hod'))
);
CREATE POLICY "Faculty can manage materials for their subjects" ON public.topic_materials FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.subjects s 
    JOIN public.subject_chapters sc ON s.id = sc.subject_id 
    JOIN public.chapter_topics ct ON sc.id = ct.chapter_id
    WHERE ct.id = topic_materials.topic_id AND s.faculty_id = auth.uid()
  )
);
CREATE POLICY "HOD can manage all materials" ON public.topic_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for project_ideas
CREATE POLICY "Students can view published project ideas" ON public.project_ideas FOR SELECT USING (
  status = 'published' OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('faculty', 'hod'))
);
CREATE POLICY "Faculty can manage their project ideas" ON public.project_ideas FOR ALL USING (created_by = auth.uid());
CREATE POLICY "HOD can manage all project ideas" ON public.project_ideas FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for assignment_updates
CREATE POLICY "Students can view their assignment updates" ON public.assignment_updates FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Faculty can view updates for their assignments" ON public.assignment_updates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_updates.assignment_id AND faculty_id = auth.uid())
);
CREATE POLICY "Faculty can create assignment updates" ON public.assignment_updates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_updates.assignment_id AND faculty_id = auth.uid())
);
CREATE POLICY "HOD can view all assignment updates" ON public.assignment_updates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for class_schedule
CREATE POLICY "Students can view their class schedules" ON public.class_schedule FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.student_subjects ss
    WHERE ss.subject_id = class_schedule.subject_id AND ss.student_id = auth.uid()
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('faculty', 'hod'))
);
CREATE POLICY "Faculty can manage their class schedules" ON public.class_schedule FOR ALL USING (faculty_id = auth.uid());
CREATE POLICY "HOD can manage all class schedules" ON public.class_schedule FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create RLS policies for student_progress
CREATE POLICY "Students can view their own progress" ON public.student_progress FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students can update their own progress" ON public.student_progress FOR ALL USING (student_id = auth.uid());
CREATE POLICY "Faculty can view progress for their subjects" ON public.student_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subjects WHERE id = student_progress.subject_id AND faculty_id = auth.uid())
);
CREATE POLICY "HOD can view all student progress" ON public.student_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Create indexes for better performance
CREATE INDEX idx_courses_department ON public.courses(department_id);
CREATE INDEX idx_semesters_course ON public.semesters(course_id);
CREATE INDEX idx_subjects_course ON public.subjects(course_id);
CREATE INDEX idx_subjects_semester ON public.subjects(semester_id);
CREATE INDEX idx_subject_chapters_subject ON public.subject_chapters(subject_id);
CREATE INDEX idx_chapter_topics_chapter ON public.chapter_topics(chapter_id);
CREATE INDEX idx_topic_materials_topic ON public.topic_materials(topic_id);
CREATE INDEX idx_project_ideas_subject ON public.project_ideas(subject_id);
CREATE INDEX idx_assignment_updates_assignment ON public.assignment_updates(assignment_id);
CREATE INDEX idx_assignment_updates_student ON public.assignment_updates(student_id);
CREATE INDEX idx_class_schedule_subject ON public.class_schedule(subject_id);
CREATE INDEX idx_class_schedule_semester ON public.class_schedule(semester_id);
CREATE INDEX idx_class_schedule_day_time ON public.class_schedule(day_of_week, start_time);
CREATE INDEX idx_student_progress_student ON public.student_progress(student_id);
CREATE INDEX idx_student_progress_subject ON public.student_progress(subject_id);

-- Add new columns to faculty_profiles
ALTER TABLE public.faculty_profiles
  ADD COLUMN IF NOT EXISTS full_name TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ADD COLUMN IF NOT EXISTS department TEXT,
  ADD COLUMN IF NOT EXISTS phone_number TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS is_faculty_verified BOOLEAN DEFAULT FALSE;

-- Backfill data from profiles to faculty_profiles for existing faculty
UPDATE public.faculty_profiles fp
SET
  full_name = p.full_name,
  email = p.email,
  avatar_url = p.avatar_url,
  created_at = p.created_at,
  updated_at = p.updated_at,
  department = p.department,
  phone_number = p.phone_number,
  address = p.address
FROM public.profiles p
WHERE fp.user_id = p.id AND p.role = 'faculty';
