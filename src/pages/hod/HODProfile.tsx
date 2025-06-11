
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, BookOpen, Users, Edit, Building } from "lucide-react"

export default function HODProfile() {
  const hodData = {
    name: "Dr. Michael Anderson",
    email: "michael.anderson@university.edu", 
    phone: "+1 234 567 8902",
    employeeId: "HOD001",
    department: "Computer Science Engineering",
    designation: "Head of Department",
    experience: "15 years",
    totalFaculty: 25,
    totalStudents: 450,
    totalSubjects: 35,
    qualifications: ["Ph.D. Computer Science", "M.Tech Computer Science", "B.Tech Computer Science"],
    specialization: ["Artificial Intelligence", "Machine Learning", "Computer Networks"],
    achievements: ["Best HOD Award 2023", "Research Excellence Award", "Innovation in Teaching"]
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">HOD Profile</h1>
          <p className="text-muted-foreground">Department leadership and administrative profile</p>
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
              <AvatarImage src="" alt={hodData.name} />
              <AvatarFallback className="text-lg">
                {hodData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle>{hodData.name}</CardTitle>
            <CardDescription>{hodData.designation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{hodData.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{hodData.phone}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{hodData.employeeId}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{hodData.department}</span>
            </div>
          </CardContent>
        </Card>

        {/* Department Overview */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Overview</CardTitle>
            <CardDescription>Leadership responsibilities and department statistics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{hodData.totalFaculty}</div>
                <div className="text-sm text-muted-foreground">Total Faculty</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{hodData.totalStudents}</div>
                <div className="text-sm text-muted-foreground">Total Students</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{hodData.totalSubjects}</div>
                <div className="text-sm text-muted-foreground">Total Subjects</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Qualifications</h3>
              <div className="flex flex-wrap gap-2">
                {hodData.qualifications.map((qualification, index) => (
                  <Badge key={index} variant="secondary">{qualification}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Areas of Specialization</h3>
              <div className="flex flex-wrap gap-2">
                {hodData.specialization.map((area, index) => (
                  <Badge key={index} variant="outline">{area}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Achievements & Awards</h3>
              <div className="flex flex-wrap gap-2">
                {hodData.achievements.map((achievement, index) => (
                  <Badge key={index}>{achievement}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground">{hodData.experience} in academia and administration</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
