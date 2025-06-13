import { Link } from "react-router-dom"
import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Presentation, FileText, Lightbulb, Shield, ArrowRight } from "lucide-react"

export default function Landing() {
  const features = [
    {
      icon: BookOpen,
      title: "Organized Study Resources",
      description: "Access structured learning materials and course content"
    },
    {
      icon: FileText,
      title: "Assignment Management",
      description: "Submit and track assignments with easy-to-use interface"
    },
    {
      icon: Presentation,
      title: "Progress Tracking",
      description: "Monitor your learning journey and academic performance"
    },
    {
      icon: Lightbulb,
      title: "Project Mentorship",
      description: "Engage in guided student projects with faculty support"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Connect with mentors and peers in a structured environment"
    },
    {
      icon: Shield,
      title: "Secure Access Control",
      description: "Approval-based accounts ensure quality and institutional control"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Empower Your Learning Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            All your study materials, assignments, and mentorship in one professional platform designed for academic excellence.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
            <Button size="lg" asChild>
              <Link to="/register?role=student" className="flex items-center">
                Student Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/login?role=student">Student Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the tools and features that make EduPanel Learning Hub the perfect choice for modern education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-foreground mb-4">EduPanel Learning Hub</h3>
              <p className="text-muted-foreground">
                Empowering education through technology and structured learning experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link to="/features" className="hover:text-primary">Features</Link></li>
                <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary">Help Center</Link></li>
                <li><Link to="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Administrative</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link to="/register?role=faculty" className="hover:text-primary">Teacher Registration</Link>
                </li>
                <li>
                  <Link to="/login?role=faculty" className="hover:text-primary">Teacher Login</Link>
                </li>
                <li>
                  <Link to="/login?role=hod" className="hover:text-primary">HOD Login</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
