import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, MessageCircle } from 'lucide-react';
import { AIChatDialog } from './AIChatDialog';
import { useAuth } from '@/hooks/useAuth';
import { useAIChatContext } from './AIChatContext';

export function StudentAIChatButton() {
  const [showChat, setShowChat] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { subject, topic } = useAIChatContext();

  // Only show the button if user is authenticated and is a student
  if (!isAuthenticated || user?.role !== 'student') {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Tooltip */}
          {isHovered && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                AI Learning Assistant
              </div>
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </div>
          )}
          
          {/* Main Button */}
          <Button
            onClick={() => setShowChat(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300 p-0"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          
          {/* Notification Badge */}
          <Badge 
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0"
          >
            AI
          </Badge>
        </div>
      </div>

      {/* Chat Dialog */}
      <AIChatDialog
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        subject={subject}
        topic={topic}
      />
    </>
  );
} 