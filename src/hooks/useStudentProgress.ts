
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { StudentProgress } from '@/types/database'

export function useStudentProgress(studentId?: string, subjectId?: string) {
  return useQuery({
    queryKey: ['student-progress', studentId, subjectId],
    queryFn: async (): Promise<StudentProgress[]> => {
      let query = supabase
        .from('student_progress')
        .select(`
          *,
          subjects:subject_id(name, code),
          subject_chapters:chapter_id(title),
          chapter_topics:topic_id(title)
        `)
        .order('created_at', { ascending: false })
      
      if (studentId) {
        query = query.eq('student_id', studentId)
      }
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  })
}

export function useUpdateStudentProgress() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (progress: Omit<StudentProgress, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('student_progress')
        .upsert(progress)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-progress'] })
    }
  })
}
