
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, UserCheck, Clock, TrendingUp } from "lucide-react"

export default function HODDashboard() {
  const stats = [
    { title: "Total Subjects", value: "24", icon: BookOpen, color: "text-blue-600" },
    { title: "Faculty Members", value: "12", icon: Users, color: "text-green-600" },
    { title: "Total Students", value: "342", icon: Users, color: "text-purple-600" },
    { title: "Pending Approvals", value: "3", icon: UserCheck, color: "text-orange-600" },
  ]

  const pendingApprovals = [
    { name: "Dr. Sarah Johnson", type: "Faculty", department: "Computer Science", date: "2025-06-10" },
    { name: "Prof. Michael Brown", type: "Faculty", department: "Computer Science", date: "2025-06-11" },
    { name: "Dr. Lisa Wang", type: "Faculty", department: "Computer Science", date: "2025-06-11" },
  ]

  const recentActivities = [
    { type: "approval", message: "Approved Dr. John Smith's faculty application", time: "2 hours ago" },
    { type: "subject", message: "Assigned Database Systems to Prof. Mary Wilson", time: "1 day ago" },
    { type: "announcement", message: "Posted department meeting announcement", time: "2 days ago" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, Dr. HOD! 👋</h1>
          <p className="text-muted-foreground">Overview of your department's academic activities</p>
        </div>
        <Button>
          <UserCheck className="h-4 w-4 mr-2" />
          Review Approvals
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Faculty Approvals
            </CardTitle>
            <CardDescription>Faculty members awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((approval, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{approval.name}</p>
                    <p className="text-sm text-muted-foreground">Applied on {approval.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">View</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">View All Approvals</Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>Your recent departmental actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Department Overview</CardTitle>
          <CardDescription>Quick insights into your department's performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">89%</div>
              <div className="text-sm text-muted-foreground">Faculty Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Student Progress Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Active Projects</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
