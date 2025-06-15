import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationItem } from "@/config/navigation"
import { cn } from "@/lib/utils"

interface BottomNavProps {
  items: NavigationItem[]
  isActive: (href: string) => boolean
}

export function BottomNav({ items, isActive }: BottomNavProps) {
  // Filter items to show only the ones we want in the bottom nav
  const bottomNavItems = items.filter(item => 
    ["Dashboard", "Subjects", "Assignments", "Schedule"].includes(item.name)
  )

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {bottomNavItems.map((item) => (
          <Button
            key={item.name}
            variant="ghost"
            size="icon"
            asChild
            className={cn(
              "group relative flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all duration-200",
              isActive(item.href) && "text-primary"
            )}
          >
            <Link to={item.href} className="relative flex flex-col items-center w-full">
              <div className={cn(
                "absolute inset-0 rounded-lg transition-all duration-200",
                isActive(item.href) 
                  ? "bg-primary/10" 
                  : "bg-transparent group-hover:bg-primary/5"
              )} />
              <div className="relative z-10">
                <item.icon className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive(item.href) && "text-primary",
                  "group-hover:text-primary/80"
                )} />
              </div>
              <span className={cn(
                "text-xs font-medium transition-all duration-200 relative z-10",
                isActive(item.href) ? "text-primary" : "text-muted-foreground",
                "group-hover:text-primary/80"
              )}>
                {item.name}
              </span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
} 