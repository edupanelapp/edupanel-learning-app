
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Rocket, Calendar, User } from "lucide-react"

export default function FacultyProjects() {
  const projects = [
    {
      id: 1,
      title: "E-Commerce Website Development",
      description: "Build a full-stack e-commerce platform using React and Node.js",
      difficulty: "Advanced",
      techStack: ["React", "Node.js", "MongoDB"],
      duration: "8 weeks",
      submissions: 5,
      status: "active"
    },
    {
      id: 2,
      title: "Mobile App for Task Management",
      description: "Create a mobile application for personal task management",
      difficulty: "Intermediate", 
      techStack: ["React Native", "Firebase"],
      duration: "6 weeks",
      submissions: 8,
      status: "active"
    },
    {
      id: 3,
      title: "Machine Learning Stock Predictor",
      description: "Develop a ML model to predict stock prices using historical data",
      difficulty: "Advanced",
      techStack: ["Python", "TensorFlow", "Pandas"],
      duration: "10 weeks", 
      submissions: 3,
      status: "completed"
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Create and mentor student projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center space-x-2">
                    <Rocket className="h-5 w-5" />
                    <span>{project.title}</span>
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {project.description}
                  </CardDescription>
                </div>
                <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                  {project.status}
                </Badge>
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

              <div className="flex items-center justify-between">
                <div className="flex space-x-6 text-sm text-muted-foreground">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Duration: {project.duration}
                  </span>
                  <span className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {project.submissions} submissions
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View Submissions
                  </Button>
                  <Button size="sm">Edit Project</Button>
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
            <h3 className="text-lg font-semibold mb-2">No projects created</h3>
            <p className="text-muted-foreground mb-4">Start creating projects to guide your students</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
