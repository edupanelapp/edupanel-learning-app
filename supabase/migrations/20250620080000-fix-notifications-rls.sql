-- Fix RLS policies for notifications table to handle announcements properly
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can send notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can mark their notifications as read" ON public.notifications;

-- Create new policies for notifications
-- Allow users to view notifications sent to them
CREATE POLICY "Users can view notifications sent to them" ON public.notifications FOR SELECT USING (
  recipient_id = auth.uid()
);

-- Allow HODs to view all announcements (type = 'announcement')
CREATE POLICY "HODs can view all announcements" ON public.notifications FOR SELECT USING (
  type = 'announcement' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Allow faculty to view announcements for their audience
CREATE POLICY "Faculty can view relevant announcements" ON public.notifications FOR SELECT USING (
  type = 'announcement' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'faculty') AND
  (target_audience = 'faculty' OR target_audience = 'all')
);

-- Allow students to view announcements for their audience
CREATE POLICY "Students can view relevant announcements" ON public.notifications FOR SELECT USING (
  type = 'announcement' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'student') AND
  (target_audience = 'students' OR target_audience = 'all')
);

-- Allow users to send notifications
CREATE POLICY "Users can send notifications" ON public.notifications FOR INSERT WITH CHECK (sender_id = auth.uid());

-- Allow HODs to manage all announcements
CREATE POLICY "HODs can manage all announcements" ON public.notifications FOR ALL USING (
  type = 'announcement' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hod')
);

-- Allow users to mark their own notifications as read
CREATE POLICY "Users can mark their notifications as read" ON public.notifications FOR UPDATE USING (recipient_id = auth.uid()); 