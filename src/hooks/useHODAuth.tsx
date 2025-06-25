import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { supabase } from "@/integrations/supabase/client"
import { clearStaleAuthData, getAuthSession, setAuthSession, validateAuthSession } from '@/utils/authUtils'

interface HODUser {
  id: string
  name: string
  email: string
  role: 'hod'
  avatar?: string
  emailVerified: boolean
  profileComplete: boolean
  approvalStatus: 'approved'
}

interface HODAuthContextType {
  hodUser: HODUser | null
  isHODAuthenticated: boolean
  isLoading: boolean
  hodLogout: () => void
  refreshAuth: () => Promise<void>
  clearAuth: () => void
}

const HODAuthContext = createContext<HODAuthContextType | undefined>(undefined)

export function HODAuthProvider({ children }: { children: React.ReactNode }) {
  const [hodUser, setHODUser] = useState<HODUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)

  // Function to clear all auth data
  const clearAuthData = useCallback(() => {
    console.log('HODAuth: Clearing all auth data')
    clearStaleAuthData()
    setHODUser(null)
    setIsLoading(false)
  }, [])

  // Function to check and validate HOD session
  const checkHODSession = useCallback(async () => {
    console.log('HODAuth: Checking HOD session...')
    try {
      // First check localStorage for HOD session using utility
      const session = getAuthSession()
      console.log('HODAuth: HOD Session from localStorage:', session ? 'valid' : 'not found/invalid')
      
      if (session && session.user) {
        console.log('HODAuth: HOD session valid, setting user:', session.user.name)
        setHODUser(session.user)
        setIsLoading(false)
        return true
      }

      // Check if user is authenticated with Supabase and is a HOD
      console.log('HODAuth: Checking Supabase session...')
      const { data: { session: supabaseSession }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('HODAuth: Error getting Supabase session:', sessionError)
        clearAuthData()
        return false
      }

      console.log('HODAuth: Supabase session result:', supabaseSession ? 'exists' : 'not found')
      
      if (supabaseSession?.user) {
        console.log('HODAuth: Found Supabase session, checking HOD status for user:', supabaseSession.user.id)
        
        // Check if user is in hods table
        const { data: hodData, error: hodError } = await supabase
          .from('hods')
          .select('user_id')
          .eq('user_id', supabaseSession.user.id)
          .single()

        console.log('HODAuth: HOD table check result:', { hodData, hodError })

        if (!hodError && hodData) {
          console.log('HODAuth: User is verified HOD')
          
          // Get user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseSession.user.id)
            .single()

          if (profileError) {
            console.error('HODAuth: Error getting profile:', profileError)
            clearAuthData()
            return false
          }

          const hodUser: HODUser = {
            id: supabaseSession.user.id,
            name: profileData?.full_name || "HOD User",
            email: supabaseSession.user.email || "",
            role: 'hod',
            avatar: profileData?.avatar_url,
            emailVerified: true,
            profileComplete: true,
            approvalStatus: 'approved'
          }

          // Store session using utility
          setAuthSession(hodUser)

          console.log('HODAuth: Setting HOD user:', hodUser.name)
          setHODUser(hodUser)
          setIsLoading(false)
          return true
        } else {
          console.log('HODAuth: User is not a HOD or error occurred:', hodError)
          clearAuthData()
          return false
        }
      } else {
        console.log('HODAuth: No Supabase session found')
        clearAuthData()
        return false
      }
    } catch (error) {
      console.error('HODAuth: Error checking HOD session:', error)
      clearAuthData()
      return false
    }
  }, [clearAuthData])

  // Initialize auth state
  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      console.log('HODAuth: Initializing auth...')
      await checkHODSession()
      if (isMounted) {
        setIsInitialized(true)
      }
    }

    initializeAuth()

    return () => {
      isMounted = false
    }
  }, [checkHODSession])

  // Listen for auth state changes
  useEffect(() => {
    if (!isInitialized) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('HODAuth: Auth state changed:', event, session?.user?.id)
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('HODAuth: User signed in, checking HOD status')
        await checkHODSession()
      } else if (event === 'SIGNED_OUT') {
        console.log('HODAuth: User signed out, clearing HOD session')
        clearAuthData()
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('HODAuth: Token refreshed, revalidating session')
        await checkHODSession()
      }
    })

    return () => subscription.unsubscribe()
  }, [isInitialized, checkHODSession, clearAuthData])

  // Listen for tab focus/visibility change to re-check session
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkHODSession();
      }
    };
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', checkHODSession);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', checkHODSession);
    };
  }, [checkHODSession]);

  // Refresh auth function
  const refreshAuth = useCallback(async () => {
    console.log('HODAuth: Refreshing auth...')
    setIsLoading(true)
    await checkHODSession()
  }, [checkHODSession])

  // Clear auth function (for manual cleanup)
  const clearAuth = useCallback(() => {
    console.log('HODAuth: Manual auth clear requested')
    clearAuthData()
  }, [clearAuthData])

  // Logout function
  const hodLogout = useCallback(async () => {
    try {
      console.log('HODAuth: Logging out...')
      // Sign out from Supabase
      await supabase.auth.signOut()
      // Clear HOD session
      clearAuthData()
      console.log('HODAuth: Successfully logged out')
    } catch (error) {
      console.error('HODAuth: Error during logout:', error)
      clearAuthData()
    }
  }, [clearAuthData])

  const value = {
    hodUser,
    isHODAuthenticated: !!hodUser,
    isLoading: isLoading || !isInitialized,
    hodLogout,
    refreshAuth,
    clearAuth
  }

  return <HODAuthContext.Provider value={value}>{children}</HODAuthContext.Provider>
}

export function useHODAuth() {
  const context = useContext(HODAuthContext)
  if (context === undefined) {
    throw new Error('useHODAuth must be used within a HODAuthProvider')
  }
  return context
}
