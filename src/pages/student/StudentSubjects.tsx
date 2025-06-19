
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, FileText, Users } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface SubjectData {
  id: string
  name: string
  code: string
  description: string
  credits: number
  faculty: {
    full_name: string
  }
  assignmentCount: number
}

export default function StudentSubjects() {
  const { user } = useAuth()
  const { toast } = useToast()
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

      // Get assignment counts for each subject
      const subjectsWithAssignments = await Promise.all(
        (data || []).map(async (item) => {
          const subject = item.subjects
          if (!subject) return null

          const { count } = await supabase
            .from('assignments')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          return {
            ...subject,
            assignmentCount: count || 0
          }
        })
      )

      setSubjects(subjectsWithAssignments.filter(Boolean) as SubjectData[])
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
          <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
          <p className="text-muted-foreground">Continue your learning journey across all enrolled subjects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden rounded-t-lg relative bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-blue-500" />
              </div>
              <Badge className="absolute top-2 right-2 bg-blue-500">
                {subject.credits} Credits
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
              <CardDescription className="space-y-1">
                <div>Code: {subject.code}</div>
                {subject.faculty?.full_name && (
                  <div>Faculty: {subject.faculty.full_name}</div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {subject.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{subject.assignmentCount} Assignments</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  View Details
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
