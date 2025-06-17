import { Outlet } from "react-router-dom"
import { BaseLayout } from "./BaseLayout"
import { navigationConfig } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"

export function HODLayout() {
  const { user, logout } = useAuth()

  const userInfo = {
    name: user?.name || "HOD Name",
    email: user?.email || "hod@example.com",
    initials: user?.name?.split(' ').map(n => n[0]).join('') || "HD",
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
      navigation={navigationConfig.hod}
      userRole="hod"
      userInfo={userInfo}
      onLogout={handleLogout}
    >
      <Outlet />
    </BaseLayout>
  )
}
