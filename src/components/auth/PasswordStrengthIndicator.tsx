
import { Progress } from "@/components/ui/progress"

interface PasswordStrengthIndicatorProps {
  password: string
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const calculateStrength = (password: string): { score: number; text: string; color: string } => {
    if (!password) return { score: 0, text: "", color: "" }
    
    let score = 0
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
    
    score = Object.values(checks).filter(Boolean).length
    
    if (score <= 2) return { score: (score / 5) * 100, text: "Weak", color: "bg-red-500" }
    if (score <= 3) return { score: (score / 5) * 100, text: "Fair", color: "bg-yellow-500" }
    if (score <= 4) return { score: (score / 5) * 100, text: "Good", color: "bg-blue-500" }
    return { score: (score / 5) * 100, text: "Strong", color: "bg-green-500" }
  }

  const strength = calculateStrength(password)

  if (!password) return null

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Password Strength</span>
        <span className={`font-medium ${
          strength.text === "Weak" ? "text-red-500" :
          strength.text === "Fair" ? "text-yellow-500" :
          strength.text === "Good" ? "text-blue-500" :
          "text-green-500"
        }`}>
          {strength.text}
        </span>
      </div>
      <Progress value={strength.score} className="h-2" />
    </div>
  )
}
