
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { ClassSchedule } from '@/types/database'

export function useClassSchedules(semesterId?: string, section?: string) {
  return useQuery({
    queryKey: ['class-schedules', semesterId, section],
    queryFn: async (): Promise<ClassSchedule[]> => {
      let query = supabase
        .from('class_schedule')
        .select(`
          *,
          subjects:subject_id(name, code),
          profiles:faculty_id(full_name)
        `)
        .eq('is_active', true)
        .order('day_of_week')
        .order('start_time')
      
      if (semesterId) {
        query = query.eq('semester_id', semesterId)
      }
      
      if (section) {
        query = query.eq('section', section)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateClassSchedule() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (schedule: Omit<ClassSchedule, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('class_schedule')
        .insert(schedule)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-schedules'] })
    }
  })
}
