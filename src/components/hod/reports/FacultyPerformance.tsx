import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const facultyData = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    subject: "Advanced Mathematics",
    avgGrade: 85,
    submissionRate: 92,
    feedback: 4.5,
  },
  // Add more sample data as needed
];

const gradingData = [
  { name: "Week 1", graded: 45, pending: 5 },
  { name: "Week 2", graded: 38, pending: 12 },
  { name: "Week 3", graded: 42, pending: 8 },
  // Add more data points
];

export default function FacultyPerformance() {
  const [selectedSemester, setSelectedSemester] = useState("current");
  const [selectedSubject, setSelectedSubject] = useState("all");

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Faculty Performance</h2>
        <div className="flex gap-4">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="previous">Previous Semester</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="math">Mathematics</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              {/* Add more subjects */}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="subject" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subject">By Subject</TabsTrigger>
          <TabsTrigger value="individual">By Individual</TabsTrigger>
        </TabsList>

        <TabsContent value="subject">
          <Card>
            <CardHeader>
              <CardTitle>Faculty-Subject Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Avg. Grade</TableHead>
                    <TableHead>Submission Rate</TableHead>
                    <TableHead>Student Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {facultyData.map((faculty) => (
                    <TableRow key={faculty.id}>
                      <TableCell className="font-medium">{faculty.name}</TableCell>
                      <TableCell>{faculty.subject}</TableCell>
                      <TableCell>{faculty.avgGrade}%</TableCell>
                      <TableCell>{faculty.submissionRate}%</TableCell>
                      <TableCell>{faculty.feedback} ⭐</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="individual">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assignments Graded vs. Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="graded" fill="#4CAF50" />
                      <Bar dataKey="pending" fill="#FFA726" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Student Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Add line chart component here */}
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Performance trend chart will be displayed here
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 