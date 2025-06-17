import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data - replace with actual data from your backend
const videoLectureData = [
  { name: "Mathematics", value: 400 },
  { name: "Physics", value: 300 },
  { name: "Computer Science", value: 300 },
  { name: "Chemistry", value: 200 },
];

const studyMaterialData = [
  { subject: "Mathematics", pdfs: 45, ppts: 30 },
  { subject: "Physics", pdfs: 35, ppts: 25 },
  { subject: "Computer Science", pdfs: 50, ppts: 40 },
  { subject: "Chemistry", pdfs: 30, ppts: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function ResourceUtilization() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resource Utilization</h2>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Video Lectures Accessed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={videoLectureData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {videoLectureData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Material Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyMaterialData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="pdfs" fill="#8884d8" name="PDFs" />
                  <Bar dataKey="ppts" fill="#82ca9d" name="Presentations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Resource Usage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Video Lectures</h3>
              <p className="text-2xl font-bold">1,200</p>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Downloads</h3>
              <p className="text-2xl font-bold">3,450</p>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Average Watch Time</h3>
              <p className="text-2xl font-bold">45 min</p>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 