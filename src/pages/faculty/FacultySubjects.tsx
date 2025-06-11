
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Plus, Eye } from "lucide-react"

export default function FacultySubjects() {
  const subjects = [
    {
      id: 1,
      name: "Data Structures & Algorithms",
      code: "CSE301",
      semester: "3rd Semester",
      students: 45,
      chapters: 8,
      assignments: 5,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Object Oriented Programming",
      code: "CSE302",
      semester: "3rd Semester", 
      students: 42,
      chapters: 6,
      assignments: 4,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Database Management Systems",
      code: "CSE401",
      semester: "4th Semester",
      students: 38,
      chapters: 7,
      assignments: 3,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
          <p className="text-muted-foreground">Manage your teaching subjects and course materials</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img 
                src={subject.image} 
                alt={subject.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{subject.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {subject.code} • {subject.semester}
                  </CardDescription>
                </div>
                <Badge variant="secondary">{subject.students} students</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {subject.chapters} chapters
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {subject.assignments} assignments
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                <Button variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state if no subjects */}
      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects assigned</h3>
            <p className="text-muted-foreground mb-4">Contact your HOD to get subjects assigned to you.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
