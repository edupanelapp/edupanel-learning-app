
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Course } from '@/types/database'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    }
  })
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async (): Promise<Course | null> => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id
  })
}

export function useCreateCourse() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (course: Omit<Course, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  })
}
