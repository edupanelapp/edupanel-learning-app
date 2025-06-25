import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, TrendingUp, TrendingDown, Users, Loader2, Eye } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { useHODStudents, type HODStudent, type SemesterStats, type DepartmentStats } from "@/hooks/useHODStudents"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function HODStudents() {
  console.log('HODStudents component rendering...')
  
  const { hodUser, isLoading, isHODAuthenticated } = useHODAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSemester, setFilterSemester] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<HODStudent | null>(null)

  // Use the new backend hook
  const { 
    data: studentData, 
    isLoading: studentsLoading, 
    error: studentsError,
    refetch: refetchStudents
  } = useHODStudents()

  const students = studentData?.students || []
  const semesterStats = studentData?.semesterStats || {}
  const departmentStats = studentData?.departmentStats

  console.log('HODStudents auth state:', { hodUser, isLoading, isHODAuthenticated })
  console.log('HODStudents data:', { students: students.length, semesterStats, departmentStats })
  console.log('HODStudents loading states:', { isLoading, studentsLoading, studentsError })

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = !filterSemester || student.semester.toString() === filterSemester

    return matchesSearch && matchesSemester
  })

  const uniqueSemesters = [...new Set(students.map(s => s.semester.toString()))].sort()

  if (studentsError) {
    console.error('Error loading students:', studentsError)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p className="text-muted-foreground mb-4">Failed to load student data. Please try again.</p>
            <div className="space-y-2">
              <Button onClick={() => refetchStudents()} variant="outline">
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || studentsLoading) {
    console.log('HODStudents: Showing loading screen', { isLoading, studentsLoading, isHODAuthenticated, hodUser })
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">
            {isLoading ? 'Loading authentication...' : 'Loading students...'}
          </span>
        </div>
      </div>
    )
  }

  if (!isHODAuthenticated) {
    console.log('HODStudents: Not authenticated', { isHODAuthenticated, isLoading, hodUser })
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground">Please log in as HOD to view this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {(() => { console.log('HODStudents: Rendering main content', { students: students.length, isHODAuthenticated, isLoading, studentsLoading }); return null; })()}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Overview</h1>
          <p className="text-muted-foreground">Monitor student progress across all semesters</p>
        </div>
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
                    placeholder="Search by name, roll number, or email..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select 
                className="px-3 py-2 border border-input rounded-md bg-background"
                value={filterSemester}
                onChange={(e) => setFilterSemester(e.target.value)}
              >
                <option value="">All Semesters</option>
                {uniqueSemesters.map(semester => (
                  <option key={semester} value={semester}>{semester} Semester</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentStats?.totalStudents || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentStats?.avgProgress || 0}%
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
                <div className="mt-2 space-y-1">
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Progress</div>
                    <div className="text-xl font-bold">{stats.avgProgress}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg GPA</div>
                    <div className="text-lg font-semibold">{stats.avgGPA}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredStudents.map((student) => (
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
                    <p className="text-xs text-muted-foreground">{student.email}</p>
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

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Student Details - {student.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold">Personal Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Roll No:</strong> {student.rollNo}</div>
                              <div><strong>Email:</strong> {student.email}</div>
                              <div><strong>Batch:</strong> {student.batch}</div>
                              <div><strong>Department:</strong> {student.department}</div>
                              <div><strong>Course:</strong> {student.course}</div>
                              <div><strong>Semester:</strong> {student.semester}</div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold">Guardian Information</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Name:</strong> {student.guardian_name || 'Not provided'}</div>
                              <div><strong>Phone:</strong> {student.guardian_phone || 'Not provided'}</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Academic Performance</h4>
                          <div className="grid grid-cols-3 gap-4 mt-2">
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{student.progress}%</div>
                              <div className="text-xs text-muted-foreground">Progress</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{student.gpa}</div>
                              <div className="text-xs text-muted-foreground">GPA</div>
                            </div>
                            <div className="text-center p-3 bg-muted rounded">
                              <div className="text-2xl font-bold">{student.projects}</div>
                              <div className="text-xs text-muted-foreground">Projects</div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold">Assignment Status</h4>
                          <div className="mt-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Completed: {student.assignments.completed}</span>
                              <span>Total: {student.assignments.total}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all" 
                                style={{ 
                                  width: `${student.assignments.total > 0 ? (student.assignments.completed / student.assignments.total) * 100 : 0}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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

      {/* Performance Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Department Analytics</CardTitle>
          <CardDescription>Overall student performance insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {departmentStats?.assignmentCompletionRate || 0}%
              </div>
              <div className="text-sm text-muted-foreground">Assignment Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {departmentStats?.avgGPA || 0}
              </div>
              <div className="text-sm text-muted-foreground">Average GPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {departmentStats?.activeProjects || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {departmentStats?.improvingStudents || 0}
              </div>
              <div className="text-sm text-muted-foreground">Improving Students</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredStudents.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground mb-4">
              {students.length === 0 
                ? "Students will appear here once they enroll in courses"
                : "No students match your search criteria"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
