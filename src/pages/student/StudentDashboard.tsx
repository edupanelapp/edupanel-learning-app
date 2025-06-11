
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

export default function StudentDashboard() {
  const subjects = [
    { name: "Data Structures", progress: 75, newMaterials: 3 },
    { name: "Web Development", progress: 60, newMaterials: 2 },
    { name: "Database Systems", progress: 90, newMaterials: 0 },
    { name: "Software Engineering", progress: 45, newMaterials: 5 },
  ]

  const recentLearnings = [
    { title: "Arrays and Linked Lists", subject: "Data Structures", date: "2 hours ago" },
    { title: "React Components", subject: "Web Development", date: "1 day ago" },
    { title: "SQL Joins", subject: "Database Systems", date: "2 days ago" },
  ]

  const assignments = [
    { title: "Binary Search Implementation", subject: "Data Structures", dueDate: "Tomorrow", status: "pending" },
    { title: "React Portfolio Project", subject: "Web Development", dueDate: "3 days", status: "in-progress" },
    { title: "Database Design", subject: "Database Systems", dueDate: "1 week", status: "submitted" },
  ]

  const todayClasses = [
    { time: "9:00 AM", subject: "Data Structures", faculty: "Dr. Smith" },
    { time: "11:00 AM", subject: "Web Development", faculty: "Prof. Johnson" },
    { time: "2:00 PM", subject: "Software Engineering", faculty: "Dr. Wilson" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, Alex! 👋</h1>
        <p className="text-muted-foreground">Continue your learning journey and track your progress.</p>
      </div>

      {/* Subject Progress Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-sm">{subject.name}</h3>
                  {subject.newMaterials > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {subject.newMaterials} new
                    </Badge>
                  )}
                </div>
                <Progress value={subject.progress} className="mb-2" />
                <p className="text-xs text-muted-foreground">{subject.progress}% complete</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Learnings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Recent Learnings
              </span>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentLearnings.map((learning, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium text-sm">{learning.title}</h4>
                    <p className="text-xs text-muted-foreground">{learning.subject}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{learning.date}</p>
                    <Button size="sm" variant="outline" className="mt-1">
                      Continue
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assignments Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Recent Assignments
              </span>
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
          </CardContent>
        </Card>
      </div>

      {/* Class Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Class Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
            </TabsList>
            <TabsContent value="today" className="space-y-4">
              <div className="grid gap-3">
                {todayClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
                      <p className="font-medium">{classItem.time}</p>
                      <Button size="sm" variant="outline">
                        Join Class
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full">
                View Full Schedule
              </Button>
            </TabsContent>
            <TabsContent value="yesterday">
              <p className="text-center text-muted-foreground py-8">No classes yesterday</p>
            </TabsContent>
            <TabsContent value="tomorrow">
              <p className="text-center text-muted-foreground py-8">No classes scheduled for tomorrow</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2" />
            Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">Mid-term Examination Schedule Released</h4>
              <p className="text-xs text-muted-foreground mt-1">Check your exam dates and prepare accordingly. Posted 2 hours ago.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium text-sm">New Study Materials Available</h4>
              <p className="text-xs text-muted-foreground mt-1">Additional resources have been uploaded for Web Development course. Posted 1 day ago.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
