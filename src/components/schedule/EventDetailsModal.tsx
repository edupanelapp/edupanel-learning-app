import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, MapPin, BookOpen, FileText, Calendar as CalendarIcon, X } from "lucide-react"
import { ScheduleEvent } from "@/types/schedule"
import { cn } from "@/lib/utils"

interface EventDetailsModalProps {
  event: ScheduleEvent
  open: boolean
  onClose: () => void
}

export function EventDetailsModal({ event, open, onClose }: EventDetailsModalProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'class':
        return <BookOpen className="h-5 w-5" />
      case 'assignment':
        return <FileText className="h-5 w-5" />
      case 'project':
        return <FileText className="h-5 w-5" />
      case 'exam':
        return <CalendarIcon className="h-5 w-5" />
      default:
        return null
    }
  }

  const getEventColor = () => {
    switch (event.type) {
      case 'class':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'assignment':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
      case 'project':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'exam':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusColor = () => {
    switch (event.status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
      case 'ongoing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      case 'overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-md", getEventColor())}>
                {getEventIcon()}
              </div>
              <DialogTitle className="text-xl">{event.title}</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-4">
            {/* Status and Type */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className={cn(getStatusColor())}>
                {event.status}
              </Badge>
              <Badge variant="secondary" className={cn(getEventColor())}>
                {event.type}
              </Badge>
              {event.priority && (
                <Badge variant="secondary">
                  Priority: {event.priority}
                </Badge>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            )}

            {/* Time and Location */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(event.date).toLocaleString([], {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>

              {event.type === 'class' && event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}
            </div>

            {/* Subject and Instructor */}
            <div className="space-y-2">
              {event.subject && (
                <div>
                  <h3 className="text-sm font-medium">Subject</h3>
                  <p className="text-sm text-muted-foreground">{event.subject}</p>
                </div>
              )}

              {event.type === 'class' && event.faculty && (
                <div>
                  <h3 className="text-sm font-medium">Instructor</h3>
                  <p className="text-sm text-muted-foreground">{event.faculty}</p>
                </div>
              )}
            </div>

            {/* Additional Details */}
            {event.type === 'assignment' && event.dueDate && (
              <div>
                <h3 className="text-sm font-medium">Due Date</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.dueDate).toLocaleString([], {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {event.type === 'project' && (
              <>
                {event.dueDate && (
                  <div>
                    <h3 className="text-sm font-medium">Due Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.dueDate).toLocaleString([], {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
                {event.mentor && (
                  <div>
                    <h3 className="text-sm font-medium">Mentor</h3>
                    <p className="text-sm text-muted-foreground">{event.mentor}</p>
                  </div>
                )}
                {event.milestones && event.milestones.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium">Milestones</h3>
                    <div className="space-y-2">
                      {event.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            milestone.completed ? "bg-green-500" : "bg-yellow-500"
                          )} />
                          <span className="text-sm text-muted-foreground">
                            {milestone.title} - {new Date(milestone.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {event.type === 'exam' && (
              <>
                {event.duration && (
                  <div>
                    <h3 className="text-sm font-medium">Duration</h3>
                    <p className="text-sm text-muted-foreground">{event.duration} minutes</p>
                  </div>
                )}
                {event.location && (
                  <div>
                    <h3 className="text-sm font-medium">Location</h3>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                )}
                {event.totalMarks && (
                  <div>
                    <h3 className="text-sm font-medium">Total Marks</h3>
                    <p className="text-sm text-muted-foreground">{event.totalMarks}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {event.type === 'assignment' && (
            <Button>View Assignment</Button>
          )}
          {event.type === 'project' && (
            <Button>View Project</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 