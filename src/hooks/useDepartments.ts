
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { Department } from '@/types/database'

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<Department[]> => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data || []
    }
  })
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ['department', id],
    queryFn: async (): Promise<Department | null> => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },
    enabled: !!id
  })
}

export function useCreateDepartment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (department: Omit<Department, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('departments')
        .insert(department)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
    }
  })
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Department> & { id: string }) => {
      const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['departments'] })
      queryClient.invalidateQueries({ queryKey: ['department', data.id] })
    }
  })
}
