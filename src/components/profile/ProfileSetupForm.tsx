import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { StudentFields } from "./StudentFields"
import { FacultyFields } from "./FacultyFields"

export function ProfileSetupForm() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, checkProfileStatus } = useAuth()
  const role = (searchParams.get("role") || user?.role || "student") as 'student' | 'faculty' | 'hod'
  
  const [formData, setFormData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (user.profileComplete) {
      navigate(`/${user.role}/dashboard`)
      return
    }

    // Initialize form data based on role
    if (role === 'student') {
      setFormData({
        fullName: user.name || '',
        studentId: '',
        semester: '',
        batch: '',
        phoneNumber: '',
        address: '',
        guardianName: '',
        guardianPhone: ''
      })
    } else if (role === 'faculty' || role === 'hod') {
      setFormData({
        fullName: '',
        employeeId: '',
        designation: '',
        qualification: '',
        experienceYears: '',
        phoneNumber: '',
        address: '',
        specialization: ''
      })
    }
  }, [user, role, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    setIsLoading(true)

    try {
      // Update base profile with proper data
      const baseUpdateData = {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        address: formData.address,
        department: 'Centre for Computer Science & Application',
        updated_at: new Date().toISOString()
      }

      const { error: baseError } = await supabase
        .from('profiles')
        .update(baseUpdateData)
        .eq('id', user.id)

      if (baseError) throw baseError

      // Insert role-specific profile data
      if (role === 'student') {
        const { error: studentError } = await supabase
          .from('student_profiles')
          .insert({
            user_id: user.id,
            student_id: formData.studentId,
            semester: parseInt(formData.semester),
            batch: formData.batch,
            guardian_name: formData.guardianName,
            guardian_phone: formData.guardianPhone,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (studentError) throw studentError
      } else if (role === 'faculty' || role === 'hod') {
        const { error: facultyError } = await supabase
          .from('faculty_profiles')
          .insert({
            user_id: user.id,
            employee_id: formData.employeeId,
            designation: formData.designation,
            qualification: formData.qualification,
            experience_years: parseInt(formData.experienceYears) || 0,
            specialization: formData.specialization,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (facultyError) throw facultyError
      }

      await checkProfileStatus()

      toast({
        title: "Profile Setup Complete",
        description: "Your profile has been updated successfully.",
      })

      navigate(`/${role}/dashboard`)

    } catch (error: any) {
      console.error('Profile setup failed:', error)
      toast({
        title: "Profile Setup Failed",
        description: error.message || "There was an error setting up your profile.",
        variant: "destructive"
      })
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription>
          Please fill in your details to complete the setup process for CCSA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
            />
          </div>

          {role === 'student' && (
            <StudentFields 
              formData={formData} 
              setFormData={setFormData}
              isLoading={isLoading}
            />
          )}
          
          {(role === 'faculty' || role === 'hod') && (
            <FacultyFields 
              formData={formData} 
              setFormData={setFormData}
              isLoading={isLoading}
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
              rows={3}
              disabled={isLoading}
            />
          </div>

          <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
            <strong>Department:</strong> Centre for Computer Science & Application (CCSA)
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Setting up profile..." : "Complete Profile Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
