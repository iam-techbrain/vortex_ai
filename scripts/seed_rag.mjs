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
  console.error('Error: Missing required environment variables in .env.local');
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

async function seed() {
  console.log('Fetching documents from Supabase to populate vector embeddings...\n');

  const { data: rows, error } = await supabase.from('documents').select('id, title, content');

  if (error) {
    console.error('Error fetching documents:', error.message);
    process.exit(1);
  }

  if (!rows || rows.length === 0) {
    console.log('No documents found in public.documents table.');
    return;
  }

  console.log(`Found ${rows.length} documents. Generating embeddings via Google Gemini...\n`);

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    process.stdout.write(`[${i + 1}/${rows.length}] Generating 768-dim vector for: "${row.title}" (ID: ${row.id})... `);

    try {
      const embedding = await getEmbedding(row.content);
      if (!embedding || embedding.length !== 768) {
        console.log(`FAILED: Invalid dimensions`);
        continue;
      }

      const { error: updateErr } = await supabase
        .from('documents')
        .update({ embedding })
        .eq('id', row.id);

      if (updateErr) {
        console.log(`Update Error: ${updateErr.message}`);
      } else {
        console.log(`SUCCESS! Vector stored in Supabase.`);
      }
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }

  console.log('\nAll Supabase pgvector embeddings have been populated successfully!');
}

seed();
