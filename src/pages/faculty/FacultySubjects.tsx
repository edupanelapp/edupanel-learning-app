import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Users, Plus, Eye, Edit } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

interface Subject {
  id: string
  name: string
  code: string
  description: string
  credits: number
  semester: number
  studentCount: number
  chaptersCount: number
  assignmentsCount: number
}

export default function FacultySubjects() {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateSubject, setShowCreateSubject] = useState(false)
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    description: '',
    credits: 3,
    semester: 1
  })

  useEffect(() => {
    if (user) {
      fetchSubjects()
    }
  }, [user])

  const fetchSubjects = async () => {
    if (!user) return

    try {
      const { data: subjectsData, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('faculty_id', user.id)
        .eq('department', 'Centre for Computer Science & Application')

      if (error) throw error

      const subjectsWithCounts = await Promise.all(
        (subjectsData || []).map(async (subject) => {
          // Get student count
          const { count: studentCount } = await supabase
            .from('student_subjects')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          // Get chapters count
          const { count: chaptersCount } = await supabase
            .from('subject_chapters')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          // Get assignments count
          const { count: assignmentsCount } = await supabase
            .from('assignments')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          return {
            ...subject,
            studentCount: studentCount || 0,
            chaptersCount: chaptersCount || 0,
            assignmentsCount: assignmentsCount || 0
          }
        })
      )

      setSubjects(subjectsWithCounts)
    } catch (error: any) {
      console.error('Error fetching subjects:', error)
      toast({
        title: "Error",
        description: "Failed to load subjects",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubject = async () => {
    if (!subjectForm.name || !subjectForm.code) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('subjects')
        .insert({
          name: subjectForm.name,
          code: subjectForm.code,
          description: subjectForm.description,
          credits: subjectForm.credits,
          semester: subjectForm.semester,
          faculty_id: user?.id,
          department: 'Centre for Computer Science & Application'
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject created successfully"
      })
      
      setShowCreateSubject(false)
      setSubjectForm({
        name: '',
        code: '',
        description: '',
        credits: 3,
        semester: 1
      })
      fetchSubjects()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive"
      })
    }
  }

  const handleManageSubject = (subjectId: string) => {
    navigate(`/faculty/subjects/${subjectId}`)
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
          <p className="text-muted-foreground">Manage your teaching subjects and course materials at CCSA</p>
        </div>
        <Dialog open={showCreateSubject} onOpenChange={setShowCreateSubject}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Add a new subject to your teaching portfolio
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Subject Name</Label>
                  <Input
                    id="name"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                    placeholder="e.g., Data Structures"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Subject Code</Label>
                  <Input
                    id="code"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                    placeholder="e.g., CS301"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={subjectForm.description}
                  onChange={(e) => setSubjectForm({...subjectForm, description: e.target.value})}
                  placeholder="Subject description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={subjectForm.credits}
                    onChange={(e) => setSubjectForm({...subjectForm, credits: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    type="number"
                    value={subjectForm.semester}
                    onChange={(e) => setSubjectForm({...subjectForm, semester: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <Button onClick={handleCreateSubject} className="w-full bg-primary hover:bg-primary/90">
                Create Subject
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-primary">{subject.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {subject.code} • Semester {subject.semester}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {subject.studentCount} students
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {subject.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {subject.description}
                </p>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {subject.chaptersCount} chapters
                </span>
                <span className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {subject.assignmentsCount} assignments
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => handleManageSubject(subject.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Manage
                </Button>
                {/* Edit button disabled - may be implemented later
                <Button variant="outline" size="icon" className="border-primary text-primary hover:bg-primary/10">
                  <Edit className="h-4 w-4" />
                </Button>
                */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {subjects.length === 0 && (
        <Card className="text-center py-12 border-primary/20">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-primary">No subjects created</h3>
            <p className="text-muted-foreground mb-4">Start by creating your first subject for CCSA students.</p>
            <Button onClick={() => setShowCreateSubject(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Subject
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
