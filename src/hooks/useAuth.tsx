
import React, { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

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
      // Get user from public.users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userError) {
        console.error('Error fetching user data:', userError)
        return
      }

      // Check if profile exists based on role
      let profileComplete = false
      let approvalStatus: 'pending' | 'approved' | 'rejected' | undefined = undefined

      if (userData.role === 'student') {
        const { data: profileData } = await supabase
          .from('student_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        profileComplete = !!profileData

        if (profileComplete) {
          const { data: verificationData } = await supabase
            .from('verification_requests')
            .select('status')
            .eq('user_id', session.user.id)
            .eq('request_type', 'student')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          approvalStatus = verificationData?.status || 'pending'
        }
      } else if (userData.role === 'faculty') {
        const { data: profileData } = await supabase
          .from('faculty_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        profileComplete = !!profileData

        if (profileComplete) {
          const { data: verificationData } = await supabase
            .from('verification_requests')
            .select('status')
            .eq('user_id', session.user.id)
            .eq('request_type', 'faculty')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

          approvalStatus = verificationData?.status || 'pending'
        }
      } else if (userData.role === 'hod') {
        const { data: profileData } = await supabase
          .from('hod_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        profileComplete = !!profileData
        approvalStatus = 'approved' // HODs are pre-approved
      }

      setUser({
        id: userData.id,
        name: session.user.user_metadata?.name || userData.email.split('@')[0],
        email: userData.email,
        role: userData.role,
        emailVerified: userData.email_verified,
        profileComplete,
        approvalStatus
      })
    } catch (error) {
      console.error('Error checking profile status:', error)
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        
        if (session?.user) {
          // Defer profile check to avoid auth state callback issues
          setTimeout(() => {
            checkProfileStatus()
          }, 0)
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        setTimeout(() => {
          checkProfileStatus()
        }, 0)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = async (email: string, password: string, role: 'student' | 'faculty' | 'hod') => {
    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })

      return {}
    } catch (error: any) {
      console.error('Registration failed:', error)
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
