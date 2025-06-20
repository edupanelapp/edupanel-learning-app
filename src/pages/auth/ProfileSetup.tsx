
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap } from "lucide-react"
import { ProfileSetupForm } from "@/components/profile/ProfileSetupForm"

export default function ProfileSetup() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">EduPanel Learning Hub</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <ProfileSetupForm />
      </div>
    </div>
  )
}
