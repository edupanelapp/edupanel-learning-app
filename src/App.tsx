import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { StudentLayout } from "@/components/layout/StudentLayout";
import { FacultyLayout } from "@/components/layout/FacultyLayout";
import { HODLayout } from "@/components/layout/HODLayout";

// Pages
import Landing from "./pages/Landing";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ProfileSetup from "./pages/auth/ProfileSetup";
import PendingApproval from "./pages/auth/PendingApproval";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

// Student Pages
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentSubjects from "./pages/student/StudentSubjects";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentProjects from "./pages/student/StudentProjects";
import StudentProgress from "./pages/student/StudentProgress";
import StudentProfile from "./pages/student/StudentProfile";
import StudentSchedule from "./pages/student/StudentSchedule";

// Faculty Pages
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultySubjects from "./pages/faculty/FacultySubjects";
import FacultyAssignments from "./pages/faculty/FacultyAssignments";
import FacultyProjects from "./pages/faculty/FacultyProjects";
import FacultyStudents from "./pages/faculty/FacultyStudents";
import FacultyApprovals from "./pages/faculty/FacultyApprovals";
import FacultyProfile from "./pages/faculty/FacultyProfile";

// HOD Pages
import HODDashboard from "./pages/hod/HODDashboard";
import HODApprovals from "./pages/hod/HODApprovals";
import HODSubjects from "./pages/hod/HODSubjects";
import HODFaculty from "./pages/hod/HODFaculty";
import HODStudents from "./pages/hod/HODStudents";
import HODAnnouncements from "./pages/hod/HODAnnouncements";
import HODProfile from "./pages/hod/HODProfile";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/features" element={<Features />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/pending-approval" element={<PendingApproval />} />
              
              {/* Student Routes */}
              <Route path="/student" element={<StudentLayout />}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="subjects" element={<StudentSubjects />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="schedule" element={<StudentSchedule />} />
                <Route path="projects" element={<StudentProjects />} />
                <Route path="progress" element={<StudentProgress />} />
                <Route path="profile" element={<StudentProfile />} />
              </Route>

              {/* Faculty Routes */}
              <Route path="/faculty" element={<FacultyLayout />}>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="subjects" element={<FacultySubjects />} />
                <Route path="assignments" element={<FacultyAssignments />} />
                <Route path="projects" element={<FacultyProjects />} />
                <Route path="students" element={<FacultyStudents />} />
                <Route path="approvals" element={<FacultyApprovals />} />
                <Route path="profile" element={<FacultyProfile />} />
              </Route>

              {/* HOD Routes */}
              <Route path="/hod" element={<HODLayout />}>
                <Route path="dashboard" element={<HODDashboard />} />
                <Route path="approvals" element={<HODApprovals />} />
                <Route path="subjects" element={<HODSubjects />} />
                <Route path="faculty" element={<HODFaculty />} />
                <Route path="students" element={<HODStudents />} />
                <Route path="announcements" element={<HODAnnouncements />} />
                <Route path="profile" element={<HODProfile />} />
              </Route>
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
