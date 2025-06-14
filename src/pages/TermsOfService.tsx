import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Scale, Shield, AlertCircle, Settings } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function TermsOfService() {
  const navigate = useNavigate()
  useScrollToTop()

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using this platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform."
    },
    {
      title: "User Responsibilities",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      title: "Academic Integrity",
      content: "You agree to maintain academic integrity and not engage in any form of plagiarism, cheating, or academic misconduct while using the platform."
    },
    {
      title: "Content Guidelines",
      content: "You agree not to post or share any content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable."
    },
    {
      title: "Intellectual Property",
      content: "All content and materials available on this platform are protected by intellectual property rights. You may not use, reproduce, or distribute any content without proper authorization."
    },
    {
      title: "Termination",
      content: "We reserve the right to terminate or suspend your access to the platform at any time, without notice, for any reason, including violation of these Terms of Service."
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
            Terms of Service
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Please read these terms carefully before using our platform.
          </p>
        </div>
      </section>

      {/* Terms Content */}
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

          {/* Additional Information */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
              <CardDescription>
                For any questions regarding these Terms of Service, please contact us.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Email: legal@edupanel.edu<br />
                Address: 123 Education Street, Tech City, TC 12345
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 