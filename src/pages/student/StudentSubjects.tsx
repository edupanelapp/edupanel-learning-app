
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, FileText } from "lucide-react"

export default function StudentSubjects() {
  const subjects = [
    {
      id: 1,
      name: "Data Structures & Algorithms",
      faculty: "Dr. John Smith",
      progress: 78,
      chapters: { completed: 6, total: 8 },
      newMaterials: 2,
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Object Oriented Programming",
      faculty: "Prof. Mary Wilson",
      progress: 85,
      chapters: { completed: 5, total: 6 },
      newMaterials: 1,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      name: "Database Management Systems",
      faculty: "Dr. Sarah Johnson",
      progress: 65,
      chapters: { completed: 4, total: 7 },
      newMaterials: 3,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
          <p className="text-muted-foreground">Continue your learning journey across all enrolled subjects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden rounded-t-lg relative">
              <img 
                src={subject.image} 
                alt={subject.name}
                className="w-full h-full object-cover"
              />
              {subject.newMaterials > 0 && (
                <Badge className="absolute top-2 right-2 bg-red-500">
                  {subject.newMaterials} New
                </Badge>
              )}
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
              <CardDescription>
                Faculty: {subject.faculty}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <Progress value={subject.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{subject.chapters.completed} of {subject.chapters.total} chapters completed</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects enrolled</h3>
            <p className="text-muted-foreground">Contact your academic advisor to enroll in subjects.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
