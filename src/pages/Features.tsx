import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileText, 
  Presentation, 
  Lightbulb, 
  Users, 
  Shield,
  Calendar,
  MessageSquare,
  BarChart,
  Bookmark,
  Clock,
  Award,
  ArrowLeft,
  Target,
  Settings
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function Features() {
  const navigate = useNavigate()
  useScrollToTop()
  
  const features = [
    {
      icon: BookOpen,
      title: "Organized Study Resources",
      description: "Access structured learning materials and course content in a well-organized format."
    },
    {
      icon: FileText,
      title: "Assignment Management",
      description: "Submit and track assignments with an intuitive interface and automated grading system."
    },
    {
      icon: Presentation,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and performance metrics."
    },
    {
      icon: Lightbulb,
      title: "Project Mentorship",
      description: "Get guidance from experienced faculty members on your academic projects."
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with peers and mentors in a structured environment for enhanced learning."
    },
    {
      icon: Shield,
      title: "Secure Access Control",
      description: "Advanced security measures to protect your academic data and privacy."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Organize your study schedule with intelligent planning tools and reminders."
    },
    {
      icon: MessageSquare,
      title: "Discussion Forums",
      description: "Engage in meaningful academic discussions with peers and faculty."
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Track your academic progress with detailed analytics and insights."
    },
    {
      icon: Bookmark,
      title: "Resource Library",
      description: "Access a comprehensive collection of study materials and references."
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Tools to help you manage your study time effectively and efficiently."
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Get recognized for your academic achievements and milestones."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Sticky Back Button */}
      <div className="sticky top-16 z-40 px-4 sm:px-6 lg:px-8 py-2">
        <div className="container mx-auto">
          <Button 
            variant="ghost" 
            className="backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-colors"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Features
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Discover the powerful tools and features that make learning more effective and engaging.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of students who are already benefiting from our comprehensive learning platform.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/register?role=student" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
              Get Started
            </a>
            <a href="/login?role=student" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              Student Login
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 