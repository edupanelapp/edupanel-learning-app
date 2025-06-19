
import { useEffect, useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Mail, CheckCircle, Clock } from "lucide-react"
import { Logo } from "@/components/ui/Logo"
import { useAuth } from "@/hooks/useAuth"

export default function EmailVerification() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const email = searchParams.get("email") || ""
  const role = (searchParams.get("role") || "student") as 'student' | 'faculty' | 'hod'
  const [timeLeft, setTimeLeft] = useState(60)

  // Redirect if user is already authenticated and verified
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      navigate(`/${user.role}/dashboard`)
    }
  }, [user, loading, navigate])

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleResendEmail = async () => {
    // Here you could implement resend functionality if needed
    setTimeLeft(60)
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
        <Logo />
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="mt-2">
                We've sent a verification link to your email address
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                A verification email has been sent to:
              </p>
              <p className="font-medium text-foreground bg-muted px-3 py-2 rounded-md">
                {email}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Click the verification link</p>
                  <p className="text-muted-foreground">
                    Check your email and click the verification link to activate your account
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 text-sm">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Complete your profile</p>
                  <p className="text-muted-foreground">
                    After verification, you'll be redirected to complete your {role} profile
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or
              </p>
              
              <Button 
                variant="outline" 
                onClick={handleResendEmail}
                disabled={timeLeft > 0}
                className="w-full"
              >
                {timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend Email"}
              </Button>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Wrong email address?{" "}
                  <Link to={`/register?role=${role}`} className="text-primary hover:underline">
                    Try again
                  </Link>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
