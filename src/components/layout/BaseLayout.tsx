
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Bell, GraduationCap, ArrowLeft } from "lucide-react"
import { NavigationItem } from "@/config/navigation"
import { Sidebar } from "@/components/navigation/Sidebar"
import { BottomNav } from "@/components/navigation/BottomNav"
import { UserMenu } from "@/components/navigation/UserMenu"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface BaseLayoutProps {
  navigation: NavigationItem[]
  userRole: "student" | "teacher" | "hod"
  userInfo: {
    name: string
    email: string
    avatar?: string
    initials: string
  }
  onLogout: () => void
}

export function BaseLayout({ 
  navigation, 
  userRole, 
  userInfo,
  onLogout 
}: BaseLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const isActive = (href: string) => location.pathname === href
  const isProfilePage = location.pathname === `/${userRole}/profile`

  const handleLogout = () => {
    try {
      // Call the parent's onLogout function
      onLogout()
      
      // Show success message
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      })
      
      // Redirect to login page
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              {isProfilePage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate(`/${userRole}/dashboard`)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              ) : (
                <Link to={`/${userRole}/dashboard`} className="flex items-center space-x-2 cursor-pointer">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <div className="flex items-center">
                    <span className="text-lg font-bold text-primary">
                      EduPanel
                    </span>
                    <span className="text-lg font-bold text-primary hidden md:block">
                      &nbsp;Learning Hub
                    </span>
                    <span className="text-sm text-muted-foreground">
                      &nbsp;| {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </span>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {!isProfilePage && (
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              )}
              <ThemeToggle />
              <UserMenu 
                userInfo={userInfo}
                profileUrl={`/${userRole}/profile`}
                onLogout={handleLogout}
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex">
        {/* Desktop Sidebar */}
        {!isProfilePage && (
          <div className="hidden md:block">
            <Sidebar 
              items={navigation} 
              isActive={isActive} 
              userRole={userRole}
              onCollapse={setIsSidebarCollapsed}
            />
          </div>
        )}

        {/* Main Content */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          !isProfilePage && (isSidebarCollapsed ? "md:ml-[54px]" : "md:ml-[218px]")
        )}>
          <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      {!isProfilePage && <BottomNav items={navigation} isActive={isActive} userRole={userRole} />}
    </div>
  )
}
