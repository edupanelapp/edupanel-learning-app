import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  FileText, 
  Clock, 
  Trophy, 
  ArrowRight,
  Calendar,
  Bell
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SubjectProgress {
  id: string
  name: string
  code: string
  progress: number
  newMaterials: number
}

interface Assignment {
  id: string
  title: string
  subject: string
  dueDate: string
  status: string
}

interface ClassSchedule {
  time: string
  subject: string
  faculty: string
}

interface Notification {
  title: string
  message: string
  time: string
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<SubjectProgress[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [todayClasses, setTodayClasses] = useState<ClassSchedule[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch enrolled subjects with progress
      const { data: enrolledSubjects } = await supabase
        .from('student_subjects')
        .select(`
          subjects:subject_id (
            id,
            name,
            code
          )
        `)
        .eq('student_id', user.id)

      // Fetch progress for each subject
      const subjectsWithProgress = await Promise.all(
        (enrolledSubjects || []).map(async (item) => {
          const subject = item.subjects
          if (!subject) return null

          // Get progress percentage
          const { data: progress } = await supabase
            .from('student_progress')
            .select('completion_percentage')
            .eq('student_id', user.id)
            .eq('subject_id', subject.id)

          const avgProgress = progress?.length 
            ? progress.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progress.length
            : 0

          // Get new materials count (last 7 days)
          const oneWeekAgo = new Date()
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
          
          const { count: materialsCount } = await supabase
            .from('topic_materials')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', oneWeekAgo.toISOString())

          return {
            id: subject.id,
            name: subject.name,
            code: subject.code,
            progress: Math.round(avgProgress),
            newMaterials: materialsCount || 0
          }
        })
      )

      setSubjects(subjectsWithProgress.filter(Boolean) as SubjectProgress[])

      // Fetch recent assignments
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select(`
          id,
          title,
          due_date,
          subjects:subject_id (name),
          assignment_submissions:assignment_submissions(status)
        `)
        .in('subject_id', enrolledSubjects?.map(s => s.subjects?.id).filter(Boolean) || [])
        .order('created_at', { ascending: false })
        .limit(5)

      const assignmentsWithStatus = assignmentsData?.map(assignment => {
        const submission = assignment.assignment_submissions?.find(sub => sub.status)
        return {
          id: assignment.id,
          title: assignment.title,
          subject: assignment.subjects?.name || 'Unknown',
          dueDate: new Date(assignment.due_date).toLocaleDateString(),
          status: submission?.status || 'pending'
        }
      }) || []

      setAssignments(assignmentsWithStatus)

      // Fetch today's classes
      const today = new Date().getDay()
      const { data: classesData } = await supabase
        .from('class_schedule')
        .select(`
          start_time,
          subjects:subject_id (name),
          profiles:faculty_id (full_name)
        `)
        .eq('day_of_week', today)
        .eq('is_active', true)
        .in('subject_id', enrolledSubjects?.map(s => s.subjects?.id).filter(Boolean) || [])

      const todayClassesFormatted = classesData?.map(cls => ({
        time: cls.start_time,
        subject: cls.subjects?.name || 'Unknown',
        faculty: cls.profiles?.full_name || 'TBD'
      })) || []

      setTodayClasses(todayClassesFormatted)

      // Fetch recent notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('title, message, created_at')
        .or('target_audience.eq.students,target_audience.eq.all')
        .order('created_at', { ascending: false })
        .limit(5)

      const notificationsFormatted = notificationsData?.map(notif => ({
        title: notif.title,
        message: notif.message,
        time: new Date(notif.created_at).toLocaleDateString()
      })) || []

      setNotifications(notificationsFormatted)

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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-muted-foreground">Continue your learning journey at CCSA and track your progress.</p>
      </div>

      {/* Subject Progress Panel */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {subjects.map((subject, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm text-primary">{subject.name}</h3>
                    {subject.newMaterials > 0 && (
                      <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                        {subject.newMaterials} new
                      </Badge>
                    )}
                  </div>
                  <Progress value={subject.progress} className="mb-2" />
                  <p className="text-xs text-muted-foreground">{subject.progress}% complete</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No subjects enrolled yet</p>
              <p className="text-sm">Contact administration to enroll in subjects</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assignments */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-primary">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Assignments
              </span>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {assignments.length > 0 ? (
              <div className="space-y-3">
                {assignments.map((assignment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary/5">
                    <div>
                      <h4 className="font-medium text-sm">{assignment.title}</h4>
                      <p className="text-xs text-muted-foreground">{assignment.subject}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          assignment.status === "submitted" ? "default" :
                          assignment.status === "in-progress" ? "secondary" : "destructive"
                        }
                        className="text-xs"
                      >
                        {assignment.status === "pending" ? "Due " + assignment.dueDate : assignment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No assignments available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center text-primary">
              <Calendar className="h-5 w-5 mr-2" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayClasses.length > 0 ? (
              <div className="space-y-3">
                {todayClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-primary/5">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{classItem.subject}</h4>
                        <p className="text-sm text-muted-foreground">{classItem.faculty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{classItem.time}</p>
                      <Button size="sm" variant="outline" className="mt-1 border-primary text-primary hover:bg-primary/10">
                        Join Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No classes scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Bell className="h-5 w-5 mr-2" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="p-3 border rounded-lg hover:bg-primary/5">
                  <h4 className="font-medium text-sm text-primary">{notification.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">Posted {notification.time}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No recent announcements</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
