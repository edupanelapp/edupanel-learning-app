import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Lock, Eye, FileText, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function PrivacyPolicy() {
  const navigate = useNavigate()
  useScrollToTop()

  const sections = [
    {
      title: "Information Collection",
      content: "We collect information that you provide directly to us, including your name, email address, and academic information. We also collect information about your use of our platform."
    },
    {
      title: "Information Usage",
      content: "We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience."
    },
    {
      title: "Information Sharing",
      content: "We do not share your personal information with third parties except as described in this policy. We may share information with your educational institution and service providers."
    },
    {
      title: "Data Security",
      content: "We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure."
    },
    {
      title: "Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You can also object to the processing of your data or request data portability."
    },
    {
      title: "Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
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
            Privacy Policy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Learn how we collect, use, and protect your personal information.
          </p>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Information */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                If you have any questions about this Privacy Policy, please contact us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Email: privacy@edupanel.edu<br />
                Address: 123 Education Street, Tech City, TC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 