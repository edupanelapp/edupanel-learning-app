import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FileText, Scale, Shield, AlertCircle, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function TermsOfService() {
  const navigate = useNavigate()
  useScrollToTop()

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By accessing and using EduPanel Learning Hub, you accept and agree to be bound by the terms and conditions of this agreement."
    },
    {
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account."
    },
    {
      title: "User Conduct",
      content: "You agree to use the platform only for lawful purposes and in accordance with these Terms. You must not use the platform in any way that violates any applicable laws or regulations."
    },
    {
      title: "Intellectual Property",
      content: "The platform and its original content, features, and functionality are owned by EduPanel and are protected by international copyright, trademark, and other intellectual property laws."
    },
    {
      title: "Termination",
      content: "We may terminate or suspend your account and bar access to the platform immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever."
    },
    {
      title: "Limitation of Liability",
      content: "In no event shall EduPanel be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
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