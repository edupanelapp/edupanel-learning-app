import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, FileText, Users, Rocket, Plus, Clock, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  subjectsTaught: number
  assignmentsCreated: number
  activeStudents: number
  projectsMentored: number
}

interface Activity {
  type: string
  title: string
  time: string
  status: string
}

interface TodayClass {
  subject: string
  time: string
  students: number
}

export default function FacultyDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<DashboardStats>({
    subjectsTaught: 0,
    assignmentsCreated: 0,
    activeStudents: 0,
    projectsMentored: 0
  })
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<TodayClass[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateAssignment, setShowCreateAssignment] = useState(false)
  const [showCreateNotification, setShowCreateNotification] = useState(false)
  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    maxMarks: 100
  })
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    message: '',
    targetAudience: 'students'
  })
  const [subjects, setSubjects] = useState<any[]>([])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch subjects taught by faculty
      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .eq('faculty_id', user.id)

      setSubjects(subjectsData || [])

      // Fetch assignments created
      const { count: assignmentCount } = await supabase
        .from('assignments')
        .select('*', { count: 'exact', head: true })
        .eq('faculty_id', user.id)

      // Fetch active students
      const { count: studentCount } = await supabase
        .from('student_subjects')
        .select('*', { count: 'exact', head: true })
        .in('subject_id', (subjectsData || []).map(s => s.id))

      // Fetch projects mentored
      const { count: projectCount } = await supabase
        .from('project_ideas')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id)

      setStats({
        subjectsTaught: subjectsData?.length || 0,
        assignmentsCreated: assignmentCount || 0,
        activeStudents: studentCount || 0,
        projectsMentored: projectCount || 0
      })

      // Fetch today's classes
      const today = new Date().getDay()
      const { data: classesData } = await supabase
        .from('class_schedule')
        .select(`
          id,
          start_time,
          subjects:subject_id (name, id)
        `)
        .eq('faculty_id', user.id)
        .eq('day_of_week', today)
        .eq('is_active', true)

      // For each class, fetch student count
      const todayClasses = await Promise.all((classesData || []).map(async (cls: any) => {
        let students = 0
        if (cls.subjects?.id) {
          const { count } = await supabase
            .from('student_subjects')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', cls.subjects.id)
          students = count || 0
        }
        return {
          subject: cls.subjects?.name || 'Unknown',
          time: cls.start_time,
          students
        }
      }))
      setUpcomingClasses(todayClasses)

      // Fetch recent activities from assignment_updates, notifications, and project_ideas
      // 1. Assignment updates (submissions, reviews, grades)
      const { data: assignmentUpdates } = await supabase
        .from('assignment_updates')
        .select('update_type, status, created_at, assignment_id, updated_by')
        .order('created_at', { ascending: false })
        .limit(5)
        .eq('updated_by', user.id)

      // 2. Notifications sent by this faculty
      const { data: notifications } = await supabase
        .from('notifications')
        .select('title, message, created_at, type')
        .order('created_at', { ascending: false })
        .limit(5)
        .eq('sender_id', user.id)

      // 3. Project ideas created by this faculty
      const { data: projectIdeas } = await supabase
        .from('project_ideas')
        .select('title, created_at, status')
        .order('created_at', { ascending: false })
        .limit(5)
        .eq('created_by', user.id)

      // Combine and normalize activities
      const activities: Activity[] = []
      if (assignmentUpdates) {
        activities.push(...assignmentUpdates.map((a: any) => ({
          type: 'assignment',
          title: `Assignment ${a.update_type}`,
          time: new Date(a.created_at).toLocaleString(),
          status: a.status || 'pending'
        })))
      }
      if (notifications) {
        activities.push(...notifications.map((n: any) => ({
          type: n.type || 'notification',
          title: n.title,
          time: new Date(n.created_at).toLocaleString(),
          status: 'sent'
        })))
      }
      if (projectIdeas) {
        activities.push(...projectIdeas.map((p: any) => ({
          type: 'project',
          title: p.title,
          time: new Date(p.created_at).toLocaleString(),
          status: p.status || 'draft'
        })))
      }
      // Sort by time descending and take top 5
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivities(activities.slice(0, 5))

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

  const handleCreateAssignment = async () => {
    if (!assignmentForm.title || !assignmentForm.subjectId || !assignmentForm.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('assignments')
        .insert({
          title: assignmentForm.title,
          description: assignmentForm.description,
          subject_id: assignmentForm.subjectId,
          faculty_id: user?.id,
          due_date: assignmentForm.dueDate,
          max_marks: assignmentForm.maxMarks
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Assignment created successfully"
      })
      
      setShowCreateAssignment(false)
      setAssignmentForm({
        title: '',
        description: '',
        subjectId: '',
        dueDate: '',
        maxMarks: 100
      })
      fetchDashboardData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create assignment",
        variant: "destructive"
      })
    }
  }

  const handleCreateNotification = async () => {
    if (!notificationForm.title || !notificationForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          title: notificationForm.title,
          message: notificationForm.message,
          sender_id: user?.id,
          target_audience: notificationForm.targetAudience,
          type: 'announcement'
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Notification sent successfully"
      })
      
      setShowCreateNotification(false)
      setNotificationForm({
        title: '',
        message: '',
        targetAudience: 'students'
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive"
      })
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Welcome back, {user?.name}! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening in your classes at CCSA today.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Dialog open={showCreateAssignment} onOpenChange={setShowCreateAssignment}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Assignment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment for your students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={assignmentForm.title}
                    onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                    placeholder="Assignment title"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <select
                    id="subject"
                    className="w-full p-2 border rounded"
                    value={assignmentForm.subjectId}
                    onChange={(e) => setAssignmentForm({...assignmentForm, subjectId: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={assignmentForm.description}
                    onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                    placeholder="Assignment description"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="datetime-local"
                    value={assignmentForm.dueDate}
                    onChange={(e) => setAssignmentForm({...assignmentForm, dueDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxMarks">Maximum Marks</Label>
                  <Input
                    id="maxMarks"
                    type="number"
                    value={assignmentForm.maxMarks}
                    onChange={(e) => setAssignmentForm({...assignmentForm, maxMarks: parseInt(e.target.value)})}
                  />
                </div>
                <Button onClick={handleCreateAssignment} className="w-full bg-primary hover:bg-primary/90">
                  Create Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateNotification} onOpenChange={setShowCreateNotification}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Send Notice
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Notification</DialogTitle>
                <DialogDescription>
                  Send a notification to students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="notifTitle">Title</Label>
                  <Input
                    id="notifTitle"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                    placeholder="Notification title"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={notificationForm.message}
                    onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                    placeholder="Notification message"
                  />
                </div>
                <Button onClick={handleCreateNotification} className="w-full bg-primary hover:bg-primary/90">
                  Send Notification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subjects Taught</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.subjectsTaught}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments Created</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.assignmentsCreated}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeStudents}</div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects Mentored</CardTitle>
            <Rocket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.projectsMentored}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Recent Activities</CardTitle>
            <CardDescription>Your latest teaching activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> :
                      <Clock className="h-5 w-5 text-primary" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'} className="bg-primary/10 text-primary">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Today's Classes</CardTitle>
            <CardDescription>Your scheduled classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div>
                    <p className="font-medium text-primary">{classItem.subject}</p>
                    <p className="text-sm text-muted-foreground">{classItem.students} students</p>
                  </div>
                  <Badge variant="outline" className="border-primary text-primary">{classItem.time}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 border-primary text-primary hover:bg-primary/10">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
