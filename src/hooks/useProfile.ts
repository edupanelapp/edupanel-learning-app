
import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from './useAuth'
import { useToast } from './use-toast'

interface BaseProfileData {
  id: string
  full_name: string | null
  email: string
  role: string
  department: string | null
  phone_number: string | null
  address: string | null
  avatar_url: string | null
  created_at: string | null
  updated_at: string | null
}

interface StudentProfileData {
  student_id: string | null
  semester: number | null
  batch: string | null
  guardian_name: string | null
  guardian_phone: string | null
}

interface FacultyProfileData {
  employee_id: string | null
  designation: string | null
  qualification: string | null
  experience_years: number | null
  specialization: string | null
}

type ProfileData = BaseProfileData & (StudentProfileData | FacultyProfileData)

export function useProfile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    if (!user) return

    try {
      // Get base profile
      const { data: baseProfile, error: baseError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (baseError) throw baseError

      let roleSpecificData = {}

      // Get role-specific profile data
      if (baseProfile.role === 'student') {
        const { data: studentProfile } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (studentProfile) {
          roleSpecificData = {
            student_id: studentProfile.student_id,
            semester: studentProfile.semester,
            batch: studentProfile.batch,
            guardian_name: studentProfile.guardian_name,
            guardian_phone: studentProfile.guardian_phone
          }
        }
      } else if (baseProfile.role === 'faculty' || baseProfile.role === 'hod') {
        const { data: facultyProfile } = await supabase
          .from('faculty_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (facultyProfile) {
          roleSpecificData = {
            employee_id: facultyProfile.employee_id,
            designation: facultyProfile.designation,
            qualification: facultyProfile.qualification,
            experience_years: facultyProfile.experience_years,
            specialization: facultyProfile.specialization
          }
        }
      }

      setProfile({ ...baseProfile, ...roleSpecificData } as ProfileData)
    } catch (error: any) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) return

    try {
      // Separate base profile updates from role-specific updates
      const baseUpdates: any = {}
      const roleUpdates: any = {}

      // Base profile fields
      const baseFields = ['full_name', 'email', 'department', 'phone_number', 'address', 'avatar_url']
      const studentFields = ['student_id', 'semester', 'batch', 'guardian_name', 'guardian_phone']
      const facultyFields = ['employee_id', 'designation', 'qualification', 'experience_years', 'specialization']

      Object.keys(updates).forEach(key => {
        if (baseFields.includes(key)) {
          baseUpdates[key] = updates[key as keyof ProfileData]
        } else if (studentFields.includes(key) || facultyFields.includes(key)) {
          roleUpdates[key] = updates[key as keyof ProfileData]
        }
      })

      // Update base profile
      if (Object.keys(baseUpdates).length > 0) {
        const { error: baseError } = await supabase
          .from('profiles')
          .update({
            ...baseUpdates,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        if (baseError) throw baseError
      }

      // Update role-specific profile
      if (Object.keys(roleUpdates).length > 0) {
        if (user.role === 'student') {
          const { error: studentError } = await supabase
            .from('student_profiles')
            .upsert({
              user_id: user.id,
              ...roleUpdates,
              updated_at: new Date().toISOString()
            })

          if (studentError) throw studentError
        } else if (user.role === 'faculty' || user.role === 'hod') {
          const { error: facultyError } = await supabase
            .from('faculty_profiles')
            .upsert({
              user_id: user.id,
              ...roleUpdates,
              updated_at: new Date().toISOString()
            })

          if (facultyError) throw facultyError
        }
      }

      // Refresh profile data
      await fetchProfile()
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })
    } catch (error: any) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
    }
  }

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile
  }
}
