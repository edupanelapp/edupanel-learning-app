import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StudentFieldsProps {
  formData: any
  setFormData: (data: any) => void
  isLoading: boolean
}

export function StudentFields({ formData, setFormData, isLoading }: StudentFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID</Label>
          <Input
            id="studentId"
            value={formData.studentId}
            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
            placeholder="Enter your student ID"
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="semester">Semester</Label>
          <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="batch">Batch</Label>
          <Input
            id="batch"
            value={formData.batch}
            onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            placeholder="e.g., 2024-2028"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guardianName">Guardian Name</Label>
          <Input
            id="guardianName"
            value={formData.guardianName}
            onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
            placeholder="Enter guardian's name"
            disabled={isLoading}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="guardianPhone">Guardian Phone</Label>
        <Input
          id="guardianPhone"
          value={formData.guardianPhone}
          onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
          placeholder="Enter guardian's phone"
          disabled={isLoading}
        />
      </div>
    </>
  )
}
