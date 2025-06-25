import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  startChatSession, 
  sendMessage, 
  createEducationalPrompt,
  ChatMessage 
} from '@/integrations/gemini/client';

interface UseAIChatOptions {
  subject?: string;
  topic?: string;
}

export function useAIChat({ subject = 'General Studies', topic = 'Current Topic' }: UseAIChatOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<any>(null);
  const { toast } = useToast();

  // Initialize chat session
  const initializeChat = useCallback(async () => {
    try {
      const session = startChatSession();
      setChatSession(session);
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        role: 'assistant',
        content: `Hello! I'm your AI learning assistant. I'm here to help you with your studies in ${subject}. Feel free to ask me any questions about ${topic} or any other academic topics. How can I assist you today?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
      
      return session;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initialize AI chat session',
        variant: 'destructive'
      });
      throw error;
    }
  }, [subject, topic, toast]);

  // Send a message
  const sendChatMessage = useCallback(async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Ensure we have a chat session
      let session = chatSession;
      if (!session) {
        session = await initializeChat();
      }

      // Create context-aware prompt
      const prompt = createEducationalPrompt(subject, topic, message);
      
      // Send message to Gemini
      const response = await sendMessage(session, prompt);
      
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get response from AI assistant',
        variant: 'destructive'
      });
      
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [chatSession, isLoading, subject, topic, toast, initializeChat]);

  // Clear chat history
  const clearChat = useCallback(() => {
    setMessages([]);
    setChatSession(null);
  }, []);

  // Reset chat with new context
  const resetChat = useCallback(async (newSubject?: string, newTopic?: string) => {
    clearChat();
    if (newSubject || newTopic) {
      await initializeChat();
    }
  }, [clearChat, initializeChat]);

  return {
    messages,
    isLoading,
    sendMessage: sendChatMessage,
    clearChat,
    resetChat,
    initializeChat
  };
} 