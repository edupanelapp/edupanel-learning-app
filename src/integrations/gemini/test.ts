import { GoogleGenerativeAI } from '@google/generative-ai';

// Test function to verify Gemini API integration
export async function testGeminiIntegration() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ VITE_GEMINI_API_KEY not found in environment variables');
    return false;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Hello! Please respond with "AI integration test successful"');
    const response = await result.response;
    const text = response.text();
    
    if (text.includes('AI integration test successful') || text.length > 0) {
      console.log('✅ Gemini API integration test successful');
      return true;
    } else {
      console.error('❌ Unexpected response from Gemini API');
      return false;
    }
  } catch (error) {
    console.error('❌ Gemini API integration test failed:', error);
    return false;
  }
}

// Test chat functionality
export async function testChatFunctionality() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ VITE_GEMINI_API_KEY not found in environment variables');
    return false;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });
    
    const result = await chat.sendMessage('Say "Chat test successful"');
    const response = await result.response;
    const text = response.text();
    
    if (text.includes('Chat test successful') || text.length > 0) {
      console.log('✅ Chat functionality test successful');
      return true;
    } else {
      console.error('❌ Unexpected chat response');
      return false;
    }
  } catch (error) {
    console.error('❌ Chat functionality test failed:', error);
    return false;
  }
}

// Run all tests
export async function runAllTests() {
  console.log('🧪 Running Gemini API integration tests...');
  
  const basicTest = await testGeminiIntegration();
  const chatTest = await testChatFunctionality();
  
  if (basicTest && chatTest) {
    console.log('🎉 All tests passed! Gemini integration is working correctly.');
    return true;
  } else {
    console.log('💥 Some tests failed. Please check your configuration.');
    return false;
  }
} 