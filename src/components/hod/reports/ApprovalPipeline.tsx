import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle, Users } from "lucide-react";

export default function ApprovalPipeline() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Faculty Approvals</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            Leave requests and course material updates
          </p>
          <Button
            variant="outline"
            className="mt-4"
            asChild
          >
            <Link 
              to="/hod/approvals/faculty"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Review Faculty Approvals
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Student Approvals</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">8</div>
          <p className="text-xs text-muted-foreground">
            Course registrations and special requests
          </p>
          <Button
            variant="outline"
            className="mt-4"
            asChild
          >
            <Link 
              to="/hod/approvals/students"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Review Student Approvals
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 