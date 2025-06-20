
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Calendar, Edit } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SubjectData {
  id: string
  name: string
  code: string
  credits: number
}

export default function StudentProfile() {
  const { profile, loading } = useProfile()
  const { toast } = useToast()
  const [enrolledSubjects, setEnrolledSubjects] = useState<SubjectData[]>([])

  useEffect(() => {
    if (profile) {
      fetchEnrolledSubjects()
    }
  }, [profile])

  const fetchEnrolledSubjects = async () => {
    if (!profile?.id) return

    try {
      const { data, error } = await supabase
        .from('student_subjects')
        .select(`
          subjects:subject_id (
            id,
            name,
            code,
            credits
          )
        `)
        .eq('student_id', profile.id)

      if (error) throw error

      const subjects = data?.map(item => item.subjects).filter(Boolean) || []
      setEnrolledSubjects(subjects as SubjectData[])
    } catch (error: any) {
      console.error('Error fetching subjects:', error)
      toast({
        title: "Error",
        description: "Failed to load enrolled subjects",
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

  // Type guard to check if profile has student-specific properties
  const isStudentProfile = (prof: any): prof is typeof profile & {
    student_id?: string
    semester?: number
    batch?: string
    guardian_name?: string
    guardian_phone?: string
  } => {
    return prof && prof.role === 'student'
  }

  const studentProfile = isStudentProfile(profile) ? profile : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your academic profile and information</p>
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
                {profile.full_name?.split(' ').map(n => n[0]).join('') || 'ST'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{profile.full_name || 'Student'}</CardTitle>
            <CardDescription>{studentProfile?.student_id || 'Student ID'}</CardDescription>
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
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{profile.department || 'Department'}</span>
            </div>
            {studentProfile?.semester && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Semester {studentProfile.semester}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your current academic status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{enrolledSubjects.length}</div>
                <div className="text-sm text-muted-foreground">Enrolled Subjects</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {enrolledSubjects.reduce((total, subject) => total + (subject.credits || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Credits</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{studentProfile?.semester || 'N/A'}</div>
                <div className="text-sm text-muted-foreground">Current Semester</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Enrolled Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {enrolledSubjects.length > 0 ? (
                  enrolledSubjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary">
                      {subject.code} - {subject.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No subjects enrolled yet</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Batch Information</h3>
              <p className="text-muted-foreground">{studentProfile?.batch || 'Not specified'}</p>
            </div>

            {studentProfile?.guardian_name && (
              <div>
                <h3 className="font-semibold mb-2">Guardian Information</h3>
                <p className="text-muted-foreground">
                  {studentProfile.guardian_name}
                  {studentProfile.guardian_phone && ` - ${studentProfile.guardian_phone}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
