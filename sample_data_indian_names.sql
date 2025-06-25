-- Sample Data Insertion Script for EduPanel Learning App
-- Run this in Supabase SQL Editor
-- Uses Indian names and realistic data

-- First, let's create some departments
INSERT INTO departments (id, name, code, description, established_year, total_faculty, total_students, contact_email, contact_phone, location)
VALUES 
  (gen_random_uuid(), 'Computer Science', 'CSE', 'Department of Computer Science and Engineering', 2010, 15, 0, 'cse@university.edu', '+91-9876543210', 'Block A, Floor 2'),
  (gen_random_uuid(), 'Information Technology', 'IT', 'Department of Information Technology', 2012, 12, 0, 'it@university.edu', '+91-9876543211', 'Block B, Floor 1'),
  (gen_random_uuid(), 'Electronics & Communication', 'ECE', 'Department of Electronics and Communication Engineering', 2008, 18, 0, 'ece@university.edu', '+91-9876543212', 'Block C, Floor 2');

-- Create courses
INSERT INTO courses (id, name, code, description, department_id, duration_years, degree_type, credits_required, eligibility_criteria, is_active)
SELECT 
  gen_random_uuid(),
  'Bachelor of Technology in Computer Science',
  'BTech-CSE',
  '4-year undergraduate program in Computer Science',
  d.id,
  4,
  'Bachelor',
  120,
  '10+2 with PCM',
  true
FROM departments d WHERE d.name = 'Computer Science';

-- Create semesters
INSERT INTO semesters (id, course_id, semester_number, name, description, start_date, end_date, is_active)
SELECT 
  gen_random_uuid(),
  c.id,
  sem.semester_num,
  sem.name,
  sem.description,
  '2024-08-01',
  '2024-12-31',
  true
FROM courses c
CROSS JOIN (
  VALUES 
    (1, 'First Semester', 'Introduction to Computer Science'),
    (2, 'Second Semester', 'Basic Programming and Mathematics'),
    (3, 'Third Semester', 'Data Structures and Algorithms'),
    (4, 'Fourth Semester', 'Object Oriented Programming'),
    (5, 'Fifth Semester', 'Database Management Systems'),
    (6, 'Sixth Semester', 'Computer Networks'),
    (7, 'Seventh Semester', 'Software Engineering'),
    (8, 'Eighth Semester', 'Final Year Project')
) AS sem(semester_num, name, description)
WHERE c.code = 'BTech-CSE';

-- Create subjects
INSERT INTO subjects (id, name, code, description, department, semester, credits, course_id, semester_id, subject_type)
SELECT 
  gen_random_uuid(),
  sub.name,
  sub.code,
  sub.description,
  'Computer Science',
  sub.semester,
  sub.credits,
  c.id,
  s.id,
  sub.subject_type
FROM courses c
JOIN semesters s ON c.id = s.course_id
CROSS JOIN (
  VALUES 
    ('Programming Fundamentals', 'CS101', 'Basic programming concepts using Python', 1, 4, 'Core'),
    ('Mathematics I', 'MA101', 'Calculus and Linear Algebra', 1, 4, 'Core'),
    ('Digital Logic Design', 'CS102', 'Digital circuits and logic gates', 2, 3, 'Core'),
    ('Data Structures', 'CS201', 'Fundamental data structures and algorithms', 3, 4, 'Core'),
    ('Object Oriented Programming', 'CS202', 'Java programming concepts', 4, 4, 'Core'),
    ('Database Systems', 'CS301', 'Database design and SQL programming', 5, 3, 'Core'),
    ('Computer Networks', 'CS302', 'Network protocols and architecture', 6, 3, 'Core'),
    ('Software Engineering', 'CS401', 'Software development methodologies', 7, 3, 'Core'),
    ('Web Development', 'CS402', 'Modern web development technologies', 5, 3, 'Elective'),
    ('Machine Learning', 'CS403', 'Introduction to ML algorithms', 6, 3, 'Elective')
) AS sub(name, code, description, semester, credits, subject_type)
WHERE c.code = 'BTech-CSE' AND s.semester_number = sub.semester;

-- Create student profiles (using Indian names)
INSERT INTO profiles (id, full_name, email, role, department)
VALUES 
  (gen_random_uuid(), 'Priya Sharma', 'priya.sharma@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Arjun Patel', 'arjun.patel@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Aisha Khan', 'aisha.khan@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Rahul Singh', 'rahul.singh@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Zara Ahmed', 'zara.ahmed@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Vikram Reddy', 'vikram.reddy@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Meera Iyer', 'meera.iyer@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Aditya Verma', 'aditya.verma@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Kavya Nair', 'kavya.nair@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Rohan Gupta', 'rohan.gupta@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Ananya Das', 'ananya.das@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Ishaan Malhotra', 'ishaan.malhotra@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Diya Kapoor', 'diya.kapoor@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Aryan Joshi', 'aryan.joshi@student.edu', 'student', 'Computer Science'),
  (gen_random_uuid(), 'Saanvi Mehta', 'saanvi.mehta@student.edu', 'student', 'Computer Science');

-- Create detailed student profiles
INSERT INTO student_profiles (id, user_id, student_id, semester, batch, guardian_name, guardian_phone)
SELECT 
  gen_random_uuid(),
  p.id,
  'CSE' || (2024 - (sp.semester - 1)) || LPAD(ROW_NUMBER() OVER (ORDER BY p.full_name)::text, 3, '0'),
  sp.semester,
  (2024 - (sp.semester - 1))::text,
  sp.guardian_name,
  sp.guardian_phone
FROM profiles p
CROSS JOIN (
  VALUES 
    (1, 'Rajesh Sharma', '+91-9876543201'),
    (1, 'Sunita Patel', '+91-9876543202'),
    (3, 'Mohammed Khan', '+91-9876543203'),
    (3, 'Harpreet Singh', '+91-9876543204'),
    (5, 'Fatima Ahmed', '+91-9876543205'),
    (5, 'Venkatesh Reddy', '+91-9876543206'),
    (7, 'Lakshmi Iyer', '+91-9876543207'),
    (7, 'Amit Verma', '+91-9876543208'),
    (5, 'Radha Nair', '+91-9876543209'),
    (3, 'Prakash Gupta', '+91-9876543210'),
    (1, 'Sukanya Das', '+91-9876543211'),
    (1, 'Ramesh Malhotra', '+91-9876543212'),
    (3, 'Priyanka Kapoor', '+91-9876543213'),
    (3, 'Vikrant Joshi', '+91-9876543214'),
    (5, 'Neha Mehta', '+91-9876543215')
) AS sp(semester, guardian_name, guardian_phone)
WHERE p.role = 'student';

-- Create student enrollments
INSERT INTO student_subjects (id, student_id, subject_id)
SELECT 
  gen_random_uuid(),
  p.id,
  s.id
FROM profiles p
JOIN subjects s ON s.semester IN (1, 3, 5)
JOIN student_profiles sp ON p.id = sp.user_id
WHERE p.role = 'student' 
  AND sp.semester = s.semester
  AND ROW_NUMBER() OVER (PARTITION BY p.id, s.semester ORDER BY s.code) <= 3;

-- Create assignments
INSERT INTO assignments (id, title, description, subject_id, max_marks, due_date, assignment_type, semester_id)
SELECT 
  gen_random_uuid(),
  ass.title,
  ass.description,
  s.id,
  ass.max_marks,
  ass.due_date,
  ass.assignment_type,
  sem.id
FROM subjects s
JOIN semesters sem ON s.semester_id = sem.id
CROSS JOIN (
  VALUES 
    ('Python Programming Assignment', 'Basic programming exercises using Python', 100, '2024-10-15', 'Individual'),
    ('Data Structures Lab', 'Implement linked lists and stacks', 100, '2024-10-20', 'Individual'),
    ('Database Design Project', 'ER diagram and normalization', 100, '2024-10-25', 'Group'),
    ('Web Development Project', 'Build a responsive website', 100, '2024-11-01', 'Project'),
    ('Machine Learning Assignment', 'Implement basic ML algorithms', 100, '2024-11-05', 'Individual'),
    ('Software Engineering Report', 'SDLC documentation', 100, '2024-11-10', 'Group'),
    ('Computer Networks Lab', 'Network simulation using NS2', 100, '2024-11-15', 'Individual'),
    ('Final Year Project Proposal', 'Project proposal and planning', 100, '2024-11-20', 'Project')
) AS ass(title, description, max_marks, due_date, assignment_type)
WHERE s.subject_type = 'Core';

-- Create assignment submissions
INSERT INTO assignment_submissions (id, student_id, assignment_id, status, marks_obtained, submitted_at)
SELECT 
  gen_random_uuid(),
  p.id,
  a.id,
  CASE WHEN random() > 0.2 THEN 'graded' ELSE 'submitted' END,
  CASE 
    WHEN random() > 0.8 THEN 90 + (random() * 10)::int
    WHEN random() > 0.6 THEN 80 + (random() * 10)::int
    WHEN random() > 0.4 THEN 70 + (random() * 10)::int
    ELSE 60 + (random() * 10)::int
  END,
  a.due_date - INTERVAL '1 day' + (random() * INTERVAL '2 days')
FROM profiles p
JOIN assignments a ON true
WHERE p.role = 'student' 
  AND random() > 0.3;  -- 70% of students submit assignments

-- Create student progress
INSERT INTO student_progress (id, student_id, subject_id, progress_type, completion_percentage, score, max_score, last_accessed)
SELECT 
  gen_random_uuid(),
  p.id,
  s.id,
  'chapter_completed',
  CASE 
    WHEN random() > 0.8 THEN 90 + (random() * 10)::int
    WHEN random() > 0.6 THEN 80 + (random() * 10)::int
    WHEN random() > 0.4 THEN 70 + (random() * 10)::int
    ELSE 60 + (random() * 10)::int
  END,
  CASE 
    WHEN random() > 0.8 THEN 90 + (random() * 10)::int
    WHEN random() > 0.6 THEN 80 + (random() * 10)::int
    WHEN random() > 0.4 THEN 70 + (random() * 10)::int
    ELSE 60 + (random() * 10)::int
  END,
  100,
  CURRENT_DATE - (random() * 30)::int
FROM profiles p
JOIN subjects s ON true
WHERE p.role = 'student'
  AND random() > 0.2;  -- 80% of students have progress data

-- Create project ideas
INSERT INTO project_ideas (id, title, description, difficulty_level, created_by, status)
SELECT 
  gen_random_uuid(),
  proj.title,
  proj.description,
  proj.difficulty_level,
  p.id,
  'published'
FROM profiles p
CROSS JOIN (
  VALUES 
    ('E-Learning Platform', 'A comprehensive learning management system with video conferencing', 'Intermediate'),
    ('Smart Attendance System', 'AI-powered attendance tracking using facial recognition', 'Advanced'),
    ('Student Performance Analytics', 'Data-driven insights for student progress tracking', 'Intermediate'),
    ('Virtual Lab Simulator', 'Interactive lab experiments for science subjects', 'Advanced'),
    ('Course Recommendation Engine', 'ML-based course suggestions for students', 'Advanced'),
    ('Campus Navigation App', 'Indoor navigation system for university campus', 'Intermediate'),
    ('Library Management System', 'Digital library with book tracking and recommendations', 'Intermediate'),
    ('Student Health Monitor', 'Health tracking app for university students', 'Advanced'),
    ('Campus Event Manager', 'Event planning and management system', 'Intermediate'),
    ('Student Budget Tracker', 'Personal finance management for students', 'Intermediate')
) AS proj(title, description, difficulty_level)
WHERE p.role = 'student'
  AND random() > 0.7;  -- 30% of students create projects

-- Update department student counts
UPDATE departments 
SET total_students = (
  SELECT COUNT(*) 
  FROM profiles p 
  JOIN student_profiles sp ON p.id = sp.user_id 
  WHERE p.department = departments.name AND p.role = 'student'
);

-- Success message
SELECT 'Sample data inserted successfully!' as message; 