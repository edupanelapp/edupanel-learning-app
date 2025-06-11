
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Calendar, Users } from "lucide-react"

export default function FacultyAssignments() {
  const assignments = [
    {
      id: 1,
      title: "Binary Search Tree Implementation",
      subject: "Data Structures",
      dueDate: "2025-06-15",
      submissions: 35,
      totalStudents: 45,
      status: "active"
    },
    {
      id: 2,
      title: "Inheritance and Polymorphism",
      subject: "OOP Concepts",
      dueDate: "2025-06-20", 
      submissions: 28,
      totalStudents: 42,
      status: "active"
    },
    {
      id: 3,
      title: "Database Normalization",
      subject: "DBMS",
      dueDate: "2025-06-10",
      submissions: 38,
      totalStudents: 38,
      status: "completed"
    }
  ]

  const submissions = [
    {
      id: 1,
      studentName: "John Doe",
      assignment: "Binary Search Tree Implementation", 
      submittedAt: "2025-06-12 10:30 AM",
      status: "pending"
    },
    {
      id: 2,
      studentName: "Jane Smith",
      assignment: "Inheritance and Polymorphism",
      submittedAt: "2025-06-11 3:45 PM", 
      status: "reviewed"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Create and manage assignments for your subjects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments">
          <div className="grid gap-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {assignment.subject}
                      </CardDescription>
                    </div>
                    <Badge variant={assignment.status === 'active' ? 'default' : 'secondary'}>
                      {assignment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6 text-sm">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {assignment.dueDate}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {assignment.submissions}/{assignment.totalStudents} submitted
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Submissions
                      </Button>
                      <Button size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                      <CardDescription>
                        {submission.assignment}
                      </CardDescription>
                    </div>
                    <Badge variant={submission.status === 'pending' ? 'destructive' : 'default'}>
                      {submission.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Submitted: {submission.submittedAt}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Download</Button>
                      <Button size="sm">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
