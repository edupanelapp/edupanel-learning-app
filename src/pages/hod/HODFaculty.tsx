import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Download, Eye, Mail, Phone, BookOpen, Loader2 } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface FacultyMember {
  id: string
  full_name: string
  email: string
  phone_number?: string
  avatar_url?: string
  designation?: string
  experience_years?: number
  specialization?: string
  subjects: string[]
  students: number
  created_at: string
}

interface DepartmentStats {
  totalFaculty: number
  totalStudents: number
  avgStudentsPerFaculty: number
  facultyWithSubjects: number
}

export default function HODFaculty() {
  const { hodUser } = useHODAuth()
  const { toast } = useToast()
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [filteredFaculty, setFilteredFaculty] = useState<FacultyMember[]>([])
  const [stats, setStats] = useState<DepartmentStats>({
    totalFaculty: 0,
    totalStudents: 0,
    avgStudentsPerFaculty: 0,
    facultyWithSubjects: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (hodUser) {
      fetchFacultyData()
    }
  }, [hodUser])

  useEffect(() => {
    // Filter faculty based on search term
    const filtered = faculty.filter(member =>
      member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredFaculty(filtered)
  }, [faculty, searchTerm])

  const fetchFacultyData = async () => {
    console.log('fetchFacultyData: START');
    console.log('fetchFacultyData: hodUser =', hodUser);
    if (!hodUser) {
      console.log('fetchFacultyData: No hodUser, returning early');
      return;
    }
    try {
      setLoading(true);
      console.log('fetchFacultyData: Fetching faculty profiles...');
      const { data: facultyProfiles, error: facultyError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone_number, avatar_url, created_at')
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application')
        .order('full_name');
      console.log('fetchFacultyData: facultyProfiles result:', facultyProfiles, facultyError);
      if (facultyError) {
        console.error('fetchFacultyData: Error fetching faculty profiles:', facultyError);
        throw facultyError;
      }
      if (!facultyProfiles || facultyProfiles.length === 0) {
        console.log('fetchFacultyData: No faculty profiles found in database');
        setFaculty([]);
        setStats({
          totalFaculty: 0,
          totalStudents: 0,
          avgStudentsPerFaculty: 0,
          facultyWithSubjects: 0
        });
        return;
      }
      console.log('fetchFacultyData: Fetching faculty details...');
      const { data: facultyDetails } = await supabase
        .from('faculty_profiles')
        .select('user_id, designation, experience_years, specialization');
      console.log('fetchFacultyData: facultyDetails result:', facultyDetails);
      const facultyDetailsMap = new Map();
      facultyDetails?.forEach(detail => {
        facultyDetailsMap.set(detail.user_id, detail);
      });
      console.log('fetchFacultyData: Fetching subjects and students for each faculty...');
      const facultyWithSubjectsData = await Promise.all(
        facultyProfiles.map(async (profile) => {
          const { data: subjectsData } = await supabase
            .from('subjects')
            .select('name, id')
            .eq('faculty_id', profile.id)
            .eq('department', 'Centre for Computer Science & Application');
          console.log(`fetchFacultyData: subjectsData for ${profile.id}:`, subjectsData);
          const subjectNames = subjectsData?.map(s => s.name) || [];
          const { count: studentCount } = await supabase
            .from('student_subjects')
            .select('*', { count: 'exact', head: true })
            .in('subject_id', subjectsData?.map(s => s.id) || []);
          console.log(`fetchFacultyData: studentCount for ${profile.id}:`, studentCount);
          const facultyDetail = facultyDetailsMap.get(profile.id);
          return {
            id: profile.id,
            full_name: profile.full_name || 'Unknown',
            email: profile.email,
            phone_number: profile.phone_number,
            avatar_url: profile.avatar_url,
            designation: facultyDetail?.designation || 'Not specified',
            experience_years: facultyDetail?.experience_years,
            specialization: facultyDetail?.specialization,
            subjects: subjectNames,
            students: studentCount || 0,
            created_at: profile.created_at
          };
        })
      );
      console.log('fetchFacultyData: Final facultyWithSubjectsData:', facultyWithSubjectsData);
      setFaculty(facultyWithSubjectsData);
      const totalFaculty = facultyWithSubjectsData.length;
      const totalStudents = facultyWithSubjectsData.reduce((sum, f) => sum + f.students, 0);
      const avgStudentsPerFaculty = totalFaculty > 0 ? Math.round(totalStudents / totalFaculty) : 0;
      const facultyWithSubjects = facultyWithSubjectsData.filter(f => f.subjects.length > 0).length;
      setStats({
        totalFaculty,
        totalStudents,
        avgStudentsPerFaculty,
        facultyWithSubjects
      });
      console.log('fetchFacultyData: Department stats:', {
        totalFaculty,
        totalStudents,
        avgStudentsPerFaculty,
        facultyWithSubjects
      });
    } catch (error) {
      console.error('fetchFacultyData: Caught error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load faculty data',
        variant: 'destructive'
      });
    } finally {
      console.log('fetchFacultyData: Setting loading to false');
      setLoading(false);
      console.log('fetchFacultyData: END');
    }
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    toast({
      title: "Export",
      description: "Export functionality will be implemented soon",
    })
  }

  const handleViewProfile = (facultyId: string) => {
    // TODO: Navigate to faculty profile page
    toast({
      title: "View Profile",
      description: "Profile view functionality will be implemented soon",
    })
  }

  const handleManageSubjects = (facultyId: string) => {
    // TODO: Navigate to subject management page
    toast({
      title: "Manage Subjects",
      description: "Subject management functionality will be implemented soon",
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-lg">Loading faculty data...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Overview</h1>
          <p className="text-muted-foreground">Manage and monitor faculty members in your department</p>
        </div>
        <Button variant="outline" onClick={handleExportReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Search Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, subject, or designation..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Faculty List */}
      <div className="grid gap-6">
        {filteredFaculty.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar_url} alt={member.full_name} />
                    <AvatarFallback className="text-lg">
                      {member.full_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{member.full_name}</h3>
                    <p className="text-muted-foreground">{member.designation}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {member.email}
                      </span>
                      {member.phone_number && (
                      <span className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                          {member.phone_number}
                      </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge variant="outline">
                    {member.experience_years ? `${member.experience_years} years` : 'Experience not specified'}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Assigned Subjects</p>
                  <div className="flex flex-wrap gap-1">
                    {member.subjects.length > 0 ? (
                      member.subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No subjects assigned</span>
                    )}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold">{member.students}</div>
                  <div className="text-xs text-muted-foreground">Total Students</div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(member.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleManageSubjects(member.id)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Manage Subjects
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <CardDescription>Overview of faculty teaching metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.totalFaculty > 0 ? Math.round((stats.facultyWithSubjects / stats.totalFaculty) * 100) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Faculty with Subjects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.avgStudentsPerFaculty}</div>
              <div className="text-sm text-muted-foreground">Avg. Students/Faculty</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {faculty.reduce((sum, f) => sum + f.subjects.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Subject Assignments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.totalFaculty > 0 ? Math.round(stats.totalStudents / stats.totalFaculty) : 0}
              </div>
              <div className="text-sm text-muted-foreground">Students per Faculty</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredFaculty.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-muted-foreground mb-4">
              {searchTerm ? 'No faculty members found matching your search' : 'No faculty members found'}
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'No faculty members have been registered in the Centre for Computer Science & Application department yet. Faculty will appear here once they register and are approved.'
              }
            </p>
            {!searchTerm && (
              <div className="mt-4">
                <Button variant="outline" onClick={() => window.location.href = '/hod/approvals'}>
                  Check Pending Approvals
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
