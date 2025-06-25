import { supabase } from '@/integrations/supabase/client'

// Helper function to generate proper UUIDs
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function insertSampleStudentData() {
  console.log('Starting sample data insertion...')
  
  try {
    console.log('Step 1: Creating student profiles...')
    // Create student profiles (without semester field)
    const timestamp = Date.now()
    const studentProfiles = [
      {
        id: generateUUID(),
        full_name: 'Alice Johnson',
        email: `alice.johnson.${timestamp}@student.edu`,
        role: 'student',
        department: 'Computer Science'
      },
      {
        id: generateUUID(),
        full_name: 'Bob Smith',
        email: `bob.smith.${timestamp}@student.edu`,
        role: 'student',
        department: 'Computer Science'
      },
      {
        id: generateUUID(),
        full_name: 'Carol Davis',
        email: `carol.davis.${timestamp}@student.edu`,
        role: 'student',
        department: 'Computer Science'
      },
      {
        id: generateUUID(),
        full_name: 'David Wilson',
        email: `david.wilson.${timestamp}@student.edu`,
        role: 'student',
        department: 'Computer Science'
      },
      {
        id: generateUUID(),
        full_name: 'Eva Brown',
        email: `eva.brown.${timestamp}@student.edu`,
        role: 'student',
        department: 'Computer Science'
      }
    ]

    console.log('Student profiles to insert:', studentProfiles.length)
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(studentProfiles)

    if (profileError) {
      console.error('Error inserting student profiles:', profileError)
      // Continue anyway, might already exist
    } else {
      console.log('Student profiles created successfully')
    }

    console.log('Step 2: Inserting student_profiles...')
    // Insert student_profiles (detailed student info)
    const { error: studentDetailError } = await supabase
      .from('student_profiles')
      .upsert([
        {
          id: generateUUID(),
          user_id: studentProfiles[0].id,
          student_id: 'CSE2024001',
          semester: 1,
          batch: '2024',
          guardian_name: 'John Johnson',
          guardian_phone: '+1234567890'
        },
        {
          id: generateUUID(),
          user_id: studentProfiles[1].id,
          student_id: 'CSE2024002',
          semester: 1,
          batch: '2024',
          guardian_name: 'Jane Smith',
          guardian_phone: '+1234567891'
        },
        {
          id: generateUUID(),
          user_id: studentProfiles[2].id,
          student_id: 'CSE2024003',
          semester: 3,
          batch: '2023',
          guardian_name: 'Robert Davis',
          guardian_phone: '+1234567892'
        },
        {
          id: generateUUID(),
          user_id: studentProfiles[3].id,
          student_id: 'CSE2024004',
          semester: 3,
          batch: '2023',
          guardian_name: 'Mary Wilson',
          guardian_phone: '+1234567893'
        },
        {
          id: generateUUID(),
          user_id: studentProfiles[4].id,
          student_id: 'CSE2024005',
          semester: 5,
          batch: '2022',
          guardian_name: 'James Brown',
          guardian_phone: '+1234567894'
        }
      ])

    if (studentDetailError) {
      console.error('Error inserting student_profiles:', studentDetailError)
      // Continue anyway, might already exist
    } else {
      console.log('Student_profiles inserted successfully')
    }

    console.log('Sample data insertion completed successfully!')
    return { success: true, message: 'Sample data inserted successfully' }
  } catch (error) {
    console.error('Error inserting sample data:', error)
    throw error
  }
}

export async function insertSampleAnnouncementData() {
  console.log('Starting sample announcement data insertion...')
  
  try {
    // Get the current user from auth
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('No authenticated user found')
      return { success: false, message: 'No authenticated user found' }
    }

    // Get user profile to check role
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('id, full_name, role')
      .eq('id', user.id)
      .single()

    if (!userProfile) {
      console.error('User profile not found')
      return { success: false, message: 'User profile not found' }
    }

    console.log('Using current user as sender:', userProfile.full_name)

    console.log('Creating sample announcements...')
    const now = new Date()
    const futureDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    const pastDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000) // 10 days ago

    const sampleAnnouncements = [
      {
        id: generateUUID(),
        title: "Department Meeting - Important Updates",
        message: "All faculty members are required to attend the monthly department meeting on June 15th at 10:00 AM in Conference Room A. We will be discussing curriculum updates, upcoming events, and strategic planning for the next academic year. Please bring your laptops and any questions you may have.",
        type: 'announcement',
        target_audience: 'faculty',
        priority: 'high',
        expires_at: futureDate.toISOString(),
        action_required: true,
        action_url: 'https://meet.google.com/abc-defg-hij',
        attachments: ['https://example.com/meeting-agenda.pdf'],
        sender_id: userProfile.id,
        created_at: now.toISOString()
      },
      {
        id: generateUUID(),
        title: "Project Submission Guidelines - Updated",
        message: "Updated guidelines for final project submissions are now available. Please review the new requirements before submitting your projects. Key changes include: 1) Extended deadline by 1 week, 2) Additional documentation requirements, 3) New presentation format. All submissions must be made through the online portal.",
        type: 'announcement',
        target_audience: 'students',
        priority: 'medium',
        expires_at: futureDate.toISOString(),
        action_required: false,
        sender_id: userProfile.id,
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateUUID(),
        title: "Semester Break Notice",
        message: "Semester break will commence from June 25th to July 5th. All classes will resume on July 6th. During this period, the library will have reduced hours, and most administrative offices will be closed. Please plan your activities accordingly.",
        type: 'announcement',
        target_audience: 'all',
        priority: 'medium',
        expires_at: futureDate.toISOString(),
        action_required: false,
        sender_id: userProfile.id,
        created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: generateUUID(),
        title: "URGENT: System Maintenance Tonight",
        message: "The learning management system will be down for maintenance tonight from 11:00 PM to 2:00 AM. Please save all your work and submit any pending assignments before this time. We apologize for any inconvenience.",
        type: 'announcement',
        target_audience: 'all',
        priority: 'urgent',
        expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        action_required: true,
        action_url: 'https://status.example.com',
        sender_id: userProfile.id,
        created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago
      },
      {
        id: generateUUID(),
        title: "Library Maintenance - Completed",
        message: "The library maintenance has been completed successfully. All services are now fully operational. The new digital resources are now available for use. Please visit the library website to explore the new features.",
        type: 'announcement',
        target_audience: 'all',
        priority: 'low',
        expires_at: pastDate.toISOString(), // This one is expired
        action_required: false,
        sender_id: userProfile.id,
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days ago
      },
      {
        id: generateUUID(),
        title: "HOD Office Hours - This Week",
        message: "I will be available for office hours this week on Tuesday and Thursday from 2:00 PM to 4:00 PM. Students and faculty are welcome to drop by for any questions or concerns. No appointment necessary.",
        type: 'announcement',
        target_audience: 'all',
        priority: 'medium',
        expires_at: futureDate.toISOString(),
        action_required: false,
        sender_id: userProfile.id,
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    const { error: announcementError } = await supabase
      .from('notifications')
      .insert(sampleAnnouncements)

    if (announcementError) {
      console.error('Error inserting announcements:', announcementError)
      return { success: false, message: 'Failed to insert announcements' }
    }

    console.log('Sample announcements created successfully!')
    return { success: true, message: 'Sample announcements inserted successfully' }
  } catch (error) {
    console.error('Error inserting sample announcement data:', error)
    throw error
  }
} 