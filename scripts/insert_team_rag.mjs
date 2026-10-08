import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key) env[key.trim()] = vals.join('=').trim();
  }
  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const geminiApiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
  console.error('Error: Missing required env vars in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getEmbedding(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
        outputDimensionality: 768
      })
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Embedding API failed (${res.status}): ${err}`);
  }

  const data = await res.json();
  return data?.embedding?.values;
}

const teamDoc = {
  title: 'Digi Ritual Team, Leadership & Agency Structure',
  content: `Digi Ritual (Ritual.ai) is a full-service digital transformation and growth agency powered by an in-house powerhouse team of 25 to 50+ specialists. Our company is organized under seasoned domain leaders:

1. SEO Division (Search Engine Optimization & Google Ranking):
Managed by Shubham and Rahul, senior managers with over 5 years of verified industry experience. They execute technical audits, Core Web Vitals optimization, and high-buyer-intent keyword architecture to deliver top Google rankings and organic revenue.

2. Creative, Video, Animation & Branding Division:
Headed by Santosh and Siddharth. They oversee all visual media: viral 9:16 reels, post videos, graphics, 2D and 3D animation, logo design, and large-scale digital branding campaigns that elevate brand perception across all social channels.

3. Web Engineering, AI Agents, E-commerce & Enterprise Systems:
Led by Raghav. This division engineers immersive 3D interactive websites (WebGL / Three.js), high-converting landing pages, custom AI agents trained on proprietary business data, full-featured E-commerce stores with payment gateways, and specialized Hospital Management Systems (HMS) and custom ERP/CRM platforms.

4. In-House Squad:
Under Shubham, Rahul, Santosh, Siddharth, and Raghav, an active team of 25 to 50+ developers, designers, video editors, and media buyers executes every client deliverable with speed and precision.`,
  category: 'team_leadership',
  metadata: {
    agency: 'Digi Ritual',
    seo_managers: ['Shubham', 'Rahul (5+ years exp)'],
    creative_leads: ['Santosh', 'Siddharth (Reels, 2D/3D Animation, Logo, Branding)'],
    tech_lead: ['Raghav (Web, 3D, AI Agents, E-commerce, Hospital Management Systems HMS)'],
    team_size: '25-50+ in-house experts'
  }
};

async function run() {
  console.log('Generating embedding for Digi Ritual Team Document...');
  const vector = await getEmbedding(teamDoc.content);

  console.log(`Vector generated (length: ${vector.length}). Inserting into Supabase public.documents...`);
  const { data, error } = await supabase.from('documents').insert([
    {
      ...teamDoc,
      embedding: vector
    }
  ]).select();

  if (error) {
    console.error('Insert error:', error.message);
  } else {
    console.log('Successfully inserted Digi Ritual Team Document with vector embedding!', data);
  }
}

run();
