import { BaseLayout } from "./BaseLayout"
import { navigationConfig } from "@/config/navigation"
import { useAuth } from "@/hooks/useAuth"
import { StudentAIChatButton } from "@/components/chat/StudentAIChatButton"
import { AIChatProvider } from "@/components/chat/AIChatContext"

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
    <AIChatProvider>
      <BaseLayout
        navigation={navigationConfig.student}
        userRole="student"
        userInfo={userInfo}
        onLogout={handleLogout}
      />
      <StudentAIChatButton />
    </AIChatProvider>
  )
}
