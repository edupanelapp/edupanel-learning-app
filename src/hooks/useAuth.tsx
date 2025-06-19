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

  const createUserProfile = async (authUser: User, role: 'student' | 'faculty' | 'hod'): Promise<UserProfile> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    if (profile) {
      return {
        id: profile.id,
        name: profile.full_name || authUser.email?.split('@')[0] || 'User',
        email: profile.email,
        role: profile.role as 'student' | 'faculty' | 'hod',
        avatar: profile.avatar_url,
        emailVerified: authUser.email_confirmed_at !== null,
        profileComplete: !!profile.full_name,
        approvalStatus: 'approved'
      }
    }

    // If no profile exists, it will be created by the trigger
    return {
      id: authUser.id,
      name: authUser.email?.split('@')[0] || 'User',
      email: authUser.email || '',
      role: role,
      emailVerified: authUser.email_confirmed_at !== null,
      profileComplete: false,
      approvalStatus: 'pending'
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        
        if (session?.user) {
          try {
            const userProfile = await createUserProfile(session.user, 'student')
            setUser(userProfile)
            
            // Handle email verification redirect
            if (event === 'SIGNED_IN' && session.user.email_confirmed_at) {
              const currentPath = window.location.pathname
              // Only redirect if we're on the root page (coming from email verification)
              if (currentPath === '/') {
                const urlParams = new URLSearchParams(window.location.search)
                const redirectTo = urlParams.get('redirect_to')
                
                if (redirectTo) {
                  window.location.href = redirectTo
                } else {
                  // Redirect to profile setup if profile is not complete
                  if (!userProfile.profileComplete) {
                    window.location.href = `/profile-setup?role=${userProfile.role}`
                  } else {
                    window.location.href = `/login?role=${userProfile.role}`
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error creating user profile:', error)
            setUser(null)
          }
        } else {
          setUser(null)
        }
        
        setLoading(false)
      }
    )

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        createUserProfile(session.user, 'student').then(setUser).catch(console.error)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const register = async (email: string, password: string, role: 'student' | 'faculty' | 'hod') => {
    try {
      // Set redirect URL to login page with role parameter
      const redirectUrl = `${window.location.origin}/?redirect_to=${encodeURIComponent(`/login?role=${role}`)}`
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role,
            full_name: ''
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
