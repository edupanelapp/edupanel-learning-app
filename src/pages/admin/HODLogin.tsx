import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Shield, Lock, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react"

export default function HODLogin() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAttempts(0)
    try {
      console.log('HODLogin: Attempting login with', formData.email)
      // 1. Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      console.log('HODLogin: Auth result', { authData, authError })
      if (authError) {
        toast({
          title: "Authentication Failed",
          description: authError.message || "Please check your email and password.",
          variant: "destructive"
        })
        setIsLoading(false)
        setAttempts(prev => prev + 1)
        return
      }
      if (!authData?.user) {
        toast({
          title: "Authentication Failed",
          description: "No user returned from Supabase.",
          variant: "destructive"
        })
        setIsLoading(false)
        setAttempts(prev => prev + 1)
        return
      }
      // 2. HOD Table Check
      const { data: hodData, error: hodError } = await supabase
        .from('hods')
        .select('user_id')
        .eq('user_id', authData.user.id)
        .single()
      console.log('HODLogin: HOD table result', { hodData, hodError })
      if (hodError || !hodData) {
        await supabase.auth.signOut()
        toast({
          title: "Access Denied",
          description: "You are not authorized to access the HOD panel.",
          variant: "destructive"
        })
        setIsLoading(false)
        setAttempts(prev => prev + 1)
        return
      }
      // 3. Success: Redirect
      console.log('HODLogin: Success! About to show toast and navigate')
      toast({
        title: "Access Granted",
        description: "Welcome to the HOD Panel!",
      })
      setIsLoading(false)
      console.log('HODLogin: Navigating to /hod/dashboard')
      navigate('/hod/dashboard')
      console.log('HODLogin: Navigation called')
    } catch (error: any) {
      console.error('HODLogin: Unexpected error:', error)
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
      setAttempts(prev => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                HOD Login Portal
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Restricted administrative access for Head of Department
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Administrative Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email here..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  autoComplete="username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Administrative Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password here..."
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={isLoading}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>
              {attempts > 0 && (
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Failed attempts: {attempts}</span>
                </div>
              )}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Access HOD Panel</span>
                  </div>
                )}
              </Button>
            </form>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-xs text-gray-500">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <Shield className="h-3 w-3" />
                  <span>Secure Administrative Access</span>
                </div>
                <p>This portal is restricted to authorized department heads only.</p>
                <p className="mt-1">For access issues, contact the system administrator.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 