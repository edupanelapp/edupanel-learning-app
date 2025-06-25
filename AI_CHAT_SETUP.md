# AI Chat Integration Setup Guide

This guide explains how to set up the Gemini AI chat integration for the learning platform.

## Prerequisites

1. Google AI Studio account
2. Gemini API key

## Setup Instructions

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Environment Variables

Create a `.env` file in the root directory and add:

```env
# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 3. Install Dependencies

The required dependency is already installed:

```bash
npm install @google/generative-ai
```

## Features

### AI Chat Dialog
- Real-time chat with Gemini AI
- Context-aware responses based on subject and topic
- Educational prompts for better learning assistance
- Message history with timestamps
- Loading states and error handling

### Integration Points
- Available in Student Unit Learning page
- Accessible via "AI Assistant" tab
- Context-aware based on current subject and topic

## Usage

1. Navigate to any unit learning page
2. Click on the "AI Assistant" tab
3. Click "Start AI Chat" button
4. Ask questions about the current topic or any academic subject
5. Get instant AI-powered responses

## Technical Details

### Files Added/Modified
- `src/integrations/gemini/client.ts` - Gemini API client
- `src/components/chat/AIChatDialog.tsx` - Chat dialog component
- `src/pages/student/StudentUnitLearning.tsx` - Integration with existing page

### API Configuration
- Model: `gemini-1.5-flash`
- Max tokens: 2048
- Temperature: 0.7
- Context-aware prompts for educational content

## Security Notes

- API key is stored in environment variables
- No sensitive data is logged
- Error handling prevents API key exposure
- Rate limiting handled by Google's API

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure your Gemini API key is valid and has proper permissions
2. **Network Error**: Check your internet connection
3. **Rate Limit**: Google API has rate limits; wait and try again

### Error Messages
- "Failed to initialize AI chat session" - Check API key configuration
- "Failed to get response from AI assistant" - Network or API issue
- "Video file too large" - File size limits exceeded

## Support

For issues related to:
- Gemini API: Contact Google AI Studio support
- Application integration: Check the application logs
- Environment setup: Verify `.env` file configuration 