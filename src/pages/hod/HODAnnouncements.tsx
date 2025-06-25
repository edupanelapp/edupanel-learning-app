import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Megaphone, AlertTriangle, Loader2 } from "lucide-react"
import { useAnnouncements, Announcement, CreateAnnouncementData } from "@/hooks/useAnnouncements"
import { AnnouncementForm } from "@/components/announcements/AnnouncementForm"
import { AnnouncementCard } from "@/components/announcements/AnnouncementCard"
import { AnnouncementFilters } from "@/components/announcements/AnnouncementFilters"
import { AnnouncementViewDialog } from "@/components/announcements/AnnouncementViewDialog"
import { useToast } from "@/hooks/use-toast"

export default function HODAnnouncements() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('announcements')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [viewingAnnouncement, setViewingAnnouncement] = useState<Announcement | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    target_audience: 'all',
    priority: 'all',
    status: 'all'
  })

  // Get announcements with filters
  const {
    announcements,
    isLoading,
    error,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    isCreating,
    isUpdating,
    isDeleting,
    getStats
  } = useAnnouncements({
    target_audience: filters.target_audience !== 'all' ? filters.target_audience : undefined,
    priority: filters.priority !== 'all' ? filters.priority : undefined,
    status: filters.status !== 'all' ? filters.status as 'active' | 'expired' : undefined
  })

  // Filter announcements based on search
  const filteredAnnouncements = announcements.filter(announcement => {
    if (!filters.search) return true
    const searchLower = filters.search.toLowerCase()
    return (
      announcement.title.toLowerCase().includes(searchLower) ||
      announcement.message.toLowerCase().includes(searchLower) ||
      announcement.sender_name?.toLowerCase().includes(searchLower) ||
      announcement.target_audience.toLowerCase().includes(searchLower)
    )
  })

  const stats = getStats()

  const handleCreateAnnouncement = async (data: CreateAnnouncementData) => {
    try {
      await createAnnouncement(data)
      setShowCreateForm(false)
      setActiveTab('announcements')
    } catch (error) {
      console.error('Error creating announcement:', error)
    }
  }

  const handleUpdateAnnouncement = async (data: CreateAnnouncementData) => {
    if (!editingAnnouncement) return
    
    try {
      await updateAnnouncement({ id: editingAnnouncement.id, data })
      setEditingAnnouncement(null)
      setActiveTab('announcements')
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
      return
    }

    try {
      await deleteAnnouncement(id)
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setActiveTab('create')
  }

  const handleViewAnnouncement = (announcement: Announcement) => {
    setViewingAnnouncement(announcement)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      target_audience: 'all',
      priority: 'all',
      status: 'all'
    })
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Error Loading Announcements</h3>
            <p className="text-muted-foreground mb-4">Failed to load announcements. Please try again.</p>
            <Button onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Create and manage department-wide announcements</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Filters */}
      <AnnouncementFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        stats={stats}
      />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="announcements">All Announcements ({filteredAnnouncements.length})</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading announcements...</span>
            </div>
          ) : filteredAnnouncements.length > 0 ? (
          <div className="space-y-4">
              {filteredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  announcement={announcement}
                  onEdit={handleEditAnnouncement}
                  onDelete={handleDeleteAnnouncement}
                  onView={handleViewAnnouncement}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {filters.search || filters.target_audience !== 'all' || filters.priority !== 'all' || filters.status !== 'all'
                    ? 'No announcements match your filters'
                    : 'No announcements yet'
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search || filters.target_audience !== 'all' || filters.priority !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Start communicating with your department'
                  }
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Announcement
            </Button>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="create">
          {editingAnnouncement ? (
            <AnnouncementForm
              announcement={editingAnnouncement}
              onSubmit={handleUpdateAnnouncement}
              onCancel={() => {
                setEditingAnnouncement(null)
                setActiveTab('announcements')
              }}
              isLoading={isUpdating}
            />
          ) : (
            <AnnouncementForm
              onSubmit={handleCreateAnnouncement}
              onCancel={() => setActiveTab('announcements')}
              isLoading={isCreating}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Create Announcement Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <AnnouncementForm
            onSubmit={handleCreateAnnouncement}
            onCancel={() => setShowCreateForm(false)}
            isLoading={isCreating}
          />
        </DialogContent>
      </Dialog>

      {/* View Announcement Dialog */}
      <AnnouncementViewDialog
        announcement={viewingAnnouncement}
        isOpen={!!viewingAnnouncement}
        onClose={() => setViewingAnnouncement(null)}
      />
    </div>
  )
}
