import { 
  Home, 
  BookOpen, 
  FileText, 
  Rocket, 
  TrendingUp, 
  Users, 
  UserCheck, 
  Megaphone,
  Calendar,
  BarChart
} from "lucide-react"

export type NavigationItem = {
  name: string
  href: string
  icon: any
  description?: string
}

export const navigationConfig = {
  student: [
    { 
      name: "Dashboard", 
      href: "/student/dashboard", 
      icon: Home,
      description: "Overview of your academic progress"
    },
    { 
      name: "Subjects", 
      href: "/student/subjects", 
      icon: BookOpen,
      description: "View and access your course materials"
    },
    { 
      name: "Assignments", 
      href: "/student/assignments", 
      icon: FileText,
      description: "Track and submit your assignments"
    },
    { 
      name: "Projects", 
      href: "/student/projects", 
      icon: Rocket,
      description: "Manage your academic projects"
    },
    { 
      name: "Progress", 
      href: "/student/progress", 
      icon: TrendingUp,
      description: "Monitor your academic performance"
    },
    {
      name: "Calendar",
      href: "/student/calendar",
      icon: Calendar,
      description: "View your academic schedule"
    }
  ],
  faculty: [
    { 
      name: "Dashboard", 
      href: "/faculty/dashboard", 
      icon: Home,
      description: "Overview of your teaching activities"
    },
    { 
      name: "Subjects", 
      href: "/faculty/subjects", 
      icon: BookOpen,
      description: "Manage your course materials"
    },
    { 
      name: "Assignments", 
      href: "/faculty/assignments", 
      icon: FileText,
      description: "Create and grade assignments"
    },
    { 
      name: "Projects", 
      href: "/faculty/projects", 
      icon: Rocket,
      description: "Supervise student projects"
    },
    { 
      name: "Students", 
      href: "/faculty/students", 
      icon: Users,
      description: "View and manage student progress"
    },
    { 
      name: "Approvals", 
      href: "/faculty/approvals", 
      icon: UserCheck,
      description: "Review student submissions"
    },
    {
      name: "Schedule",
      href: "/faculty/schedule",
      icon: Calendar,
      description: "Manage your teaching schedule"
    }
  ],
  hod: [
    { 
      name: "Dashboard", 
      href: "/hod/dashboard", 
      icon: Home,
      description: "Department overview and analytics"
    },
    { 
      name: "Approvals", 
      href: "/hod/approvals", 
      icon: UserCheck,
      description: "Review faculty and student applications"
    },
    { 
      name: "Subjects", 
      href: "/hod/subjects", 
      icon: BookOpen,
      description: "Manage department courses"
    },
    { 
      name: "Faculty", 
      href: "/hod/faculty", 
      icon: Users,
      description: "Manage faculty members"
    },
    { 
      name: "Students", 
      href: "/hod/students", 
      icon: Users,
      description: "View student information"
    },
    { 
      name: "Announcements", 
      href: "/hod/announcements", 
      icon: Megaphone,
      description: "Create department announcements"
    },
    {
      name: "Reports",
      href: "/hod/reports",
      icon: BarChart,
      description: "View department analytics"
    }
  ]
} 