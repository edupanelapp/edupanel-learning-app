import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Users, Edit, Building, Shield } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function HODProfile() {
  const { hodUser } = useHODAuth()
  const { toast } = useToast()
  const [departmentStats, setDepartmentStats] = useState({
    totalFaculty: 0,
    totalStudents: 0,
    totalSubjects: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hodUser) {
      fetchDepartmentStats()
    }
  }, [hodUser])

  const fetchDepartmentStats = async () => {
    console.log('fetchDepartmentStats: START');
    console.log('fetchDepartmentStats: hodUser =', hodUser);
    if (!hodUser) {
      console.log('fetchDepartmentStats: No hodUser, returning early');
      return;
    }
    try {
      console.log('fetchDepartmentStats: Fetching faculty count...');
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('department', 'Centre for Computer Science & Application')
        .eq('role', 'faculty');
      console.log('fetchDepartmentStats: facultyCount =', facultyCount);
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('department', 'Centre for Computer Science & Application')
        .eq('role', 'student');
      console.log('fetchDepartmentStats: studentCount =', studentCount);
      const { count: subjectCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('department', 'Centre for Computer Science & Application');
      console.log('fetchDepartmentStats: subjectCount =', subjectCount);
      setDepartmentStats({
        totalFaculty: facultyCount || 0,
        totalStudents: studentCount || 0,
        totalSubjects: subjectCount || 0
      });
      console.log('fetchDepartmentStats: Department stats set');
    } catch (error) {
      console.error('fetchDepartmentStats: Caught error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load department statistics',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      console.log('fetchDepartmentStats: Setting loading to false');
      console.log('fetchDepartmentStats: END');
    }
  };

  if (loading || !hodUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HOD Profile</h1>
          <p className="text-muted-foreground">Department leadership and administrative profile</p>
        </div>
        <Button disabled>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={hodUser.avatar || ""} alt={hodUser.name || ""} />
              <AvatarFallback className="text-lg">
                {hodUser.name?.split(' ').map(n => n[0]).join('') || 'HD'}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{hodUser.name || 'HOD'}</CardTitle>
            <CardDescription>Head of Department</CardDescription>
            <Badge variant="secondary" className="mt-2">
              <Shield className="h-3 w-3 mr-1" />
              Administrative Access
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{hodUser.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">HOD Admin ID</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Centre for Computer Science & Application</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Full Administrative Access</span>
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

            <div>
              <h3 className="font-semibold mb-3">Administrative Responsibilities</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Faculty Management</Badge>
                  <span className="text-sm text-muted-foreground">- Approve faculty profiles and assignments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Student Oversight</Badge>
                  <span className="text-sm text-muted-foreground">- Monitor student progress and performance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Curriculum Management</Badge>
                  <span className="text-sm text-muted-foreground">- Oversee subject and course management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Department Reports</Badge>
                  <span className="text-sm text-muted-foreground">- Generate and review department analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Announcements</Badge>
                  <span className="text-sm text-muted-foreground">- Create department-wide communications</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Access Level</h3>
              <p className="text-muted-foreground">Full administrative access to all department functions including faculty approvals, student management, and department analytics.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 