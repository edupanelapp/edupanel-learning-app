
import { useSearchParams, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap, Clock, CheckCircle } from "lucide-react"

export default function PendingApproval() {
  const [searchParams] = useSearchParams()
  const role = searchParams.get("role") || "student"

  const getApprovalMessage = () => {
    switch (role) {
      case "student":
        return {
          title: "Student Account Pending Approval",
          description: "Your student profile has been submitted and is awaiting approval from a faculty member.",
          approver: "faculty member",
          timeline: "1-2 business days"
        }
      case "faculty":
        return {
          title: "Faculty Account Pending Approval", 
          description: "Your faculty profile has been submitted and is awaiting approval from the Head of Department.",
          approver: "Head of Department (HOD)",
          timeline: "2-3 business days"
        }
      default:
        return {
          title: "Account Pending Approval",
          description: "Your account is awaiting approval.",
          approver: "administrator",
          timeline: "2-3 business days"
        }
    }
  }

  const approval = getApprovalMessage()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">EduPanel</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto">
              <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            </div>
            <CardTitle className="text-2xl">{approval.title}</CardTitle>
            <CardDescription className="text-base">
              {approval.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What happens next?</h3>
              <ul className="text-sm text-muted-foreground space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  Your profile has been submitted successfully
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                  A {approval.approver} will review your application
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  You'll receive email notification once approved
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  Full access to platform features will be granted
                </li>
              </ul>
            </div>

            <div className="text-sm text-muted-foreground">
              <p>Expected approval time: <span className="font-medium">{approval.timeline}</span></p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to={`/login?role=${role}`}>
                  Check Login Status
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/">
                  Return to Home
                </Link>
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              If you have any questions or concerns, please contact our support team.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
