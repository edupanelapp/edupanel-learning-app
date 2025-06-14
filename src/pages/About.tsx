import { Navigation } from "@/components/layout/Navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, Target, Award, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useScrollToTop } from "@/hooks/useScrollToTop"

export default function About() {
  const navigate = useNavigate()
  useScrollToTop()

  const values = [
    {
      icon: GraduationCap,
      title: "Academic Excellence",
      description: "Committed to providing the highest quality educational experience through innovative learning methods and comprehensive resources."
    },
    {
      icon: Users,
      title: "Student-Centric",
      description: "Focused on student success with personalized learning paths and dedicated support systems."
    },
    {
      icon: Target,
      title: "Future-Ready",
      description: "Equipping students with the skills and knowledge needed to excel in their chosen fields and adapt to evolving industry demands."
    },
    {
      icon: Award,
      title: "Quality Education",
      description: "Maintaining high standards in curriculum delivery and ensuring continuous improvement in teaching methodologies."
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
            About Us
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4">
            Learn about our mission to transform education through technology.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Mission</CardTitle>
              <CardDescription className="text-lg">
                To transform education through technology, making quality learning accessible and engaging for all students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                EduPanel Learning Hub was founded with a vision to revolutionize the educational experience. 
                We combine cutting-edge technology with proven teaching methodologies to create an environment 
                where students can thrive and reach their full potential.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <value.icon className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Our Team</CardTitle>
              <CardDescription className="text-lg">
                A dedicated group of educators, technologists, and innovators working together to shape the future of education.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our team consists of experienced educators, software developers, and education technology experts 
                who are passionate about creating the best possible learning experience. We continuously work to 
                improve our platform and incorporate feedback from students, teachers, and administrators.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
} 