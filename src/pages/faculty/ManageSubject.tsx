import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Users, Plus, Eye, Edit, Trash2, Upload, FileText, Video, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Subject {
  id: string
  name: string
  code: string
  description: string
  credits: number
  semester: number
  faculty_id: string
  department: string
}

interface Chapter {
  id: string
  title: string
  description: string
  chapter_number: number
  subject_id: string
  created_at: string
}

interface Unit {
  id: string
  chapter_id: string
  topic_number: number
  title: string
  description: string
  content: string | null
  key_points: string[] | null
  examples: string | null
  estimated_duration: number | null
  difficulty_level: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface Material {
  id: string
  topic_id: string
  material_type: 'video' | 'pdf'
  title: string
  description: string | null
  file_url: string | null
  content: string | null
  video_url: string | null
  duration: number | null
  file_size: number | null
  mime_type: string | null
  tags: string[] | null
  is_downloadable: boolean
  access_level: string
  uploaded_by: string | null
  created_at: string
  updated_at: string
}

export default function ManageSubject() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [subject, setSubject] = useState<Subject | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [units, setUnits] = useState<Unit[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateChapter, setShowCreateChapter] = useState(false)
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [showAddVideo, setShowAddVideo] = useState(false)
  const [showAddPDF, setShowAddPDF] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: '',
    chapter_number: 1
  })
  
  const [unitForm, setUnitForm] = useState({
    title: '',
    description: '',
    topic_number: 1,
    estimated_duration: 30,
    difficulty_level: 'Beginner',
  })

  const [contentForm, setContentForm] = useState({
    title: '',
    type: 'pdf' as 'video' | 'pdf' | 'document',
    file: null as File | null
  })

  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    file: null as File | null,
    duration: 0,
  })

  const [pdfForm, setPDFForm] = useState({
    title: '',
    description: '',
    file: null as File | null,
    tags: [] as string[],
  })

  // Add state for material dialog
  const [showMaterialDialog, setShowMaterialDialog] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    materialType: 'video',
    file: null as File | null,
    duration: '', // for video
    tags: [] as string[], // for pdf
  });
  const [materialUnit, setMaterialUnit] = useState<Unit | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // File size limits
  const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
  const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB

  // Helper to reset form
  const resetMaterialForm = () => setMaterialForm({
    title: '',
    description: '',
    materialType: 'video',
    file: null,
    duration: '',
    tags: [],
  });

  // Handle file input and video duration
  const handleMaterialFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return setMaterialForm(f => ({ ...f, file: null, duration: '' }));
    if (materialForm.materialType === 'video') {
      if (file.size > MAX_VIDEO_SIZE) {
        toast({ title: 'Error', description: 'Video file too large (max 50MB)', variant: 'destructive' });
        return;
      }
      // Get video duration
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        setMaterialForm(f => ({ ...f, file, duration: Math.round(video.duration).toString() }));
      };
      video.onerror = () => {
        toast({ title: 'Error', description: 'Could not read video file', variant: 'destructive' });
        setMaterialForm(f => ({ ...f, file: null, duration: '' }));
      };
      video.src = url;
    } else if (materialForm.materialType === 'pdf') {
      if (file.size > MAX_PDF_SIZE) {
        toast({ title: 'Error', description: 'PDF file too large (max 10MB)', variant: 'destructive' });
        return;
      }
      setMaterialForm(f => ({ ...f, file }));
    }
  };

  // Handle add/edit material
  const handleSaveMaterial = async () => {
    if (!materialUnit) return;
    if (!materialForm.title || !materialForm.file) {
      toast({ title: 'Error', description: 'Title and file are required', variant: 'destructive' });
      return;
    }
    if (materialForm.materialType === 'video' && (!materialForm.duration || isNaN(Number(materialForm.duration)))) {
      toast({ title: 'Error', description: 'Could not determine video duration', variant: 'destructive' });
      return;
    }
    if (materialForm.materialType === 'pdf' && materialForm.tags.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one tag for PDF', variant: 'destructive' });
      return;
    }
    // Upload file
    const ext = materialForm.file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `units/${materialUnit.id}/${materialForm.materialType}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('course-materials')
      .upload(filePath, materialForm.file);
    if (uploadError) {
      toast({ title: 'Error', description: 'File upload failed', variant: 'destructive' });
      return;
    }
    const { data: { publicUrl } } = supabase.storage
      .from('course-materials')
      .getPublicUrl(filePath);
    // If editing, delete old file and update row
    if (editingMaterial) {
      await supabase
        .from('topic_materials')
        .delete()
        .eq('id', editingMaterial.id);
    }
    // Insert new material
    const insertObj: any = {
      topic_id: materialUnit.id,
      material_type: materialForm.materialType,
      title: materialForm.title,
      description: materialForm.description,
      file_url: publicUrl,
      uploaded_by: user?.id,
    };
    if (materialForm.materialType === 'video') {
      insertObj.duration = Number(materialForm.duration);
    } else if (materialForm.materialType === 'pdf') {
      insertObj.tags = materialForm.tags;
    }
    const { error: dbError } = await supabase
      .from('topic_materials')
      .insert(insertObj);
    if (dbError) {
      toast({ title: 'Error', description: 'Database insert failed', variant: 'destructive' });
      return;
    }
    toast({ title: 'Success', description: editingMaterial ? 'Material updated' : 'Material added' });
    setShowMaterialDialog(false);
    setMaterialUnit(null);
    setEditingMaterial(null);
    resetMaterialForm();
    fetchSubjectData();
  };

  // Handle delete material
  const handleDeleteMaterial = async (material: Material) => {
    if (!window.confirm('Delete this material?')) return;
    // Remove from storage (optional: parse file path from URL)
    await supabase
      .from('topic_materials')
      .delete()
      .eq('id', material.id);
    toast({ title: 'Deleted', description: 'Material deleted' });
    fetchSubjectData();
  };

  // Handle edit material
  const handleEditMaterial = (unit: Unit, material: Material) => {
    setMaterialUnit(unit);
    setEditingMaterial(material);
    setMaterialForm({
      title: material.title,
      description: material.description || '',
      materialType: material.material_type,
      file: null,
      duration: material.duration ? material.duration.toString() : '',
      tags: material.tags || [],
    });
    setShowMaterialDialog(true);
  };

  useEffect(() => {
    if (subjectId && user) {
      fetchSubjectData()
    }
  }, [subjectId, user])

  const fetchSubjectData = async () => {
    if (!subjectId || !user) return
    setLoading(true)
    try {
      // Fetch subject details
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .eq('faculty_id', user.id)
        .single()
      if (subjectError) throw subjectError
      setSubject(subjectData)
      // Fetch chapters
      const { data: chaptersData, error: chaptersError } = await supabase
        .from('subject_chapters')
        .select('*')
        .eq('subject_id', subjectId)
        .order('chapter_number')
      if (chaptersError) throw chaptersError
      setChapters(chaptersData || [])
      // Fetch units (topics)
      const chapterIds = (chaptersData || []).map((c: Chapter) => c.id)
      const { data: unitsData, error: unitsError } = await supabase
        .from('chapter_topics')
        .select('*')
        .in('chapter_id', chapterIds)
        .order('topic_number')
      if (unitsError) throw unitsError
      setUnits(unitsData || [])
      // Fetch materials
      const unitIds = (unitsData || []).map((u: Unit) => u.id)
      const { data: materialsData, error: materialsError } = await supabase
        .from('topic_materials')
        .select('*')
        .in('topic_id', unitIds)
      if (materialsError) throw materialsError
      setMaterials((materialsData || []).map((m: any) => ({ ...m, material_type: m.material_type as 'video' | 'pdf' })));
    } catch (error: any) {
      console.error('Error fetching subject data:', error)
      toast({
        title: "Error",
        description: "Failed to load subject data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChapter = async () => {
    if (!subjectId || !chapterForm.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('subject_chapters')
        .insert({
          title: chapterForm.title,
          description: chapterForm.description,
          chapter_number: chapterForm.chapter_number,
          subject_id: subjectId
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
        chapter_number: 1
      })
      fetchSubjectData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create chapter",
        variant: "destructive"
      })
    }
  }

  const handleAddUnit = async () => {
    if (!selectedChapter || !unitForm.title) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }
    try {
      const { error } = await supabase
        .from('chapter_topics')
        .insert({
          chapter_id: selectedChapter.id,
          topic_number: unitForm.topic_number,
          title: unitForm.title,
          description: unitForm.description,
          estimated_duration: unitForm.estimated_duration,
          difficulty_level: unitForm.difficulty_level,
          is_active: true,
        })
      if (error) throw error
      toast({
        title: "Success",
        description: "Unit added successfully"
      })
      setShowAddUnit(false)
      setUnitForm({
        title: '',
        description: '',
        topic_number: 1,
        estimated_duration: 30,
        difficulty_level: 'Beginner',
      })
      setSelectedChapter(null)
      fetchSubjectData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add unit",
        variant: "destructive"
      })
    }
  }

  const handleAddVideo = async () => {
    console.log('[DEBUG] handleAddVideo called', { selectedUnit, videoForm });
    if (!selectedUnit || !videoForm.title || !videoForm.file || !(videoForm.file instanceof File)) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a valid file",
        variant: "destructive"
      });
      console.error('[DEBUG] handleAddVideo missing fields', { selectedUnit, videoForm });
      return;
    }
    setUploading(true);
    try {
      const fileExt = videoForm.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `units/${selectedUnit.id}/video/${fileName}`;
      console.log('[DEBUG] Uploading video to:', filePath, videoForm.file);
      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, videoForm.file);
      if (uploadError) {
        console.error('[DEBUG] Supabase upload error:', uploadError);
        throw uploadError;
      }
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath);
      console.log('[DEBUG] Video public URL:', publicUrl);
      const existingVideo = materials.find(m => m.topic_id === selectedUnit.id && m.material_type === 'video');
      if (existingVideo) {
        await supabase
          .from('topic_materials')
          .delete()
          .eq('id', existingVideo.id);
        console.log('[DEBUG] Deleted existing video:', existingVideo.id);
      }
      const { error: dbError } = await supabase
        .from('topic_materials')
        .insert({
          topic_id: selectedUnit.id,
          material_type: 'video',
          title: videoForm.title,
          description: videoForm.description,
          file_url: publicUrl,
          duration: videoForm.duration,
          uploaded_by: user?.id,
        });
      if (dbError) {
        console.error('[DEBUG] Supabase DB insert error:', dbError);
        throw dbError;
      }
      toast({
        title: "Success",
        description: "Video uploaded successfully"
      });
      setShowAddVideo(false);
      setVideoForm({ title: '', description: '', file: null, duration: 0 });
      setSelectedUnit(null);
      fetchSubjectData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload video",
        variant: "destructive"
      });
      console.error('[DEBUG] handleAddVideo error:', error);
    } finally {
      setUploading(false);
    }
  }

  const handleAddPDF = async () => {
    if (!selectedUnit || !pdfForm.title || !pdfForm.file || pdfForm.tags.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields, select a file, and add at least one tag",
        variant: "destructive"
      })
      return
    }
    setUploading(true)
    try {
      // Upload PDF to storage
      const fileExt = pdfForm.file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `units/${selectedUnit.id}/pdf/${fileName}`
      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(filePath, pdfForm.file)
      if (uploadError) throw uploadError
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-materials')
        .getPublicUrl(filePath)
      // Save PDF record
      const { error: dbError } = await supabase
        .from('topic_materials')
        .insert({
          topic_id: selectedUnit.id,
          material_type: 'pdf',
          title: pdfForm.title,
          description: pdfForm.description,
          file_url: publicUrl,
          tags: pdfForm.tags,
          uploaded_by: user?.id,
        })
      if (dbError) throw dbError
      toast({
        title: "Success",
        description: "PDF uploaded successfully"
      })
      setShowAddPDF(false)
      setPDFForm({ title: '', description: '', file: null, tags: [] })
      setSelectedUnit(null)
      fetchSubjectData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to upload PDF",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Are you sure you want to delete this chapter? This will also delete all associated content.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('subject_chapters')
        .delete()
        .eq('id', chapterId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Chapter deleted successfully"
      })
      fetchSubjectData()
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive"
      })
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'pdf':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading subject...</div>
        </div>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Subject not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/faculty/subjects')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">{subject.name}</h1>
          <p className="text-muted-foreground">
            {subject.code} • {subject.credits} Credits • Semester {subject.semester}
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <BookOpen className="h-8 w-8 mx-auto text-primary mb-2" />
                  <div className="text-2xl font-bold text-primary">{chapters.length}</div>
                  <div className="text-sm text-muted-foreground">Chapters</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <FileText className="h-8 w-8 mx-auto text-secondary mb-2" />
                  <div className="text-2xl font-bold text-secondary">
                    {units.length}
                  </div>
                  <div className="text-sm text-muted-foreground">Units</div>
                </div>
                <div className="text-center p-4 bg-accent/10 rounded-lg">
                  <Video className="h-8 w-8 mx-auto text-accent-foreground mb-2" />
                  <div className="text-2xl font-bold text-accent-foreground">
                    {materials.filter(m => m.material_type === 'video').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </div>
              </div>
              
              {subject.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{subject.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Chapters</h2>
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
                  <DialogDescription>
                    Add a new chapter to organize your course content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="chapter-title">Chapter Title</Label>
                    <Input
                      id="chapter-title"
                      value={chapterForm.title}
                      onChange={(e) => setChapterForm({...chapterForm, title: e.target.value})}
                      placeholder="e.g., Introduction to Data Structures"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chapter-description">Description</Label>
                    <Textarea
                      id="chapter-description"
                      value={chapterForm.description}
                      onChange={(e) => setChapterForm({...chapterForm, description: e.target.value})}
                      placeholder="Chapter description"
                    />
                  </div>
                  <div>
                    <Label htmlFor="chapter-number">Chapter Number</Label>
                    <Input
                      id="chapter-number"
                      type="number"
                      value={chapterForm.chapter_number}
                      onChange={(e) => setChapterForm({...chapterForm, chapter_number: parseInt(e.target.value)})}
                    />
                  </div>
                  <Button onClick={handleCreateChapter} className="w-full bg-primary hover:bg-primary/90">
                    Create Chapter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {chapters.map((chapter) => (
              <Card key={chapter.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Chapter {chapter.chapter_number}</CardTitle>
                      <CardDescription className="mt-1">{chapter.title}</CardDescription>
                    </div>
                    <Badge variant="secondary">#{chapter.chapter_number}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chapter.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chapter.description}
                    </p>
                  )}
                  <div className="flex space-x-2 mb-2">
                    <Button 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setSelectedChapter(chapter)
                        setShowAddUnit(true)
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Unit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* List units for this chapter */}
                  <div className="pl-4 border-l-2 border-primary/20 space-y-4">
                    {units.filter(u => u.chapter_id === chapter.id).length === 0 && (
                      <div className="text-muted-foreground text-sm">No units added yet.</div>
                    )}
                    {units.filter(u => u.chapter_id === chapter.id).map(unit => (
                      <div key={unit.id} className="bg-secondary/10 rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-primary">Unit {unit.topic_number}: {unit.title}</div>
                            <div className="text-xs text-muted-foreground mb-1">{unit.description}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => { setMaterialUnit(unit); setEditingMaterial(null); resetMaterialForm(); setShowMaterialDialog(true); }}>Add Unit Material</Button>
                        </div>
                        {/* List existing materials for this unit */}
                        <div className="mt-2 space-y-2">
                          {materials.filter(m => m.topic_id === unit.id).length === 0 ? (
                            <div className="text-xs text-muted-foreground">No materials added.</div>
                          ) : (
                            materials.filter(m => m.topic_id === unit.id).map(material => (
                              <div key={material.id} className="flex items-center gap-2 bg-background rounded p-2">
                                <span className="font-semibold">{material.title}</span>
                                <span className="text-xs text-muted-foreground">{material.material_type}</span>
                                {material.material_type === 'video' && <span className="text-xs">Duration: {material.duration} sec</span>}
                                {material.material_type === 'pdf' && material.tags && <span className="text-xs">[{material.tags.join(', ')}]</span>}
                                <Button size="sm" variant="outline" onClick={() => window.open(material.file_url || '', '_blank')}>View</Button>
                                <Button size="sm" variant="outline" onClick={() => handleEditMaterial(unit, material)}>Edit</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteMaterial(material)}>Delete</Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {chapters.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">No chapters created</h3>
                <p className="text-muted-foreground mb-4">Start by creating your first chapter to organize your course content.</p>
                <Button onClick={() => setShowCreateChapter(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Chapter
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">All Content</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>
                All uploaded videos, PDFs, and documents organized by chapter
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => {
                    const chapter = chapters.find(c => c.id === material.topic_id)
                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getContentIcon(material.material_type)}
                            <Badge variant="outline" className="capitalize">
                              {material.material_type}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {chapter ? `Chapter ${chapter.chapter_number}: ${chapter.title}` : 'Unknown Chapter'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {/* Removed material.file_name */}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(material.file_url, '_blank')}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteMaterial(material)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {materials.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No content uploaded</h3>
                  <p className="text-muted-foreground">Start by adding content to your chapters.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Unit Dialog */}
      <Dialog open={showAddUnit} onOpenChange={setShowAddUnit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Unit to Chapter {selectedChapter?.chapter_number}</DialogTitle>
            <DialogDescription>
              Add a new unit to organize your course content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="unit-title">Unit Title</Label>
              <Input
                id="unit-title"
                value={unitForm.title}
                onChange={(e) => setUnitForm({...unitForm, title: e.target.value})}
                placeholder="e.g., Introduction to Data Structures"
              />
            </div>
            <div>
              <Label htmlFor="unit-description">Description</Label>
              <Textarea
                id="unit-description"
                value={unitForm.description}
                onChange={(e) => setUnitForm({...unitForm, description: e.target.value})}
                placeholder="Unit description"
              />
            </div>
            <div>
              <Label htmlFor="unit-number">Unit Number</Label>
              <Input
                id="unit-number"
                type="number"
                value={unitForm.topic_number}
                onChange={(e) => setUnitForm({...unitForm, topic_number: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="unit-duration">Estimated Duration (minutes)</Label>
              <Input
                id="unit-duration"
                type="number"
                value={unitForm.estimated_duration}
                onChange={(e) => setUnitForm({...unitForm, estimated_duration: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="unit-difficulty">Difficulty Level</Label>
              <select
                id="unit-difficulty"
                value={unitForm.difficulty_level}
                onChange={(e) => setUnitForm({...unitForm, difficulty_level: e.target.value})}
                className="w-full p-2 border rounded-md"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <Button 
              onClick={handleAddUnit} 
              className="w-full bg-primary hover:bg-primary/90"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Upload className="h-4 w-4 mr-2 animate-spin" />
                  Adding Unit...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Add Unit
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Material Dialog */}
      {showMaterialDialog && (
        <Dialog open={showMaterialDialog} onOpenChange={(open) => {
          setShowMaterialDialog(open);
          if (!open) {
            setMaterialUnit(null);
            setEditingMaterial(null);
            resetMaterialForm();
          }
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMaterial ? 'Edit' : 'Add'} Material for Unit {materialUnit?.topic_number}: {materialUnit?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="material-title">Title</Label>
                <Input
                  id="material-title"
                  value={materialForm.title}
                  onChange={e => setMaterialForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Material title"
                />
              </div>
              <div>
                <Label htmlFor="material-description">Description</Label>
                <Textarea
                  id="material-description"
                  value={materialForm.description}
                  onChange={e => setMaterialForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Material description"
                />
              </div>
              <div>
                <Label htmlFor="material-type">Material Type</Label>
                <select
                  id="material-type"
                  value={materialForm.materialType}
                  onChange={e => setMaterialForm(f => ({ ...f, materialType: e.target.value as 'video' | 'pdf', file: null, duration: '', tags: [] }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              {materialForm.materialType === 'video' && (
                <>
                  <div>
                    <Label htmlFor="material-video">Video File (max 50MB)</Label>
                    <Input
                      id="material-video"
                      type="file"
                      accept="video/*"
                      onChange={handleMaterialFileChange}
                    />
                  </div>
                  <div>
                    <Label>Duration (seconds)</Label>
                    <Input value={materialForm.duration} readOnly placeholder="Auto-fetched from video" />
                  </div>
                </>
              )}
              {materialForm.materialType === 'pdf' && (
                <>
                  <div>
                    <Label htmlFor="material-pdf">PDF File (max 10MB)</Label>
                    <Input
                      id="material-pdf"
                      type="file"
                      accept="application/pdf,.pdf"
                      onChange={handleMaterialFileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="material-tags">Tags</Label>
                    <select
                      id="material-tags"
                      multiple
                      value={materialForm.tags}
                      onChange={e => {
                        const options = Array.from(e.target.selectedOptions).map(o => o.value);
                        setMaterialForm(f => ({ ...f, tags: options }));
                      }}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="notes">Notes</option>
                      <option value="pyq">PYQ</option>
                      <option value="imp questions">Imp Questions</option>
                      <option value="mcq">MCQ</option>
                    </select>
                  </div>
                </>
              )}
              <Button onClick={handleSaveMaterial} className="w-full bg-primary hover:bg-primary/90">
                {editingMaterial ? 'Update' : 'Add'} Material
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 