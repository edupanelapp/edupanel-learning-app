import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, TrendingUp, TrendingDown, Users, Loader2 } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { useToast } from "@/hooks/use-toast"

interface Student {
  id: string
  name: string
  rollNo: string
  course: string
  semester: number
  progress: number
  assignments: { completed: number; total: number }
  projects: number
  gpa: number
  trend: "up" | "down"
}

interface SemesterStats {
  [key: string]: { count: number; avgProgress: number }
}

// Mock data for students
const mockStudents: Student[] = [
  {
    id: "1",
    name: "John Doe",
    rollNo: "CSE2024001",
    course: "Computer Science",
    semester: 3,
    progress: 85,
    assignments: { completed: 8, total: 10 },
    projects: 3,
    gpa: 3.8,
    trend: "up"
  },
  {
    id: "2",
    name: "Jane Smith",
    rollNo: "CSE2024002",
    course: "Computer Science",
    semester: 3,
    progress: 92,
    assignments: { completed: 10, total: 10 },
    projects: 4,
    gpa: 4.0,
    trend: "up"
  },
  {
    id: "3",
    name: "Mike Johnson",
    rollNo: "CSE2024003",
    course: "Computer Science",
    semester: 5,
    progress: 78,
    assignments: { completed: 6, total: 8 },
    projects: 2,
    gpa: 3.5,
    trend: "down"
  },
  {
    id: "4",
    name: "Sarah Wilson",
    rollNo: "CSE2024004",
    course: "Computer Science",
    semester: 5,
    progress: 88,
    assignments: { completed: 7, total: 8 },
    projects: 3,
    gpa: 3.9,
    trend: "up"
  },
  {
    id: "5",
    name: "Alex Brown",
    rollNo: "CSE2024005",
    course: "Computer Science",
    semester: 1,
    progress: 65,
    assignments: { completed: 4, total: 6 },
    projects: 1,
    gpa: 3.2,
    trend: "up"
  },
  {
    id: "6",
    name: "Emily Davis",
    rollNo: "CSE2024006",
    course: "Computer Science",
    semester: 1,
    progress: 72,
    assignments: { completed: 5, total: 6 },
    projects: 2,
    gpa: 3.6,
    trend: "up"
  }
]

export default function HODStudents() {
  console.log('HODStudents component rendering...')
  
  const { hodUser, isLoading, isHODAuthenticated } = useHODAuth()
  const { toast } = useToast()
  const [students, setStudents] = useState<Student[]>([])
  const [semesterStats, setSemesterStats] = useState<SemesterStats>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSemester, setFilterSemester] = useState("")

  console.log('HODStudents auth state:', { hodUser, isLoading, isHODAuthenticated })

  useEffect(() => {
    console.log('HODStudents useEffect triggered, hodUser:', hodUser, 'isLoading:', isLoading, 'isHODAuthenticated:', isHODAuthenticated)
    
    // If authentication is complete, load mock data immediately
    if (isHODAuthenticated && !isLoading) {
      console.log('Authentication complete, loading mock data immediately')
      loadMockData()
    }
  }, [isHODAuthenticated, isLoading])

  const loadMockData = () => {
    console.log('Loading mock student data...')
    setLoading(true)
    
    // Load data immediately without delay
    setStudents(mockStudents)
    
    // Calculate semester statistics
    const semesterData: SemesterStats = {}
    mockStudents.forEach(student => {
      const semesterKey = `${student.semester}`
      if (!semesterData[semesterKey]) {
        semesterData[semesterKey] = { count: 0, avgProgress: 0 }
      }
      semesterData[semesterKey].count++
      semesterData[semesterKey].avgProgress += student.progress
    })

    // Calculate averages
    Object.keys(semesterData).forEach(semester => {
      semesterData[semester].avgProgress = Math.round(
        semesterData[semester].avgProgress / semesterData[semester].count
      )
    })

    setSemesterStats(semesterData)
    setLoading(false)
    console.log('Mock data loaded successfully')
  }

  // Filter students based on search and filters
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSemester = !filterSemester || student.semester.toString() === filterSemester

    return matchesSearch && matchesSemester
  })

  const uniqueSemesters = [...new Set(students.map(s => s.semester.toString()))].sort()

  if (loading || isLoading) {
    console.log('HODStudents: Showing loading screen', { loading, isLoading, isHODAuthenticated, hodUser })
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
      {(() => { console.log('HODStudents: Rendering main content', { students: students.length, isHODAuthenticated, loading, isLoading }); return null; })()}
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
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 
                ? Math.round(students.reduce((sum, s) => sum + s.progress, 0) / students.length)
                : 0}%
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
                {students.length > 0 
                  ? Math.round(students.reduce((sum, s) => sum + s.assignments.completed, 0) / 
                              students.reduce((sum, s) => sum + s.assignments.total, 0) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Assignment Completion Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {students.length > 0 
                  ? Math.round(students.reduce((sum, s) => sum + s.gpa, 0) / students.length * 10) / 10
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground">Average GPA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {students.reduce((sum, s) => sum + s.projects, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {students.length > 0 
                  ? Math.round(students.filter(s => s.trend === 'up').length / students.length * 100)
                  : 0}%
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
            <p className="text-muted-foreground">
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
