import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Megaphone, 
  Calendar, 
  Users, 
  AlertTriangle, 
  Clock, 
  Paperclip,
  Link as LinkIcon,
  X
} from "lucide-react"
import { Announcement } from "@/hooks/useAnnouncements"

interface AnnouncementViewDialogProps {
  announcement: Announcement | null
  isOpen: boolean
  onClose: () => void
}

export function AnnouncementViewDialog({ 
  announcement, 
  isOpen, 
  onClose 
}: AnnouncementViewDialogProps) {
  if (!announcement) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (isExpired: boolean) => {
    return isExpired ? 'bg-gray-100 text-gray-800 border-gray-200' : 'bg-green-100 text-green-800 border-green-200'
  }

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'faculty': return '👨‍🏫'
      case 'students': return '👨‍🎓'
      case 'hod': return '👨‍💼'
      default: return '👥'
    }
  }

  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'faculty': return 'Faculty Only'
      case 'students': return 'Students Only'
      case 'hod': return 'HOD Only'
      case 'all': return 'All Users'
      default: return audience
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Megaphone className="h-6 w-6 text-primary" />
              <span>{announcement.title}</span>
              {announcement.priority === 'urgent' && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(announcement.is_expired || false)}>
              {announcement.is_expired ? 'Expired' : 'Active'}
            </Badge>
            <Badge className={getPriorityColor(announcement.priority)}>
              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)} Priority
            </Badge>
            <Badge variant="outline">
              <span className="mr-1">{getAudienceIcon(announcement.target_audience)}</span>
              {getAudienceLabel(announcement.target_audience)}
            </Badge>
          </div>

          {/* Message Content */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Announcement Content</h3>
            <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
              {announcement.message}
            </div>
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Created: {formatDate(announcement.created_at)}</span>
                </div>
                {announcement.expires_at && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Expires: {formatDate(announcement.expires_at)}</span>
                    {announcement.days_until_expiry !== null && announcement.days_until_expiry > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {announcement.days_until_expiry} days left
                      </Badge>
                    )}
                  </div>
                )}
                {announcement.sender_name && (
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">
                        {announcement.sender_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>By: {announcement.sender_name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Target Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Audience: {getAudienceLabel(announcement.target_audience)}</span>
                </div>
                {announcement.department_name && (
                  <div className="flex items-center space-x-2">
                    <span>Department: {announcement.department_name}</span>
                  </div>
                )}
                {announcement.section && (
                  <div className="flex items-center space-x-2">
                    <span>Section: {announcement.section}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Required */}
          {announcement.action_required && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-800">Action Required</h3>
              </div>
              {announcement.action_url && (
                <Button
                  onClick={() => window.open(announcement.action_url!, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Take Action
                </Button>
              )}
            </div>
          )}

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Paperclip className="h-5 w-5" />
                <span>Attachments ({announcement.attachments.length})</span>
              </h3>
              <div className="space-y-2">
                {announcement.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Attachment {index + 1}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(attachment, '_blank')}
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Open
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 