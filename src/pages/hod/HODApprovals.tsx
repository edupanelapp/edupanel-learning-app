import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, XCircle, Eye, Clock, Mail, Phone, Users, FileText, AlertCircle } from "lucide-react"
import { useHODAuth } from "@/hooks/useHODAuth"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FacultyApproval {
  id: string
  full_name: string
  email: string
  phone_number?: string
  department: string
  created_at: string
  avatar_url?: string
}

interface AssignmentUpdate {
  id: string
  assignment_id: string
  student_id: string
  update_type: string
  status: string
  marks_awarded?: number
  feedback?: string
  created_at: string
  assignment_title?: string
  student_name?: string
}

interface RecentApproval {
  id: string
  name: string
  type: string
  status: string
  date: string
  avatar?: string
}

export default function HODApprovals() {
  const { hodUser } = useHODAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [facultyApprovals, setFacultyApprovals] = useState<FacultyApproval[]>([])
  const [assignmentUpdates, setAssignmentUpdates] = useState<AssignmentUpdate[]>([])
  const [recentApprovals, setRecentApprovals] = useState<RecentApproval[]>([])

  useEffect(() => {
    if (hodUser) {
      fetchApprovalData()
    }
  }, [hodUser])

  const fetchApprovalData = async () => {
    console.log('fetchApprovalData: START');
    console.log('fetchApprovalData: hodUser =', hodUser);
    if (!hodUser) {
      console.log('fetchApprovalData: No hodUser, returning early');
      return;
    }
    try {
      setLoading(true);
      console.log('fetchApprovalData: Fetching approved faculty IDs...');
      const { data: approvedFacultyIds, error: approvedError } = await supabase
        .from('faculty_profiles')
        .select('user_id');
      console.log('fetchApprovalData: approvedFacultyIds result:', approvedFacultyIds, approvedError);
      if (approvedError) {
        console.error('fetchApprovalData: Error fetching approved faculty IDs:', approvedError);
        throw approvedError;
      }
      const approvedIds = approvedFacultyIds?.map(f => f.user_id) || [];
      console.log('fetchApprovalData: approvedIds =', approvedIds);
      console.log('fetchApprovalData: Fetching all faculty...');
      const { data: allFaculty, error: facultyError } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone_number, department, created_at, avatar_url')
        .eq('role', 'faculty')
        .eq('department', 'Centre for Computer Science & Application')
        .order('created_at', { ascending: false });
      console.log('fetchApprovalData: allFaculty result:', allFaculty, facultyError);
      if (facultyError) {
        console.error('fetchApprovalData: Error fetching all faculty:', facultyError);
        throw facultyError;
      }
      const pendingFaculty = allFaculty?.filter(faculty => !approvedIds.includes(faculty.id)) || [];
      console.log('fetchApprovalData: pendingFaculty =', pendingFaculty);
      console.log('fetchApprovalData: Fetching assignment updates...');
      const { data: pendingAssignments, error: assignmentError } = await supabase
        .from('assignment_updates')
        .select(`
          id,
          assignment_id,
          student_id,
          update_type,
          status,
          marks_awarded,
          feedback,
          created_at
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      console.log('fetchApprovalData: pendingAssignments result:', pendingAssignments, assignmentError);
      if (assignmentError) {
        console.error('fetchApprovalData: Error fetching assignment updates:', assignmentError);
        throw assignmentError;
      }
      const processedAssignments = await Promise.all(
        (pendingAssignments || []).map(async (item) => {
          const { data: assignmentData } = await supabase
            .from('assignments')
            .select('title')
            .eq('id', item.assignment_id)
            .single();
          const { data: studentData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', item.student_id)
            .single();
          return {
            id: item.id,
            assignment_id: item.assignment_id,
            student_id: item.student_id,
            update_type: item.update_type,
            status: item.status,
            marks_awarded: item.marks_awarded,
            feedback: item.feedback,
            created_at: item.created_at,
            assignment_title: assignmentData?.title || 'Unknown Assignment',
            student_name: studentData?.full_name || 'Unknown Student'
          };
        })
      );
      console.log('fetchApprovalData: processedAssignments =', processedAssignments);
      console.log('fetchApprovalData: Fetching recent approvals...');
      const { data: recentFaculty, error: recentError } = await supabase
        .from('faculty_profiles')
        .select(`
          id,
          created_at,
          profiles!inner(full_name, avatar_url, department)
        `)
        .eq('profiles.department', 'Centre for Computer Science & Application')
        .order('created_at', { ascending: false })
        .limit(5);
      console.log('fetchApprovalData: recentFaculty result:', recentFaculty, recentError);
      if (recentError) {
        console.error('fetchApprovalData: Error fetching recent approvals:', recentError);
        throw recentError;
      }
      const processedRecent = recentFaculty?.map(item => ({
        id: item.id,
        name: item.profiles?.full_name || 'Unknown',
        type: 'Faculty Profile',
        status: 'Approved',
        date: new Date(item.created_at).toLocaleDateString(),
        avatar: item.profiles?.avatar_url
      })) || [];
      setFacultyApprovals(pendingFaculty);
      setAssignmentUpdates(processedAssignments);
      setRecentApprovals(processedRecent);
      console.log('fetchApprovalData: State set with data');
    } catch (error) {
      console.error('fetchApprovalData: Caught error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load approval data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      console.log('fetchApprovalData: Setting loading to false');
      console.log('fetchApprovalData: END');
    }
  };

  const handleFacultyApproval = async (facultyId: string, approved: boolean) => {
    try {
      if (approved) {
        // Create faculty profile to approve them
        const { error } = await supabase
          .from('faculty_profiles')
          .insert({
            user_id: facultyId,
            designation: 'Assistant Professor',
            qualification: 'To be updated',
            specialization: 'To be updated'
          })

        if (error) throw error

        toast({
          title: "Success",
          description: "Faculty member approved successfully",
        })
      } else {
        // For rejection, we could add a notification or mark them as rejected
        toast({
          title: "Faculty Rejected",
          description: "Faculty member has been rejected",
        })
      }

      // Refresh data
      fetchApprovalData()
    } catch (error: any) {
      console.error('Error handling faculty approval:', error)
      toast({
        title: "Error",
        description: "Failed to process approval",
        variant: "destructive"
      })
    }
  }

  const handleAssignmentUpdate = async (updateId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('assignment_updates')
        .update({ status })
        .eq('id', updateId)

      if (error) throw error

      toast({
        title: "Success",
        description: `Assignment update ${status}`,
      })

      // Refresh data
      fetchApprovalData()
    } catch (error: any) {
      console.error('Error handling assignment update:', error)
      toast({
        title: "Error",
        description: "Failed to process assignment update",
        variant: "destructive"
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return '1 day ago'
    return `${diffInDays} days ago`
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading approvals...</div>
        </div>
      </div>
    )
  }

  const totalPending = facultyApprovals.length + assignmentUpdates.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Approvals</h1>
          <p className="text-muted-foreground">Review and approve faculty registration requests</p>
        </div>
        {totalPending > 0 && (
        <Badge variant="destructive" className="text-sm">
            {totalPending} pending approvals
        </Badge>
        )}
      </div>

      <Tabs defaultValue="faculty" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="faculty" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Faculty ({facultyApprovals.length})</span>
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Assignments ({assignmentUpdates.length})</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Recent</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="space-y-6">
          {facultyApprovals.length > 0 ? (
        <div className="grid gap-6">
              {facultyApprovals.map((faculty) => (
            <Card key={faculty.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                          <AvatarImage src={faculty.avatar_url} alt={faculty.full_name} />
                      <AvatarFallback className="text-lg">
                            {faculty.full_name?.split(' ').map(n => n[0]).join('') || 'F'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                          <CardTitle className="text-xl">{faculty.full_name}</CardTitle>
                      <CardDescription className="text-base">
                            Faculty • {faculty.department}
                      </CardDescription>
                      <p className="text-sm text-muted-foreground mt-1">
                            Registered {formatTimeAgo(faculty.created_at)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {faculty.email}
                    </div>
                        {faculty.phone_number && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            {faculty.phone_number}
                    </div>
                        )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm">
                          <span className="font-medium">Department:</span> {faculty.department}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Registration Date:</span> {new Date(faculty.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                        Submitted: {formatTimeAgo(faculty.created_at)}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                          View Profile
                    </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleFacultyApproval(faculty.id, false)}
                        >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleFacultyApproval(faculty.id, true)}
                        >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
            <p className="text-muted-foreground">No pending faculty approvals at the moment.</p>
          </CardContent>
        </Card>
          )}
        </TabsContent>

        <TabsContent value="assignments" className="space-y-6">
          {assignmentUpdates.length > 0 ? (
            <div className="grid gap-6">
              {assignmentUpdates.map((update) => (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-sm">
                            {update.student_name?.split(' ').map(n => n[0]).join('') || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{update.student_name}</CardTitle>
                          <CardDescription className="text-base">
                            {update.assignment_title}
                          </CardDescription>
                          <p className="text-sm text-muted-foreground mt-1">
                            {update.update_type} • {formatTimeAgo(update.created_at)}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {update.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {update.feedback && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <span className="font-medium">Feedback:</span> {update.feedback}
                        </p>
                      </div>
                    )}
                    
                    {update.marks_awarded && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Marks:</span>
                        <Badge variant="outline">{update.marks_awarded}</Badge>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Submitted: {formatTimeAgo(update.created_at)}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAssignmentUpdate(update.id, 'in_review')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleAssignmentUpdate(update.id, 'returned')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Return
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleAssignmentUpdate(update.id, 'completed')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pending assignments!</h3>
                <p className="text-muted-foreground">All assignment updates have been processed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
              <CardDescription>Recently processed approvals and updates</CardDescription>
        </CardHeader>
        <CardContent>
              {recentApprovals.length > 0 ? (
          <div className="space-y-4">
                  {recentApprovals.map((approval) => (
                    <div key={approval.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                          <AvatarImage src={approval.avatar} />
                          <AvatarFallback>
                            {approval.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                </Avatar>
                <div>
                          <p className="font-medium">{approval.name}</p>
                          <p className="text-sm text-muted-foreground">{approval.type}</p>
                          <p className="text-xs text-muted-foreground">{approval.date}</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {approval.status}
              </Badge>
            </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No recent approvals to show.</p>
              </div>
              )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}