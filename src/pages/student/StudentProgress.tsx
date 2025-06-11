
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, BookOpen, Award, Target } from "lucide-react"

export default function StudentProgress() {
  const subjects = [
    {
      name: "Data Structures & Algorithms",
      progress: 78,
      chapters: { completed: 6, total: 8 },
      assignments: { completed: 4, total: 5 },
      grade: "B+"
    },
    {
      name: "Object Oriented Programming", 
      progress: 85,
      chapters: { completed: 5, total: 6 },
      assignments: { completed: 5, total: 5 },
      grade: "A"
    },
    {
      name: "Database Management Systems",
      progress: 65,
      chapters: { completed: 4, total: 7 },
      assignments: { completed: 2, total: 4 },
      grade: "B"
    }
  ]

  const overallStats = {
    averageProgress: Math.round(subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length),
    totalChapters: subjects.reduce((sum, s) => sum + s.chapters.total, 0),
    completedChapters: subjects.reduce((sum, s) => sum + s.chapters.completed, 0),
    totalAssignments: subjects.reduce((sum, s) => sum + s.assignments.total, 0),
    completedAssignments: subjects.reduce((sum, s) => sum + s.assignments.completed, 0)
  }

  const achievements = [
    { title: "Fast Learner", description: "Completed 5 chapters in one week", icon: "🚀" },
    { title: "Assignment Pro", description: "Submitted 10 assignments on time", icon: "📝" },
    { title: "Perfect Score", description: "Got 100% in OOP quiz", icon: "⭐" }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Progress</h1>
          <p className="text-muted-foreground">Track your learning journey and achievements</p>
        </div>
      </div>

      {/* Overall Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageProgress}%</div>
            <p className="text-xs text-muted-foreground">Average across all subjects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chapters</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.completedChapters}/{overallStats.totalChapters}
            </div>
            <p className="text-xs text-muted-foreground">Chapters completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallStats.completedAssignments}/{overallStats.totalAssignments}
            </div>
            <p className="text-xs text-muted-foreground">Assignments submitted</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements.length}</div>
            <p className="text-xs text-muted-foreground">Badges earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject-wise Progress</CardTitle>
          <CardDescription>Your progress in each enrolled subject</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{subject.name}</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Grade: {subject.grade}</Badge>
                  <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                </div>
              </div>
              <Progress value={subject.progress} className="h-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Chapters: {subject.chapters.completed}/{subject.chapters.total}</span>
                <span>Assignments: {subject.assignments.completed}/{subject.assignments.total}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Your latest accomplishments and badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Progress Trend</CardTitle>
          <CardDescription>Your learning activity over the past weeks</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-muted rounded-lg">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-2" />
            <p>Progress chart will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
