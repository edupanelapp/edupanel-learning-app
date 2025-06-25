import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export interface HODStudent {
  id: string
  name: string
  rollNo: string
  course: string
  semester: number
  progress: number
  assignments: { completed: number; total: number }
  projects: number
  gpa: number
  trend: "up" | "down"
  email: string
  department: string
  batch: string
  guardian_name?: string
  guardian_phone?: string
  last_active: string
}

export interface SemesterStats {
  [key: string]: { count: number; avgProgress: number; avgGPA: number }
}

export interface DepartmentStats {
  totalStudents: number
  avgProgress: number
  avgGPA: number
  assignmentCompletionRate: number
  activeProjects: number
  improvingStudents: number
}

export function useHODStudents(departmentId?: string) {
  return useQuery({
    queryKey: ['hod-students', departmentId],
    queryFn: async (): Promise<{
      students: HODStudent[]
      semesterStats: SemesterStats
      departmentStats: DepartmentStats
    }> => {
      console.log('useHODStudents: Starting data fetch...')
      
      try {
        // Get HOD's department if not provided
        let targetDepartmentId = departmentId
        if (!targetDepartmentId) {
          console.log('useHODStudents: No department ID provided, fetching HOD profile...')
          const { data: hodProfile, error: hodError } = await supabase
            .from('profiles')
            .select('department')
            .eq('role', 'hod')
            .maybeSingle()
          
          if (hodError) {
            console.error('useHODStudents: Error fetching HOD profile:', hodError)
            // Use a default department for now
            targetDepartmentId = 'Computer Science'
          } else if (hodProfile) {
            console.log('useHODStudents: HOD profile found:', hodProfile)
            targetDepartmentId = hodProfile.department || 'Computer Science'
          } else {
            console.log('useHODStudents: No HOD profile found, using default department')
            targetDepartmentId = 'Computer Science'
          }
        }

        console.log('useHODStudents: Target department:', targetDepartmentId)

        // Fetch all students in the department - Fixed query to remove semester from profiles
        console.log('useHODStudents: Fetching students...')
        const { data: studentsData, error: studentsError } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            email,
            department,
            student_profiles!inner (
              student_id,
              batch,
              guardian_name,
              guardian_phone,
              semester
            )
          `)
          .eq('role', 'student')
          .eq('department', targetDepartmentId)
          .order('full_name')

        console.log('useHODStudents: Students query result:', { studentsData, studentsError })

        if (studentsError) {
          console.error('useHODStudents: Error fetching students:', studentsError)
          throw studentsError
        }

        if (!studentsData || studentsData.length === 0) {
          console.log('useHODStudents: No students found, returning empty data')
          return {
            students: [],
            semesterStats: {},
            departmentStats: {
              totalStudents: 0,
              avgProgress: 0,
              avgGPA: 0,
              assignmentCompletionRate: 0,
              activeProjects: 0,
              improvingStudents: 0
            }
          }
        }

        console.log('useHODStudents: Found', studentsData.length, 'students')

        // Fetch detailed data for each student
        const studentsWithDetails = await Promise.all(
          studentsData.map(async (student) => {
            console.log('useHODStudents: Processing student:', student.full_name)
            const studentProfile = student.student_profiles?.[0]
            
            // Get enrolled subjects
            const { data: enrolledSubjects } = await supabase
              .from('student_subjects')
              .select(`
                subjects:subject_id (
                  id,
                  name,
                  code,
                  courses:course_id (
                    name,
                    departments:department_id (name)
                  )
                )
              `)
              .eq('student_id', student.id)

            // Get progress data
            const { data: progressData } = await supabase
              .from('student_progress')
              .select('completion_percentage, score, max_score, last_accessed')
              .eq('student_id', student.id)

            // Get assignment data
            const { data: assignmentData } = await supabase
              .from('assignment_submissions')
              .select(`
                status,
                marks_obtained,
                assignments!inner (
                  max_marks
                )
              `)
              .eq('student_id', student.id)

            // Get project data
            const { count: projectCount } = await supabase
              .from('project_ideas')
              .select('*', { count: 'exact', head: true })
              .eq('created_by', student.id)

            // Calculate metrics
            const avgProgress = progressData?.length 
              ? progressData.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progressData.length
              : 0

            const completedAssignments = assignmentData?.filter(a => a.status === 'graded').length || 0
            const totalAssignments = assignmentData?.length || 0

            // Calculate GPA from assignment scores
            let gpa = 0
            if (assignmentData && assignmentData.length > 0) {
              const validScores = assignmentData
                .filter(a => a.marks_obtained && a.assignments?.max_marks)
                .map(a => (a.marks_obtained! / a.assignments!.max_marks) * 100)
              
              if (validScores.length > 0) {
                const avgScore = validScores.reduce((sum, score) => sum + score, 0) / validScores.length
                // Convert percentage to GPA (4.0 scale)
                gpa = Math.min(4.0, (avgScore / 100) * 4.0)
              }
            }

            // Determine trend (simplified - could be enhanced with historical data)
            const trend: "up" | "down" = avgProgress > 70 ? "up" : "down"

            // Get course name
            const courseName = enrolledSubjects?.[0]?.subjects?.courses?.name || 'Not Enrolled'
            const departmentName = enrolledSubjects?.[0]?.subjects?.courses?.departments?.name || student.department

            // Get last activity
            const lastAccessed = progressData?.length 
              ? Math.max(...progressData.map(p => new Date(p.last_accessed || '').getTime()))
              : 0

            return {
              id: student.id,
              name: student.full_name || 'Unknown',
              rollNo: studentProfile?.student_id || 'N/A',
              course: courseName,
              semester: studentProfile?.semester || 0,
              progress: Math.round(avgProgress),
              assignments: { 
                completed: completedAssignments, 
                total: totalAssignments 
              },
              projects: projectCount || 0,
              gpa: Math.round(gpa * 10) / 10,
              trend,
              email: student.email || '',
              department: departmentName,
              batch: studentProfile?.batch || 'N/A',
              guardian_name: studentProfile?.guardian_name,
              guardian_phone: studentProfile?.guardian_phone,
              last_active: new Date(lastAccessed).toISOString()
            }
          })
        )

        console.log('useHODStudents: Processed students:', studentsWithDetails.length)

        // Calculate semester statistics
        const semesterData: SemesterStats = {}
        studentsWithDetails.forEach(student => {
          const semesterKey = `${student.semester}`
          if (!semesterData[semesterKey]) {
            semesterData[semesterKey] = { count: 0, avgProgress: 0, avgGPA: 0 }
          }
          semesterData[semesterKey].count++
          semesterData[semesterKey].avgProgress += student.progress
          semesterData[semesterKey].avgGPA += student.gpa
        })

        // Calculate averages
        Object.keys(semesterData).forEach(semester => {
          semesterData[semester].avgProgress = Math.round(
            semesterData[semester].avgProgress / semesterData[semester].count
          )
          semesterData[semester].avgGPA = Math.round(
            (semesterData[semester].avgGPA / semesterData[semester].count) * 10
          ) / 10
        })

        // Calculate department statistics
        const totalStudents = studentsWithDetails.length
        const avgProgress = totalStudents > 0 
          ? Math.round(studentsWithDetails.reduce((sum, s) => sum + s.progress, 0) / totalStudents)
          : 0
        const avgGPA = totalStudents > 0
          ? Math.round((studentsWithDetails.reduce((sum, s) => sum + s.gpa, 0) / totalStudents) * 10) / 10
          : 0
        
        const totalAssignments = studentsWithDetails.reduce((sum, s) => sum + s.assignments.total, 0)
        const completedAssignments = studentsWithDetails.reduce((sum, s) => sum + s.assignments.completed, 0)
        const assignmentCompletionRate = totalAssignments > 0 
          ? Math.round((completedAssignments / totalAssignments) * 100)
          : 0

        const activeProjects = studentsWithDetails.reduce((sum, s) => sum + s.projects, 0)
        const improvingStudents = studentsWithDetails.filter(s => s.trend === 'up').length

        const departmentStats: DepartmentStats = {
          totalStudents,
          avgProgress,
          avgGPA,
          assignmentCompletionRate,
          activeProjects,
          improvingStudents
        }

        console.log('useHODStudents: Returning data:', {
          studentsCount: studentsWithDetails.length,
          semesterStats: semesterData,
          departmentStats
        })

        return {
          students: studentsWithDetails,
          semesterStats: semesterData,
          departmentStats
        }
      } catch (error) {
        console.error('useHODStudents: Error in query function:', error)
        throw error
      }
    },
    enabled: true, // Always enabled for HOD
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useStudentDetails(studentId: string) {
  return useQuery({
    queryKey: ['student-details', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          student_profiles (*),
          student_progress (
            *,
            subjects:subject_id (name, code),
            subject_chapters:chapter_id (title),
            chapter_topics:topic_id (title)
          ),
          assignment_submissions (
            *,
            assignments!inner (
              title,
              max_marks,
              subjects:subject_id (name)
            )
          )
        `)
        .eq('id', studentId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!studentId
  })
} 