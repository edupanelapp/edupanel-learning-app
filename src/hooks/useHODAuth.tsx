import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { supabase } from "@/integrations/supabase/client"

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
  hodLogin: (email: string, password: string) => boolean
  hodLogout: () => void
}

const HODAuthContext = createContext<HODAuthContextType | undefined>(undefined)

export function HODAuthProvider({ children }: { children: React.ReactNode }) {
  const [hodUser, setHODUser] = useState<HODUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      console.log('HODAuth: Checking session...')
      try {
        // First check localStorage for HOD session
        const hodSession = localStorage.getItem('hod-session')
        console.log('HODAuth: HOD Session from localStorage:', hodSession)
        
        if (hodSession) {
          const { user, timestamp } = JSON.parse(hodSession)
          const now = Date.now()
          const sessionAge = now - timestamp
          
          console.log('HODAuth: Session age:', sessionAge, 'ms')
          
          // Session expires after 8 hours
          if (sessionAge < 8 * 60 * 60 * 1000) {
            console.log('HODAuth: HOD session valid, setting user:', user)
            setHODUser(user)
            setIsLoading(false)
            return
          } else {
            console.log('HODAuth: HOD session expired, clearing')
            localStorage.removeItem('hod-session')
          }
        }

        // Check if user is authenticated with Supabase and is a HOD
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          console.log('HODAuth: Found Supabase session, checking HOD status')
          
          // Check if user is in hods table
          const { data: hodData, error } = await supabase
            .from('hods')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single()

          if (!error && hodData) {
            console.log('HODAuth: User is verified HOD')
            
            // Get user profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            const hodUser: HODUser = {
              id: session.user.id,
              name: profileData?.full_name || "HOD User",
              email: session.user.email || "",
              role: 'hod',
              avatar: profileData?.avatar_url,
              emailVerified: true,
              profileComplete: true,
              approvalStatus: 'approved'
            }

            // Store session
            localStorage.setItem('hod-session', JSON.stringify({
              user: hodUser,
              timestamp: Date.now()
            }))

            setHODUser(hodUser)
          } else {
            console.log('HODAuth: User is not a HOD or error occurred:', error)
            setHODUser(null)
          }
        } else {
          console.log('HODAuth: No Supabase session found')
          setHODUser(null)
        }
      } catch (error) {
        console.error('HODAuth: Error checking HOD session:', error)
        localStorage.removeItem('hod-session')
        setHODUser(null)
      } finally {
        console.log('HODAuth: Setting isLoading to false')
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const hodLogin = useCallback((email: string, password: string): boolean => {
    // This function is now handled by the HODAccess component
    // keeping it for compatibility but it's not used
    console.log('HODAuth: hodLogin called but authentication is now handled by HODAccess component')
    return false
  }, [])

  const hodLogout = useCallback(async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      // Clear HOD session
      localStorage.removeItem('hod-session')
      setHODUser(null)
      
      console.log('HODAuth: Successfully logged out')
    } catch (error) {
      console.error('HODAuth: Error during logout:', error)
    }
  }, [])

  const value = {
    hodUser,
    isHODAuthenticated: !!hodUser,
    isLoading,
    hodLogin,
    hodLogout
  }

  return <HODAuthContext.Provider value={value}>{children}</HODAuthContext.Provider>
}

export function useHODAuth() {
  const context = useContext(HODAuthContext)
  if (context === undefined) {
    throw new Error('useHODAuth must be used within an HODAuthProvider')
  }
  return context
}
