
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Mail, Phone, BookOpen } from "lucide-react"

export default function HODFaculty() {
  const faculty = [
    {
      id: 1,
      name: "Dr. John Smith",
      email: "john.smith@faculty.com",
      phone: "+1 234-567-8901",
      designation: "Associate Professor",
      experience: "10 years",
      subjects: ["Data Structures", "Algorithms"],
      students: 87,
      avatar: ""
    },
    {
      id: 2,
      name: "Prof. Mary Wilson",
      email: "mary.wilson@faculty.com", 
      phone: "+1 234-567-8902",
      designation: "Assistant Professor",
      experience: "6 years",
      subjects: ["OOP", "Software Engineering"],
      students: 64,
      avatar: ""
    },
    {
      id: 3,
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@faculty.com",
      phone: "+1 234-567-8903",
      designation: "Professor", 
      experience: "15 years",
      subjects: ["Database Systems", "Data Mining"],
      students: 76,
      avatar: ""
    },
    {
      id: 4,
      name: "Prof. Michael Brown", 
      email: "michael.brown@faculty.com",
      phone: "+1 234-567-8904",
      designation: "Assistant Professor",
      experience: "4 years",
      subjects: ["Computer Networks"],
      students: 45,
      avatar: ""
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Overview</h1>
          <p className="text-muted-foreground">Manage and monitor faculty members in your department</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, subject, or designation..." 
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {faculty.reduce((sum, f) => sum + f.students, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty List */}
      <div className="grid gap-6">
        {faculty.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-muted-foreground">{member.designation}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {member.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="outline">{member.experience} experience</Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Assigned Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {member.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{member.students}</div>
                  <div className="text-xs text-muted-foreground">Total Students</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Manage Subjects
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Overview of faculty teaching metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87%</div>
              <div className="text-sm text-muted-foreground">Assignment Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">23</div>
              <div className="text-sm text-muted-foreground">Avg. Assignments/Faculty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {faculty.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">No faculty members found</div>
            <p className="text-sm text-muted-foreground">Faculty members will appear here once they are approved</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
