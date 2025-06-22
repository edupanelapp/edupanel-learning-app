
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Users, Edit, Award, GraduationCap } from "lucide-react"
import { useProfile } from "@/hooks/useProfile"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface FacultyStats {
  totalStudents: number
  assignmentsCreated: number
  projectsMentored: number
  subjectsTaught: string[]
}

export default function FacultyProfile() {
  const { profile, loading } = useProfile()
  const { toast } = useToast()
  const [facultyStats, setFacultyStats] = useState<FacultyStats>({
    totalStudents: 0,
    assignmentsCreated: 0,
    projectsMentored: 0,
    subjectsTaught: []
  })

  useEffect(() => {
    if (profile) {
      fetchFacultyData()
    }
  }, [profile])

  const fetchFacultyData = async () => {
    if (!profile?.id) return

    try {
      // Fetch subjects taught
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('id, name, code')
        .eq('faculty_id', profile.id)

      const subjectNames = subjectsData?.map(s => s.name) || []
      const subjectIds = subjectsData?.map(s => s.id) || []

      // Fetch total students
      const { count: studentCount } = await supabase
        .from('student_subjects')
        .select('*', { count: 'exact', head: true })
        .in('subject_id', subjectIds)

      // Fetch assignments created
      const { count: assignmentCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('faculty_id', profile.id)

      // Fetch projects mentored
      const { count: projectCount } = await supabase
        .from('project_ideas')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', profile.id)

      setFacultyStats({
        totalStudents: studentCount || 0,
        assignmentsCreated: assignmentCount || 0,
        projectsMentored: projectCount || 0,
        subjectsTaught: subjectNames
      })

    } catch (error: any) {
      console.error('Error fetching faculty data:', error)
      toast({
        title: "Error",
        description: "Failed to load faculty data",
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

  // Type guard for faculty profile
  const isFacultyProfile = (prof: any): prof is typeof profile & {
    employee_id?: string
    designation?: string
    qualification?: string
    experience_years?: number
    specialization?: string
  } => {
    return prof && (prof.role === 'faculty' || prof.role === 'hod')
  }

  const facultyProfile = isFacultyProfile(profile) ? profile : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Faculty Profile</h1>
          <p className="text-muted-foreground">Your professional academic profile at CCSA</p>
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
                {profile.full_name?.split(' ').map(n => n[0]).join('') || 'FC'}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-primary">{profile.full_name || 'Faculty Member'}</CardTitle>
            <CardDescription>{facultyProfile?.designation || 'Faculty'}</CardDescription>
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
            {facultyProfile?.employee_id && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-primary" />
                <span className="text-sm">{facultyProfile.employee_id}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm">Centre for Computer Science & Application</span>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Professional Information</CardTitle>
            <CardDescription>Your teaching responsibilities and achievements at CCSA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{facultyStats.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{facultyStats.assignmentsCreated}</div>
                <div className="text-sm text-muted-foreground">Assignments Created</div>
              </div>
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="text-2xl font-bold text-primary">{facultyStats.projectsMentored}</div>
                <div className="text-sm text-muted-foreground">Projects Mentored</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-primary">Subjects Teaching</h3>
              <div className="flex flex-wrap gap-2">
                {facultyStats.subjectsTaught.length > 0 ? (
                  facultyStats.subjectsTaught.map((subject, index) => (
                    <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {subject}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">No subjects assigned yet</span>
                )}
              </div>
            </div>

            {facultyProfile?.qualification && (
              <div>
                <h3 className="font-semibold mb-3 text-primary">Qualifications</h3>
                <Badge variant="outline" className="border-primary text-primary">
                  {facultyProfile.qualification}
                </Badge>
              </div>
            )}

            {facultyProfile?.specialization && (
              <div>
                <h3 className="font-semibold mb-3 text-primary">Specialization</h3>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  {facultyProfile.specialization}
                </Badge>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2 text-primary">Experience</h3>
              <p className="text-muted-foreground">
                {facultyProfile?.experience_years ? `${facultyProfile.experience_years} years` : 'Not specified'} in academia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
