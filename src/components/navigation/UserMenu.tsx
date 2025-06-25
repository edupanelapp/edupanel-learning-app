import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut } from "lucide-react"
import { userMenuItems, navigationConfig } from "@/config/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

interface UserMenuProps {
  userInfo: {
    name: string
    email: string
    avatar?: string
    initials: string
  }
  profileUrl: string
  onLogout: () => void
  userRole: "student" | "faculty" | "hod"
  sidebarActive?: boolean
}

export function UserMenu({ userInfo, profileUrl, onLogout, userRole, sidebarActive = false }: UserMenuProps) {
  const menuItems = userMenuItems[userRole] || []
  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Get all navigation items for this role
  const allNavItems = navigationConfig[userRole] || []
  
  // Define which items appear in bottom navigation for each role
  const bottomNavItems = {
    student: ["Dashboard", "Subjects", "Assignments", "Schedule", "Projects"],
    faculty: ["Dashboard", "Subjects", "Assignments", "Students", "Approvals"],
    hod: ["Dashboard", "Approvals", "Faculty", "Students"]
  }
  
  // Get remaining items that don't appear in bottom navigation
  const bottomNavItemNames = bottomNavItems[userRole] || []
  const remainingNavItems = allNavItems.filter(item => !bottomNavItemNames.includes(item.name))
  
  // Filter out Reports and Schedule for HOD when sidebar is active (desktop)
  const filteredMenuItems = userRole === "hod" && sidebarActive 
    ? menuItems.filter(item => !["Reports", "Schedule"].includes(item.name))
    : menuItems

  // Show remaining navigation items in dropdown only on mobile when bottom nav is active
  const shouldShowRemainingNav = isMobile && !sidebarActive

  // Debug logging
  console.log('UserMenu Debug:', {
    userRole,
    isMobile,
    sidebarActive,
    shouldShowRemainingNav,
    bottomNavItemNames,
    remainingNavItems: remainingNavItems.map(item => item.name),
    allNavItems: allNavItems.map(item => item.name),
    menuItems: menuItems.map(item => item.name),
    filteredMenuItems: filteredMenuItems.map(item => item.name)
  })

  // Corrected logic: Show remaining nav items on mobile when not on profile page
  const showRemainingNav = isMobile && sidebarActive

  // For faculty: on mobile, show only Students and Approvals (from navigationConfig) in dropdown, always Profile and Logout at the bottom
  let dropdownNavItems: any[] = []
  if (userRole === 'faculty' && isMobile && !sidebarActive) {
    dropdownNavItems = allNavItems.filter(item => ["Students", "Approvals"].includes(item.name))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {userInfo.avatar ? (
              <img src={userInfo.avatar} alt={userInfo.name} />
            ) : (
              <AvatarFallback>{userInfo.initials}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={profileUrl} className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        {/* Show Students and Approvals for faculty on mobile */}
        {dropdownNavItems.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {dropdownNavItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link to={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
        {/* Regular menu items (from userMenuItems config) for other roles */}
        {userRole !== 'faculty' && filteredMenuItems.length > 0 && (
          <>
            {shouldShowRemainingNav && <DropdownMenuSeparator />}
            {filteredMenuItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link to={item.href} className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </DropdownMenuItem>
            ))}
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 