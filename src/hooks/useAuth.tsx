
import React, { useState, useEffect, createContext, useContext } from 'react'
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

interface Session {
  user: UserProfile
  access_token: string
  refresh_token: string
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

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'student@example.com',
    password: 'password123',
    name: 'John Student',
    role: 'student' as const,
    emailVerified: true,
    profileComplete: true,
    approvalStatus: 'approved' as const
  },
  {
    id: '2',
    email: 'faculty@example.com',
    password: 'password123',
    name: 'Dr. Jane Faculty',
    role: 'faculty' as const,
    emailVerified: true,
    profileComplete: true,
    approvalStatus: 'approved' as const
  },
  {
    id: '3',
    email: 'hod@example.com',
    password: 'password123',
    name: 'Prof. Smith HOD',
    role: 'hod' as const,
    emailVerified: true,
    profileComplete: true,
    approvalStatus: 'approved' as const
  }
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const checkProfileStatus = async () => {
    // Mock implementation - in real app, this would check database
    console.log('Checking profile status for user:', user?.id)
  }

  useEffect(() => {
    // Check for existing session in localStorage
    const savedSession = localStorage.getItem('auth_session')
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        setSession(sessionData)
        setUser(sessionData.user)
      } catch (error) {
        console.error('Error parsing saved session:', error)
        localStorage.removeItem('auth_session')
      }
    }
    setLoading(false)
  }, [])

  const register = async (email: string, password: string, role: 'student' | 'faculty' | 'hod') => {
    try {
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === email)
      if (existingUser) {
        return { error: 'User with this email already exists' }
      }

      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      })

      return {}
    } catch (error: any) {
      console.error('[Register] Registration failed:', error)
      return { error: error.message || 'Registration failed' }
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const mockUser = mockUsers.find(u => u.email === email && u.password === password)
      
      if (!mockUser) {
        return { error: 'Invalid email or password' }
      }

      const userProfile: UserProfile = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        emailVerified: mockUser.emailVerified,
        profileComplete: mockUser.profileComplete,
        approvalStatus: mockUser.approvalStatus
      }

      const sessionData: Session = {
        user: userProfile,
        access_token: 'mock_access_token_' + Date.now(),
        refresh_token: 'mock_refresh_token_' + Date.now()
      }

      setUser(userProfile)
      setSession(sessionData)
      
      // Save to localStorage
      localStorage.setItem('auth_session', JSON.stringify(sessionData))

      return {}
    } catch (error: any) {
      console.error('Login failed:', error)
      return { error: error.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      setUser(null)
      setSession(null)
      localStorage.removeItem('auth_session')
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
