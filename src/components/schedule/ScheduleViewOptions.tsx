import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Calendar, List, Settings2 } from "lucide-react"
import { ScheduleView } from "@/types/schedule"

interface ScheduleViewOptionsProps {
  view: ScheduleView
  onViewChange: (view: ScheduleView) => void
}

export function ScheduleViewOptions({ view, onViewChange }: ScheduleViewOptionsProps) {
  const handleViewTypeChange = (type: ScheduleView['type']) => {
    onViewChange({ ...view, type })
  }

  const handleGroupByChange = (groupBy: ScheduleView['groupBy']) => {
    onViewChange({ ...view, groupBy })
  }

  const toggleShowCompleted = () => {
    onViewChange({ ...view, showCompleted: !view.showCompleted })
  }

  const toggleShowOverdue = () => {
    onViewChange({ ...view, showOverdue: !view.showOverdue })
  }

  return (
    <div className="flex items-center gap-2">
      {/* View Type Buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant={view.type === 'month' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewTypeChange('month')}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          variant={view.type === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleViewTypeChange('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* View Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Settings2 className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="p-2">
            <h4 className="mb-2 text-sm font-medium">View Options</h4>
            <div className="space-y-2">
              {/* Group By */}
              <div className="space-y-1">
                <Label className="text-xs">Group By</Label>
                <div className="flex gap-2">
                  <Button
                    variant={view.groupBy === 'type' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleGroupByChange('type')}
                  >
                    Type
                  </Button>
                  <Button
                    variant={view.groupBy === 'subject' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleGroupByChange('subject')}
                  >
                    Subject
                  </Button>
                  <Button
                    variant={view.groupBy === 'none' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleGroupByChange('none')}
                  >
                    None
                  </Button>
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-completed" className="text-xs">
                    Show Completed
                  </Label>
                  <Switch
                    id="show-completed"
                    checked={view.showCompleted}
                    onCheckedChange={toggleShowCompleted}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-overdue" className="text-xs">
                    Show Overdue
                  </Label>
                  <Switch
                    id="show-overdue"
                    checked={view.showOverdue}
                    onCheckedChange={toggleShowOverdue}
                  />
                </div>
              </div>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 