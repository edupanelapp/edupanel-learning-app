-- Add sample departments
INSERT INTO public.departments (id, name, code, description, established_year, total_faculty, total_students, contact_email, contact_phone, location) VALUES
('d1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Computer Science', 'CSE', 'Department of Computer Science and Engineering', 2010, 15, 120, 'cse@university.edu', '+1234567890', 'Block A, Floor 2'),
('d2b3c4d5-e6f7-8901-bcde-f23456789012', 'Information Technology', 'IT', 'Department of Information Technology', 2012, 12, 95, 'it@university.edu', '+1234567891', 'Block B, Floor 1')
ON CONFLICT (code) DO NOTHING;

-- Add sample courses
INSERT INTO public.courses (id, name, code, description, department_id, duration_years, degree_type, credits_required, eligibility_criteria, is_active) VALUES
('c1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bachelor of Technology in Computer Science', 'BTech-CSE', '4-year undergraduate program in Computer Science', 'd1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, 'Bachelor', 120, '10+2 with PCM', true),
('c2b3c4d5-e6f7-8901-bcde-f23456789012', 'Bachelor of Technology in Information Technology', 'BTech-IT', '4-year undergraduate program in Information Technology', 'd2b3c4d5-e6f7-8901-bcde-f23456789012', 4, 'Bachelor', 120, '10+2 with PCM', true)
ON CONFLICT (code) DO NOTHING;

-- Add sample semesters
INSERT INTO public.semesters (id, course_id, semester_number, name, description, start_date, end_date, is_active) VALUES
('s1b2c3d4-e5f6-7890-abcd-ef1234567890', 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 'First Semester', 'Introduction to Computer Science', '2024-08-01', '2024-12-15', true),
('s2b3c4d5-e6f7-8901-bcde-f23456789012', 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 'Second Semester', 'Programming Fundamentals', '2025-01-15', '2025-05-30', true),
('s3b4c5d6-e7f8-9012-cdef-345678901234', 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 3, 'Third Semester', 'Data Structures and Algorithms', '2024-08-01', '2024-12-15', true),
('s4b5c6d7-e8f9-0123-def0-456789012345', 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 5, 'Fifth Semester', 'Database Management Systems', '2024-08-01', '2024-12-15', true)
ON CONFLICT (course_id, semester_number) DO NOTHING;

-- Add sample subjects
INSERT INTO public.subjects (id, name, code, description, department, semester, credits, course_id, semester_id, subject_type) VALUES
('sub1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Introduction to Programming', 'CS101', 'Basic programming concepts using Python', 'Computer Science', 1, 3, 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 's1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Core'),
('sub2b3c4d5-e6f7-8901-bcde-f23456789012', 'Data Structures', 'CS201', 'Fundamental data structures and algorithms', 'Computer Science', 3, 4, 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 's3b4c5d6-e7f8-9012-cdef-345678901234', 'Core'),
('sub3b4c5d6-e7f8-9012-cdef-345678901234', 'Database Systems', 'CS301', 'Database design and SQL programming', 'Computer Science', 5, 4, 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 's4b5c6d7-e8f9-0123-def0-456789012345', 'Core'),
('sub4b5c6d7-e8f9-0123-def0-456789012345', 'Web Development', 'CS401', 'Modern web development technologies', 'Computer Science', 5, 3, 'c1b2c3d4-e5f6-7890-abcd-ef1234567890', 's4b5c6d7-e8f9-0123-def0-456789012345', 'Elective')
ON CONFLICT (code) DO NOTHING;

-- Add sample students (profiles)
INSERT INTO public.profiles (id, full_name, email, role, department, semester, avatar_url, created_at, updated_at) VALUES
('stu1b2c3d4-e5f6-7890-abcd-ef1234567890', 'John Doe', 'john.doe@student.edu', 'student', 'Computer Science', 3, null, NOW(), NOW()),
('stu2b3c4d5-e6f7-8901-bcde-f23456789012', 'Jane Smith', 'jane.smith@student.edu', 'student', 'Computer Science', 3, null, NOW(), NOW()),
('stu3b4c5d6-e7f8-9012-cdef-345678901234', 'Mike Johnson', 'mike.johnson@student.edu', 'student', 'Computer Science', 5, null, NOW(), NOW()),
('stu4b5c6d7-e8f9-0123-def0-456789012345', 'Sarah Wilson', 'sarah.wilson@student.edu', 'student', 'Computer Science', 5, null, NOW(), NOW()),
('stu5b6c7d8-e9f0-1234-ef01-567890123456', 'Alex Brown', 'alex.brown@student.edu', 'student', 'Computer Science', 1, null, NOW(), NOW()),
('stu6b7c8d9-e0f1-2345-f012-678901234567', 'Emily Davis', 'emily.davis@student.edu', 'student', 'Computer Science', 1, null, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Add sample student profiles
INSERT INTO public.student_profiles (id, user_id, student_id, semester, batch, guardian_name, guardian_phone, created_at, updated_at) VALUES
('sp1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stu1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CSE2024001', 3, '2024', 'Robert Doe', '+1234567890', NOW(), NOW()),
('sp2b3c4d5-e6f7-8901-bcde-f23456789012', 'stu2b3c4d5-e6f7-8901-bcde-f23456789012', 'CSE2024002', 3, '2024', 'Mary Smith', '+1234567891', NOW(), NOW()),
('sp3b4c5d6-e7f8-9012-cdef-345678901234', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'CSE2024003', 5, '2024', 'David Johnson', '+1234567892', NOW(), NOW()),
('sp4b5c6d7-e8f9-0123-def0-456789012345', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'CSE2024004', 5, '2024', 'Lisa Wilson', '+1234567893', NOW(), NOW()),
('sp5b6c7d8-e9f0-1234-ef01-567890123456', 'stu5b6c7d8-e9f0-1234-ef01-567890123456', 'CSE2024005', 1, '2024', 'James Brown', '+1234567894', NOW(), NOW()),
('sp6b7c8d9-e0f1-2345-f012-678901234567', 'stu6b7c8d9-e0f1-2345-f012-678901234567', 'CSE2024006', 1, '2024', 'Patricia Davis', '+1234567895', NOW(), NOW())
ON CONFLICT (student_id) DO NOTHING;

-- Add sample assignments
INSERT INTO public.assignments (id, subject_id, title, description, due_date, max_marks, faculty_id, semester_id, assignment_type) VALUES
('ass1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sub1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Python Basics', 'Write a Python program to calculate factorial', '2024-12-20 23:59:00+00', 100, null, 's1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Individual'),
('ass2b3c4d5-e6f7-8901-bcde-f23456789012', 'sub2b3c4d5-e6f7-8901-bcde-f23456789012', 'Linked List Implementation', 'Implement a singly linked list in Python', '2024-12-25 23:59:00+00', 100, null, 's3b4c5d6-e7f8-9012-cdef-345678901234', 'Individual'),
('ass3b4c5d6-e7f8-9012-cdef-345678901234', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', 'Database Design', 'Design a database schema for a library system', '2024-12-30 23:59:00+00', 100, null, 's4b5c6d7-e8f9-0123-def0-456789012345', 'Group'),
('ass4b5c6d7-e8f9-0123-def0-456789012345', 'sub4b5c6d7-e8f9-0123-def0-456789012345', 'Web Application', 'Build a simple web application using React', '2025-01-05 23:59:00+00', 100, null, 's4b5c6d7-e8f9-0123-def0-456789012345', 'Project')
ON CONFLICT DO NOTHING;

-- Add sample student enrollments
INSERT INTO public.student_subjects (id, student_id, subject_id, enrolled_at) VALUES
('en1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stu1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sub2b3c4d5-e6f7-8901-bcde-f23456789012', NOW()),
('en2b3c4d5-e6f7-8901-bcde-f23456789012', 'stu2b3c4d5-e6f7-8901-bcde-f23456789012', 'sub2b3c4d5-e6f7-8901-bcde-f23456789012', NOW()),
('en3b4c5d6-e7f8-9012-cdef-345678901234', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', NOW()),
('en4b5c6d7-e8f9-0123-def0-456789012345', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', NOW()),
('en5b6c7d8-e9f0-1234-ef01-567890123456', 'stu5b6c7d8-e9f0-1234-ef01-567890123456', 'sub1b2c3d4-e5f6-7890-abcd-ef1234567890', NOW()),
('en6b7c8d9-e0f1-2345-f012-678901234567', 'stu6b7c8d9-e0f1-2345-f012-678901234567', 'sub1b2c3d4-e5f6-7890-abcd-ef1234567890', NOW()),
('en7b8c9d0-e1f2-3456-f123-789012345678', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'sub4b5c6d7-e8f9-0123-def0-456789012345', NOW()),
('en8b9c0d1-e2f3-4567-f234-890123456789', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'sub4b5c6d7-e8f9-0123-def0-456789012345', NOW())
ON CONFLICT (student_id, subject_id) DO NOTHING;

-- Add sample assignment submissions
INSERT INTO public.assignment_submissions (id, assignment_id, student_id, submission_text, file_url, marks_obtained, feedback, submitted_at, status) VALUES
('sub1b2c3d4-e5f6-7890-abcd-ef1234567890', 'ass1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stu5b6c7d8-e9f0-1234-ef01-567890123456', 'def factorial(n): return 1 if n <= 1 else n * factorial(n-1)', null, 85, 'Good implementation', NOW(), 'graded'),
('sub2b3c4d5-e6f7-8901-bcde-f23456789012', 'ass1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stu6b7c8d9-e0f1-2345-f012-678901234567', 'def factorial(n): return 1 if n <= 1 else n * factorial(n-1)', null, 92, 'Excellent work', NOW(), 'graded'),
('sub3b4c5d6-e7f8-9012-cdef-345678901234', 'ass2b3c4d5-e6f7-8901-bcde-f23456789012', 'stu1b2c3d4-e5f6-7890-abcd-ef1234567890', 'class Node: def __init__(self, data): self.data = data; self.next = None', null, 78, 'Good structure, needs more methods', NOW(), 'graded'),
('sub4b5c6d7-e8f9-0123-def0-456789012345', 'ass2b3c4d5-e6f7-8901-bcde-f23456789012', 'stu2b3c4d5-e6f7-8901-bcde-f23456789012', 'class Node: def __init__(self, data): self.data = data; self.next = None', null, 95, 'Perfect implementation', NOW(), 'graded'),
('sub5b6c7d8-e9f0-1234-ef01-567890123456', 'ass3b4c5d6-e7f8-9012-cdef-345678901234', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'CREATE TABLE books (id INT PRIMARY KEY, title VARCHAR(255))', null, 88, 'Good schema design', NOW(), 'graded'),
('sub6b7c8d9-e0f1-2345-f012-678901234567', 'ass3b4c5d6-e7f8-9012-cdef-345678901234', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'CREATE TABLE books (id INT PRIMARY KEY, title VARCHAR(255))', null, 82, 'Basic schema, could be more detailed', NOW(), 'graded'),
('sub7b8c9d0-e1f2-3456-f123-789012345678', 'ass4b5c6d7-e8f9-0123-def0-456789012345', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'React app with components', 'https://github.com/student/react-app', null, null, NOW(), 'submitted'),
('sub8b9c0d1-e2f3-4567-f234-890123456789', 'ass4b5c6d7-e8f9-0123-def0-456789012345', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'React app with components', 'https://github.com/student/react-app', null, null, NOW(), 'submitted')
ON CONFLICT (assignment_id, student_id) DO NOTHING;

-- Add sample student progress
INSERT INTO public.student_progress (id, student_id, subject_id, progress_type, completion_percentage, time_spent, score, max_score, last_accessed) VALUES
('pro1b2c3d4-e5f6-7890-abcd-ef1234567890', 'stu1b2c3d4-e5f6-7890-abcd-ef1234567890', 'sub2b3c4d5-e6f7-8901-bcde-f23456789012', 'chapter_completed', 85, 120, 78, 100, NOW()),
('pro2b3c4d5-e6f7-8901-bcde-f23456789012', 'stu2b3c4d5-e6f7-8901-bcde-f23456789012', 'sub2b3c4d5-e6f7-8901-bcde-f23456789012', 'chapter_completed', 92, 150, 95, 100, NOW()),
('pro3b4c5d6-e7f8-9012-cdef-345678901234', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', 'chapter_completed', 78, 90, 88, 100, NOW()),
('pro4b5c6d7-e8f9-0123-def0-456789012345', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', 'chapter_completed', 88, 110, 82, 100, NOW()),
('pro5b6c7d8-e9f0-1234-ef01-567890123456', 'stu5b6c7d8-e9f0-1234-ef01-567890123456', 'sub1b2c3d4-e5f6-7890-abcd-ef1234567890', 'chapter_completed', 65, 80, 85, 100, NOW()),
('pro6b7c8d9-e0f1-2345-f012-678901234567', 'stu6b7c8d9-e0f1-2345-f012-678901234567', 'sub1b2c3d4-e5f6-7890-abcd-ef1234567890', 'chapter_completed', 72, 95, 92, 100, NOW()),
('pro7b8c9d0-e1f2-3456-f123-789012345678', 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 'sub4b5c6d7-e8f9-0123-def0-456789012345', 'chapter_completed', 75, 100, null, null, NOW()),
('pro8b9c0d1-e2f3-4567-f234-890123456789', 'stu4b5c6d7-e8f9-0123-def0-456789012345', 'sub4b5c6d7-e8f9-0123-def0-456789012345', 'chapter_completed', 80, 120, null, null, NOW())
ON CONFLICT (student_id, subject_id, chapter_id, topic_id, progress_type) DO NOTHING;

-- Add sample project ideas (created by students)
INSERT INTO public.project_ideas (id, title, description, subject_id, difficulty_level, estimated_duration, technologies_used, created_by, target_semester, department_id, status) VALUES
('proj1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Student Management System', 'A web-based system to manage student records', 'sub3b4c5d6-e7f8-9012-cdef-345678901234', 'Intermediate', '2 weeks', ARRAY['React', 'Node.js', 'PostgreSQL'], 'stu3b4c5d6-e7f8-9012-cdef-345678901234', 5, 'd1b2c3d4-e5f6-7890-abcd-ef1234567890', 'published'),
('proj2b3c4d5-e6f7-8901-bcde-f23456789012', 'E-commerce Platform', 'Online shopping platform with payment integration', 'sub4b5c6d7-e8f9-0123-def0-456789012345', 'Advanced', '1 month', ARRAY['React', 'Express', 'MongoDB', 'Stripe'], 'stu4b5c6d7-e8f9-0123-def0-456789012345', 5, 'd1b2c3d4-e5f6-7890-abcd-ef1234567890', 'published')
ON CONFLICT DO NOTHING;

-- Update department student counts
UPDATE public.departments 
SET total_students = (
  SELECT COUNT(*) 
  FROM public.profiles 
  WHERE role = 'student' AND department = 'Computer Science'
)
WHERE name = 'Computer Science';

UPDATE public.departments 
SET total_students = (
  SELECT COUNT(*) 
  FROM public.profiles 
  WHERE role = 'student' AND department = 'Information Technology'
)
WHERE name = 'Information Technology'; 