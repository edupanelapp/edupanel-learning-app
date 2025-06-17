import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar as CalendarIcon, Clock, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const scheduleFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  type: z.string().min(1, "Class type is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  room: z.string().min(1, "Location is required"),
  group: z.string().min(1, "Student group is required"),
  isRecurring: z.boolean().default(false),
  recurrenceEndDate: z.date().optional(),
});

type ScheduleFormValues = z.infer<typeof scheduleFormSchema>;

// Sample data - replace with actual data from your backend
const timeSlots = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor((i + 16) / 2);
  const minute = (i + 16) % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const sampleClasses = [
  {
    id: 1,
    subject: "Advanced Mathematics",
    type: "lecture",
    startTime: "09:00",
    endTime: "10:30",
    day: "Monday",
    room: "Room 101",
    group: "Group A",
    isRecurring: true,
  },
  {
    id: 2,
    subject: "Computer Architecture and Organization",
    type: "Lab",
    startTime: "10:30",
    endTime: "11:30",
    day: "Tuesday",
    room: "Room 102",
    group: "Group B",
    isRecurring: true,
  },
  {
    id: 3,
    subject: "Operating Systems",
    type: "Lecture",
    startTime: "09:30",
    endTime: "10:30",
    day: "Thursday",
    room: "Room 101",
    group: "Group A",
    isRecurring: true,
  },
  {
    id: 4,
    subject: "Programming in C",
    type: "Lecture",
    startTime: "10:30",
    endTime: "11:30",
    day: "Wednesday",
    room: "Room 105",
    group: "Group D",
    isRecurring: true,
  },
  // Add more sample classes
];

const getClassTypeColor = (type: string) => {
  switch (type) {
    case "lecture":
      return "bg-blue-500";
    case "lab":
      return "bg-green-500";
    case "consultation":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
};

export default function FacultySchedule() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      subject: "",
      type: "",
      startTime: "",
      endTime: "",
      room: "",
      group: "",
      isRecurring: false,
    },
  });

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      // Here you would typically make an API call to save the schedule
      console.log("Schedule data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Class scheduled successfully!",
      });

      // Close the dialog and reset form
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule class. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-4 md:py-6 space-y-4 md:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Schedule Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your teaching schedule and classes</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add New Class
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Class</DialogTitle>
              <DialogDescription>
                Add a new class to your schedule. Make sure to check for conflicts.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  onValueChange={(value) => form.setValue("subject", value)}
                  value={form.watch("subject")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Advanced Mathematics</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="cs">Computer Science</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.subject.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Class Type</Label>
                <Select
                  onValueChange={(value) => form.setValue("type", value)}
                  value={form.watch("type")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab/Practical</SelectItem>
                    <SelectItem value="consultation">Office Hours</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.type && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.type.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    type="time"
                    id="startTime"
                    {...form.register("startTime")}
                  />
                  {form.formState.errors.startTime && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    type="time"
                    id="endTime"
                    {...form.register("endTime")}
                  />
                  {form.formState.errors.endTime && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="room">Location</Label>
                <Input
                  id="room"
                  placeholder="Room number or virtual link"
                  {...form.register("room")}
                />
                {form.formState.errors.room && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.room.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="group">Student Group</Label>
                <Select
                  onValueChange={(value) => form.setValue("group", value)}
                  value={form.watch("group")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">Group A</SelectItem>
                    <SelectItem value="b">Group B</SelectItem>
                    <SelectItem value="c">Group C</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.group && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.group.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Scheduling..." : "Schedule Class"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>
        <TabsContent value="weekly" className="mt-4">
          <div className="grid gap-4 md:grid-cols-[300px_1fr]">
            <Card className="md:sticky md:top-20">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Lecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm">Lab/Practical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Office Hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="sticky top-0 bg-background z-10">
                        <tr>
                          <th className="border p-2 bg-muted/50">Time</th>
                          {weekDays.map((day) => (
                            <th key={day} className="border p-2 bg-muted/50">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {timeSlots.map((time) => (
                          <tr key={time}>
                            <td className="border p-2 text-sm sticky left-0 bg-background">
                              {time}
                            </td>
                            {weekDays.map((day) => (
                              <td key={`${day}-${time}`} className="border p-2">
                                {sampleClasses
                                  .filter(
                                    (cls) =>
                                      cls.day === day &&
                                      cls.startTime <= time &&
                                      cls.endTime > time
                                  )
                                  .map((cls) => (
                                    <div
                                      key={cls.id}
                                      className={cn(
                                        "p-2 rounded text-white text-sm mb-1",
                                        getClassTypeColor(cls.type)
                                      )}
                                    >
                                      <div className="font-medium">{cls.subject}</div>
                                      <div className="text-xs opacity-90">
                                        {cls.room}
                                      </div>
                                      {cls.isRecurring && (
                                        <Badge variant="secondary" className="mt-1">
                                          Recurring
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {sampleClasses.map((cls) => (
                  <Card key={cls.id} className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.day}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.startTime} - {cls.endTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.room}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{cls.group}</span>
                      </div>
                      <Badge variant="outline" className={cn(
                        "ml-auto",
                        cls.type === "lecture" && "bg-blue-500/10 text-blue-500",
                        cls.type === "lab" && "bg-green-500/10 text-green-500",
                        cls.type === "consultation" && "bg-purple-500/10 text-purple-500"
                      )}>
                        {cls.type.charAt(0).toUpperCase() + cls.type.slice(1)}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 