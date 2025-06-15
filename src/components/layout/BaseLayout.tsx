
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Bell } from "lucide-react"
import { GraduationCap } from "lucide-react"
import { NavigationItem } from "@/config/navigation"
import { DesktopNav } from "@/components/navigation/DesktopNav"
import { MobileNav } from "@/components/navigation/MobileNav"
import { UserMenu } from "@/components/navigation/UserMenu"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { useToast } from "@/components/ui/use-toast"

interface BaseLayoutProps {
  navigation: NavigationItem[]
  userRole: "student" | "faculty" | "hod"
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
  const isActive = (href: string) => location.pathname === href

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
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate(`/${userRole}/dashboard`)}>
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-primary hidden sm:block">
                EduPanel Learning Hub
              </span>
            </div>

            {/* Desktop Navigation */}
            <DesktopNav items={navigation} isActive={isActive} />

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <ThemeToggle />
              
              <UserMenu 
                userInfo={userInfo}
                profileUrl={`/${userRole}/profile`}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav items={navigation} isActive={isActive} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation items={navigation} />
    </div>
  )
}
