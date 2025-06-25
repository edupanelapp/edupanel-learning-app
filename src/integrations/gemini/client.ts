import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error('❌ VITE_GEMINI_API_KEY is not set in environment variables');
  console.error('Please create a .env file with: VITE_GEMINI_API_KEY=your_api_key_here');
}

const genAI = new GoogleGenerativeAI(apiKey || '');

// Get the model
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Chat interface
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Chat session interface
export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Initialize a new chat session
export const startChatSession = () => {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
  }
  
  const chat = geminiModel.startChat({
    history: [],
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  });
  return chat;
};

// Send a message to the chat
export const sendMessage = async (chat: any, message: string): Promise<string> => {
  try {
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }
    
    console.log('🤖 Sending message to Gemini:', message.substring(0, 100) + '...');
    
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Received response from Gemini:', text.substring(0, 100) + '...');
    
    return text;
  } catch (error: any) {
    console.error('❌ Error sending message to Gemini:', error);
    
    // Provide more specific error messages
    if (error.message?.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your .env file.');
    } else if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(`Failed to get response from AI assistant: ${error.message || 'Unknown error'}`);
    }
  }
};

// Create a context-aware prompt for educational content
export const createEducationalPrompt = (subject: string, topic: string, userQuestion: string) => {
  return `You are an AI learning assistant for an educational platform. You're helping a student with their studies.

Context:
- Subject: ${subject}
- Current Topic: ${topic}

Student's Question: ${userQuestion}

Please provide a helpful, educational response that:
1. Directly addresses the student's question
2. Provides clear explanations and examples
3. Encourages learning and understanding
4. Uses a friendly, supportive tone
5. Suggests related topics or resources when relevant

Keep your response concise but comprehensive. If the question is not related to the current subject/topic, still provide a helpful response while gently guiding them back to their studies.`;
}; 