import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAIChatContext } from "@/components/chat/AIChatContext";

interface Chapter {
  id: string;
  title: string;
  description: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
}

export default function StudentSubjectContent() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { setContext } = useAIChatContext();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subjectName, setSubjectName] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (subjectId) {
      console.log("Fetching chapters for subject:", subjectId);
      fetchChapters();
    } else {
      console.error("No subjectId provided");
      setError("No subject ID provided");
    }
    // eslint-disable-next-line
  }, [subjectId]);

  const fetchChapters = async () => {
    if (!subjectId) {
      setError("No subject ID provided");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log("Making Supabase query for subject_chapters with subjectId:", subjectId);
      
      // First, get the subject name
      const { data: subjectData, error: subjectError } = await supabase
        .from("subjects")
        .select("name")
        .eq("id", subjectId)
        .single();

      if (subjectError) {
        console.error("Error fetching subject:", subjectError);
      } else if (subjectData) {
        setSubjectName(subjectData.name);
        // Set AI chat context for the subject
        setContext(subjectData.name, 'Subject Overview');
      }
      
      const { data, error } = await supabase
        .from("subject_chapters")
        .select("id, title, description, chapter_number")
        .eq("subject_id", subjectId)
        .order("chapter_number");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Chapters data received:", data);
      
      if (data) {
        setChapters(data);
        if (data.length === 0) {
          setError("No chapters found for this subject");
        }
      } else {
        setError("No chapters data received");
      }
    } catch (err: any) {
      console.error("Error fetching chapters:", err);
      setError(err.message || "Failed to load chapters");
      toast({
        title: "Error",
        description: "Failed to load chapters: " + (err.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTopics = async (chapterId: string) => {
    setLoading(true);
    setSelectedChapter(chapterId);
    
    try {
      console.log("Fetching topics for chapter:", chapterId);
      
      // Get chapter title for context
      const { data: chapterData } = await supabase
        .from("subject_chapters")
        .select("title")
        .eq("id", chapterId)
        .single();

      if (chapterData) {
        // Update AI chat context for the selected chapter
        setContext(subjectName, chapterData.title);
      }
      
      const { data, error } = await supabase
        .from("chapter_topics")
        .select("id, title, description, topic_number")
        .eq("chapter_id", chapterId)
        .order("topic_number");

      if (error) {
        console.error("Supabase error fetching topics:", error);
        throw error;
      }

      console.log("Topics data received:", data);
      
      if (data) {
        setTopics(data);
      }
    } catch (err: any) {
      console.error("Error fetching topics:", err);
      toast({
        title: "Error",
        description: "Failed to load topics: " + (err.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-primary mb-4">Chapters</h1>
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
                Error Loading Chapters
              </h3>
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={fetchChapters} variant="outline">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary mb-4">Chapters</h1>
      
      {loading && (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-lg">Loading chapters...</div>
        </div>
      )}
      
      {!loading && chapters.length === 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-700 dark:text-yellow-300 mb-2">
                No Chapters Available
              </h3>
              <p className="text-yellow-600 dark:text-yellow-400">
                This subject doesn't have any chapters yet. Please check back later.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!loading && chapters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapters.map((chapter) => (
            <Card key={chapter.id} className={selectedChapter === chapter.id ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{chapter.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-2 text-muted-foreground">{chapter.description}</p>
                <Button
                  variant={selectedChapter === chapter.id ? "default" : "outline"}
                  onClick={() => fetchTopics(chapter.id)}
                >
                  {selectedChapter === chapter.id ? "Selected" : "Explore Subject"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {selectedChapter && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Units in this Chapter</h2>
          {loading ? (
            <div className="text-center py-4">Loading units...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <Card key={topic.id}>
                  <CardHeader>
                    <CardTitle>{topic.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-muted-foreground">{topic.description}</p>
                    <Button onClick={() => navigate(`/student/subjects/${subjectId}/chapters/${selectedChapter}/topics/${topic.id}`)}>
                      Explore Subject
                    </Button>
                  </CardContent>
                </Card>
              ))}
              {topics.length === 0 && <div className="text-muted-foreground">No units found for this chapter.</div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 