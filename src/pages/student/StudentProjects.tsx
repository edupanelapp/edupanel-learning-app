import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, Calendar, User, Upload, Eye } from "lucide-react"

export default function StudentProjects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Website Development", 
      description: "Build a full-stack e-commerce platform using React and Node.js",
      mentor: "Dr. John Smith",
      difficulty: "Advanced",
      techStack: ["React", "Node.js", "MongoDB"],
      duration: "8 weeks",
      progress: 65,
      status: "in-progress",
      submittedFiles: 3
    },
    {
      id: 2,
      title: "Mobile App for Task Management",
      description: "Create a mobile application for personal task management",
      mentor: "Prof. Mary Wilson", 
      difficulty: "Intermediate",
      techStack: ["React Native", "Firebase"],
      duration: "6 weeks",
      progress: 40,
      status: "in-progress",
      submittedFiles: 1
    },
    {
      id: 3,
      title: "Student Management System",
      description: "Develop a web-based student management system with dashboard",
      mentor: "Dr. Sarah Johnson",
      difficulty: "Beginner",
      techStack: ["HTML", "CSS", "JavaScript", "PHP"],
      duration: "4 weeks", 
      progress: 100,
      status: "completed",
      submittedFiles: 5,
      grade: "A"
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground">Track and submit your academic projects</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Eye className="h-4 w-4 mr-2" />
          Browse Available Projects
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5" />
                    <span>{project.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                  {project.grade && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      Grade: {project.grade}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className={getDifficultyColor(project.difficulty)}>
                  {project.difficulty}
                </Badge>
                <div className="flex flex-wrap gap-1">
                  {project.techStack.map((tech, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Mentor: {project.mentor}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration: {project.duration}
                  </span>
                  <span>{project.submittedFiles} files submitted</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  {project.status !== 'completed' && (
                    <Button size="sm">
                      <Upload className="h-4 w-4 mr-1" />
                      Submit Work
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No projects assigned</h3>
            <p className="text-muted-foreground mb-4">Browse available projects or wait for your mentor to assign one</p>
            <Button className="w-full sm:w-auto">
              <Eye className="h-4 w-4 mr-2" />
              Browse Available Projects
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
