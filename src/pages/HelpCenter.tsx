import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, BookOpen, Users, FileText, MessageSquare, ArrowLeft, HelpCircle, Settings, Phone } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function HelpCenter() {
  const navigate = useNavigate()
  useScrollToTop()

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your registered email address."
    },
    {
      question: "How do I access my course materials?",
      answer: "Once logged in, navigate to the 'Subjects' section in your dashboard. All your enrolled courses and their materials will be listed there."
    },
    {
      question: "How do I submit assignments?",
      answer: "Go to the 'Assignments' section, select the relevant assignment, and use the upload button to submit your work. Make sure to check the submission deadline."
    },
    {
      question: "How can I contact my instructors?",
      answer: "You can contact your instructors through the messaging system in the platform. Go to the 'Messages' section and select the instructor you want to contact."
    }
  ]

  const resources = [
    {
      icon: BookOpen,
      title: "User Guide",
      description: "Comprehensive guide to using the platform"
    },
    {
      icon: Users,
      title: "Student Resources",
      description: "Resources specifically for students"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Technical documentation and API references"
    },
    {
      icon: MessageSquare,
      title: "Community Forum",
      description: "Connect with other users and get help"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Sticky Back Button */}
      <div className="sticky top-16 z-40 px-4 sm:px-6 lg:px-8 py-2">
        <div className="container mx-auto">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Help Center
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Find answers to common questions and get support when you need it.
          </p>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Helpful Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <resource.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{resource.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{resource.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{faq.answer}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is here to help you with any questions or issues you may have.
          </p>
          <Button asChild>
            <a href="/contact">Contact Support</a>
          </Button>
        </div>
      </section>
    </div>
  )
} 