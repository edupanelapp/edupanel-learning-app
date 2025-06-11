
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, TrendingUp, TrendingDown, Users } from "lucide-react"

export default function HODStudents() {
  const students = [
    {
      id: 1,
      name: "John Doe",
      rollNo: "BCA001",
      course: "BCA",
      semester: "3rd",
      progress: 89,
      assignments: { completed: 18, total: 20 },
      projects: 3,
      gpa: 3.7,
      trend: "up"
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNo: "BCA002", 
      course: "BCA",
      semester: "3rd",
      progress: 94,
      assignments: { completed: 19, total: 20 },
      projects: 4,
      gpa: 3.9,
      trend: "up"
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNo: "BCA003",
      course: "BCA", 
      semester: "4th",
      progress: 76,
      assignments: { completed: 14, total: 18 },
      projects: 2,
      gpa: 3.2,
      trend: "down"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      rollNo: "BCA004",
      course: "BCA",
      semester: "4th",
      progress: 91,
      assignments: { completed: 16, total: 18 },
      projects: 3,
      gpa: 3.8,
      trend: "up"
    }
  ]

  const semesterStats = {
    "3rd": { count: 2, avgProgress: 91.5 },
    "4th": { count: 2, avgProgress: 83.5 }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Overview</h1>
          <p className="text-muted-foreground">Monitor student progress across all semesters</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Search Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name, roll number, or course..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline">Filter by Semester</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Semester Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Semester Overview</CardTitle>
          <CardDescription>Student distribution and performance by semester</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(semesterStats).map(([semester, stats]) => (
              <div key={semester} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">{semester} Semester</p>
                    <p className="text-sm text-muted-foreground">{stats.count} students</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground">Avg Progress</div>
                  <div className="text-xl font-bold">{stats.avgProgress}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="" alt={student.name} />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="text-lg font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {student.rollNo} • {student.course} {student.semester} Semester
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="flex items-center">
                      <span className="text-lg font-bold mr-1">{student.progress}%</span>
                      {student.trend === 'up' ? 
                        <TrendingUp className="h-4 w-4 text-green-500" /> :
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">Progress</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {student.assignments.completed}/{student.assignments.total}
                    </div>
                    <div className="text-xs text-muted-foreground">Assignments</div>
                  </div>

                  <div className="text-center">
                    <div className="text-lg font-bold">{student.gpa}</div>
                    <div className="text-xs text-muted-foreground">GPA</div>
                  </div>

                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Course Progress</span>
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

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Analytics</CardTitle>
          <CardDescription>Overall student performance insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">87%</div>
              <div className="text-sm text-muted-foreground">Assignment Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">3.6</div>
              <div className="text-sm text-muted-foreground">Average GPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">78</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Student Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {students.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">Students will appear here once they enroll in courses</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
