
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Users, Plus, Edit, User } from "lucide-react"

export default function HODSubjects() {
  const subjects = [
    {
      id: 1,
      name: "Data Structures & Algorithms",
      code: "CSE301",
      semester: "3rd",
      faculty: {
        name: "Dr. John Smith",
        avatar: ""
      },
      students: 45,
      status: "active"
    },
    {
      id: 2,
      name: "Object Oriented Programming", 
      code: "CSE302",
      semester: "3rd",
      faculty: {
        name: "Prof. Mary Wilson",
        avatar: ""
      },
      students: 42,
      status: "active"
    },
    {
      id: 3,
      name: "Database Management Systems",
      code: "CSE401", 
      semester: "4th",
      faculty: {
        name: "Dr. Sarah Johnson",
        avatar: ""
      },
      students: 38,
      status: "active"
    },
    {
      id: 4,
      name: "Computer Networks",
      code: "CSE402",
      semester: "4th", 
      faculty: null,
      students: 0,
      status: "unassigned"
    }
  ]

  const availableFaculty = [
    "Dr. John Smith",
    "Prof. Mary Wilson", 
    "Dr. Sarah Johnson",
    "Prof. Michael Brown",
    "Dr. Lisa Wang"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject Management</h1>
          <p className="text-muted-foreground">Manage subjects and assign faculty members</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{subject.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subject.code} • {subject.semester} Semester
                  </CardDescription>
                </div>
                <Badge variant={subject.status === 'active' ? 'default' : 'secondary'}>
                  {subject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {subject.faculty ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={subject.faculty.avatar} alt={subject.faculty.name} />
                        <AvatarFallback>
                          {subject.faculty.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{subject.faculty.name}</p>
                        <p className="text-xs text-muted-foreground">Assigned Faculty</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">No faculty assigned</p>
                        <p className="text-xs text-muted-foreground">Awaiting assignment</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{subject.students} students</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!subject.faculty && (
                    <Button size="sm">
                      Assign Faculty
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Faculty Assignment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Workload Distribution</CardTitle>
          <CardDescription>Overview of subject assignments across faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFaculty.map((faculty, index) => {
              const assignedSubjects = subjects.filter(s => s.faculty?.name === faculty).length
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{faculty.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{faculty}</p>
                      <p className="text-xs text-muted-foreground">{assignedSubjects} subjects</p>
                    </div>
                  </div>
                  <Badge variant="outline">{assignedSubjects}</Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">Start by adding subjects to your department</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
