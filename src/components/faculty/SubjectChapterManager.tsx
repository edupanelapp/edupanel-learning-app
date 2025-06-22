
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Video, FileText, Edit, Trash2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Chapter {
  id: string
  title: string
  description: string | null
  chapter_number: number
  estimated_hours: number
  difficulty_level: string
  topics: Topic[]
}

interface Topic {
  id: string
  title: string
  description: string | null
  topic_number: number
  estimated_duration: number
  content: string | null
  materials: Material[]
}

interface Material {
  id: string
  title: string
  material_type: string
  file_url: string | null
  video_url: string | null
  content: string | null
}

interface SubjectChapterManagerProps {
  subjectId: string
}

export function SubjectChapterManager({ subjectId }: SubjectChapterManagerProps) {
  const { toast } = useToast()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateChapter, setShowCreateChapter] = useState(false)
  const [showCreateTopic, setShowCreateTopic] = useState(false)
  const [showCreateMaterial, setShowCreateMaterial] = useState(false)
  const [selectedChapterId, setSelectedChapterId] = useState<string>('')
  const [selectedTopicId, setSelectedTopicId] = useState<string>('')
  
  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: '',
    estimated_hours: 4,
    difficulty_level: 'Beginner'
  })

  const [topicForm, setTopicForm] = useState({
    title: '',
    description: '',
    estimated_duration: 30,
    content: ''
  })

  const [materialForm, setMaterialForm] = useState({
    title: '',
    material_type: 'document',
    content: '',
    video_url: ''
  })

  useEffect(() => {
    fetchChapters()
  }, [subjectId])

  const fetchChapters = async () => {
    try {
      const { data: chaptersData, error } = await supabase
        .from('subject_chapters')
        .select(`
          *,
          chapter_topics (
            *,
            topic_materials (*)
          )
        `)
        .eq('subject_id', subjectId)
        .order('chapter_number')

      if (error) throw error

      const formattedChapters = chaptersData?.map(chapter => ({
        ...chapter,
        topics: chapter.chapter_topics?.map((topic: any) => ({
          ...topic,
          materials: topic.topic_materials || []
        })) || []
      })) || []

      setChapters(formattedChapters)
    } catch (error: any) {
      console.error('Error fetching chapters:', error)
      toast({
        title: "Error",
        description: "Failed to load chapters",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChapter = async () => {
    if (!chapterForm.title) {
      toast({
        title: "Error",
        description: "Please enter a chapter title",
        variant: "destructive"
      })
      return
    }

    try {
      const nextChapterNumber = chapters.length + 1

      const { error } = await supabase
        .from('subject_chapters')
        .insert({
          subject_id: subjectId,
          title: chapterForm.title,
          description: chapterForm.description,
          chapter_number: nextChapterNumber,
          estimated_hours: chapterForm.estimated_hours,
          difficulty_level: chapterForm.difficulty_level
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Chapter created successfully"
      })

      setShowCreateChapter(false)
      setChapterForm({
        title: '',
        description: '',
        estimated_hours: 4,
        difficulty_level: 'Beginner'
      })
      fetchChapters()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create chapter",
        variant: "destructive"
      })
    }
  }

  const handleCreateTopic = async () => {
    if (!topicForm.title || !selectedChapterId) {
      toast({
        title: "Error",
        description: "Please enter topic details",
        variant: "destructive"
      })
      return
    }

    try {
      const chapter = chapters.find(c => c.id === selectedChapterId)
      const nextTopicNumber = (chapter?.topics.length || 0) + 1

      const { error } = await supabase
        .from('chapter_topics')
        .insert({
          chapter_id: selectedChapterId,
          title: topicForm.title,
          description: topicForm.description,
          topic_number: nextTopicNumber,
          estimated_duration: topicForm.estimated_duration,
          content: topicForm.content
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Topic created successfully"
      })

      setShowCreateTopic(false)
      setTopicForm({
        title: '',
        description: '',
        estimated_duration: 30,
        content: ''
      })
      fetchChapters()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive"
      })
    }
  }

  const handleCreateMaterial = async () => {
    if (!materialForm.title || !selectedTopicId) {
      toast({
        title: "Error",
        description: "Please enter material details",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('topic_materials')
        .insert({
          topic_id: selectedTopicId,
          title: materialForm.title,
          material_type: materialForm.material_type,
          content: materialForm.content,
          video_url: materialForm.video_url || null
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Material added successfully"
      })

      setShowCreateMaterial(false)
      setMaterialForm({
        title: '',
        material_type: 'document',
        content: '',
        video_url: ''
      })
      fetchChapters()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add material",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading chapters...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Course Content</h2>
        <Dialog open={showCreateChapter} onOpenChange={setShowCreateChapter}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Chapter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chapter</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Chapter Title</Label>
                <Input
                  id="title"
                  value={chapterForm.title}
                  onChange={(e) => setChapterForm({...chapterForm, title: e.target.value})}
                  placeholder="Enter chapter title"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={chapterForm.description}
                  onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
                  placeholder="Chapter description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Estimated Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    value={chapterForm.estimated_hours}
                    onChange={(e) => setChapterForm({...chapterForm, estimated_hours: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    id="difficulty"
                    className="w-full p-2 border rounded"
                    value={chapterForm.difficulty_level}
                    onChange={(e) => setChapterForm({...chapterForm, difficulty_level: e.target.value})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleCreateChapter} className="w-full bg-primary hover:bg-primary/90">
                Create Chapter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Card key={chapter.id} className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary">
                    Chapter {chapter.chapter_number}: {chapter.title}
                  </CardTitle>
                  <CardDescription>{chapter.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{chapter.estimated_hours}h</Badge>
                  <Badge className="bg-primary/10 text-primary">{chapter.difficulty_level}</Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedChapterId(chapter.id)
                      setShowCreateTopic(true)
                    }}
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Topic
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {chapter.topics.map((topic) => (
                  <Card key={topic.id} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Topic {topic.topic_number}: {topic.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{topic.estimated_duration}min</Badge>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => {
                              setSelectedTopicId(topic.id)
                              setShowCreateMaterial(true)
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Material
                          </Button>
                        </div>
                      </div>
                      {topic.description && (
                        <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {topic.materials.map((material) => (
                          <Badge key={material.id} variant="secondary" className="text-xs">
                            {material.material_type === 'video' ? <Video className="h-3 w-3 mr-1" /> : <FileText className="h-3 w-3 mr-1" />}
                            {material.title}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Topic Dialog */}
      <Dialog open={showCreateTopic} onOpenChange={setShowCreateTopic}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topicTitle">Topic Title</Label>
              <Input
                id="topicTitle"
                value={topicForm.title}
                onChange={(e) => setTopicForm({...topicForm, title: e.target.value})}
                placeholder="Enter topic title"
              />
            </div>
            <div>
              <Label htmlFor="topicDescription">Description</Label>
              <Textarea
                id="topicDescription"
                value={topicForm.description}
                onChange={(e) => setTopicForm({...topicForm, description: e.target.value})}
                placeholder="Topic description"
              />
            </div>
            <div>
              <Label htmlFor="duration">Estimated Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={topicForm.estimated_duration}
                onChange={(e) => setTopicForm({...topicForm, estimated_duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={topicForm.content}
                onChange={(e) => setTopicForm({...topicForm, content: e.target.value})}
                placeholder="Topic content"
                rows={4}
              />
            </div>
            <Button onClick={handleCreateTopic} className="w-full bg-primary hover:bg-primary/90">
              Create Topic
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Material Dialog */}
      <Dialog open={showCreateMaterial} onOpenChange={setShowCreateMaterial}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Learning Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="materialTitle">Material Title</Label>
              <Input
                id="materialTitle"
                value={materialForm.title}
                onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                placeholder="Enter material title"
              />
            </div>
            <div>
              <Label htmlFor="materialType">Material Type</Label>
              <select
                id="materialType"
                className="w-full p-2 border rounded"
                value={materialForm.material_type}
                onChange={(e) => setMaterialForm({...materialForm, material_type: e.target.value})}
              >
                <option value="document">Document</option>
                <option value="video">Video</option>
                <option value="presentation">Presentation</option>
                <option value="code">Code Example</option>
              </select>
            </div>
            {materialForm.material_type === 'video' && (
              <div>
                <Label htmlFor="videoUrl">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={materialForm.video_url}
                  onChange={(e) => setMaterialForm({...materialForm, video_url: e.target.value})}
                  placeholder="Enter video URL"
                />
              </div>
            )}
            <div>
              <Label htmlFor="materialContent">Content</Label>
              <Textarea
                id="materialContent"
                value={materialForm.content}
                onChange={(e) => setMaterialForm({...materialForm, content: e.target.value})}
                placeholder="Material content"
                rows={4}
              />
            </div>
            <Button onClick={handleCreateMaterial} className="w-full bg-primary hover:bg-primary/90">
              Add Material
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {chapters.length === 0 && (
        <Card className="text-center py-12 border-primary/20">
          <CardContent>
            <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2 text-primary">No chapters created</h3>
            <p className="text-muted-foreground mb-4">Start building your course content by adding chapters.</p>
            <Button onClick={() => setShowCreateChapter(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Chapter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
