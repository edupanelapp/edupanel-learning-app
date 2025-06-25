import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationItem } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  items: NavigationItem[]
  isActive: (href: string) => boolean
  userRole: "student" | "faculty" | "hod"
}

export function BottomNav({ items, isActive, userRole }: BottomNavProps) {
  // Filter items to show only the most important ones in the bottom nav
  const bottomNavItems = items.filter(item => {
    const roleSpecificItems = {
      student: ["Dashboard", "Subjects", "Assignments", "Schedule", "Projects"],
      faculty: ["Dashboard", "Subjects", "Assignments", "Projects", "Schedule"],
      hod: ["Dashboard", "Approvals", "Faculty", "Students"]
    }
    const roleItems = roleSpecificItems[userRole] || []
    return roleItems.includes(item.name)
  })

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden shadow-lg">
      <div className="flex h-16 items-center justify-around px-2">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Button
              key={item.name}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                "group relative flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 h-14 w-full max-w-20 transition-all duration-300 ease-in-out",
                active && "text-primary"
              )}
            >
              <Link to={item.href} className="relative flex flex-col items-center justify-center w-full h-full">
                {/* Active indicator */}
                <div className={cn(
                  "absolute inset-0 rounded-xl transition-all duration-300 ease-in-out",
                  active 
                    ? "bg-primary/10 border border-primary/20" 
                    : "bg-transparent group-hover:bg-primary/5"
                )} />
                
                {/* Icon container */}
                <div className="relative z-10 flex items-center justify-center">
                  <item.icon className={cn(
                    "h-5 w-5 transition-all duration-300 ease-in-out",
                    active 
                      ? "text-primary scale-110" 
                      : "text-muted-foreground group-hover:text-primary/80 group-hover:scale-105"
                  )} />
                </div>
                
                {/* Label */}
                <span className={cn(
                  "text-xs font-medium transition-all duration-300 ease-in-out relative z-10 leading-tight",
                  active 
                    ? "text-primary font-semibold" 
                    : "text-muted-foreground group-hover:text-primary/80"
                )}>
                  {item.name}
                </span>
                
                {/* Active dot indicator */}
                {active && (
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                )}
              </Link>
            </Button>
          )
        })}
      </div>
      
      {/* Safe area for devices with home indicator */}
      <div className="h-safe-area-inset-bottom bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" />
    </nav>
  )
} 