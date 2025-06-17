import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScheduleFilters as FilterType, EventType, EventStatus } from "@/types/schedule"

interface ScheduleFiltersProps {
  filters: FilterType
  onFiltersChange: (filters: FilterType) => void
}

const eventTypes: EventType[] = ['class', 'assignment', 'project', 'exam', 'other']
const eventStatuses: EventStatus[] = ['upcoming', 'ongoing', 'completed', 'overdue']
const priorities = ['high', 'medium', 'low'] as const

export function ScheduleFilters({ filters, onFiltersChange }: ScheduleFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showError, setShowError] = useState(false)

  const activeFiltersCount = 
    filters.types.length + 
    filters.status.length + 
    filters.priority.length

  const toggleEventType = (type: EventType) => {
    const isAlreadyIncluded = filters.types.includes(type)
    const newTypes = isAlreadyIncluded
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]

    if (!isAlreadyIncluded && activeFiltersCount >= 3) {
      setShowError(true)
      return
    }
    setShowError(false)
    onFiltersChange({ ...filters, types: newTypes })
  }

  const toggleStatus = (status: EventStatus) => {
    const isAlreadyIncluded = filters.status.includes(status)
    const newStatuses = isAlreadyIncluded
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status]

    if (!isAlreadyIncluded && activeFiltersCount >= 3) {
      setShowError(true)
      return
    }
    setShowError(false)
    onFiltersChange({ ...filters, status: newStatuses })
  }

  const togglePriority = (priority: 'high' | 'medium' | 'low') => {
    const isAlreadyIncluded = filters.priority.includes(priority)
    const newPriorities = isAlreadyIncluded
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority]

    if (!isAlreadyIncluded && activeFiltersCount >= 3) {
      setShowError(true)
      return
    }
    setShowError(false)
    onFiltersChange({ ...filters, priority: newPriorities })
  }

  const clearFilters = () => {
    onFiltersChange({
      types: [],
      status: [],
      priority: [],
      dateRange: filters.dateRange
    })
    setShowError(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="gap-1"
              >
                {type}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleEventType(type)}
                />
              </Badge>
            ))}
            {filters.status.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="gap-1"
              >
                {status}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleStatus(status)}
                />
              </Badge>
            ))}
            {filters.priority.map((priority) => (
              <Badge
                key={priority}
                variant="secondary"
                className="gap-1"
              >
                {priority}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => togglePriority(priority)}
                />
              </Badge>
            ))}
          </div>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
              >
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 rounded-sm px-1 font-normal"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {showError && (
                  <p className="text-red-500 text-sm">Maximum 3 filters can be applied.</p>
                )}

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-4">
                    {/* Event Types */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Event Types</h5>
                      <div className="flex flex-wrap gap-2">
                        {eventTypes.map((type) => (
                          <Badge
                            key={type}
                            variant={filters.types.includes(type) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleEventType(type)}
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Status</h5>
                      <div className="flex flex-wrap gap-2">
                        {eventStatuses.map((status) => (
                          <Badge
                            key={status}
                            variant={filters.status.includes(status) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleStatus(status)}
                          >
                            {status}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Priority</h5>
                      <div className="flex flex-wrap gap-2">
                        {priorities.map((priority) => (
                          <Badge
                            key={priority}
                            variant={filters.priority.includes(priority) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer",
                              priority === 'high' && "bg-red-500",
                              priority === 'medium' && "bg-yellow-500",
                              priority === 'low' && "bg-green-500"
                            )}
                            onClick={() => togglePriority(priority)}
                          >
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
} 