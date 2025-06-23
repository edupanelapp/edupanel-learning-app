import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { HODLayout } from "./HODLayout"
import { useHODAuth } from "@/hooks/useHODAuth"
import { Loader2 } from "lucide-react"

export function ProtectedHODLayout() {
  const { isHODAuthenticated, isLoading } = useHODAuth()
  const navigate = useNavigate()

  console.log('ProtectedHODLayout: Auth state:', { isHODAuthenticated, isLoading })

  useEffect(() => {
    console.log('ProtectedHODLayout: useEffect triggered, isHODAuthenticated:', isHODAuthenticated, 'isLoading:', isLoading)
    if (!isLoading && !isHODAuthenticated) {
      console.log('ProtectedHODLayout: Redirecting to HOD access page')
      navigate('/admin/hod/access')
    }
  }, [isHODAuthenticated, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying HOD access...</p>
        </div>
      </div>
    )
  }

  // Show HOD layout if authenticated
  if (isHODAuthenticated) {
    return <HODLayout />
  }

  // This should not be reached due to the useEffect redirect, but just in case
  return null
} 