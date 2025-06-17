import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { ScheduleFilters } from "@/components/schedule/ScheduleFilters"
import { ScheduleViewOptions } from "@/components/schedule/ScheduleViewOptions"
import { ScheduleEventCard } from "@/components/schedule/ScheduleEventCard"
import { EventDetailsModal } from "@/components/schedule/EventDetailsModal"
import { ScheduleEvent, ScheduleFilters as Filters, ScheduleView } from "@/types/schedule"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

// Mock data - replace with actual API calls
const mockEvents: ScheduleEvent[] = [
  {
    id: "1",
    type: "class",
    title: "Mathematics Lecture",
    description: "Introduction to Calculus",
    date: new Date(2024, 2, 20, 10, 0),
    subject: "Mathematics",
    status: "upcoming",
    priority: "high",
    faculty: "Dr. Smith",
    duration: 90,
    location: "Room 101",
    isVirtual: false
  },
  {
    id: "2",
    type: "assignment",
    title: "Calculus Problem Set",
    description: "Complete problems 1-10",
    date: new Date(2024, 2, 20, 14, 0),
    subject: "Mathematics",
    status: "in-progress",
    priority: "high",
    dueDate: new Date(2024, 2, 25),
    submissionType: "file",
    maxAttempts: 3
  },
  {
    id: "3",
    type: "project",
    title: "Group Project",
    description: "Final year project",
    date: new Date(2024, 2, 22, 9, 0),
    subject: "Software Engineering",
    status: "upcoming",
    priority: "high",
    mentor: "Prof. Johnson",
    progress: 0,
    milestones: [
      {
        title: "Project Proposal",
        date: new Date(2024, 2, 25),
        completed: false
      }
    ]
  },
  {
    id: "4",
    type: "exam",
    title: "Midterm Examination",
    description: "Covering chapters 1-5",
    date: new Date(2024, 2, 25, 10, 0),
    subject: "Mathematics",
    status: "upcoming",
    priority: "high",
    duration: 120,
    location: "Exam Hall A",
    totalMarks: 100
  },
  {
    id: "5",
    type: "class",
    title: "Physics Lab Session",
    description: "Experiments on Electromagnetism",
    date: new Date(2024, 2, 28, 13, 0),
    subject: "Physics",
    status: "upcoming",
    priority: "medium",
    faculty: "Dr. Davis",
    duration: 180,
    location: "Lab 3B",
    isVirtual: false
  },
  {
    id: "6",
    type: "assignment",
    title: "Physics Homework 1",
    description: "Solve problems from Chapter 3",
    date: new Date(2024, 2, 28, 16, 0),
    subject: "Physics",
    status: "overdue",
    priority: "high",
    dueDate: new Date(2024, 2, 27),
    submissionType: "online",
    maxAttempts: 1
  },
  {
    id: "7",
    type: "project",
    title: "Research Paper",
    description: "Literature review on AI",
    date: new Date(2024, 3, 5, 11, 0),
    subject: "Computer Science",
    status: "in-progress",
    priority: "medium",
    mentor: "Prof. Lee",
    progress: 50,
    milestones: [
      {
        title: "Outline Submission",
        date: new Date(2024, 3, 1),
        completed: true
      },
      {
        title: "First Draft",
        date: new Date(2024, 3, 10),
        completed: false
      }
    ]
  },
  {
    id: "8",
    type: "exam",
    title: "Chemistry Final Exam",
    description: "Comprehensive exam on all topics",
    date: new Date(2024, 3, 15, 9, 0),
    subject: "Chemistry",
    status: "upcoming",
    priority: "high",
    duration: 180,
    location: "Main Auditorium",
    totalMarks: 200
  },
  {
    id: "9",
    type: "class",
    title: "History of Art",
    description: "From Renaissance to Modern Art",
    date: new Date(2024, 2, 18, 10, 0),
    subject: "Art History",
    status: "completed",
    priority: "low",
    faculty: "Dr. White",
    duration: 60,
    location: "Online",
    isVirtual: true
  },
  {
    id: "10",
    type: "assignment",
    title: "Art History Essay",
    description: "Analyze a piece of Renaissance art",
    date: new Date(2024, 2, 19, 23, 59),
    subject: "Art History",
    status: "completed",
    priority: "medium",
    dueDate: new Date(2024, 2, 19),
    submissionType: "text",
    maxAttempts: 1
  }
]

export default function StudentSchedule() {
  const [date, setDate] = useState<Date>(new Date())
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null)
  const [filters, setFilters] = useState<Filters>({
    types: [],
    status: [],
    priority: [],
    dateRange: {
      start: new Date(2024, 2, 1), // Start of March 2024
      end: new Date(2024, 3, 30)   // End of April 2024
    }
  })
  const [view, setView] = useState<ScheduleView>({
    type: 'month',
    groupBy: 'none',
    showCompleted: true,
    showOverdue: true
  })

  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  const filteredEvents = mockEvents.filter(event => {
    if (filters.types.length > 0 && !filters.types.includes(event.type)) return false
    if (filters.status.length > 0 && !filters.status.includes(event.status)) return false
    if (filters.priority.length > 0 && !filters.priority.includes(event.priority)) return false
    if (filters.dateRange) {
      const eventDate = new Date(event.date)
      eventDate.setHours(0, 0, 0, 0); // Normalize eventDate to start of day

      const startDate = new Date(filters.dateRange.start);
      startDate.setHours(0, 0, 0, 0); // Normalize startDate to start of day

      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Normalize endDate to end of day

      if (eventDate < startDate || eventDate > endDate) return false
    }
    if (!view.showCompleted && event.status === 'completed') return false
    if (!view.showOverdue && event.status === 'overdue') return false
    return true
  })

  const getEventsForDate = (date: Date) => {
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getDate() === date.getDate() &&
             eventDate.getMonth() === date.getMonth() &&
             eventDate.getFullYear() === date.getFullYear()
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schedule</h1>
          <p className="text-muted-foreground">Manage your classes, assignments, and exams</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousDay} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  if (date) {
                    setDate(date)
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={handleNextDay} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div>
        {/* Upcoming Events */}
        <Card className="p-4 h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Events</h2>
            <ScheduleFilters filters={filters} onFiltersChange={setFilters} />
          </div>
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <ScheduleEventCard
                  key={event.id}
                  event={event}
                  onClick={() => handleEventClick(event)}
                />
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-center text-muted-foreground py-4">
                  No events found
                </p>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          open={!!selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
} 