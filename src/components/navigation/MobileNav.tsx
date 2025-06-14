import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationItem } from "@/config/navigation"

interface MobileNavProps {
  items: NavigationItem[]
  isActive: (href: string) => boolean
}

export function MobileNav({ items, isActive }: MobileNavProps) {
  return (
    <nav className="md:hidden border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto py-2">
          {items.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.href) ? "default" : "ghost"}
              size="sm"
              asChild
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
} 