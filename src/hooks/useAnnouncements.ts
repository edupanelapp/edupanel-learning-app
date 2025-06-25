import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

export interface Announcement {
  id: string
  title: string
  message: string
  type: 'announcement' | 'assignment' | 'class' | 'grade' | 'general'
  target_audience: 'all' | 'students' | 'faculty' | 'hod' | 'department' | 'semester' | 'section'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  expires_at: string | null
  attachments: string[] | null
  action_required: boolean
  action_url: string | null
  sender_id: string
  created_at: string
  updated_at: string
  // Computed fields
  sender_name?: string
  department_name?: string
  is_expired?: boolean
  days_until_expiry?: number
}

export interface CreateAnnouncementData {
  title: string
  message: string
  target_audience: 'all' | 'students' | 'faculty' | 'hod' | 'department' | 'semester' | 'section'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  expires_at?: string
  attachments?: string[]
  action_required?: boolean
  action_url?: string
  department_id?: string
  semester_id?: string
  section?: string
}

export function useAnnouncements(filters?: {
  target_audience?: string
  priority?: string
  status?: 'active' | 'expired' | 'all'
}) {
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch announcements
  const {
    data: announcements = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['announcements', filters],
    queryFn: async (): Promise<Announcement[]> => {
      let query = supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!sender_id(full_name, department),
          department:departments(name)
        `)
        .eq('type', 'announcement')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters?.target_audience && filters.target_audience !== 'all') {
        query = query.eq('target_audience', filters.target_audience)
      }

      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching announcements:', error)
        throw error
      }

      // Process the data to add computed fields
      const processedData = (data || []).map(announcement => {
        const now = new Date()
        const expiryDate = announcement.expires_at ? new Date(announcement.expires_at) : null
        const isExpired = expiryDate ? now > expiryDate : false
        const daysUntilExpiry = expiryDate 
          ? Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : null

        return {
          ...announcement,
          sender_name: announcement.sender?.full_name,
          department_name: announcement.department?.name,
          is_expired: isExpired,
          days_until_expiry: daysUntilExpiry
        }
      })

      // Filter by status if specified
      if (filters?.status && filters.status !== 'all') {
        if (filters.status === 'active') {
          return processedData.filter(a => !a.is_expired)
        } else if (filters.status === 'expired') {
          return processedData.filter(a => a.is_expired)
        }
      }

      return processedData
    },
    enabled: !!user
  })

  // Create announcement mutation
  const createAnnouncement = useMutation({
    mutationFn: async (data: CreateAnnouncementData) => {
      const announcementData = {
        ...data,
        sender_id: user?.id,
        type: 'announcement'
      }
      
      const { error } = await supabase
        .from('notifications')
        .insert(announcementData)

      if (error) throw error
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast({
        title: "Success",
        description: "Announcement created successfully"
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create announcement",
        variant: "destructive"
      })
    }
  })

  // Update announcement mutation
  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAnnouncementData> }) => {
      const { error } = await supabase
        .from('notifications')
        .update(data)
        .eq('id', id)

      if (error) throw error
      return { id, data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast({
        title: "Success",
        description: "Announcement updated successfully"
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update announcement",
        variant: "destructive"
      })
    }
  })

  // Delete announcement mutation
  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast({
        title: "Success",
        description: "Announcement deleted successfully"
      })
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete announcement",
        variant: "destructive"
      })
    }
  })

  // Get announcement statistics
  const getStats = () => {
    const active = announcements.filter(a => !a.is_expired).length
    const expired = announcements.filter(a => a.is_expired).length
    const faculty = announcements.filter(a => a.target_audience === 'faculty').length
    const students = announcements.filter(a => a.target_audience === 'students').length
    const all = announcements.filter(a => a.target_audience === 'all').length
    const urgent = announcements.filter(a => a.priority === 'urgent').length

    return {
      total: announcements.length,
      active,
      expired,
      faculty,
      students,
      all,
      urgent
    }
  }

  return {
    announcements,
    isLoading,
    error,
    refetch,
    createAnnouncement: createAnnouncement.mutate,
    updateAnnouncement: updateAnnouncement.mutate,
    deleteAnnouncement: deleteAnnouncement.mutate,
    isCreating: createAnnouncement.isPending,
    isUpdating: updateAnnouncement.isPending,
    isDeleting: deleteAnnouncement.isPending,
    getStats
  }
} 