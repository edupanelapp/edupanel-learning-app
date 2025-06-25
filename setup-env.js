import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Setting up environment variables for Gemini AI...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
  
  // Read existing .env file
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  if (envContent.includes('VITE_GEMINI_API_KEY')) {
    console.log('✅ VITE_GEMINI_API_KEY is already configured');
  } else {
    console.log('⚠️  VITE_GEMINI_API_KEY is missing from .env file');
    console.log('Please add the following line to your .env file:');
    console.log('VITE_GEMINI_API_KEY=AIzaSyDQOsX9Ja6IoYUYRGRXX7IS9ApCNtxPLFo\n');
  }
} else {
  console.log('📝 Creating .env file...');
  
  const envContent = `# Google Gemini AI Configuration
VITE_GEMINI_API_KEY=AIzaSyDQOsX9Ja6IoYUYRGRXX7IS9ApCNtxPLFo

# Supabase Configuration (update with your actual values)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully');
}

console.log('\n📋 Next steps:');
console.log('1. Restart your development server: npm run dev');
console.log('2. Open the browser console to see any error messages');
console.log('3. Try using the AI chat feature');
console.log('\n🔍 If you still get errors, check:');
console.log('- The API key is valid and has proper permissions');
console.log('- Your internet connection is working');
console.log('- The browser console for detailed error messages'); 