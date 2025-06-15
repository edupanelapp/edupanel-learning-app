
import { useState, useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

export default function Login() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login, user, loading } = useAuth()
  const role = searchParams.get("role") || "student"
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  // Redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      if (!user.emailVerified) {
        toast({
          title: "Email Verification Required",
          description: "Please check your email and verify your account.",
          variant: "destructive"
        })
        return
      }

      if (!user.profileComplete) {
        navigate(`/profile-setup?role=${user.role}`)
        return
      }

      if (user.approvalStatus === 'pending') {
        navigate(`/pending-approval?role=${user.role}`)
        return
      }

      if (user.approvalStatus === 'rejected') {
        toast({
          title: "Account Rejected",
          description: "Your profile was rejected. Please contact support.",
          variant: "destructive"
        })
        return
      }

      // Redirect to dashboard
      navigate(`/${user.role}/dashboard`)
    }
  }, [user, loading, navigate, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsLoading(true)
    const { error } = await login(formData.email, formData.password)
    setIsLoading(false)

    if (error) {
      toast({
        title: "Login Failed",
        description: error,
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Login Successful",
      description: "Welcome back to EduPanel!",
    })
  }

  const getRoleTitle = () => {
    switch (role) {
      case "student": return "Student Login"
      case "faculty": return "Faculty Login"
      case "hod": return "HOD Login"
      default: return "Login"
    }
  }

  const getRoleDescription = () => {
    switch (role) {
      case "student": return "Access your courses, assignments, and learning materials"
      case "faculty": return "Manage your courses and mentor your students"
      case "hod": return "Administrative access for department management"
      default: return "Sign in to your account"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">EduPanel Learning Hub</span>
        </Link>
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
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {role !== "hod" && (
              <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link to={`/register?role=${role}`} className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            )}

            {role === "hod" && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                HOD accounts are created by administrators only.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
