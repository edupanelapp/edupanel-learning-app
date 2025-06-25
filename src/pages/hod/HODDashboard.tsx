import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, UserCheck, Clock, TrendingUp } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalSubjects: number
  totalFaculty: number
  totalStudents: number
}

interface RecentActivity {
  id: string
  type: string
  message: string
  created_at: string
}

export default function HODDashboard() {
  const { hodUser } = useHODAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalFaculty: 0,
    totalStudents: 0
  })
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hodUser) {
      fetchDashboardData()
    }
  }, [hodUser])

  const fetchDashboardData = async () => {
    console.log('fetchDashboardData: START');
    console.log('fetchDashboardData: hodUser =', hodUser);
    if (!hodUser) {
      console.log('fetchDashboardData: No hodUser, returning early');
      return;
    }
    try {
      console.log('fetchDashboardData: Fetching subjects count...');
      const { count: subjectsCount } = await supabase
        .from('subjects')
        .select('*', { count: 'exact', head: true })
        .eq('department', 'Centre for Computer Science & Application');
      console.log('fetchDashboardData: subjectsCount =', subjectsCount);
      const { count: facultyCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application');
      console.log('fetchDashboardData: facultyCount =', facultyCount);
      const { count: studentsCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .eq('department', 'Centre for Computer Science & Application');
      console.log('fetchDashboardData: studentsCount =', studentsCount);
      const { count: hodCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'hod')
        .eq('department', 'Centre for Computer Science & Application');
      console.log('fetchDashboardData: hodCount =', hodCount);
      
      setStats({
        totalSubjects: subjectsCount || 0,
        totalFaculty: (facultyCount || 0) + (hodCount || 0),
        totalStudents: studentsCount || 0
      });
      
      const { data: notifications } = await supabase
        .from('notifications')
        .select('id, title, message, created_at, type')
        .or('target_audience.eq.faculty,target_audience.eq.all')
        .order('created_at', { ascending: false })
        .limit(5);
      console.log('fetchDashboardData: notifications =', notifications);
      const activities = notifications?.map(notif => ({
        id: notif.id,
        type: notif.type || 'announcement',
        message: notif.title,
        created_at: notif.created_at
      })) || [];
      setRecentActivities(activities);
    } catch (error) {
      console.error('fetchDashboardData: Caught error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      console.log('fetchDashboardData: Setting loading to false');
      console.log('fetchDashboardData: END');
    }
  };

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
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {hodUser?.name}! 👋</h1>
          <p className="text-muted-foreground">Overview of your department's academic activities</p>
        </div>
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
                {stats.totalFaculty > 0 ? 100 : 0}%
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
