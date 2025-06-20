
import { Outlet } from "react-router-dom"
import { BaseLayout } from "./BaseLayout"
import { navigationConfig } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"

export function FacultyLayout() {
  const { user, logout } = useAuth()

  const userInfo = {
    name: user?.name || "Faculty Name",
    email: user?.email || "faculty@example.com",
    initials: user?.name?.split(' ').map(n => n[0]).join('') || "FC",
    avatar: user?.avatar
  }

  const handleLogout = async () => {
    try {
      await logout()
      // Redirect to home page after logout
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return (
    <BaseLayout
      navigation={navigationConfig.faculty}
      userRole="faculty"
      userInfo={userInfo}
      onLogout={handleLogout}
    />
  )
}
