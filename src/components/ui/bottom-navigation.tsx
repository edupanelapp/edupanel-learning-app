
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface BottomNavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface BottomNavigationProps {
  items: BottomNavItem[]
  className?: string
}

export function BottomNavigation({ items, className }: BottomNavigationProps) {
  const location = useLocation()

  const isActive = (href: string) => location.pathname === href

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t md:hidden",
      className
    )}>
      <div className="flex items-center justify-around h-16 px-4">
        {items.map((item) => (
          <Button
            key={item.name}
            variant={isActive(item.href) ? "default" : "ghost"}
            size="sm"
            asChild
            className="flex flex-col h-12 w-12 p-0"
          >
            <Link to={item.href}>
              <item.icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
