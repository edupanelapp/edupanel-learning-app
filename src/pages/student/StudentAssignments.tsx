
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function StudentAssignments() {
  const assignments = [
    {
      id: 1,
      title: "Binary Search Tree Implementation",
      subject: "Data Structures",
      faculty: "Dr. John Smith",
      dueDate: "2025-06-15",
      status: "pending",
      isOverdue: false
    },
    {
      id: 2,
      title: "Inheritance and Polymorphism", 
      subject: "OOP Concepts",
      faculty: "Prof. Mary Wilson",
      dueDate: "2025-06-20",
      status: "pending",
      isOverdue: false
    },
    {
      id: 3,
      title: "Database Normalization",
      subject: "DBMS",
      faculty: "Dr. Sarah Johnson", 
      dueDate: "2025-06-10",
      status: "submitted",
      submittedAt: "2025-06-09 3:30 PM",
      isOverdue: false
    },
    {
      id: 4,
      title: "Sorting Algorithms Analysis",
      subject: "Data Structures",
      faculty: "Dr. John Smith",
      dueDate: "2025-06-08", 
      status: "overdue",
      isOverdue: true
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'overdue')
  const submittedAssignments = assignments.filter(a => a.status === 'submitted')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">View and submit your assignments</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="destructive">
            {pendingAssignments.length} pending
          </Badge>
          <Badge variant="secondary">
            {submittedAssignments.length} submitted
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.subject} • {assignment.faculty}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Due: {assignment.dueDate}
                      </span>
                      {assignment.isOverdue && (
                        <span className="text-red-500 font-medium">Overdue</span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submitted">
          <div className="grid gap-4">
            {submittedAssignments.map((assignment) => (
              <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{assignment.title}</CardTitle>
                      <CardDescription>
                        {assignment.subject} • {assignment.faculty}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      {assignment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Due: {assignment.dueDate}
                        </span>
                      </div>
                      {assignment.submittedAt && (
                        <div className="text-sm text-muted-foreground">
                          Submitted: {assignment.submittedAt}
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">View Submission</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {assignments.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
            <p className="text-muted-foreground">Assignments will appear here when your teachers create them.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
