
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye, Clock } from "lucide-react"

export default function FacultyApprovals() {
  const pendingStudents = [
    {
      id: 1,
      name: "Alex Thompson",
      email: "alex.thompson@student.com",
      course: "BCA",
      semester: "3rd",
      submittedAt: "2025-06-10 2:30 PM",
      avatar: ""
    },
    {
      id: 2,
      name: "Emma Rodriguez",
      email: "emma.rodriguez@student.com",
      course: "BCA", 
      semester: "3rd",
      submittedAt: "2025-06-11 10:15 AM",
      avatar: ""
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.chen@student.com",
      course: "BCA",
      semester: "4th", 
      submittedAt: "2025-06-11 4:45 PM",
      avatar: ""
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Approvals</h1>
          <p className="text-muted-foreground">Review and approve student registration requests</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          {pendingStudents.length} pending approvals
        </Badge>
      </div>

      {pendingStudents.length > 0 ? (
        <div className="grid gap-6">
          {pendingStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.avatar} alt={student.name} />
                      <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{student.name}</CardTitle>
                      <CardDescription>
                        {student.email} • {student.course} {student.semester} Semester
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Submitted: {student.submittedAt}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                    <Button variant="destructive" size="sm">
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending student approvals at the moment.</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
          <CardDescription>Students you've recently approved or rejected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-xs text-muted-foreground">Approved 2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Approved
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>MW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Mary Williams</p>
                  <p className="text-xs text-muted-foreground">Approved yesterday</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Approved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
