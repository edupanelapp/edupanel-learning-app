
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye, Clock, Mail, Phone } from "lucide-react"

export default function HODApprovals() {
  const pendingFaculty = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@faculty.com",
      phone: "+1 234-567-8901",
      department: "Computer Science",
      designation: "Associate Professor",
      experience: "8 years",
      submittedAt: "2025-06-10 2:30 PM",
      avatar: "",
      qualifications: "PhD in Computer Science, MIT"
    },
    {
      id: 2,
      name: "Prof. Michael Brown",
      email: "michael.brown@faculty.com", 
      phone: "+1 234-567-8902",
      department: "Computer Science",
      designation: "Assistant Professor",
      experience: "5 years",
      submittedAt: "2025-06-11 10:15 AM",
      avatar: "",
      qualifications: "MS in Software Engineering, Stanford"
    },
    {
      id: 3,
      name: "Dr. Lisa Wang",
      email: "lisa.wang@faculty.com",
      phone: "+1 234-567-8903", 
      department: "Computer Science",
      designation: "Professor",
      experience: "12 years",
      submittedAt: "2025-06-11 4:45 PM",
      avatar: "",
      qualifications: "PhD in Data Science, UC Berkeley"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Approvals</h1>
          <p className="text-muted-foreground">Review and approve faculty registration requests</p>
        </div>
        <Badge variant="destructive" className="text-sm">
          {pendingFaculty.length} pending approvals
        </Badge>
      </div>

      {pendingFaculty.length > 0 ? (
        <div className="grid gap-6">
          {pendingFaculty.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={faculty.avatar} alt={faculty.name} />
                      <AvatarFallback className="text-lg">
                        {faculty.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{faculty.name}</CardTitle>
                      <CardDescription className="text-base">
                        {faculty.designation} • {faculty.department}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                        {faculty.experience} experience
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {faculty.email}
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {faculty.phone}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Qualifications:</span> {faculty.qualifications}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Submitted: {faculty.submittedAt}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Full Profile
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
            <p className="text-muted-foreground">No pending faculty approvals at the moment.</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
          <CardDescription>Faculty members you've recently approved or rejected</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Dr. John Smith</p>
                  <p className="text-sm text-muted-foreground">Associate Professor</p>
                  <p className="text-xs text-muted-foreground">Approved 2 hours ago</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Approved
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>MW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Prof. Mary Wilson</p>
                  <p className="text-sm text-muted-foreground">Assistant Professor</p>
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
