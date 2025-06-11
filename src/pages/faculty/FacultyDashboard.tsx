
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, FileText, Users, Rocket, Plus, Clock, CheckCircle } from "lucide-react"

export default function FacultyDashboard() {
  const stats = [
    { title: "Subjects Taught", value: "5", icon: BookOpen, color: "text-blue-600" },
    { title: "Assignments Created", value: "23", icon: FileText, color: "text-green-600" },
    { title: "Active Students", value: "127", icon: Users, color: "text-purple-600" },
    { title: "Projects Mentored", value: "8", icon: Rocket, color: "text-orange-600" },
  ]

  const recentActivities = [
    { type: "assignment", title: "Data Structures Assignment", time: "2 hours ago", status: "pending" },
    { type: "submission", title: "John's Project Submission", time: "4 hours ago", status: "review" },
    { type: "material", title: "Added new chapter to OOP", time: "1 day ago", status: "completed" },
  ]

  const upcomingClasses = [
    { subject: "Data Structures", time: "10:00 AM", students: 35 },
    { subject: "OOP Concepts", time: "2:00 PM", students: 42 },
    { subject: "Database Systems", time: "4:00 PM", students: 28 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome back, Professor! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening in your classes today.</p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Assignment
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest teaching activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' ? 
                      <CheckCircle className="h-5 w-5 text-green-500" /> :
                      <Clock className="h-5 w-5 text-yellow-500" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Classes</CardTitle>
            <CardDescription>Your scheduled classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((classItem, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{classItem.subject}</p>
                    <p className="text-sm text-muted-foreground">{classItem.students} students</p>
                  </div>
                  <Badge variant="outline">{classItem.time}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View Full Schedule</Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions to manage your teaching</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="flex flex-col h-20">
              <FileText className="h-6 w-6 mb-2" />
              Create Assignment
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
              <BookOpen className="h-6 w-6 mb-2" />
              Add Material
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
              <Rocket className="h-6 w-6 mb-2" />
              Create Project
            </Button>
            <Button variant="outline" className="flex flex-col h-20">
              <Users className="h-6 w-6 mb-2" />
              View Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
