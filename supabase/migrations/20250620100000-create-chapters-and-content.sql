-- Create subject_chapters table
CREATE TABLE IF NOT EXISTS subject_chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapter_contents table
CREATE TABLE IF NOT EXISTS chapter_contents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('video', 'pdf', 'document')),
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    chapter_id UUID NOT NULL REFERENCES subject_chapters(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subject_chapters_subject_id ON subject_chapters(subject_id);
CREATE INDEX IF NOT EXISTS idx_subject_chapters_order ON subject_chapters(subject_id, order_number);
CREATE INDEX IF NOT EXISTS idx_chapter_contents_chapter_id ON chapter_contents(chapter_id);
CREATE INDEX IF NOT EXISTS idx_chapter_contents_type ON chapter_contents(type);

-- Enable Row Level Security
ALTER TABLE subject_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_contents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subject_chapters
-- Faculty can view their own subject chapters
CREATE POLICY "Faculty can view their subject chapters" ON subject_chapters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subjects 
            WHERE subjects.id = subject_chapters.subject_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can insert chapters for their subjects
CREATE POLICY "Faculty can insert chapters for their subjects" ON subject_chapters
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM subjects 
            WHERE subjects.id = subject_chapters.subject_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can update their subject chapters
CREATE POLICY "Faculty can update their subject chapters" ON subject_chapters
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM subjects 
            WHERE subjects.id = subject_chapters.subject_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can delete their subject chapters
CREATE POLICY "Faculty can delete their subject chapters" ON subject_chapters
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM subjects 
            WHERE subjects.id = subject_chapters.subject_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Students can view chapters for subjects they are enrolled in
CREATE POLICY "Students can view chapters for enrolled subjects" ON subject_chapters
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_subjects 
            WHERE student_subjects.subject_id = subject_chapters.subject_id 
            AND student_subjects.student_id = auth.uid()
        )
    );

-- RLS Policies for chapter_contents
-- Faculty can view content for their subject chapters
CREATE POLICY "Faculty can view content for their chapters" ON chapter_contents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subject_chapters 
            JOIN subjects ON subjects.id = subject_chapters.subject_id
            WHERE subject_chapters.id = chapter_contents.chapter_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can insert content for their chapters
CREATE POLICY "Faculty can insert content for their chapters" ON chapter_contents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM subject_chapters 
            JOIN subjects ON subjects.id = subject_chapters.subject_id
            WHERE subject_chapters.id = chapter_contents.chapter_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can update content for their chapters
CREATE POLICY "Faculty can update content for their chapters" ON chapter_contents
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM subject_chapters 
            JOIN subjects ON subjects.id = subject_chapters.subject_id
            WHERE subject_chapters.id = chapter_contents.chapter_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Faculty can delete content for their chapters
CREATE POLICY "Faculty can delete content for their chapters" ON chapter_contents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM subject_chapters 
            JOIN subjects ON subjects.id = subject_chapters.subject_id
            WHERE subject_chapters.id = chapter_contents.chapter_id 
            AND subjects.faculty_id = auth.uid()
        )
    );

-- Students can view content for chapters of subjects they are enrolled in
CREATE POLICY "Students can view content for enrolled subjects" ON chapter_contents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM subject_chapters 
            JOIN student_subjects ON student_subjects.subject_id = subject_chapters.subject_id
            WHERE subject_chapters.id = chapter_contents.chapter_id 
            AND student_subjects.student_id = auth.uid()
        )
    );

-- Create storage bucket for course materials
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-materials', 'course-materials', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for course materials
CREATE POLICY "Faculty can upload course materials" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'course-materials' AND
        auth.uid() IN (
            SELECT faculty_id FROM subjects 
            WHERE subjects.id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Faculty can update their course materials" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'course-materials' AND
        auth.uid() IN (
            SELECT faculty_id FROM subjects 
            WHERE subjects.id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Faculty can delete their course materials" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'course-materials' AND
        auth.uid() IN (
            SELECT faculty_id FROM subjects 
            WHERE subjects.id::text = (storage.foldername(name))[1]
        )
    );

CREATE POLICY "Anyone can view course materials" ON storage.objects
    FOR SELECT USING (bucket_id = 'course-materials'); 