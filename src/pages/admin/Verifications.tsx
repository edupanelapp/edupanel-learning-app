import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { CheckCircle, XCircle, Clock, User } from "lucide-react"

interface VerificationRequest {
  id: string
  applicant_id: string
  role: 'student' | 'faculty' | 'hod'
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  applicant: {
    email: string
  }
  profile: {
    full_name: string
    department: string
    student_id?: string
    employee_id?: string
    designation?: string
  }
}

// Mock verification data
const mockVerifications: VerificationRequest[] = [
  {
    id: '1',
    applicant_id: 'student1',
    role: 'student',
    status: 'pending',
    submitted_at: new Date().toISOString(),
    applicant: {
      email: 'student1@example.com'
    },
    profile: {
      full_name: 'John Doe',
      department: 'Computer Science',
      student_id: 'CS2024001'
    }
  },
  {
    id: '2',
    applicant_id: 'faculty1',
    role: 'faculty',
    status: 'pending',
    submitted_at: new Date().toISOString(),
    applicant: {
      email: 'faculty1@example.com'
    },
    profile: {
      full_name: 'Dr. Jane Smith',
      department: 'Information Technology',
      employee_id: 'IT2024001',
      designation: 'Assistant Professor'
    }
  }
]

export default function Verifications() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [verifications, setVerifications] = useState<VerificationRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [comments, setComments] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (user && (user.role === 'faculty' || user.role === 'hod')) {
      fetchVerifications()
    }
  }, [user])

  const fetchVerifications = async () => {
    if (!user) return

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Filter verifications based on user role
      let filteredVerifications = mockVerifications.filter(v => v.status === 'pending')
      
      if (user.role === 'faculty') {
        filteredVerifications = filteredVerifications.filter(v => v.role === 'student')
      } else if (user.role === 'hod') {
        filteredVerifications = filteredVerifications.filter(v => v.role === 'faculty')
      }

      setVerifications(filteredVerifications)
    } catch (error) {
      console.error('Error fetching verifications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch verification requests.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async (verificationId: string, status: 'approved' | 'rejected') => {
    setProcessingId(verificationId)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock update - in real app, this would update the database
      console.log('Updating verification:', verificationId, 'to status:', status)
      console.log('Comments:', comments[verificationId])

      toast({
        title: "Success",
        description: `Profile ${status} successfully.`,
      })

      // Remove the processed verification from the list
      setVerifications(prev => prev.filter(v => v.id !== verificationId))
      
      // Clear comments
      setComments(prev => {
        const newComments = { ...prev }
        delete newComments[verificationId]
        return newComments
      })

    } catch (error) {
      console.error('Error updating verification:', error)
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (!user || (user.role !== 'faculty' && user.role !== 'hod')) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p>You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile Verifications</h1>
        <p className="text-muted-foreground">
          Review and approve pending {user.role === 'faculty' ? 'student' : 'faculty'} profiles
        </p>
      </div>

      {verifications.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Pending Verifications</h3>
            <p className="text-muted-foreground">
              There are no pending verification requests at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {verifications.map((verification) => (
            <Card key={verification.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <CardTitle className="text-lg">{verification.profile?.full_name}</CardTitle>
                    <Badge variant="outline">{verification.role}</Badge>
                  </div>
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                </div>
                <CardDescription>{verification.applicant?.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium">Department</p>
                    <p className="text-sm text-muted-foreground">{verification.profile?.department}</p>
                  </div>
                  {verification.role === 'student' && verification.profile?.student_id && (
                    <div>
                      <p className="text-sm font-medium">Student ID</p>
                      <p className="text-sm text-muted-foreground">{verification.profile.student_id}</p>
                    </div>
                  )}
                  {verification.role === 'faculty' && (
                    <>
                      <div>
                        <p className="text-sm font-medium">Employee ID</p>
                        <p className="text-sm text-muted-foreground">{verification.profile?.employee_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Designation</p>
                        <p className="text-sm text-muted-foreground">{verification.profile?.designation}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <p className="text-sm font-medium">Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(verification.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`comments-${verification.id}`}>Comments (Optional)</Label>
                    <Textarea
                      id={`comments-${verification.id}`}
                      placeholder="Add any comments about this verification..."
                      value={comments[verification.id] || ''}
                      onChange={(e) => setComments(prev => ({
                        ...prev,
                        [verification.id]: e.target.value
                      }))}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleApproval(verification.id, 'approved')}
                      disabled={processingId === verification.id}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleApproval(verification.id, 'rejected')}
                      disabled={processingId === verification.id}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
