import { useState, useRef } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { GraduationCap, Upload, Calendar, Phone, Mail, MapPin, User, Building, BookOpen, Award, FileText, Globe, Banknote, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

// Mock data - Replace with actual API calls
const departments = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Business Administration",
  "Mathematics",
  "Physics",
  "Chemistry"
]

const programs = {
  "Computer Science": [
    "B.Tech Computer Science",
    "M.Tech Computer Science",
    "M.Tech Artificial Intelligence",
    "M.Tech Data Science",
    "M.Tech Software Engineering",
    "Ph.D. Computer Science",
    "Ph.D. Artificial Intelligence",
    "Ph.D. Data Science"
  ],
  "Electrical Engineering": [
    "B.Tech Electrical Engineering",
    "M.Tech Power Systems",
    "M.Tech Control Systems",
    "M.Tech Power Electronics",
    "M.Tech Electrical Drives",
    "Ph.D. Electrical Engineering",
    "Ph.D. Power Systems"
  ],
  "Mechanical Engineering": [
    "B.Tech Mechanical Engineering",
    "M.Tech Thermal Engineering",
    "M.Tech Manufacturing Technology",
    "M.Tech Machine Design",
    "M.Tech Industrial Engineering",
    "Ph.D. Mechanical Engineering",
    "Ph.D. Thermal Engineering"
  ],
  "Civil Engineering": [
    "B.Tech Civil Engineering",
    "M.Tech Structural Engineering",
    "M.Tech Transportation Engineering",
    "M.Tech Environmental Engineering",
    "M.Tech Geotechnical Engineering",
    "Ph.D. Civil Engineering",
    "Ph.D. Structural Engineering"
  ],
  "Information Technology": [
    "B.Tech Information Technology",
    "M.Tech Information Technology",
    "M.Tech Cyber Security",
    "M.Tech Cloud Computing",
    "M.Tech Internet of Things",
    "Ph.D. Information Technology",
    "Ph.D. Cyber Security"
  ],
  "Electronics & Communication": [
    "B.Tech Electronics & Communication",
    "M.Tech VLSI Design",
    "M.Tech Communication Systems",
    "M.Tech Signal Processing",
    "M.Tech Embedded Systems",
    "Ph.D. Electronics & Communication",
    "Ph.D. VLSI Design"
  ],
  "Business Administration": [
    "BBA",
    "MBA",
    "MBA Finance",
    "MBA Marketing",
    "MBA Human Resources",
    "MBA Operations",
    "MBA Information Technology",
    "Ph.D. Business Administration"
  ],
  "Mathematics": [
    "B.Sc Mathematics",
    "M.Sc Mathematics",
    "M.Sc Applied Mathematics",
    "M.Sc Statistics",
    "Ph.D. Mathematics",
    "Ph.D. Applied Mathematics"
  ],
  "Physics": [
    "B.Sc Physics",
    "M.Sc Physics",
    "M.Sc Applied Physics",
    "M.Sc Electronics",
    "Ph.D. Physics",
    "Ph.D. Applied Physics"
  ],
  "Chemistry": [
    "B.Sc Chemistry",
    "M.Sc Chemistry",
    "M.Sc Organic Chemistry",
    "M.Sc Inorganic Chemistry",
    "M.Sc Physical Chemistry",
    "Ph.D. Chemistry",
    "Ph.D. Organic Chemistry"
  ]
}

const subjects = {
  "Computer Science": [
    "Data Structures",
    "Algorithms",
    "Database Systems",
    "Operating Systems",
    "Computer Networks"
  ],
  // Add other departments and their subjects
}

export default function ProfileSetup() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const role = searchParams.get("role") || "student"
  const email = searchParams.get("email") || ""
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: null as Date | null,
    gender: "",
    profilePicture: "",
    
    // Contact Details
    email: email,
    phone: "",
    alternatePhone: "",
    emergencyContact: "",
    emergencyPhone: "",
    
    // Academic/Professional Information
    department: "",
    program: "",
    semester: "",
    rollNumber: "",
    enrollmentYear: null as Date | null,
    designation: "",
    facultyId: "",
    officeLocation: "",
    
    // Additional Details
    permanentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    },
    currentAddress: {
      street: "",
      city: "",
      state: "",
      country: "",
      postalCode: ""
    },
    sameAsPermanent: false,
    bloodGroup: "",
    specialNeeds: "",
    interests: [] as string[],
    
    // Professional Details (Faculty only)
    highestQualification: "",
    specialization: "",
    researchInterests: [] as string[],
    joiningDate: null as Date | null,
    responsibilities: [] as string[],
    subjectsToTeach: [] as string[],
    resume: "",
    website: "",
    
    // Bank Details (Faculty only)
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    branch: "",
    ifscCode: "",
    
    // Declaration
    declaration: false
  })

  const [newInterest, setNewInterest] = useState("")
  const [newResearchInterest, setNewResearchInterest] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.declaration) {
      toast({
        title: "Error",
        description: "Please accept the declaration to continue",
        variant: "destructive"
      })
      return
    }
    
    // Validate required fields based on role
    const requiredFields = role === "student" 
      ? ["firstName", "lastName", "dateOfBirth", "gender", "phone", "emergencyContact", 
         "emergencyPhone", "department", "program", "semester", "rollNumber", 
         "enrollmentYear", "permanentAddress.street", "permanentAddress.city", "permanentAddress.state", "permanentAddress.country", "permanentAddress.postalCode"]
      : ["firstName", "lastName", "designation", "facultyId", "department", "phone", 
         "officeLocation", "highestQualification", "specialization", "joiningDate", 
         "accountHolderName", "accountNumber", "bankName", "branch", "ifscCode"]
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData])
    
    if (missingFields.length > 0) {
      toast({
        title: "Error",
        description: `Please fill in all required fields: ${missingFields.join(", ")}`,
        variant: "destructive"
      })
      return
    }
    
    // Simulate profile setup
    console.log("Profile setup data:", { ...formData, role })
    
    toast({
      title: "Profile Setup Complete",
      description: `Your ${role} profile is now pending approval.`,
    })

    // Redirect to pending approval page
    navigate(`/pending-approval?role=${role}`)
  }

  const getRoleTitle = () => {
    switch (role) {
      case "student": return "Student Profile Setup"
      case "faculty": return "Faculty Profile Setup"
      default: return "Profile Setup"
    }
  }

  const addInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest]
      })
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest)
    })
  }

  const addResearchInterest = () => {
    if (newResearchInterest && !formData.researchInterests.includes(newResearchInterest)) {
      setFormData({
        ...formData,
        researchInterests: [...formData.researchInterests, newResearchInterest]
      })
      setNewResearchInterest("")
    }
  }

  const removeResearchInterest = (interest: string) => {
    setFormData({
      ...formData,
      researchInterests: formData.researchInterests.filter(i => i !== interest)
    })
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Profile picture size should be less than 5MB",
          variant: "destructive"
        })
        return
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Only JPG, JPEG, and PNG files are allowed",
          variant: "destructive"
        })
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePicture: reader.result as string
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddressChange = (type: 'permanent' | 'current', field: string, value: string) => {
    if (type === 'permanent') {
      setFormData({
        ...formData,
        permanentAddress: {
          ...formData.permanentAddress,
          [field]: value
        },
        // If same as permanent is checked, update current address too
        ...(formData.sameAsPermanent && {
          currentAddress: {
            ...formData.currentAddress,
            [field]: value
          }
        })
      })
    } else {
      setFormData({
        ...formData,
        currentAddress: {
          ...formData.currentAddress,
          [field]: value
        }
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-primary">EduPanel Learning Hub</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>{getRoleTitle()}</CardTitle>
            <CardDescription>
              Complete your profile to get started. Your account will be pending approval after submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                
              {/* Profile Picture */}
              <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-2 border-border">
                  <AvatarImage src={formData.profilePicture} />
                      <AvatarFallback className="text-lg">
                        {formData.firstName ? formData.firstName[0].toUpperCase() : <Upload className="h-8 w-8" />}
                  </AvatarFallback>
                </Avatar>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleProfilePictureChange}
                    />
                  </div>
                  <div className="flex flex-col items-center space-y-2">
                    <Button 
                      variant="outline" 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-40"
                    >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
                    <div className="text-xs text-muted-foreground text-center space-y-1">
                      <p>Max size: 5MB</p>
                      <p>Supported formats: JPG, JPEG, PNG</p>
                    </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.dateOfBirth && "text-muted-foreground"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={formData.dateOfBirth || undefined}
                          onSelect={(date) => setFormData({ ...formData, dateOfBirth: date })}
                          disabled={(date) => date > new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                    />
                  </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternatePhone">Alternate Contact Number (Optional)</Label>
                    <Input
                      id="alternatePhone"
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Emergency Contact Number</Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Academic/Professional Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  {role === "student" ? "Academic Information" : "Professional Information"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => {
                        setFormData({ 
                          ...formData, 
                          department: value,
                          program: "", // Reset program when department changes
                          subjectsToTeach: [] // Reset subjects when department changes
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept.toLowerCase()}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {role === "student" ? (
                  <>
                    <div className="space-y-2">
                        <Label htmlFor="program">Program/Course</Label>
                        <Select
                          value={formData.program}
                          onValueChange={(value) => setFormData({ ...formData, program: value })}
                          disabled={!formData.department}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select program" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.department && programs[formData.department as keyof typeof programs]?.map((prog) => (
                              <SelectItem key={prog} value={prog.toLowerCase()}>
                                {prog}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="semester">Current Semester/Year</Label>
                        <Select
                          value={formData.semester}
                          onValueChange={(value) => setFormData({ ...formData, semester: value })}
                        >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: 8 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {i + 1}st Semester
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rollNumber">Roll Number/Student ID</Label>
                      <Input
                        id="rollNumber"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        required
                      />
                    </div>

                      <div className="space-y-2">
                        <Label>Enrollment Year</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.enrollmentYear && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formData.enrollmentYear ? format(formData.enrollmentYear, "yyyy") : "Select year"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={formData.enrollmentYear || undefined}
                              onSelect={(date) => setFormData({ ...formData, enrollmentYear: date })}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Select
                          value={formData.designation}
                          onValueChange={(value) => setFormData({ ...formData, designation: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="professor">Professor</SelectItem>
                            <SelectItem value="associate-professor">Associate Professor</SelectItem>
                            <SelectItem value="assistant-professor">Assistant Professor</SelectItem>
                            <SelectItem value="lecturer">Lecturer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="facultyId">Faculty ID/Employee Number</Label>
                        <Input
                          id="facultyId"
                          value={formData.facultyId}
                          onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="officeLocation">Office Location/Room Number</Label>
                        <Input
                          id="officeLocation"
                          value={formData.officeLocation}
                          onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="highestQualification">Highest Qualification</Label>
                        <Select
                          value={formData.highestQualification}
                          onValueChange={(value) => setFormData({ ...formData, highestQualification: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select qualification" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="phd">PhD</SelectItem>
                            <SelectItem value="masters">Masters</SelectItem>
                            <SelectItem value="bachelors">Bachelors</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          value={formData.specialization}
                          onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Research Interests</Label>
                        <div className="flex gap-2">
                          <Input
                            value={newResearchInterest}
                            onChange={(e) => setNewResearchInterest(e.target.value)}
                            placeholder="Add research interest"
                          />
                          <Button type="button" onClick={addResearchInterest}>
                            Add
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.researchInterests.map((interest) => (
                            <Badge key={interest} variant="secondary">
                              {interest}
                              <button
                                type="button"
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => removeResearchInterest(interest)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Joining Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.joiningDate && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {formData.joiningDate ? format(formData.joiningDate, "PPP") : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={formData.joiningDate || undefined}
                              onSelect={(date) => setFormData({ ...formData, joiningDate: date })}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Subjects Qualified to Teach</Label>
                        <Select
                          value=""
                          onValueChange={(value) => {
                            if (!formData.subjectsToTeach.includes(value)) {
                              setFormData({
                                ...formData,
                                subjectsToTeach: [...formData.subjectsToTeach, value]
                              })
                            }
                          }}
                          disabled={!formData.department}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select subjects" />
                          </SelectTrigger>
                          <SelectContent>
                            {formData.department && subjects[formData.department as keyof typeof subjects]?.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.subjectsToTeach.map((subject) => (
                            <Badge key={subject} variant="secondary">
                              {subject}
                              <button
                                type="button"
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    subjectsToTeach: formData.subjectsToTeach.filter(s => s !== subject)
                                  })
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="resume">Resume/CV Upload</Label>
                        <Input
                          id="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              // Handle file upload
                              console.log("File selected:", file)
                            }
                          }}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website/LinkedIn Profile</Label>
                        <Input
                          id="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        />
                      </div>
                  </>
                )}
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">Blood Group (Optional)</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => setFormData({ ...formData, bloodGroup: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="specialNeeds">Special Needs/Disabilities (Optional)</Label>
                    <Textarea
                      id="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Interests/Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add interest or skill"
                      />
                      <Button type="button" onClick={addInterest}>
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                          <button
                            type="button"
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onClick={() => removeInterest(interest)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Details</h3>

                {/* Permanent Address */}
                <div className="space-y-4">
                  <h4 className="font-medium">Permanent Address</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="permanentStreet">Street Address</Label>
                      <Input
                        id="permanentStreet"
                        value={formData.permanentAddress.street}
                        onChange={(e) => handleAddressChange('permanent', 'street', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentCity">City</Label>
                      <Input
                        id="permanentCity"
                        value={formData.permanentAddress.city}
                        onChange={(e) => handleAddressChange('permanent', 'city', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentState">State/Province</Label>
                      <Input
                        id="permanentState"
                        value={formData.permanentAddress.state}
                        onChange={(e) => handleAddressChange('permanent', 'state', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentCountry">Country</Label>
                      <Input
                        id="permanentCountry"
                        value={formData.permanentAddress.country}
                        onChange={(e) => handleAddressChange('permanent', 'country', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="permanentPostalCode">Postal Code</Label>
                      <Input
                        id="permanentPostalCode"
                        value={formData.permanentAddress.postalCode}
                        onChange={(e) => handleAddressChange('permanent', 'postalCode', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Current Address */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sameAsPermanent"
                      checked={formData.sameAsPermanent}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          sameAsPermanent: checked as boolean,
                          currentAddress: checked ? formData.permanentAddress : formData.currentAddress
                        })
                      }}
                    />
                    <Label htmlFor="sameAsPermanent">Same as permanent address</Label>
                  </div>

                  {!formData.sameAsPermanent && (
                    <>
                      <h4 className="font-medium">Current Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentStreet">Street Address</Label>
                          <Input
                            id="currentStreet"
                            value={formData.currentAddress.street}
                            onChange={(e) => handleAddressChange('current', 'street', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentCity">City</Label>
                          <Input
                            id="currentCity"
                            value={formData.currentAddress.city}
                            onChange={(e) => handleAddressChange('current', 'city', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentState">State/Province</Label>
                          <Input
                            id="currentState"
                            value={formData.currentAddress.state}
                            onChange={(e) => handleAddressChange('current', 'state', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentCountry">Country</Label>
                          <Input
                            id="currentCountry"
                            value={formData.currentAddress.country}
                            onChange={(e) => handleAddressChange('current', 'country', e.target.value)}
                            required
                          />
              </div>

              <div className="space-y-2">
                          <Label htmlFor="currentPostalCode">Postal Code</Label>
                          <Input
                            id="currentPostalCode"
                            value={formData.currentAddress.postalCode}
                            onChange={(e) => handleAddressChange('current', 'postalCode', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Bank Details Section (Faculty only) */}
              {role === "faculty" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bank Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountHolderName">Account Holder Name</Label>
                      <Input
                        id="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch">Branch</Label>
                      <Input
                        id="branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        required
                      />
                    </div>

                <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input
                        id="ifscCode"
                        value={formData.ifscCode}
                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Declaration */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={formData.declaration}
                    onCheckedChange={(checked) => setFormData({ ...formData, declaration: checked as boolean })}
                    required
                  />
                  <Label htmlFor="declaration" className="text-sm">
                    I verify that all information provided is accurate and complete
                  </Label>
              </div>

              <Button type="submit" className="w-full">
                Complete Profile Setup
              </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
