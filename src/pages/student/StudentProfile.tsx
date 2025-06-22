
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Calendar, Edit, GraduationCap } from "lucide-react"
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
  const [profileStats, setProfileStats] = useState({
    totalCredits: 0,
    completedAssignments: 0,
    averageGrade: 0
  })

  useEffect(() => {
    if (profile) {
      fetchStudentData()
    }
  }, [profile])

  const fetchStudentData = async () => {
    if (!profile?.id) return

    try {
      // Fetch enrolled subjects
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

      // Calculate total credits
      const totalCredits = subjects.reduce((sum, subject) => sum + (subject?.credits || 0), 0)

      // Fetch completed assignments count
      const { count: completedCount } = await supabase
        .from('assignment_submissions')
        .select('*', { count: 'exact', head: true })
        .eq('student_id', profile.id)
        .eq('status', 'submitted')

      // Fetch average marks
      const { data: submissionData } = await supabase
        .from('assignment_submissions')
        .select('marks_obtained, assignments!inner(max_marks)')
        .eq('student_id', profile.id)
        .not('marks_obtained', 'is', null)

      let averageGrade = 0
      if (submissionData && submissionData.length > 0) {
        const totalPercentage = submissionData.reduce((sum, submission) => {
          const percentage = (submission.marks_obtained / submission.assignments.max_marks) * 100
          return sum + percentage
        }, 0)
        averageGrade = totalPercentage / submissionData.length
      }

      setProfileStats({
        totalCredits,
        completedAssignments: completedCount || 0,
        averageGrade: Math.round(averageGrade)
      })

    } catch (error: any) {
      console.error('Error fetching student data:', error)
      toast({
        title: "Error",
        description: "Failed to load student data",
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
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-muted-foreground">Manage your academic profile at CCSA</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 border-primary/20">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name || ""} />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {profile.full_name?.split(' ').map(n => n[0]).join('') || 'ST'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-primary">{profile.full_name || 'Student'}</CardTitle>
            <CardDescription>{studentProfile?.student_id || 'Student ID'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm">{profile.email}</span>
            </div>
            {profile.phone_number && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.phone_number}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm">Centre for Computer Science & Application</span>
            </div>
            {studentProfile?.semester && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm">Semester {studentProfile.semester}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Academic Information</CardTitle>
            <CardDescription>Your current academic status and progress at CCSA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{enrolledSubjects.length}</div>
                <div className="text-sm text-muted-foreground">Enrolled Subjects</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{profileStats.totalCredits}</div>
                <div className="text-sm text-muted-foreground">Total Credits</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{profileStats.averageGrade}%</div>
                <div className="text-sm text-muted-foreground">Average Grade</div>
              </div>
            </div>

            <div>
              <h3 className="font-semib old mb-3 text-primary">Enrolled Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {enrolledSubjects.length > 0 ? (
                  enrolledSubjects.map((subject) => (
                    <Badge key={subject.id} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {subject.code} - {subject.name}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No subjects enrolled yet</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-primary">Performance Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completed Assignments:</span>
                  <span className="font-medium text-primary">{profileStats.completedAssignments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Semester:</span>
                  <span className="font-medium text-primary">{studentProfile?.semester || 'Not specified'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Batch:</span>
                  <span className="font-medium text-primary">{studentProfile?.batch || 'Not specified'}</span>
                </div>
              </div>
            </div>

            {studentProfile?.guardian_name && (
              <div>
                <h3 className="font-semibold mb-2 text-primary">Guardian Information</h3>
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
