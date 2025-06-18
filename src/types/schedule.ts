
export type EventType = 'class' | 'assignment' | 'project' | 'exam' | 'other'

export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'overdue' | 'in-progress'

export interface BaseEvent {
  id: string
  title: string
  type: EventType
  date: Date
  subject: string
  description?: string
  status: EventStatus
  priority: 'high' | 'medium' | 'low'
}

export interface ClassEvent extends BaseEvent {
  type: 'class'
  faculty: string
  duration: number // in minutes
  location: string
  isVirtual: boolean
  meetingLink?: string
  materials?: string[]
}

export interface AssignmentEvent extends BaseEvent {
  type: 'assignment'
  dueDate: Date
  submissionStatus?: 'pending' | 'submitted' | 'graded'
  submissionType?: 'file' | 'online' | 'text'
  maxAttempts?: number
  grade?: number
  feedback?: string
  attachments?: string[]
}

export interface ProjectEvent extends BaseEvent {
  type: 'project'
  mentor: string
  progress: number
  dueDate?: Date
  milestones: {
    title: string
    date: Date
    completed: boolean
  }[]
  team?: string[]
}

export interface ExamEvent extends BaseEvent {
  type: 'exam'
  duration: number // in minutes
  location: string
  totalMarks?: number
  syllabus?: string[]
  preparationStatus?: 'not_started' | 'in_progress' | 'completed'
}

export type ScheduleEvent = ClassEvent | AssignmentEvent | ProjectEvent | ExamEvent

export interface ScheduleFilters {
  types: EventType[]
  status: EventStatus[]
  priority: ('high' | 'medium' | 'low')[]
  dateRange: {
    start: Date
    end: Date
  }
}

export interface ScheduleView {
  type: 'month' | 'week' | 'day' | 'list'
  showCompleted: boolean
  showOverdue: boolean
  groupBy: 'type' | 'subject' | 'none'
}
