import { useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordStrengthIndicator } from "@/components/auth/PasswordStrengthIndicator"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Logo } from "@/components/ui/Logo"
import { useAuth } from "@/hooks/useAuth"

export default function Register() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { register } = useAuth()
  const role = (searchParams.get("role") || "student") as 'student' | 'faculty' | 'hod'
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    const { error } = await register(formData.email, formData.password, role)
    setIsLoading(false)

    if (error) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive"
      })
      return
    }

    // Success handled in useAuth hook
    navigate(`/login?role=${role}`)
  }

  const getRoleTitle = () => {
    switch (role) {
      case "student": return "Student Registration"
      case "faculty": return "Faculty Registration" 
      case "hod": return "HOD Registration"
      default: return "Registration"
    }
  }

  const getRoleDescription = () => {
    switch (role) {
      case "student": return "Create your student account to access courses and assignments"
      case "faculty": return "Join as faculty to manage courses and mentor students"
      case "hod": return "Department head registration (admin approval required)"
      default: return "Create your account"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2 mb-2">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <CardTitle className="text-2xl">{getRoleTitle()}</CardTitle>
            </div>
            <CardDescription>
              {getRoleDescription()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <PasswordStrengthIndicator password={formData.password} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to={`/login?role=${role}`} className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
