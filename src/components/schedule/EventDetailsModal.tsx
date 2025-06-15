import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface EventDetailsModalProps {
  event: any // Replace with proper type
  isOpen: boolean
  onClose: () => void
}

export function EventDetailsModal({ event, isOpen, onClose }: EventDetailsModalProps) {
  const getEventColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-500"
      case "assignment":
        return "bg-red-500"
      case "project":
        return "bg-green-500"
      case "exam":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const renderEventDetails = () => {
    switch (event.type) {
      case "class":
        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Faculty</span>
                <span className="font-medium">{event.faculty}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="font-medium">
                  {event.date.toLocaleTimeString()} ({event.duration} mins)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Location</span>
                <span className="font-medium">{event.location}</span>
              </div>
            </div>
            {event.isVirtual && (
              <Button className="w-full mt-4">
                Join Class
              </Button>
            )}
          </>
        )

      case "assignment":
        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="font-medium">
                  {event.date.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={event.status === "submitted" ? "default" : "destructive"}
                >
                  {event.status}
                </Badge>
              </div>
            </div>
            {event.status === "pending" && (
              <Button className="w-full mt-4">
                Submit Now
              </Button>
            )}
          </>
        )

      case "project":
        return (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Mentor</span>
                <span className="font-medium">{event.mentor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Deadline</span>
                <span className="font-medium">
                  {event.date.toLocaleString()}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="font-medium">{event.progress}%</span>
                </div>
                <Progress value={event.progress} className="h-2" />
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{event.title}</DialogTitle>
            <Badge
              className={cn(
                "ml-2",
                getEventColor(event.type)
              )}
            >
              {event.type}
            </Badge>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subject</span>
              <span className="font-medium">{event.subject}</span>
            </div>
          </div>
          {renderEventDetails()}
        </div>
      </DialogContent>
    </Dialog>
  )
} 