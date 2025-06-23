import { Outlet } from "react-router-dom"
import { useMemo, useCallback } from "react"
import { BaseLayout } from "./BaseLayout"
import { navigationConfig } from "@/config/navigation"
import { useHODAuth } from "@/hooks/useHODAuth"

export function HODLayout() {
  const { hodUser, hodLogout } = useHODAuth()

  const userInfo = useMemo(() => ({
    name: hodUser?.name || "HOD Name",
    email: hodUser?.email || "hod@ccsa.edu.in",
    initials: hodUser?.name?.split(' ').map(n => n[0]).join('') || "HD",
    avatar: hodUser?.avatar
  }), [hodUser?.name, hodUser?.email, hodUser?.avatar])

  const handleLogout = useCallback(async () => {
    try {
      hodLogout()
    } catch (error) {
      console.error('HOD Logout failed:', error)
      throw error
    }
  }, [hodLogout])

  return (
    <BaseLayout
      navigation={navigationConfig.hod}
      userRole="hod"
      userInfo={userInfo}
      onLogout={handleLogout}
    />
  )
}
