import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { 
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Eye,
  FileText,
  Heart,
  HelpCircle,
  MessageCircle,
  Play,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { AIChatDialog } from "@/components/chat/AIChatDialog";
import { useAIChatContext } from "@/components/chat/AIChatContext";

interface Material {
  id: string;
  material_type: string;
  title: string;
  file_url: string;
  description: string;
  tags?: string[];
}

export default function StudentUnitLearning() {
  const { subjectId, chapterId, topicId } = useParams();
  const { user } = useAuth();
  const { setContext, clearContext } = useAIChatContext();
  const [videoMaterial, setVideoMaterial] = useState<Material | null>(null);
  const [pdfMaterials, setPdfMaterials] = useState<Material[]>([]);
  const [openPdfId, setOpenPdfId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'materials' | 'question' | 'ai'>('materials');
  const [isLoved, setIsLoved] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const playerRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [topicName, setTopicName] = useState('');
  
  // Custom PDF viewer plugin with minimal tools
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => [
      defaultTabs[0], // Thumbnails tab
    ],
    toolbarPlugin: {
      searchPlugin: {
        keyword: '',
      },
      fullScreenPlugin: {
        onEnterFullScreen: (zoom) => {
          zoom(1.5);
          return Promise.resolve();
        },
      },
    },
  });

  useEffect(() => {
    fetchMaterials();
    // eslint-disable-next-line
  }, [topicId]);

  // Cleanup effect to clear AI chat context when component unmounts
  useEffect(() => {
    return () => {
      clearContext();
    };
  }, [clearContext]);

  useEffect(() => {
    if (videoMaterial && playerRef.current) {
      const player = videojs(playerRef.current, {
        controls: true,
        preload: "auto",
        sources: [
          {
            src: videoMaterial.file_url,
            type: "video/mp4",
          },
        ],
      });

      // Get video duration when metadata is loaded
      player.on('loadedmetadata', () => {
        const duration = Math.round(player.duration() / 60);
        setVideoDuration(duration);
      });

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [videoMaterial]);

  const fetchMaterials = async () => {
    if (!topicId) return;
    
    try {
      const { data: materials, error } = await supabase
        .from('topic_materials')
        .select('*')
        .eq('topic_id', topicId)
        .order('created_at');

      if (error) throw error;

      const video = materials?.find(m => m.material_type === 'video') || null;
      const pdfs = materials?.filter(m => m.material_type === 'pdf') || [];

      setVideoMaterial(video);
      setPdfMaterials(pdfs);

      // Fetch subject and topic names for AI context
      if (video || pdfs.length > 0) {
        const { data: topicData } = await supabase
          .from('chapter_topics')
          .select(`
            title,
            chapter:subject_chapters(
              title,
              subject:subjects(name)
            )
          `)
          .eq('id', topicId)
          .single();

        if (topicData) {
          const subject = topicData.chapter?.subject?.name || 'General Studies';
          const topic = topicData.title;
          setTopicName(topic);
          setSubjectName(subject);
          
          // Set AI chat context
          setContext(subject, topic);
        }
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = () => {
    // Handle completion logic
  };

  const handleLoveToggle = () => {
    setIsLoved(!isLoved);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'materials':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Study Materials
            </h3>
            
            {/* PDF Materials */}
            {pdfMaterials.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  PDF Resources
                </h4>
                <div className="grid gap-3">
                  {pdfMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-700/30 dark:to-slate-600/30 rounded-xl border border-slate-200/60 dark:border-slate-600/60 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                          <FileText className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                            {material.title}
                          </h5>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {material.description}
                          </p>
                          {material.tags && material.tags.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {material.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(material.file_url, '_blank')}
                        className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View PDF
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No materials message */}
            {pdfMaterials.length === 0 && !videoMaterial && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  No study materials available
                </p>
              </div>
            )}
          </div>
        );
      case 'question':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Ask Question
            </h3>
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50/30 dark:from-slate-700/30 dark:to-slate-600/30 rounded-xl border border-green-200/50 dark:border-green-700/30">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Need Help?
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Ask your instructor any questions about this lesson. They'll get back to you as soon as possible.
                </p>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                  Ask Question
                </Button>
              </div>
            </div>
          </div>
        );
      case 'ai':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
              AI Assistant
            </h3>
            <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50/30 dark:from-slate-700/30 dark:to-slate-600/30 rounded-xl border border-purple-200/50 dark:border-purple-700/30">
              <div className="text-center">
                <HelpCircle className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  AI Learning Assistant
                </h4>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Get instant help from our AI assistant. Ask questions, get explanations, or request additional resources.
                </p>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                  onClick={() => setShowAIChat(true)}
                >
                  Start AI Chat
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        {/* Header Section - Enhanced */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 h-9 px-4 rounded-lg hover:bg-white/80 dark:hover:bg-slate-700/50 transition-all duration-200">
              <ArrowLeft className="h-4 w-4" />
              Back to Chapters
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                Chapter 1
              </Badge>
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <Badge variant="outline" className="text-xs px-3 py-1 rounded-full border-blue-200 text-blue-600 dark:border-blue-700 dark:text-blue-300">
                Unit 1.1
              </Badge>
            </div>
          </div>
        </div>

        {/* Main Content - Enhanced */}
        <div className="grid grid-cols-1 gap-6">
          {/* Video Player Card - Enhanced */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {videoMaterial ? (
                <div>
                  {/* Video Header - Enhanced */}
                  <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-700/30">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 text-xs px-3 py-1 rounded-full shadow-sm">
                            <Play className="h-3 w-3 mr-1" />
                            Video Lesson
                          </Badge>
                          <Badge variant="outline" className="text-xs px-3 py-1 rounded-full border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300">
                            {videoDuration > 0 ? `${videoDuration} min` : 'Loading...'}
                          </Badge>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight">
                          {videoMaterial.title}
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {videoMaterial.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-6">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`h-9 w-9 p-0 rounded-full transition-all duration-200 ${
                            isLoved 
                              ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30' 
                              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                          }`}
                          onClick={handleLoveToggle}
                        >
                          <Heart className={`h-4 w-4 ${isLoved ? 'fill-current' : ''}`} />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Player - Enhanced */}
                  <div className="relative">
                    <div className="aspect-video w-full bg-gradient-to-br from-slate-900 to-black">
                      <video
                        ref={playerRef}
                        className="video-js vjs-big-play-centered w-full h-full rounded-none"
                        controls
                        preload="auto"
                        data-setup="{}"
                      />
                    </div>
                    {/* Video overlay for better visual appeal */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  
                  {/* Tab Buttons */}
                  <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 to-blue-50/30 dark:from-slate-800/50 dark:to-slate-700/30">
                    <div className="flex items-center gap-3">
                      <Button 
                        variant={selectedTab === 'materials' ? 'default' : 'secondary'}
                        size="sm"
                        className={`flex items-center gap-2 h-10 px-5 font-semibold transition-all duration-300 rounded-xl ${
                          selectedTab === 'materials' 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                            : 'bg-slate-200 hover:bg-blue-200 border border-slate-400 hover:border-blue-500'
                        }`}
                        onClick={() => setSelectedTab('materials')}
                      >
                        <BookOpen className="h-4 w-4" />
                        Study Materials
                      </Button>
                      <Button 
                        variant={selectedTab === 'question' ? 'default' : 'secondary'}
                        size="sm"
                        className={`flex items-center gap-2 h-10 px-5 font-semibold transition-all duration-300 rounded-xl ${
                          selectedTab === 'question' 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg' 
                            : 'bg-slate-200 hover:bg-green-200 border border-slate-400 hover:border-green-500'
                        }`}
                        onClick={() => setSelectedTab('question')}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Ask Question
                      </Button>
                      <Button 
                        variant={selectedTab === 'ai' ? 'default' : 'secondary'}
                        size="sm"
                        className={`flex items-center gap-2 h-10 px-5 font-semibold transition-all duration-300 rounded-xl ${
                          selectedTab === 'ai' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg' 
                            : 'bg-slate-200 hover:bg-purple-200 border border-slate-400 hover:border-purple-500'
                        }`}
                        onClick={() => setSelectedTab('ai')}
                      >
                        <HelpCircle className="h-4 w-4" />
                        AI Assistant
                      </Button>
                      
                      <div className="ml-auto">
                        <Button 
                          size="sm"
                          className="flex items-center gap-2 h-10 px-5 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                          onClick={handleMarkComplete}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="text-slate-400 mb-4">
                    <Play className="h-16 w-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    No Video Available
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    This unit doesn't have any video content yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dynamic Content Container */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Chat Dialog */}
      <AIChatDialog
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        subject={subjectName}
        topic={topicName}
      />
    </div>
  );
} 