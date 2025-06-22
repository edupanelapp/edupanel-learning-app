
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, UserCheck, Clock, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalSubjects: number
  totalFaculty: number
  totalStudents: number
  pendingApprovals: number
}

interface PendingApproval {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
}

interface RecentActivity {
  id: string
  type: string
  message: string
  created_at: string
}

export default function HODDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalFaculty: 0,
    totalStudents: 0,
    pendingApprovals: 0
  })
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch subjects count
      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('department', 'Centre for Computer Science & Application')

      // Fetch faculty count (approved)
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application')

      // Fetch students count
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .eq('department', 'Centre for Computer Science & Application')

      // Fetch HOD count (should be just us, but for completeness)
      const { count: hodCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'hod')
        .eq('department', 'Centre for Computer Science & Application')

      // Fetch pending faculty approvals (profiles without faculty_profiles)
      const { data: pendingFaculty } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application')
        .not('id', 'in', 
          supabase
            .from('faculty_profiles')
            .select('user_id')
        )
        .order('created_at', { ascending: false })
        .limit(5)

      setPendingApprovals(pendingFaculty || [])

      setStats({
        totalSubjects: subjectsCount || 0,
        totalFaculty: (facultyCount || 0) + (hodCount || 0),
        totalStudents: studentsCount || 0,
        pendingApprovals: (pendingFaculty || []).length
      })

      // Fetch recent notifications as activities
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id, title, message, created_at, type')
        .or(`sender_id.eq.${user.id},target_audience.eq.faculty,target_audience.eq.all`)
        .order('created_at', { ascending: false })
        .limit(5)

      const activities = notifications?.map(notif => ({
        id: notif.id,
        type: notif.type || 'announcement',
        message: notif.title,
        created_at: notif.created_at
      })) || []

      setRecentActivities(activities)

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveFaculty = async (facultyId: string) => {
    try {
      // Create faculty profile to "approve" them
      const { error } = await supabase
        .from('faculty_profiles')
        .insert({
          user_id: facultyId,
          designation: 'Assistant Professor',
          qualification: 'To be updated',
          specialization: 'To be updated'
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Faculty member approved successfully",
      })

      fetchDashboardData() // Refresh data
    } catch (error: any) {
      console.error('Error approving faculty:', error)
      toast({
        title: "Error",
        description: "Failed to approve faculty member",
        variant: "destructive"
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  const statsCards = [
    { title: "Total Subjects", value: stats.totalSubjects.toString(), icon: BookOpen, color: "text-blue-600" },
    { title: "Faculty Members", value: stats.totalFaculty.toString(), icon: Users, color: "text-green-600" },
    { title: "Total Students", value: stats.totalStudents.toString(), icon: Users, color: "text-purple-600" },
    { title: "Pending Approvals", value: stats.pendingApprovals.toString(), icon: UserCheck, color: "text-orange-600" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">Overview of your department's academic activities</p>
        </div>
        <Button onClick={() => window.location.href = '/hod/approvals'}>
          <UserCheck className="h-4 w-4 mr-2" />
          Review Approvals
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Faculty Approvals
            </CardTitle>
            <CardDescription>Faculty members awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.length > 0 ? (
                pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{approval.full_name || approval.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Applied {formatTimeAgo(approval.created_at)}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = `/hod/approvals`}
                      >
                        View
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleApproveFaculty(approval.id)}
                      >
                        Approve
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No pending approvals</p>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => window.location.href = '/hod/approvals'}
            >
              View All Approvals
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your recent departmental actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimeAgo(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent activities</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Quick insights into your department's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.totalFaculty > 0 ? Math.round((stats.totalFaculty - stats.pendingApprovals) / stats.totalFaculty * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Faculty Approval Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.totalStudents > 0 ? Math.round(stats.totalStudents / stats.totalSubjects) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Students per Subject</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalSubjects}</div>
              <div className="text-sm text-muted-foreground">Active Subjects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
