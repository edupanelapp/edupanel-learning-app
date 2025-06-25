import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Play, FileText, Clock } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface SubjectData {
  id: string
  name: string
  code: string
  description: string
  credits: number
  faculty: {
    full_name: string
  } | null
  assignmentCount: number
  materialCount: number
  progressPercentage: number
}

export default function StudentSubjects() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchEnrolledSubjects()
    }
  }, [user])

  const fetchEnrolledSubjects = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('student_subjects')
        .select(`
          subjects:subject_id (
            id,
            name,
            code,
            description,
            credits,
            faculty:faculty_id (
              full_name
            )
          )
        `)
        .eq('student_id', user.id)

      if (error) throw error

      const subjectsWithDetails = await Promise.all(
        (data || []).map(async (item) => {
          const subject = item.subjects
          if (!subject) return null

          // Get assignment count
          const { count: assignmentCount } = await supabase
            .from('assignments')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          // Get material count - fixed the query structure
          const { count: materialCount } = await supabase
            .from('topic_materials')
            .select(`
              *,
              chapter_topics!inner (
                subject_chapters!inner (
                  subject_id
                )
              )
            `, { count: 'exact', head: true })
            .eq('chapter_topics.subject_chapters.subject_id', subject.id)

          // Get progress percentage
          const { data: progressData } = await supabase
            .from('student_progress')
            .select('completion_percentage')
            .eq('student_id', user.id)
            .eq('subject_id', subject.id)

          const avgProgress = progressData?.length 
            ? progressData.reduce((sum, p) => sum + (p.completion_percentage || 0), 0) / progressData.length
            : 0

          return {
            ...subject,
            assignmentCount: assignmentCount || 0,
            materialCount: materialCount || 0,
            progressPercentage: Math.round(avgProgress)
          }
        })
      )

      setSubjects(subjectsWithDetails.filter(Boolean) as SubjectData[])
    } catch (error: any) {
      console.error('Error fetching subjects:', error)
      toast({
        title: "Error",
        description: "Failed to load enrolled subjects",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewSubject = (subjectId: string) => {
    navigate(`/student/subjects/${subjectId}`)
  }

  const handleViewAssignments = (subjectId: string) => {
    navigate(`/student/assignments?subject=${subjectId}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading subjects...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Subjects</h1>
          <p className="text-muted-foreground">Continue your learning journey across all enrolled subjects at CCSA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow border-primary/20">
            <div className="aspect-video overflow-hidden rounded-t-lg relative bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary" />
              </div>
              <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                {subject.credits} Credits
              </Badge>
              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-background/90 rounded p-2">
                  <div className="text-xs text-muted-foreground mb-1">Progress</div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${subject.progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-primary font-medium mt-1">{subject.progressPercentage}% Complete</div>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg text-primary">{subject.name}</CardTitle>
              <CardDescription className="space-y-1">
                <div>Code: <span className="text-primary font-medium">{subject.code}</span></div>
                {subject.faculty?.full_name && (
                  <div>Faculty: <span className="text-primary font-medium">{subject.faculty.full_name}</span></div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subject.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{subject.assignmentCount} Assignments</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{subject.materialCount} Materials</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleViewSubject(subject.id)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  View Content
                </Button>
                <Button 
                  variant="outline" 
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={() => handleViewAssignments(subject.id)}
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <Card className="text-center py-12 border-primary/20">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-primary">No subjects enrolled</h3>
            <p className="text-muted-foreground">Contact your academic advisor to enroll in subjects for CCSA.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
