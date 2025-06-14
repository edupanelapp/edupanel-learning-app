import { Link } from "react-router-dom"
import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Presentation, FileText, Lightbulb, Shield, ArrowRight, GraduationCap, Sparkles, Star, CheckCircle2 } from "lucide-react"

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
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-fade-in">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>Transform Your Learning Experience</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight animate-slide-up">
                Your Gateway to{" "}
                <span className="relative">
                  Academic Excellence
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20 rounded-full" />
                </span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
                Access comprehensive study materials, track your progress, and collaborate with mentors in a secure, structured learning environment.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up">
                <Button size="lg" asChild className="w-full sm:w-auto group">
                  <Link to="/register?role=student" className="flex items-center">
                    Get Started 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                  <Link to="/login?role=student">Student Login</Link>
                </Button>
              </div>

              {/* Key Benefits */}
              <div className="mt-8 space-y-3 max-w-xl mx-auto lg:mx-0 animate-fade-in">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Access to premium study materials</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Real-time progress tracking</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Expert mentorship and guidance</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl mx-auto lg:mx-0">
                <div className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Students</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">Expert Faculty</div>
                </div>
                <div className="text-center p-4 rounded-lg bg-card hover:shadow-lg transition-shadow">
                  <div className="text-2xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Right Content - Decorative Element */}
            <div className="flex-1 hidden lg:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-3xl transform rotate-3 animate-float" />
                <div className="relative bg-card rounded-3xl p-8 shadow-lg border border-border/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">EduPanel Learning Hub</h3>
                      <p className="text-sm text-muted-foreground">Your Academic Success Partner</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-3/4 bg-primary/10 rounded-full animate-pulse" />
                    <div className="h-2 w-full bg-primary/10 rounded-full animate-pulse delay-150" />
                    <div className="h-2 w-2/3 bg-primary/10 rounded-full animate-pulse delay-300" />
                  </div>
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background" />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Join 10K+ students</span>
                  </div>
                </div>
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-float" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-primary/20 rounded-full animate-float delay-300" />
                <div className="absolute top-1/2 -right-2 w-4 h-4 bg-primary/20 rounded-full animate-float delay-150" />
              </div>
            </div>
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
