import { Outlet } from "react-router-dom"
import { BaseLayout } from "./BaseLayout"
import { navigationConfig } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"

export function StudentLayout() {
  const { user, logout } = useAuth()

  // This would typically come from your auth context/state management
  const userInfo = {
    name: user?.name || "Student Name",
    email: user?.email || "student@example.com",
    initials: user?.name?.split(' ').map(n => n[0]).join('') || "ST",
    avatar: user?.avatar
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  return (
    <BaseLayout
      navigation={navigationConfig.student}
      userRole="student"
      userInfo={userInfo}
      onLogout={handleLogout}
    >
      <Outlet />
    </BaseLayout>
  )
}
