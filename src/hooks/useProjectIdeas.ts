
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { ProjectIdea } from '@/types/database'

export function useProjectIdeas(status?: 'draft' | 'published' | 'archived') {
  return useQuery({
    queryKey: ['project-ideas', status],
    queryFn: async (): Promise<ProjectIdea[]> => {
      let query = supabase
        .from('project_ideas')
        .select(`
          *,
          subjects:subject_id(name, code),
          chapter_topics:topic_id(title),
          departments:department_id(name),
          profiles:created_by(full_name)
        `)
        .order('created_at', { ascending: false })
      
      if (status) {
        query = query.eq('status', status)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    }
  })
}

export function useCreateProjectIdea() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (projectIdea: Omit<ProjectIdea, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('project_ideas')
        .insert(projectIdea)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-ideas'] })
    }
  })
}

export function useUpdateProjectIdea() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ProjectIdea> & { id: string }) => {
      const { data, error } = await supabase
        .from('project_ideas')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-ideas'] })
    }
  })
}
