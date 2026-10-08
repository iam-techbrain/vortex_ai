import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve project root .env.local safely
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

function loadApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^GEMINI_API_KEY=([^\r\n]+)/m);
    if (match && match[1].trim()) {
      return match[1].trim();
    }
  }
  return null;
}

const apiKey = loadApiKey();

if (!apiKey) {
  console.error('Error: GEMINI_API_KEY not found in process.env or .env.local');
  process.exit(1);
}

async function testGemini(model) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Reply in one short sentence: Who are you?' }] }]
      })
    });
    const data = await res.json();
    console.log(model, 'Status:', res.status);
    if (res.status === 200) {
      console.log('Success Reply:', data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
    } else {
      console.log('Error details:', JSON.stringify(data));
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

async function run() {
  console.log('Testing with GEMINI_API_KEY securely loaded from .env.local (hidden for security)');
  await testGemini('gemini-3.1-flash-lite');
}

run();
