import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { NavigationItem } from "@/config/navigation"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SidebarProps {
  items: NavigationItem[]
  isActive: (href: string) => boolean
  userRole: "student" | "faculty" | "hod"
  onCollapse?: (collapsed: boolean) => void
}

export function Sidebar({ items, isActive, userRole, onCollapse }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    onCollapse?.(isCollapsed)
  }, [isCollapsed, onCollapse])

  const handleCollapse = () => {
    setIsTransitioning(true)
    setIsCollapsed(!isCollapsed)
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 300) // Match the duration of the transition
  }

  // Filter items based on screen size and user role
  const filteredItems = items.filter(item => {
    if (isMobile && userRole === "faculty") {
      return !["Students", "Approvals"].includes(item.name)
    }
    return true
  })

  return (
    <div
      className={cn(
        "fixed h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300",
        isCollapsed ? "w-[54px]" : "w-[218px]"
      )}
    >
      <div className="flex h-full flex-col">
        <nav 
          className={cn(
            "flex-1 space-y-1 p-2",
            !isTransitioning && "overflow-y-auto",
            "scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          )}
        >
          {filteredItems.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.href) ? "default" : "ghost"}
              asChild
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Link to={item.href}>
                <item.icon className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">{item.name}</span>}
              </Link>
            </Button>
          ))}
        </nav>

        {/* Collapse button at the bottom */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapse}
            className="w-full justify-center"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 