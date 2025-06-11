
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, Eye, Mail } from "lucide-react"

export default function FacultyStudents() {
  const students = [
    {
      id: 1,
      name: "John Doe",
      rollNo: "BCA001",
      email: "john.doe@student.com",
      course: "BCA",
      semester: "3rd",
      progress: 85,
      assignments: { completed: 8, total: 10 },
      avatar: ""
    },
    {
      id: 2,
      name: "Jane Smith", 
      rollNo: "BCA002",
      email: "jane.smith@student.com",
      course: "BCA",
      semester: "3rd",
      progress: 92,
      assignments: { completed: 9, total: 10 },
      avatar: ""
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNo: "BCA003", 
      email: "mike.johnson@student.com",
      course: "BCA",
      semester: "3rd",
      progress: 78,
      assignments: { completed: 7, total: 10 },
      avatar: ""
    },
    {
      id: 4,
      name: "Sarah Wilson",
      rollNo: "BCA004",
      email: "sarah.wilson@student.com", 
      course: "BCA",
      semester: "4th",
      progress: 88,
      assignments: { completed: 8, total: 9 },
      avatar: ""
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">View and manage students enrolled in your subjects</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>Search and filter students by name, roll number, or course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name or roll number..." 
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">Filter by Course</Button>
            <Button variant="outline">Filter by Semester</Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid gap-6">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.rollNo} • {student.course} {student.semester} Semester</p>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Mail className="h-3 w-3 mr-1" />
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{student.progress}%</div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {student.assignments.completed}/{student.assignments.total}
                    </div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View Profile
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">No students found</div>
            <p className="text-sm text-muted-foreground">Students will appear here once they enroll in your subjects</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
