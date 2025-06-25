import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { HODLayout } from "./HODLayout"
import { useHODAuth } from "@/hooks/useHODAuth"
import { Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProtectedHODLayout() {
  const { isHODAuthenticated, isLoading, refreshAuth } = useHODAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [retryCount, setRetryCount] = useState(0)
  const [showRetry, setShowRetry] = useState(false)

  console.log('ProtectedHODLayout: Auth state:', { isHODAuthenticated, isLoading, pathname: location.pathname })

  useEffect(() => {
    console.log('ProtectedHODLayout: useEffect triggered, isHODAuthenticated:', isHODAuthenticated, 'isLoading:', isLoading)
    
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isHODAuthenticated) {
      console.log('ProtectedHODLayout: Redirecting to HOD login page')
      navigate('/admin/hod/login', { replace: true })
    }
  }, [isHODAuthenticated, isLoading, navigate])

  // Show retry option if loading takes too long
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setShowRetry(true)
      }, 10000) // Show retry after 10 seconds

      return () => clearTimeout(timer)
    } else {
      setShowRetry(false)
      setRetryCount(0)
    }
  }, [isLoading])

  // Handle retry
  const handleRetry = async () => {
    console.log('ProtectedHODLayout: Retrying authentication...')
    setRetryCount(prev => prev + 1)
    setShowRetry(false)
    await refreshAuth()
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Verifying HOD access...</p>
          
          {showRetry && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Taking longer than expected</p>
              <Button 
                onClick={handleRetry} 
                variant="outline" 
                size="sm"
                disabled={retryCount >= 3}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {retryCount >= 3 ? 'Max retries reached' : 'Retry Authentication'}
              </Button>
              {retryCount >= 3 && (
                <p className="text-xs text-red-500">
                  Please refresh the page or clear browser cache
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Show HOD layout if authenticated
  if (isHODAuthenticated) {
    console.log('ProtectedHODLayout: User is authenticated, showing HOD layout')
    return <HODLayout />
  }

  // This should not be reached due to the useEffect redirect, but just in case
  console.log('ProtectedHODLayout: User not authenticated, showing null')
  return null
} 