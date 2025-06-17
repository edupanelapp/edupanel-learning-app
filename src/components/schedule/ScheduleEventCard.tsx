import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, BookOpen, FileText, Calendar as CalendarIcon } from "lucide-react"
import { ScheduleEvent } from "@/types/schedule"
import { cn } from "@/lib/utils"

interface ScheduleEventCardProps {
  event: ScheduleEvent
  onClick?: () => void
  className?: string
}

export function ScheduleEventCard({ event, onClick, className }: ScheduleEventCardProps) {
  const getEventIcon = () => {
    switch (event.type) {
      case 'class':
        return <BookOpen className="h-4 w-4" />
      case 'assignment':
        return <FileText className="h-4 w-4" />
      case 'project':
        return <FileText className="h-4 w-4" />
      case 'exam':
        return <CalendarIcon className="h-4 w-4" />
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
    <Card
      className={cn(
        "p-3 transition-all hover:shadow-md cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-md", getEventColor())}>
          {getEventIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium truncate">{event.title}</h3>
            <Badge variant="secondary" className={cn("shrink-0", getStatusColor())}>
              {event.status}
            </Badge>
          </div>
          
          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(event.date).toLocaleString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            
            {event.type === 'class' && event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{event.location}</span>
              </div>
            )}

            {event.type === 'assignment' && event.dueDate && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Due: {new Date(event.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {event.type === 'project' && event.dueDate && (
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Due: {new Date(event.dueDate).toLocaleDateString()}</span>
              </div>
            )}

            {event.type === 'exam' && event.duration && (
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>Duration: {event.duration} minutes</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
} 