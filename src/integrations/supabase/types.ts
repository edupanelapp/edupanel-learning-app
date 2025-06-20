export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string | null
          feedback: string | null
          file_url: string | null
          graded_at: string | null
          id: string
          marks_obtained: number | null
          status: string | null
          student_id: string | null
          submission_text: string | null
          submitted_at: string | null
        }
        Insert: {
          assignment_id?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          marks_obtained?: number | null
          status?: string | null
          student_id?: string | null
          submission_text?: string | null
          submitted_at?: string | null
        }
        Update: {
          assignment_id?: string | null
          feedback?: string | null
          file_url?: string | null
          graded_at?: string | null
          id?: string
          marks_obtained?: number | null
          status?: string | null
          student_id?: string | null
          submission_text?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignment_updates: {
        Row: {
          assignment_id: string | null
          attachments: string[] | null
          created_at: string | null
          feedback: string | null
          id: string
          marks_awarded: number | null
          remarks: string | null
          status: string | null
          student_id: string | null
          submission_id: string | null
          update_type: string
          updated_by: string | null
        }
        Insert: {
          assignment_id?: string | null
          attachments?: string[] | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          marks_awarded?: number | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          submission_id?: string | null
          update_type: string
          updated_by?: string | null
        }
        Update: {
          assignment_id?: string | null
          attachments?: string[] | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          marks_awarded?: number | null
          remarks?: string | null
          status?: string | null
          student_id?: string | null
          submission_id?: string | null
          update_type?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignment_updates_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_updates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_updates_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "assignment_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignment_updates_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          assignment_type: string | null
          average_marks: number | null
          created_at: string | null
          description: string | null
          due_date: string
          faculty_id: string | null
          id: string
          instructions: string | null
          is_active: boolean | null
          late_submission_penalty: number | null
          max_marks: number | null
          section: string | null
          semester_id: string | null
          subject_id: string | null
          submission_format: string[] | null
          title: string
          total_submissions: number | null
          updated_at: string | null
        }
        Insert: {
          assignment_type?: string | null
          average_marks?: number | null
          created_at?: string | null
          description?: string | null
          due_date: string
          faculty_id?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          late_submission_penalty?: number | null
          max_marks?: number | null
          section?: string | null
          semester_id?: string | null
          subject_id?: string | null
          submission_format?: string[] | null
          title: string
          total_submissions?: number | null
          updated_at?: string | null
        }
        Update: {
          assignment_type?: string | null
          average_marks?: number | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          faculty_id?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          late_submission_penalty?: number | null
          max_marks?: number | null
          section?: string | null
          semester_id?: string | null
          subject_id?: string | null
          submission_format?: string[] | null
          title?: string
          total_submissions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_topics: {
        Row: {
          chapter_id: string | null
          content: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration: number | null
          examples: string | null
          id: string
          is_active: boolean | null
          key_points: string[] | null
          title: string
          topic_number: number
          updated_at: string | null
        }
        Insert: {
          chapter_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          examples?: string | null
          id?: string
          is_active?: boolean | null
          key_points?: string[] | null
          title: string
          topic_number: number
          updated_at?: string | null
        }
        Update: {
          chapter_id?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration?: number | null
          examples?: string | null
          id?: string
          is_active?: boolean | null
          key_points?: string[] | null
          title?: string
          topic_number?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chapter_topics_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "subject_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedule: {
        Row: {
          class_type: string | null
          classroom: string | null
          created_at: string | null
          day_of_week: number | null
          end_date: string | null
          end_time: string
          faculty_id: string | null
          id: string
          is_active: boolean | null
          notes: string | null
          recurring_pattern: string | null
          section: string
          semester_id: string | null
          start_date: string
          start_time: string
          subject_id: string | null
          updated_at: string | null
        }
        Insert: {
          class_type?: string | null
          classroom?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          end_time: string
          faculty_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          recurring_pattern?: string | null
          section: string
          semester_id?: string | null
          start_date: string
          start_time: string
          subject_id?: string | null
          updated_at?: string | null
        }
        Update: {
          class_type?: string | null
          classroom?: string | null
          created_at?: string | null
          day_of_week?: number | null
          end_date?: string | null
          end_time?: string
          faculty_id?: string | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          recurring_pattern?: string | null
          section?: string
          semester_id?: string | null
          start_date?: string
          start_time?: string
          subject_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedule_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedule_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedule_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          description: string | null
          duration: number | null
          faculty_id: string | null
          id: string
          location: string | null
          scheduled_at: string
          subject_id: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          faculty_id?: string | null
          id?: string
          location?: string | null
          scheduled_at: string
          subject_id?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: number | null
          faculty_id?: string | null
          id?: string
          location?: string | null
          scheduled_at?: string
          subject_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string | null
          credits_required: number | null
          degree_type: string | null
          department_id: string | null
          description: string | null
          duration_years: number
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          credits_required?: number | null
          degree_type?: string | null
          department_id?: string | null
          description?: string | null
          duration_years?: number
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          credits_required?: number | null
          degree_type?: string | null
          department_id?: string | null
          description?: string | null
          duration_years?: number
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          code: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          established_year: number | null
          head_of_department_id: string | null
          id: string
          location: string | null
          name: string
          total_faculty: number | null
          total_students: number | null
          updated_at: string | null
        }
        Insert: {
          code: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          head_of_department_id?: string | null
          id?: string
          location?: string | null
          name: string
          total_faculty?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          established_year?: number | null
          head_of_department_id?: string | null
          id?: string
          location?: string | null
          name?: string
          total_faculty?: number | null
          total_students?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_of_department_id_fkey"
            columns: ["head_of_department_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faculty_profiles: {
        Row: {
          created_at: string | null
          designation: string | null
          employee_id: string | null
          experience_years: number | null
          id: string
          qualification: string | null
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          designation?: string | null
          employee_id?: string | null
          experience_years?: number | null
          id?: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          designation?: string | null
          employee_id?: string | null
          experience_years?: number | null
          id?: string
          qualification?: string | null
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faculty_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_required: boolean | null
          action_url: string | null
          attachments: string[] | null
          created_at: string | null
          department_id: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          recipient_id: string | null
          section: string | null
          semester_id: string | null
          sender_id: string | null
          target_audience: string | null
          title: string
          type: string | null
        }
        Insert: {
          action_required?: boolean | null
          action_url?: string | null
          attachments?: string[] | null
          created_at?: string | null
          department_id?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          recipient_id?: string | null
          section?: string | null
          semester_id?: string | null
          sender_id?: string | null
          target_audience?: string | null
          title: string
          type?: string | null
        }
        Update: {
          action_required?: boolean | null
          action_url?: string | null
          attachments?: string[] | null
          created_at?: string | null
          department_id?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          recipient_id?: string | null
          section?: string | null
          semester_id?: string | null
          sender_id?: string | null
          target_audience?: string | null
          title?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string
          full_name: string | null
          id: string
          phone_number: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email: string
          full_name?: string | null
          id: string
          phone_number?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone_number?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_ideas: {
        Row: {
          created_at: string | null
          created_by: string | null
          department_id: string | null
          description: string
          detailed_requirements: string | null
          difficulty_level: string
          estimated_duration: string | null
          id: string
          is_group_project: boolean | null
          learning_outcomes: string[] | null
          max_team_size: number | null
          min_team_size: number | null
          prerequisites: string[] | null
          reference_links: string[] | null
          sample_code_url: string | null
          status: string | null
          subject_id: string | null
          tags: string[] | null
          target_semester: number | null
          technologies_used: string[] | null
          title: string
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description: string
          detailed_requirements?: string | null
          difficulty_level: string
          estimated_duration?: string | null
          id?: string
          is_group_project?: boolean | null
          learning_outcomes?: string[] | null
          max_team_size?: number | null
          min_team_size?: number | null
          prerequisites?: string[] | null
          reference_links?: string[] | null
          sample_code_url?: string | null
          status?: string | null
          subject_id?: string | null
          tags?: string[] | null
          target_semester?: number | null
          technologies_used?: string[] | null
          title: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          department_id?: string | null
          description?: string
          detailed_requirements?: string | null
          difficulty_level?: string
          estimated_duration?: string | null
          id?: string
          is_group_project?: boolean | null
          learning_outcomes?: string[] | null
          max_team_size?: number | null
          min_team_size?: number | null
          prerequisites?: string[] | null
          reference_links?: string[] | null
          sample_code_url?: string | null
          status?: string | null
          subject_id?: string | null
          tags?: string[] | null
          target_semester?: number | null
          technologies_used?: string[] | null
          title?: string
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_ideas_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_ideas_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_ideas_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_ideas_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chapter_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      semesters: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          name: string
          semester_number: number
          start_date: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          semester_number: number
          start_date?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          semester_number?: number
          start_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "semesters_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      student_profiles: {
        Row: {
          batch: string | null
          created_at: string | null
          guardian_name: string | null
          guardian_phone: string | null
          id: string
          semester: number | null
          student_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          batch?: string | null
          created_at?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          semester?: number | null
          student_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          batch?: string | null
          created_at?: string | null
          guardian_name?: string | null
          guardian_phone?: string | null
          id?: string
          semester?: number | null
          student_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          areas_of_improvement: string[] | null
          attempts: number | null
          chapter_id: string | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          last_accessed: string | null
          max_score: number | null
          milestones_achieved: string[] | null
          notes: string | null
          progress_type: string
          score: number | null
          strengths: string[] | null
          student_id: string | null
          subject_id: string | null
          time_spent: number | null
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          areas_of_improvement?: string[] | null
          attempts?: number | null
          chapter_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          max_score?: number | null
          milestones_achieved?: string[] | null
          notes?: string | null
          progress_type: string
          score?: number | null
          strengths?: string[] | null
          student_id?: string | null
          subject_id?: string | null
          time_spent?: number | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          areas_of_improvement?: string[] | null
          attempts?: number | null
          chapter_id?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          last_accessed?: string | null
          max_score?: number | null
          milestones_achieved?: string[] | null
          notes?: string | null
          progress_type?: string
          score?: number | null
          strengths?: string[] | null
          student_id?: string | null
          subject_id?: string | null
          time_spent?: number | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "subject_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chapter_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subjects: {
        Row: {
          enrolled_at: string | null
          id: string
          student_id: string | null
          subject_id: string | null
        }
        Insert: {
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
          subject_id?: string | null
        }
        Update: {
          enrolled_at?: string | null
          id?: string
          student_id?: string | null
          subject_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_subjects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subjects_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subject_chapters: {
        Row: {
          chapter_number: number
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          learning_objectives: string | null
          subject_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_number: number
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string | null
          subject_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_number?: number
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          learning_objectives?: string | null
          subject_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subject_chapters_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          assessment_criteria: string | null
          code: string
          course_id: string | null
          created_at: string | null
          credits: number | null
          department: string
          description: string | null
          faculty_id: string | null
          id: string
          learning_outcomes: string | null
          name: string
          prerequisites: string | null
          semester: number | null
          semester_id: string | null
          subject_type: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_criteria?: string | null
          code: string
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          department: string
          description?: string | null
          faculty_id?: string | null
          id?: string
          learning_outcomes?: string | null
          name: string
          prerequisites?: string | null
          semester?: number | null
          semester_id?: string | null
          subject_type?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_criteria?: string | null
          code?: string
          course_id?: string | null
          created_at?: string | null
          credits?: number | null
          department?: string
          description?: string | null
          faculty_id?: string | null
          id?: string
          learning_outcomes?: string | null
          name?: string
          prerequisites?: string | null
          semester?: number | null
          semester_id?: string | null
          subject_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_semester_id_fkey"
            columns: ["semester_id"]
            isOneToOne: false
            referencedRelation: "semesters"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_materials: {
        Row: {
          access_level: string | null
          content: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          file_size: number | null
          file_url: string | null
          id: string
          is_downloadable: boolean | null
          material_type: string
          mime_type: string | null
          tags: string[] | null
          title: string
          topic_id: string | null
          updated_at: string | null
          uploaded_by: string | null
          video_url: string | null
        }
        Insert: {
          access_level?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean | null
          material_type: string
          mime_type?: string | null
          tags?: string[] | null
          title: string
          topic_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          video_url?: string | null
        }
        Update: {
          access_level?: string | null
          content?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          is_downloadable?: boolean | null
          material_type?: string
          mime_type?: string | null
          tags?: string[] | null
          title?: string
          topic_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_materials_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "chapter_topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_materials_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
