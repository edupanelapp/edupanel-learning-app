import React, { useState, useEffect, createContext, useContext } from 'react'
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { User, Session } from '@supabase/supabase-js'

interface UserProfile {
  id: string
  name: string
  email: string
  role: 'student' | 'faculty' | 'hod'
  avatar?: string
  emailVerified: boolean
  profileComplete: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
}

interface AuthContextType {
  user: UserProfile | null
  session: Session | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  register: (email: string, password: string, role: 'student' | 'faculty' | 'hod') => Promise<{ error?: string }>
  logout: () => Promise<void>
  isAuthenticated: boolean
  checkProfileStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const checkProfileStatus = async () => {
    if (!session?.user) return
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      console.log('Profile status checked:', profile)
    } catch (error) {
      console.error('Error checking profile status:', error)
    }
  }

  const createUserProfile = async (authUser: User): Promise<UserProfile> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (profile) {
      // Check if role-specific profile exists
      let roleProfileExists = false
      if (profile.role === 'student') {
        const { data: studentProfile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .single()
        roleProfileExists = !!studentProfile
      } else if (profile.role === 'faculty' || profile.role === 'hod') {
        const { data: facultyProfile } = await supabase
          .from('faculty_profiles')
          .select('id')
          .eq('user_id', profile.id)
          .single()
        roleProfileExists = !!facultyProfile
      }

      return {
        id: profile.id,
        name: profile.full_name || authUser.email?.split('@')[0] || 'User',
        email: profile.email,
        role: profile.role as 'student' | 'faculty' | 'hod',
        avatar: profile.avatar_url,
        emailVerified: authUser.email_confirmed_at !== null,
        profileComplete: !!(profile.full_name && roleProfileExists),
        approvalStatus: 'approved'
      }
    }

    return {
      id: authUser.id,
      name: authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      role: (authUser.user_metadata?.role as 'student' | 'faculty' | 'hod') || 'student',
      emailVerified: authUser.email_confirmed_at !== null,
      profileComplete: false,
      approvalStatus: 'pending'
    }
  }

  useEffect(() => {
    let mounted = true

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        if (!mounted) return

        setSession(session)
        
        if (session?.user) {
          try {
            const userProfile = await createUserProfile(session.user)
            if (mounted) {
              setUser(userProfile)
              
              if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
                const currentPath = window.location.pathname
                const urlParams = new URLSearchParams(window.location.search)
                const redirectTo = urlParams.get('redirect_to')
                
                if (currentPath === '/' || currentPath.includes('/email-verification')) {
                  if (redirectTo) {
                    setTimeout(() => window.location.href = redirectTo, 100)
                  } else if (!userProfile.profileComplete) {
                    setTimeout(() => window.location.href = `/profile-setup?role=${userProfile.role}`, 100)
                  } else {
                    setTimeout(() => window.location.href = `/login?role=${userProfile.role}`, 100)
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error creating user profile:', error)
            if (mounted) setUser(null)
          }
        } else {
          if (mounted) setUser(null)
        }
        
        if (mounted) setLoading(false)
      }
    )

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      
      if (session?.user) {
        createUserProfile(session.user)
          .then(profile => {
            if (mounted) setUser(profile)
          })
          .catch(console.error)
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const register = async (email: string, password: string, role: 'student' | 'faculty' | 'hod') => {
    // Prevent HOD registration
    if (role === 'hod') {
      return { error: 'HOD accounts cannot be created through registration. Please contact the administrator.' }
    }

    try {
      const redirectUrl = `${window.location.origin}/?redirect_to=${encodeURIComponent(`/login?role=${role}`)}`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role,
            full_name: '',
            department: 'Centre for Computer Science & Application'
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      console.error('[Register] Registration failed:', error)
      return { error: error.message || 'Registration failed' }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error: any) {
      console.error('Login failed:', error)
      return { error: error.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!session && !!user,
    checkProfileStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
