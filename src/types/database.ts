
// Database types for the educational platform

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  head_of_department_id?: string
  established_year?: number
  total_faculty?: number
  total_students?: number
  contact_email?: string
  contact_phone?: string
  location?: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  name: string
  code: string
  description?: string
  department_id?: string
  duration_years: number
  degree_type?: 'Bachelor' | 'Master' | 'PhD' | 'Diploma' | 'Certificate'
  credits_required?: number
  eligibility_criteria?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Semester {
  id: string
  course_id?: string
  semester_number: number
  name: string
  description?: string
  start_date?: string
  end_date?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SubjectChapter {
  id: string
  subject_id?: string
  chapter_number: number
  title: string
  description?: string
  learning_objectives?: string
  estimated_hours?: number
  difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ChapterTopic {
  id: string
  chapter_id?: string
  topic_number: number
  title: string
  description?: string
  content?: string
  key_points?: string[]
  examples?: string
  estimated_duration?: number
  difficulty_level?: 'Beginner' | 'Intermediate' | 'Advanced'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface TopicMaterial {
  id: string
  topic_id?: string
  material_type: 'pdf' | 'text' | 'video' | 'image' | 'link' | 'audio'
  title: string
  description?: string
  file_url?: string
  content?: string
  video_url?: string
  duration?: number
  file_size?: number
  mime_type?: string
  tags?: string[]
  is_downloadable: boolean
  access_level?: 'public' | 'student' | 'faculty' | 'premium'
  uploaded_by?: string
  created_at: string
  updated_at: string
}

export interface ProjectIdea {
  id: string
  title: string
  description: string
  subject_id?: string
  topic_id?: string
  difficulty_level: 'Beginner' | 'Intermediate' | 'Advanced'
  estimated_duration?: string
  technologies_used?: string[]
  prerequisites?: string[]
  learning_outcomes?: string[]
  detailed_requirements?: string
  sample_code_url?: string
  reference_links?: string[]
  max_team_size?: number
  min_team_size?: number
  is_group_project: boolean
  created_by?: string
  target_semester?: number
  department_id?: string
  status?: 'draft' | 'published' | 'archived'
  tags?: string[]
  created_at: string
  updated_at: string
}

export interface AssignmentUpdate {
  id: string
  assignment_id?: string
  student_id?: string
  submission_id?: string
  update_type: 'submitted' | 'reviewed' | 'graded' | 'returned' | 'resubmitted'
  status?: 'pending' | 'in_review' | 'graded' | 'returned' | 'completed'
  marks_awarded?: number
  feedback?: string
  attachments?: string[]
  updated_by?: string
  remarks?: string
  created_at: string
}

export interface ClassSchedule {
  id: string
  subject_id?: string
  faculty_id?: string
  semester_id?: string
  section: string
  day_of_week?: number
  start_time: string
  end_time: string
  classroom?: string
  class_type?: 'lecture' | 'lab' | 'tutorial' | 'practical' | 'seminar'
  recurring_pattern?: 'weekly' | 'biweekly' | 'monthly' | 'once'
  start_date: string
  end_date?: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export interface StudentProgress {
  id: string
  student_id?: string
  subject_id?: string
  chapter_id?: string
  topic_id?: string
  progress_type: 'chapter_completed' | 'topic_completed' | 'assignment_submitted' | 'quiz_completed' | 'material_viewed'
  completion_percentage?: number
  time_spent?: number
  score?: number
  max_score?: number
  attempts?: number
  last_accessed?: string
  notes?: string
  milestones_achieved?: string[]
  areas_of_improvement?: string[]
  strengths?: string[]
  created_at: string
  updated_at: string
}
