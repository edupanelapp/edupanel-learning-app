
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Calendar, Edit } from "lucide-react"

export default function StudentProfile() {
  const studentData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    rollNumber: "CSE2021001",
    department: "Computer Science",
    semester: "6th Semester",
    batch: "2021-2025",
    enrolledSubjects: [
      "Data Structures & Algorithms",
      "Object Oriented Programming", 
      "Database Management Systems"
    ],
    completionRate: 78,
    totalAssignments: 15,
    submittedAssignments: 12
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your academic profile and information</p>
        </div>
        <Button>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="" alt={studentData.name} />
              <AvatarFallback className="text-lg">
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{studentData.name}</CardTitle>
            <CardDescription>{studentData.rollNumber}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{studentData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{studentData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{studentData.department}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{studentData.semester}</span>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your current academic status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{studentData.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Overall Progress</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{studentData.submittedAssignments}/{studentData.totalAssignments}</div>
                <div className="text-sm text-muted-foreground">Assignments</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{studentData.enrolledSubjects.length}</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Enrolled Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {studentData.enrolledSubjects.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Batch Information</h3>
              <p className="text-muted-foreground">{studentData.batch}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
