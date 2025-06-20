
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { SubjectChapter, ChapterTopic } from '@/types/database'

export function useSubjectChapters(subjectId?: string) {
  return useQuery({
    queryKey: ['subject-chapters', subjectId],
    queryFn: async (): Promise<SubjectChapter[]> => {
      let query = supabase
        .from('subject_chapters')
        .select('*')
        .eq('is_active', true)
        .order('chapter_number')
      
      if (subjectId) {
        query = query.eq('subject_id', subjectId)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    },
    enabled: !!subjectId
  })
}

export function useChapterTopics(chapterId?: string) {
  return useQuery({
    queryKey: ['chapter-topics', chapterId],
    queryFn: async (): Promise<ChapterTopic[]> => {
      const { data, error } = await supabase
        .from('chapter_topics')
        .select('*')
        .eq('chapter_id', chapterId)
        .eq('is_active', true)
        .order('topic_number')
      
      if (error) throw error
      return data || []
    },
    enabled: !!chapterId
  })
}

export function useCreateChapter() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (chapter: Omit<SubjectChapter, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subject_chapters')
        .insert(chapter)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subject-chapters'] })
    }
  })
}

export function useCreateTopic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (topic: Omit<ChapterTopic, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('chapter_topics')
        .insert(topic)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chapter-topics'] })
    }
  })
}
