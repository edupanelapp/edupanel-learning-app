
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Users, Edit, Award } from "lucide-react"

export default function FacultyProfile() {
  const facultyData = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 234 567 8901",
    employeeId: "FAC001",
    department: "Computer Science",
    designation: "Associate Professor",
    experience: "8 years",
    subjectsTaught: [
      "Database Management Systems",
      "Software Engineering",
      "Web Development"
    ],
    totalStudents: 120,
    assignmentsCreated: 45,
    projectsMentored: 12,
    qualifications: ["Ph.D. Computer Science", "M.Tech Software Engineering"],
    researchInterests: ["Database Systems", "Machine Learning", "Software Architecture"]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Profile</h1>
          <p className="text-muted-foreground">Your professional academic profile</p>
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
              <AvatarImage src="" alt={facultyData.name} />
              <AvatarFallback className="text-lg">
                {facultyData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{facultyData.name}</CardTitle>
            <CardDescription>{facultyData.designation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{facultyData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{facultyData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{facultyData.employeeId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{facultyData.department}</span>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your teaching responsibilities and achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{facultyData.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{facultyData.assignmentsCreated}</div>
                <div className="text-sm text-muted-foreground">Assignments Created</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{facultyData.projectsMentored}</div>
                <div className="text-sm text-muted-foreground">Projects Mentored</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Subjects Teaching</h3>
              <div className="flex flex-wrap gap-2">
                {facultyData.subjectsTaught.map((subject, index) => (
                  <Badge key={index} variant="secondary">{subject}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {facultyData.qualifications.map((qualification, index) => (
                  <Badge key={index} variant="outline">{qualification}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Research Interests</h3>
              <div className="flex flex-wrap gap-2">
                {facultyData.researchInterests.map((interest, index) => (
                  <Badge key={index}>{interest}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground">{facultyData.experience} in academia</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
