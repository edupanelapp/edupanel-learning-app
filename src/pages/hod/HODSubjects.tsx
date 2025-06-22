
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, Plus, Edit, User, Trash } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  id: string
  name: string
  code: string
  semester: number | null
  credits: number
  description: string | null
  faculty_id: string | null
  faculty?: {
    full_name: string
    avatar_url?: string
  }
  studentCount?: number
  status: string
}

interface Faculty {
  id: string
  full_name: string
  email: string
  avatar_url?: string
}

interface CreateSubjectData {
  name: string
  code: string
  description?: string
  credits: number
  semester: number
}

export default function HODSubjects() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [faculty, setFaculty] = useState<Faculty[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>("")
  const [newSubject, setNewSubject] = useState<CreateSubjectData>({
    name: "",
    code: "",
    description: "",
    credits: 3,
    semester: 1
  })

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    if (!user) return

    try {
      // Fetch subjects with faculty information
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select(`
          *,
          faculty:faculty_id (
            full_name,
            avatar_url
          )
        `)
        .eq('department', 'Centre for Computer Science & Application')
        .order('created_at', { ascending: false })

      if (subjectsError) throw subjectsError

      // Get student counts for each subject
      const subjectsWithCounts = await Promise.all(
        (subjectsData || []).map(async (subject) => {
          const { count } = await supabase
            .from('student_subjects')
            .select('*', { count: 'exact', head: true })
            .eq('subject_id', subject.id)

          return {
            ...subject,
            studentCount: count || 0,
            status: subject.faculty_id ? 'active' : 'unassigned'
          }
        })
      )

      setSubjects(subjectsWithCounts)

      // Fetch available faculty
      const { data: facultyData, error: facultyError } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_url')
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application')
        .order('full_name')

      if (facultyError) throw facultyError

      setFaculty(facultyData || [])

    } catch (error: any) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load subjects data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubject = async () => {
    if (!newSubject.name || !newSubject.code) {
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
          name: newSubject.name,
          code: newSubject.code,
          description: newSubject.description || null,
          credits: newSubject.credits,
          semester: newSubject.semester,
          department: 'Centre for Computer Science & Application'
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject created successfully"
      })

      setIsCreateDialogOpen(false)
      setNewSubject({
        name: "",
        code: "",
        description: "",
        credits: 3,
        semester: 1
      })
      fetchData()

    } catch (error: any) {
      console.error('Error creating subject:', error)
      toast({
        title: "Error",
        description: "Failed to create subject",
        variant: "destructive"
      })
    }
  }

  const handleAssignFaculty = async () => {
    if (!selectedSubject || !selectedFacultyId) return

    try {
      const { error } = await supabase
        .from('subjects')
        .update({ faculty_id: selectedFacultyId })
        .eq('id', selectedSubject.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Faculty assigned successfully"
      })

      setIsAssignDialogOpen(false)
      setSelectedSubject(null)
      setSelectedFacultyId("")
      fetchData()

    } catch (error: any) {
      console.error('Error assigning faculty:', error)
      toast({
        title: "Error",
        description: "Failed to assign faculty",
        variant: "destructive"
      })
    }
  }

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subject deleted successfully"
      })

      fetchData()

    } catch (error: any) {
      console.error('Error deleting subject:', error)
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive"
      })
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
          <h1 className="text-3xl font-bold text-foreground">Subject Management</h1>
          <p className="text-muted-foreground">Manage subjects and assign faculty members</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Subject</DialogTitle>
              <DialogDescription>
                Add a new subject to the Centre for Computer Science & Application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="col-span-3"
                  placeholder="Subject name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input
                  id="code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                  className="col-span-3"
                  placeholder="e.g., CSE301"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credits" className="text-right">Credits</Label>
                <Input
                  id="credits"
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) })}
                  className="col-span-3"
                  min="1"
                  max="6"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="semester" className="text-right">Semester</Label>
                <Select 
                  value={newSubject.semester.toString()} 
                  onValueChange={(value) => setNewSubject({ ...newSubject, semester: parseInt(value) })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((sem) => (
                      <SelectItem key={sem} value={sem.toString()}>
                        Semester {sem}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Input
                  id="description"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  className="col-span-3"
                  placeholder="Brief description (optional)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateSubject}>Create Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{subject.name}</span>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {subject.code} • Semester {subject.semester} • {subject.credits} Credits
                  </CardDescription>
                </div>
                <Badge variant={subject.status === 'active' ? 'default' : 'secondary'}>
                  {subject.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {subject.faculty ? (
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={subject.faculty.avatar_url} alt={subject.faculty.full_name} />
                        <AvatarFallback>
                          {subject.faculty.full_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{subject.faculty.full_name}</p>
                        <p className="text-xs text-muted-foreground">Assigned Faculty</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">No faculty assigned</p>
                        <p className="text-xs text-muted-foreground">Awaiting assignment</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{subject.studentCount} students</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {!subject.faculty_id && (
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedSubject(subject)
                        setIsAssignDialogOpen(true)
                      }}
                    >
                      Assign Faculty
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedSubject(subject)
                      setIsAssignDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {subject.faculty_id ? 'Reassign' : 'Assign'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteSubject(subject.id)}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Faculty Assignment Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Faculty</DialogTitle>
            <DialogDescription>
              Select a faculty member to assign to {selectedSubject?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={selectedFacultyId} onValueChange={setSelectedFacultyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select faculty member" />
              </SelectTrigger>
              <SelectContent>
                {faculty.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.full_name} ({f.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAssignFaculty} disabled={!selectedFacultyId}>
              Assign Faculty
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Faculty Workload Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Faculty Workload Distribution</CardTitle>
          <CardDescription>Overview of subject assignments across faculty members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculty.map((f) => {
              const assignedSubjects = subjects.filter(s => s.faculty_id === f.id).length
              return (
                <div key={f.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={f.avatar_url} alt={f.full_name} />
                      <AvatarFallback>{f.full_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{f.full_name}</p>
                      <p className="text-xs text-muted-foreground">{assignedSubjects} subjects</p>
                    </div>
                  </div>
                  <Badge variant="outline">{assignedSubjects}</Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {subjects.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground mb-4">Start by adding subjects to your department</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Subject
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
