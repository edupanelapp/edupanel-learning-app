import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navigation() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">EduPanel Learning Hub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-muted-foreground hover:text-primary transition-colors",
                isActive("/") && "text-primary font-medium"
              )}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className={cn(
                "text-muted-foreground hover:text-primary transition-colors",
                isActive("/features") && "text-primary font-medium"
              )}
            >
              Features
            </Link>
            <Link 
              to="/about" 
              className={cn(
                "text-muted-foreground hover:text-primary transition-colors",
                isActive("/about") && "text-primary font-medium"
              )}
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login?role=student">Student Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
