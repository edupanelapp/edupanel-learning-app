import { Link } from "react-router-dom"
import { Navigation } from "@/components/layout/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Award, Presentation, FileText, Lightbulb, Shield, ArrowRight, GraduationCap, Sparkles, Star, CheckCircle2, ChevronDown, ArrowUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Logo } from "@/components/ui/Logo"

const quotes = [
  "Education is the most powerful weapon which you can use to change the world. – Nelson Mandela",
  "The beautiful thing about learning is that no one can take it away from you. – B.B. King",
  "The purpose of education is to replace an empty mind with an open one. – Malcolm Forbes",
  "Learning never exhausts the mind. – Leonardo da Vinci"
]

function EducationalQuotes() {
  const [index, setIndex] = useState(0)

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-[48px] flex items-center justify-center transition-all duration-700 animate-fade-in">
      <span className="text-base italic text-muted-foreground text-center">{quotes[index]}</span>
    </div>
  )
}

export default function Landing() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      setShowScrollTop(scrollPosition > 300)
      setShowScrollIndicator(scrollPosition < 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

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
                    {/* Educational Quotes Section */}
                    <EducationalQuotes />
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

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-500 flex justify-center w-full ${
          showScrollIndicator ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-muted-foreground animate-fade-in">Scroll to explore</span>
          <ChevronDown className="h-6 w-6 text-primary animate-slide-up" />
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-foreground shadow-lg hover:bg-background/90 hover:scale-105 hover:border-primary/50 transition-all duration-300 animate-fade-in z-50 group"
          aria-label="Scroll to top"
        >
          <div className="relative">
            <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
          </div>
        </button>
      )}

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="h-4 w-4" />
              <span>Platform Features</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Everything You Need to Succeed</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover the tools and features that make EduPanel Learning Hub the perfect choice for modern education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                      <span>Easy to use</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                      <span>Always accessible</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Features Banner */}
          <div className="mt-16 bg-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">Your data is protected with enterprise-grade security</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Active Community</h3>
                <p className="text-sm text-muted-foreground">Connect with peers and mentors worldwide</p>
              </div>
              <div className="text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Quality Content</h3>
                <p className="text-sm text-muted-foreground">Curated by expert educators and professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-t relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <Logo />
              <p className="text-sm text-muted-foreground max-w-md">
                Empowering the next generation of learners through innovative education technology and structured learning experiences.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/about" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/features" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Features
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/help" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/privacy" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Administrative */}
            <div>
              <h3 className="font-semibold mb-4">Administrative</h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/register?role=faculty" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Teacher Registration
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login?role=faculty" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    Teacher Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/login?role=hod" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <div className="h-1 w-1 rounded-full bg-primary/50" />
                    HOD Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} EduPanel Learning Hub. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Designed with ❤️ for better education
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
