import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Megaphone, 
  Calendar, 
  Users, 
  Edit, 
  Trash, 
  AlertTriangle, 
  Clock, 
  Paperclip,
  Link as LinkIcon,
  Eye
} from "lucide-react"
import { Announcement } from "@/hooks/useAnnouncements"

interface AnnouncementCardProps {
  announcement: Announcement
  onEdit?: (announcement: Announcement) => void
  onDelete?: (id: string) => void
  onView?: (announcement: Announcement) => void
  showActions?: boolean
}

export function AnnouncementCard({ 
  announcement, 
  onEdit, 
  onDelete, 
  onView,
  showActions = true 
}: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
    <Card className={`hover:shadow-md transition-shadow ${announcement.is_expired ? 'opacity-75' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <span>{announcement.title}</span>
              </CardTitle>
              {announcement.priority === 'urgent' && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <CardDescription className="mt-2 line-clamp-3">
              {announcement.message}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge className={getStatusColor(announcement.is_expired || false)}>
              {announcement.is_expired ? 'Expired' : 'Active'}
            </Badge>
            <Badge className={getPriorityColor(announcement.priority)}>
              {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span className="mr-1">{getAudienceIcon(announcement.target_audience)}</span>
              {getAudienceLabel(announcement.target_audience)}
            </span>
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Created: {formatDate(announcement.created_at)}
            </span>
            {announcement.expires_at && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Expires: {formatDate(announcement.expires_at)}
                {announcement.days_until_expiry !== null && announcement.days_until_expiry > 0 && (
                  <span className="ml-1 text-xs">({announcement.days_until_expiry} days left)</span>
                )}
              </span>
            )}
            {announcement.sender_name && (
              <span className="flex items-center">
                <Avatar className="h-4 w-4 mr-1">
                  <AvatarFallback className="text-xs">
                    {announcement.sender_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {announcement.sender_name}
              </span>
            )}
          </div>

          {/* Action Required */}
          {announcement.action_required && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Action Required</span>
              </div>
              {announcement.action_url && (
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(announcement.action_url!, '_blank')}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Take Action
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Attachments */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <Paperclip className="h-4 w-4" />
                <span>Attachments ({announcement.attachments.length})</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {announcement.attachments.map((attachment, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(attachment, '_blank')}
                    className="text-xs"
                  >
                    <Paperclip className="h-3 w-3 mr-1" />
                    Attachment {index + 1}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && (
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-xs text-muted-foreground">
                Posted {formatTimeAgo(announcement.created_at)}
              </div>
              <div className="flex space-x-2">
                {onView && (
                  <Button variant="outline" size="sm" onClick={() => onView(announcement)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                {onEdit && (
                  <Button variant="outline" size="sm" onClick={() => onEdit(announcement)}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onDelete(announcement.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 