import { useState, useEffect, createContext, useContext, useCallback } from 'react'

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
    const checkSession = () => {
      console.log('HODAuth: Checking session...')
      try {
        const session = localStorage.getItem('hod-session')
        console.log('HODAuth: Session from localStorage:', session)
        if (session) {
          const { user, timestamp } = JSON.parse(session)
          const now = Date.now()
          const sessionAge = now - timestamp
          
          console.log('HODAuth: Session age:', sessionAge, 'ms')
          
          // Session expires after 8 hours
          if (sessionAge < 8 * 60 * 60 * 1000) {
            console.log('HODAuth: Session valid, setting user:', user)
            setHODUser(user)
          } else {
            // Session expired
            console.log('HODAuth: Session expired, clearing')
            localStorage.removeItem('hod-session')
            setHODUser(null)
          }
        } else {
          console.log('HODAuth: No session found')
          setHODUser(null)
        }
      } catch (error) {
        console.error('HODAuth: Error parsing HOD session:', error)
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
    const HOD_CREDENTIALS = {
      email: 'hod@ccsa.edu.in',
      password: 'HOD@2024#Secure'
    }

    if (email === HOD_CREDENTIALS.email && password === HOD_CREDENTIALS.password) {
      const hodUser: HODUser = {
        id: 'hod-admin-id',
        name: 'Dr. Head of Department',
        email: HOD_CREDENTIALS.email,
        role: 'hod',
        avatar: undefined,
        emailVerified: true,
        profileComplete: true,
        approvalStatus: 'approved'
      }

      localStorage.setItem('hod-session', JSON.stringify({
        user: hodUser,
        timestamp: Date.now()
      }))

      setHODUser(hodUser)
      return true
    }
    
    return false
  }, [])

  const hodLogout = useCallback(() => {
    localStorage.removeItem('hod-session')
    setHODUser(null)
    // Navigation will be handled by the component using this hook
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