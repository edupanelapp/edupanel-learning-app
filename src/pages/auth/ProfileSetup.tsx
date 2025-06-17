
import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"

export default function ProfileSetup() {
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
        fullName: '',
        studentId: '',
        department: '',
        semester: '',
        batch: '',
        phoneNumber: '',
        address: '',
        guardianName: '',
        guardianPhone: ''
      })
    } else if (role === 'faculty') {
      setFormData({
        fullName: '',
        employeeId: '',
        department: '',
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
      if (role === 'student') {
        // Insert student profile
        const { error: profileError } = await supabase
          .from('student_profiles')
          .insert({
            user_id: user.id,
            full_name: formData.fullName,
            student_id: formData.studentId,
            department: formData.department,
            semester: formData.semester ? parseInt(formData.semester) : null,
            batch: formData.batch,
            phone_number: formData.phoneNumber,
            address: formData.address,
            guardian_name: formData.guardianName,
            guardian_phone: formData.guardianPhone,
            is_complete: true
          })

        if (profileError) throw profileError

        // Create verification request
        const { error: verificationError } = await supabase
          .from('profile_verifications')
          .insert({
            applicant_id: user.id,
            role: 'student',
            status: 'pending'
          })

        if (verificationError) throw verificationError

      } else if (role === 'faculty') {
        // Insert faculty profile
        const { error: profileError } = await supabase
          .from('faculty_profiles')
          .insert({
            user_id: user.id,
            full_name: formData.fullName,
            employee_id: formData.employeeId,
            department: formData.department,
            designation: formData.designation,
            qualification: formData.qualification,
            experience_years: formData.experienceYears ? parseInt(formData.experienceYears) : null,
            phone_number: formData.phoneNumber,
            address: formData.address,
            specialization: formData.specialization,
            is_complete: true
          })

        if (profileError) throw profileError

        // Create verification request
        const { error: verificationError } = await supabase
          .from('profile_verifications')
          .insert({
            applicant_id: user.id,
            role: 'faculty',
            status: 'pending'
          })

        if (verificationError) throw verificationError
      }

      await checkProfileStatus()

      toast({
        title: "Profile Setup Complete",
        description: "Your profile is now under review.",
      })

      navigate(`/pending-approval?role=${role}`)

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

  const renderStudentFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            placeholder="Enter your student ID"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            placeholder="e.g., 2024-2028"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian Name</Label>
          <Input
            id="guardianName"
            value={formData.guardianName}
            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            placeholder="Enter guardian's name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardianPhone">Guardian Phone</Label>
          <Input
            id="guardianPhone"
            value={formData.guardianPhone}
            onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
            placeholder="Enter guardian's phone"
          />
        </div>
      </div>
    </>
  )

  const renderFacultyFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            placeholder="Enter employee ID"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Designation</Label>
          <Select value={formData.designation} onValueChange={(value) => setFormData({ ...formData, designation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
              <SelectItem value="Associate Professor">Associate Professor</SelectItem>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Lecturer">Lecturer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science">Computer Science</SelectItem>
              <SelectItem value="Information Technology">Information Technology</SelectItem>
              <SelectItem value="Electronics">Electronics</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Civil">Civil</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Experience (Years)</Label>
          <Input
            id="experienceYears"
            type="number"
            value={formData.experienceYears}
            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
            placeholder="Years of experience"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="qualification">Qualification</Label>
        <Input
          id="qualification"
          value={formData.qualification}
          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          placeholder="e.g., PhD in Computer Science"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Input
          id="specialization"
          value={formData.specialization}
          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
          placeholder="Your area of specialization"
        />
      </div>
    </>
  )

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
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>
              Please fill in your details to complete the setup process.
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

              {role === 'student' && renderStudentFields()}
              {role === 'faculty' && renderFacultyFields()}

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="Enter your phone number"
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
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Setting up profile..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
