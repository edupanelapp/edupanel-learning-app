
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Megaphone, Calendar, Users, Edit, Trash } from "lucide-react"

export default function HODAnnouncements() {
  const announcements = [
    {
      id: 1,
      title: "Department Meeting - June 15th",
      content: "All faculty members are required to attend the monthly department meeting on June 15th at 10:00 AM in Conference Room A.",
      audience: "Faculty",
      createdAt: "2025-06-10",
      validUntil: "2025-06-15",
      status: "active"
    },
    {
      id: 2,
      title: "Project Submission Guidelines",
      content: "Updated guidelines for final project submissions are now available. Please review the new requirements before submitting your projects.",
      audience: "Students",
      createdAt: "2025-06-09", 
      validUntil: "2025-07-30",
      status: "active"
    },
    {
      id: 3,
      title: "Semester Break Notice",
      content: "Semester break will commence from June 25th to July 5th. All classes will resume on July 6th.",
      audience: "Both",
      createdAt: "2025-06-08",
      validUntil: "2025-07-06", 
      status: "active"
    },
    {
      id: 4,
      title: "Library Maintenance",
      content: "The library will be closed for maintenance from June 1st to June 3rd.",
      audience: "Both",
      createdAt: "2025-05-28",
      validUntil: "2025-06-03",
      status: "expired"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Create and manage department-wide announcements</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      <Tabs defaultValue="announcements" className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">All Announcements</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Megaphone className="h-5 w-5" />
                        <span>{announcement.title}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {announcement.content}
                      </CardDescription>
                    </div>
                    <Badge variant={announcement.status === 'active' ? 'default' : 'secondary'}>
                      {announcement.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-6 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {announcement.audience}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Created: {announcement.createdAt}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Valid until: {announcement.validUntil}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Announcement</CardTitle>
              <CardDescription>
                Compose an announcement for faculty, students, or both
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Announcement Title</Label>
                  <Input 
                    id="title"
                    placeholder="Enter announcement title..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <select className="w-full p-2 border border-input rounded-md">
                    <option value="both">Faculty & Students</option>
                    <option value="faculty">Faculty Only</option>
                    <option value="students">Students Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input 
                    id="validFrom"
                    type="date"
                    defaultValue="2025-06-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input 
                    id="validUntil"
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Announcement Content</Label>
                <Textarea 
                  id="content"
                  placeholder="Enter the full announcement content..."
                  rows={6}
                />
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Megaphone className="h-4 w-4 mr-2" />
                  Publish Announcement
                </Button>
                <Button variant="outline">
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Announcement Statistics</CardTitle>
          <CardDescription>Overview of your announcement activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {announcements.filter(a => a.status === 'active').length}
              </div>
              <div className="text-sm text-muted-foreground">Active Announcements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {announcements.filter(a => a.audience === 'Faculty').length}
              </div>
              <div className="text-sm text-muted-foreground">Faculty Announcements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {announcements.filter(a => a.audience === 'Students').length}
              </div>
              <div className="text-sm text-muted-foreground">Student Announcements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {announcements.filter(a => a.audience === 'Both').length}
              </div>
              <div className="text-sm text-muted-foreground">General Announcements</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {announcements.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No announcements yet</h3>
            <p className="text-muted-foreground mb-4">Start communicating with your department</p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Announcement
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
