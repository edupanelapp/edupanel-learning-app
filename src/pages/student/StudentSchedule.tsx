import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar as CalendarIcon, List, Download, Printer } from "lucide-react"
import { cn } from "@/lib/utils"
import { EventDetailsModal } from "@/components/schedule/EventDetailsModal"

// Mock data - Replace with actual API calls
const mockEvents = [
  {
    id: 1,
    title: "Web Development Class",
    type: "class",
    date: new Date(2024, 2, 20, 10, 0),
    duration: 60,
    subject: "Web Development",
    faculty: "Dr. Smith",
    location: "Room 101",
    isVirtual: false,
  },
  {
    id: 2,
    title: "Database Assignment Due",
    type: "assignment",
    date: new Date(2024, 2, 22, 23, 59),
    subject: "Database Systems",
    status: "pending",
  },
  {
    id: 3,
    title: "Project Phase 1",
    type: "project",
    date: new Date(2024, 2, 25, 17, 0),
    subject: "Software Engineering",
    mentor: "Prof. Johnson",
    progress: 75,
  },
]

export default function StudentSchedule() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"month" | "week" | "day" | "list">("month")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)

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

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold">Schedule</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Sync Calendar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Calendar Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Calendar</CardTitle>
                <Tabs defaultValue="month" value={view} onValueChange={(v) => setView(v as any)}>
                  <TabsList>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="list">
                      <List className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {view !== "list" ? (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                  modifiers={{
                    hasEvent: (date) => mockEvents.some(event => 
                      event.date.toDateString() === date.toDateString()
                    ),
                  }}
                  modifiersStyles={{
                    hasEvent: { backgroundColor: "var(--primary)" },
                  }}
                />
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {mockEvents.map((event) => (
                      <Card 
                        key={event.id}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => handleEventClick(event)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {event.date.toLocaleString()}
                              </p>
                              <p className="text-sm">{event.subject}</p>
                            </div>
                            <Badge
                              className={cn(
                                "ml-2",
                                getEventColor(event.type)
                              )}
                            >
                              {event.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {mockEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-4 p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full mt-2",
                        getEventColor(event.type)
                      )} />
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date.toLocaleString()}
                        </p>
                        <p className="text-sm">{event.subject}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
} 