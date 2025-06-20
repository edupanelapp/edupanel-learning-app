
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Users, Edit, Building } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function HODProfile() {
  const { profile, loading } = useProfile()
  const { toast } = useToast()
  const [departmentStats, setDepartmentStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalSubjects: 0
  })

  useEffect(() => {
    if (profile?.department) {
      fetchDepartmentStats()
    }
  }, [profile])

  const fetchDepartmentStats = async () => {
    if (!profile?.department) return

    try {
      // Count faculty in department
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('department', profile.department)
        .eq('role', 'faculty')

      // Count students in department  
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('department', profile.department)
        .eq('role', 'student')

      // Count subjects in department
      const { count: subjectCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('department', profile.department)

      setDepartmentStats({
        totalFaculty: facultyCount || 0,
        totalStudents: studentCount || 0,
        totalSubjects: subjectCount || 0
      })
    } catch (error: any) {
      console.error('Error fetching department stats:', error)
      toast({
        title: "Error",
        description: "Failed to load department statistics",
        variant: "destructive"
      })
    }
  }

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    )
  }

  // Type guard to check if profile has faculty-specific properties
  const isFacultyProfile = (prof: any): prof is typeof profile & {
    qualification?: string
    specialization?: string
    designation?: string
    employee_id?: string
    experience_years?: number
  } => {
    return prof && (prof.role === 'faculty' || prof.role === 'hod')
  }

  const facultyProfile = isFacultyProfile(profile) ? profile : null
  const qualifications = facultyProfile?.qualification ? facultyProfile.qualification.split(',').map(q => q.trim()) : []
  const specializations = facultyProfile?.specialization ? facultyProfile.specialization.split(',').map(s => s.trim()) : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HOD Profile</h1>
          <p className="text-muted-foreground">Department leadership and administrative profile</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
              <AvatarFallback className="text-lg">
                {profile.full_name?.split(' ').map(n => n[0]).join('') || 'HD'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{profile.full_name || 'HOD'}</CardTitle>
            <CardDescription>{facultyProfile?.designation || 'Head of Department'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.email}</span>
            </div>
            {profile.phone_number && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{profile.phone_number}</span>
              </div>
            )}
            {facultyProfile?.employee_id && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{facultyProfile.employee_id}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.department || 'Department'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Leadership responsibilities and department statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{departmentStats.totalFaculty}</div>
                <div className="text-sm text-muted-foreground">Total Faculty</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{departmentStats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{departmentStats.totalSubjects}</div>
                <div className="text-sm text-muted-foreground">Total Subjects</div>
              </div>
            </div>

            {qualifications.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Qualifications</h3>
                <div className="flex flex-wrap gap-2">
                  {qualifications.map((qualification, index) => (
                    <Badge key={index} variant="secondary">{qualification}</Badge>
                  ))}
                </div>
              </div>
            )}

            {specializations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Areas of Specialization</h3>
                <div className="flex flex-wrap gap-2">
                  {specializations.map((area, index) => (
                    <Badge key={index} variant="outline">{area}</Badge>
                  ))}
                </div>
              </div>
            )}

            {facultyProfile?.experience_years && (
              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-muted-foreground">{facultyProfile.experience_years} years in academia and administration</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
