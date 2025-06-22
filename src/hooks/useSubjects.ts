
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

interface Subject {
  id: string
  name: string
  code: string
  description: string | null
  credits: number
  semester: number | null
  department: string
  faculty_id: string | null
  created_at: string
  updated_at: string
  // These are computed fields, not in database
  studentCount?: number
  chaptersCount?: number
  assignmentsCount?: number
}

interface CreateSubjectData {
  name: string
  code: string
  description?: string
  credits: number
  semester: number
}

export function useSubjects() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubjects = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('faculty_id', user.id)

      if (error) throw error

      setSubjects(data || [])
    } catch (error: any) {
      console.error('Error fetching subjects:', error)
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (subjectData: CreateSubjectData) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name: subjectData.name,
          code: subjectData.code,
          description: subjectData.description || null,
          credits: subjectData.credits,
          semester: subjectData.semester,
          faculty_id: user.id,
          department: 'Centre for Computer Science & Application'
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject created successfully"
      })

      fetchSubjects()
      return { data, error: null }
    } catch (error: any) {
      console.error('Error creating subject:', error)
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const updateSubject = async (id: string, updates: Partial<CreateSubjectData>) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .update({
          name: updates.name,
          code: updates.code,
          description: updates.description || null,
          credits: updates.credits,
          semester: updates.semester
        })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject updated successfully"
      })

      fetchSubjects()
      return { error: null }
    } catch (error: any) {
      console.error('Error updating subject:', error)
      toast({
        title: "Error",
        description: "Failed to update subject",
        variant: "destructive"
      })
      return { error }
    }
  }

  const deleteSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject deleted successfully"
      })

      fetchSubjects()
      return { error: null }
    } catch (error: any) {
      console.error('Error deleting subject:', error)
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive"
      })
      return { error }
    }
  }

  useEffect(() => {
    if (user) {
      fetchSubjects()
    }
  }, [user])

  return {
    subjects,
    loading,
    createSubject,
    updateSubject,
    deleteSubject,
    refetch: fetchSubjects
  }
}
