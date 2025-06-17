import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { DateRange } from "react-day-picker";
import ExecutiveSummary from "@/components/hod/reports/ExecutiveSummary";
import FacultyPerformance from "@/components/hod/reports/FacultyPerformance";
import StudentProgress from "@/components/hod/reports/StudentProgress";
import ResourceUtilization from "@/components/hod/reports/ResourceUtilization";
import ApprovalPipeline from "@/components/hod/reports/ApprovalPipeline";

export default function Reports() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date(),
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Department Reports</h1>
        <div className="flex items-center gap-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      <ExecutiveSummary />

      <Tabs defaultValue="faculty" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faculty">Faculty Performance</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
          <TabsTrigger value="resources">Resource Utilization</TabsTrigger>
        </TabsList>

        <TabsContent value="faculty" className="space-y-4">
          <FacultyPerformance />
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <StudentProgress />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <ResourceUtilization />
        </TabsContent>
      </Tabs>

      <ApprovalPipeline />
    </div>
  );
} 