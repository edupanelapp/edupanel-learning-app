// Authentication utility functions

export const clearStaleAuthData = () => {
  console.log('AuthUtils: Clearing stale authentication data')
  
  // Clear all auth-related localStorage items
  const authKeys = [
    'hod-session',
    'supabase.auth.token',
    'supabase.auth.expires_at',
    'supabase.auth.refresh_token'
  ]
  
  authKeys.forEach(key => {
    try {
      localStorage.removeItem(key)
      console.log(`AuthUtils: Cleared ${key}`)
    } catch (error) {
      console.error(`AuthUtils: Error clearing ${key}:`, error)
    }
  })
  
  // Clear sessionStorage as well
  try {
    sessionStorage.clear()
    console.log('AuthUtils: Cleared sessionStorage')
  } catch (error) {
    console.error('AuthUtils: Error clearing sessionStorage:', error)
  }
}

export const validateAuthSession = (session: any) => {
  if (!session) return false
  
  try {
    const { user, timestamp } = session
    const now = Date.now()
    const sessionAge = now - timestamp
    
    // Session expires after 8 hours
    return sessionAge < 8 * 60 * 60 * 1000 && user && user.id
  } catch (error) {
    console.error('AuthUtils: Error validating session:', error)
    return false
  }
}

export const getAuthSession = () => {
  try {
    const session = localStorage.getItem('hod-session')
    if (!session) return null
    
    const parsedSession = JSON.parse(session)
    return validateAuthSession(parsedSession) ? parsedSession : null
  } catch (error) {
    console.error('AuthUtils: Error getting auth session:', error)
    return null
  }
}

export const setAuthSession = (user: any) => {
  try {
    const session = {
      user,
      timestamp: Date.now()
    }
    localStorage.setItem('hod-session', JSON.stringify(session))
    console.log('AuthUtils: Set auth session for user:', user.name)
  } catch (error) {
    console.error('AuthUtils: Error setting auth session:', error)
  }
}

// Check if we're in a development environment
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development'
}

// Force refresh the page (useful for clearing stuck states)
export const forceRefresh = () => {
  console.log('AuthUtils: Force refreshing page')
  window.location.reload()
}

// Check if the current page is an HOD page
export const isHODPage = (pathname: string) => {
  return pathname.startsWith('/hod')
} 