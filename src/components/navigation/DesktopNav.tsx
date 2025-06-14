import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationItem } from "@/config/navigation"

interface DesktopNavProps {
  items: NavigationItem[]
  isActive: (href: string) => boolean
}

export function DesktopNav({ items, isActive }: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center space-x-1">
      {items.map((item) => (
        <Button
          key={item.name}
          variant={isActive(item.href) ? "default" : "ghost"}
          asChild
          className="flex items-center space-x-2"
        >
          <Link to={item.href}>
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
} 