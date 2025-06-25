import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { insertSampleStudentData, insertSampleAnnouncementData } from '@/utils/sampleData'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Database, Users, Megaphone, Search } from "lucide-react"

export default function TestData() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [userInfo, setUserInfo] = useState<any>(null)

  const handleInsertStudentData = async () => {
    setIsLoading(true)
    try {
      const result = await insertSampleStudentData()
      toast({
        title: "Success",
        description: result.message
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to insert sample student data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInsertAnnouncementData = async () => {
    setIsLoading(true)
    try {
      const result = await insertSampleAnnouncementData()
      toast({
        title: "Success",
        description: result.message
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to insert sample announcement data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestAnnouncementFetching = async () => {
    setIsLoading(true)
    try {
      // Get current user info
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast({
          title: "Error",
          description: "No authenticated user found",
          variant: "destructive"
        })
        return
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setUserInfo({ user, profile })

      // Test fetching announcements
      console.log('Testing announcement fetching...')
      console.log('Current user:', user.id)
      console.log('User role:', profile?.role)

      const { data: announcementsData, error } = await supabase
        .from('notifications')
        .select(`
          *,
          sender:profiles!sender_id(full_name, department)
        `)
        .eq('type', 'announcement')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching announcements:', error)
        toast({
          title: "Error",
          description: `Failed to fetch announcements: ${error.message}`,
          variant: "destructive"
        })
        return
      }

      console.log('Fetched announcements:', announcementsData)
      setAnnouncements(announcementsData || [])

      toast({
        title: "Success",
        description: `Fetched ${announcementsData?.length || 0} announcements`
      })

    } catch (error) {
      console.error('Error testing announcement fetching:', error)
      toast({
        title: "Error",
        description: "Failed to test announcement fetching",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Test Data Management</h1>
        <p className="text-muted-foreground">Insert sample data for testing purposes</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Data</CardTitle>
            <CardDescription>Insert sample student profiles and data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInsertStudentData} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Inserting...' : 'Insert Sample Student Data'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Announcement Data</CardTitle>
            <CardDescription>Insert sample announcements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleInsertAnnouncementData} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Inserting...' : 'Insert Sample Announcements'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Announcement Fetching</CardTitle>
          <CardDescription>Test if announcements are being fetched correctly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleTestAnnouncementFetching} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Testing...' : 'Test Announcement Fetching'}
          </Button>

          {userInfo && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Current User Info:</h4>
              <p><strong>User ID:</strong> {userInfo.user.id}</p>
              <p><strong>Email:</strong> {userInfo.user.email}</p>
              <p><strong>Role:</strong> <Badge>{userInfo.profile?.role}</Badge></p>
              <p><strong>Name:</strong> {userInfo.profile?.full_name}</p>
            </div>
          )}

          {announcements.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">Fetched Announcements ({announcements.length}):</h4>
              {announcements.map((announcement) => (
                <div key={announcement.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-medium">{announcement.title}</h5>
                    <div className="flex gap-2">
                      <Badge variant="outline">{announcement.priority}</Badge>
                      <Badge variant="secondary">{announcement.target_audience}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                  <div className="text-xs text-muted-foreground">
                    <p><strong>Sender:</strong> {announcement.sender?.full_name || 'Unknown'}</p>
                    <p><strong>Created:</strong> {new Date(announcement.created_at).toLocaleString()}</p>
                    <p><strong>Expires:</strong> {announcement.expires_at ? new Date(announcement.expires_at).toLocaleString() : 'Never'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 