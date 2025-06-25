import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Calendar, AlertTriangle, Link, Paperclip, X } from "lucide-react"
import { CreateAnnouncementData, Announcement } from "@/hooks/useAnnouncements"

interface AnnouncementFormProps {
  announcement?: Announcement
  onSubmit: (data: CreateAnnouncementData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function AnnouncementForm({ 
  announcement, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: AnnouncementFormProps) {
  const [formData, setFormData] = useState<CreateAnnouncementData>({
    title: '',
    message: '',
    target_audience: 'all',
    priority: 'medium',
    action_required: false,
    action_url: '',
    attachments: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title,
        message: announcement.message,
        target_audience: announcement.target_audience,
        priority: announcement.priority,
        expires_at: announcement.expires_at || undefined,
        action_required: announcement.action_required,
        action_url: announcement.action_url || '',
        attachments: announcement.attachments || []
      })
    }
  }, [announcement])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    if (formData.action_required && !formData.action_url?.trim()) {
      newErrors.action_url = 'Action URL is required when action is required'
    }

    if (formData.expires_at && new Date(formData.expires_at) <= new Date()) {
      newErrors.expires_at = 'Expiry date must be in the future'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof CreateAnnouncementData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addAttachment = () => {
    const url = prompt('Enter attachment URL:')
    if (url && url.trim()) {
      setFormData(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), url.trim()]
      }))
    }
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }))
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Megaphone className="h-5 w-5" />
          <span>{announcement ? 'Edit Announcement' : 'Create New Announcement'}</span>
        </CardTitle>
        <CardDescription>
          {announcement 
            ? 'Update the announcement details below'
            : 'Compose an announcement for faculty, students, or both'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Target Audience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Announcement Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter announcement title..."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_audience">Target Audience *</Label>
              <Select
                value={formData.target_audience}
                onValueChange={(value) => handleInputChange('target_audience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All (Faculty & Students)</SelectItem>
                  <SelectItem value="faculty">Faculty Only</SelectItem>
                  <SelectItem value="students">Students Only</SelectItem>
                  <SelectItem value="hod">HOD Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority and Expiry Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
              {formData.priority && (
                <Badge className={getPriorityColor(formData.priority)}>
                  {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
                </Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
              <Input
                id="expires_at"
                type="datetime-local"
                value={formData.expires_at || ''}
                onChange={(e) => handleInputChange('expires_at', e.target.value)}
                className={errors.expires_at ? 'border-red-500' : ''}
              />
              {errors.expires_at && (
                <p className="text-sm text-red-500">{errors.expires_at}</p>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Announcement Content *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Enter the full announcement content..."
              rows={6}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message}</p>
            )}
          </div>

          {/* Action Required */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="action_required"
                checked={formData.action_required}
                onCheckedChange={(checked) => handleInputChange('action_required', checked)}
              />
              <Label htmlFor="action_required">Action Required</Label>
            </div>
            
            {formData.action_required && (
              <div className="space-y-2">
                <Label htmlFor="action_url">Action URL *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="action_url"
                    value={formData.action_url}
                    onChange={(e) => handleInputChange('action_url', e.target.value)}
                    placeholder="https://example.com/action"
                    className={errors.action_url ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(formData.action_url, '_blank')}
                    disabled={!formData.action_url}
                  >
                    <Link className="h-4 w-4" />
                  </Button>
                </div>
                {errors.action_url && (
                  <p className="text-sm text-red-500">{errors.action_url}</p>
                )}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="space-y-2">
              {formData.attachments?.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                  <Paperclip className="h-4 w-4 text-muted-foreground" />
                  <a 
                    href={attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 text-sm text-blue-600 hover:underline truncate"
                  >
                    {attachment}
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttachment}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Add Attachment
              </Button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isLoading}>
              <Megaphone className="h-4 w-4 mr-2" />
              {announcement ? 'Update Announcement' : 'Publish Announcement'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 