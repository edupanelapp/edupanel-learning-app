
export interface Department {
  id: string
  name: string
  code: string
  description: string | null
  head_of_department_id: string | null
  established_year: number | null
  total_faculty: number | null
  total_students: number | null
  contact_email: string | null
  contact_phone: string | null
  location: string | null
  created_at: string | null
  updated_at: string | null
}

export interface Course {
  id: string
  name: string
  code: string
  description: string | null
  department_id: string | null
  duration_years: number
  degree_type: string | null
  credits_required: number | null
  eligibility_criteria: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface Semester {
  id: string
  course_id: string | null
  semester_number: number
  name: string
  description: string | null
  start_date: string | null
  end_date: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface SubjectChapter {
  id: string
  subject_id: string | null
  chapter_number: number
  title: string
  description: string | null
  learning_objectives: string | null
  estimated_hours: number | null
  difficulty_level: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface ChapterTopic {
  id: string
  chapter_id: string | null
  topic_number: number
  title: string
  description: string | null
  content: string | null
  key_points: string[] | null
  examples: string | null
  estimated_duration: number | null
  difficulty_level: string | null
  is_active: boolean | null
  created_at: string | null
  updated_at: string | null
}

export interface TopicMaterial {
  id: string
  topic_id: string | null
  material_type: string
  title: string
  description: string | null
  file_url: string | null
  content: string | null
  video_url: string | null
  duration: number | null
  file_size: number | null
  mime_type: string | null
  tags: string[] | null
  is_downloadable: boolean | null
  access_level: string | null
  uploaded_by: string | null
  created_at: string | null
  updated_at: string | null
}

export interface ProjectIdea {
  id: string
  title: string
  description: string
  subject_id: string | null
  topic_id: string | null
  difficulty_level: string
  estimated_duration: string | null
  technologies_used: string[] | null
  prerequisites: string[] | null
  learning_outcomes: string[] | null
  detailed_requirements: string | null
  sample_code_url: string | null
  reference_links: string[] | null
  max_team_size: number | null
  min_team_size: number | null
  is_group_project: boolean | null
  created_by: string | null
  target_semester: number | null
  department_id: string | null
  status: string | null
  tags: string[] | null
  created_at: string | null
  updated_at: string | null
}

export interface AssignmentUpdate {
  id: string
  assignment_id: string | null
  student_id: string | null
  submission_id: string | null
  update_type: string
  status: string | null
  marks_awarded: number | null
  feedback: string | null
  attachments: string[] | null
  updated_by: string | null
  remarks: string | null
  created_at: string | null
}

export interface ClassSchedule {
  id: string
  subject_id: string | null
  faculty_id: string | null
  semester_id: string | null
  section: string
  day_of_week: number | null
  start_time: string
  end_time: string
  classroom: string | null
  class_type: string | null
  recurring_pattern: string | null
  start_date: string
  end_date: string | null
  is_active: boolean | null
  notes: string | null
  created_at: string | null
  updated_at: string | null
}

export interface StudentProgress {
  id: string
  student_id: string | null
  subject_id: string | null
  chapter_id: string | null
  topic_id: string | null
  progress_type: string
  completion_percentage: number | null
  time_spent: number | null
  score: number | null
  max_score: number | null
  attempts: number | null
  last_accessed: string | null
  notes: string | null
  milestones_achieved: string[] | null
  areas_of_improvement: string[] | null
  strengths: string[] | null
  created_at: string | null
  updated_at: string | null
}
