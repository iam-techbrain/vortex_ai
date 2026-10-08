-- ==============================================================================
-- RITUAL.AI SUPABASE PGVECTOR & RAG SCHEMA
-- Database: PostgreSQL + pgvector (768 dimensions for Google Gemini embeddings)
-- ==============================================================================

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create knowledge base documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    title TEXT,
    content TEXT NOT NULL,
    category TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(768), -- Dimension for Gemini text-embedding-004 / gemini-embedding-001
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- 3. Create high-performance HNSW index for cosine similarity search
CREATE INDEX IF NOT EXISTS documents_embedding_hnsw_idx
ON public.documents
USING hnsw (embedding vector_cosine_ops);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access to knowledge documents for seeding
DROP POLICY IF EXISTS "Allow public all access to knowledge documents" ON public.documents;
DROP POLICY IF EXISTS "Allow public read access to knowledge documents" ON public.documents;
CREATE POLICY "Allow public all access to knowledge documents"
ON public.documents
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 5. RPC Function: match_documents for RAG Similarity Search
CREATE OR REPLACE FUNCTION public.match_documents (
    query_embedding VECTOR(768),
    match_threshold FLOAT DEFAULT 0.50,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    content TEXT,
    category TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
    RETURN QUERY
    SELECT
        d.id,
        d.title,
        d.content,
        d.category,
        d.metadata,
        ROUND((1 - (d.embedding <=> query_embedding))::NUMERIC, 4)::FLOAT AS similarity
    FROM public.documents d
    WHERE d.embedding IS NOT NULL
      AND (1 - (d.embedding <=> query_embedding)) > match_threshold
    ORDER BY d.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 6. Helper RPC to update embedding with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.update_document_embedding(doc_id BIGINT, new_embedding VECTOR(768))
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.documents SET embedding = new_embedding WHERE id = doc_id;
END;
$$;

-- 7. Leads Table for Enterprise Lead Capture & CRM Routing
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT,
    phone TEXT,
    market_region TEXT DEFAULT 'Global',
    detected_lang TEXT DEFAULT 'en',
    intent_score INT DEFAULT 50,
    suggested_tier TEXT,
    summary TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon and auth to insert leads" ON public.leads;
CREATE POLICY "Allow anon and auth to insert leads"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ==============================================================================
-- 7. SEED KNOWLEDGE DATA (Comprehensive Agency Capabilities)
-- ==============================================================================
INSERT INTO public.documents (title, content, category, metadata)
VALUES
(
    'Social Media Ads Specialist & Precision Targeting',
    'Ritual.ai / Digi Ritual provides a dedicated Ads Specialist (Media Buyer) who manages end-to-end Meta and Google Ad campaigns. We conduct deep audience research: precisely knowing who to target (high-intent buyers by demographics, interests, lookalikes) and who to exclude (negative audiences, non-buyers) so your ad budget is never wasted. We perform continuous A/B testing on ad creatives and optimize weekly for cost-per-lead and ROAS.',
    'advertising',
    '{"channels": ["Meta Ads", "Google Ads", "Instagram", "Facebook"], "skills": ["Audience Targeting", "Exclusions", "Budget Optimization", "ROAS Scaling"]}'::jsonb
),
(
    'Viral Reels & 2D/3D Animation Video Production',
    'We produce high-impact viral reels and 2D/3D animation videos tailored to your brand. From customer psychology-backed hooks and engaging storytelling to dynamic motion graphics, 3D product visualizations, and native-language captions, we deliver 3-4 professional reels per week. Our animated explainer videos turn complex products into easily understandable visual stories, with top performers scaled directly into ad campaigns.',
    'creative_video',
    '{"formats": ["9:16 Viral Reels", "2D Animation", "3D Motion Graphics", "Explainer Videos"], "platforms": ["Instagram", "YouTube Shorts", "TikTok"]}'::jsonb
),
(
    'Website Engineering: 3D, Landing Pages & Multi-Page Portals',
    'We engineer state-of-the-art web experiences: from immersive 3D interactive websites (WebGL, Three.js, Spline animations) that wow visitors, to ultra-fast single-page landing pages built for high ad conversion, and expansive multi-page corporate portals with international multilingual SEO. All sites are responsive, mobile-optimized, and built on modern tech stacks like Next.js.',
    'web_development',
    '{"types": ["3D Interactive Websites", "Single-Page High-Converting Landing Pages", "Multi-Page Corporate Portals"], "tech": ["Next.js", "React", "Three.js", "Tailwind CSS"]}'::jsonb
),
(
    'E-Commerce & Custom Business Management Systems (HMS / ERP)',
    'We build scalable E-commerce stores with seamless payment gateways (Stripe, Razorpay, PayPal) and inventory management. Additionally, we develop custom enterprise software tailored to specific industry workflows: Hospital Management Systems (doctor schedules, patient records, OPD billing), Real Estate portals, School/College ERPs, and custom CRM platforms that streamline operations and accelerate business growth.',
    'software_systems',
    '{"solutions": ["E-Commerce Stores", "Hospital Management Systems (HMS)", "Real Estate Portals", "Custom ERP & CRM"], "integrations": ["Payment Gateways", "Inventory", "Billing", "Appointments"]}'::jsonb
),
(
    'Custom Business AI Agents & Intelligent Product Matcher',
    'We build tailored AI agents specifically fine-tuned on your business data, product catalog, and service workflows. The AI acts as your 24/7 digital sales consultant: engaging prospects transparently, understanding user needs, recommending the exact right product/service, answering objections, and closing discovery calls with 2+ years of simulated industry expertise.',
    'ai_agents',
    '{"capabilities": ["24/7 Intelligent Chat", "Lead Qualification", "Product Matching", "Objection Handling"], "integration": ["Website Embed", "WhatsApp", "Telegram"]}'::jsonb
),
(
    'Instant CRM & 2-Second WhatsApp Routing Automation',
    'Every qualified lead interacting with our AI or ad funnels is processed in real time. Important customer details and chat summaries are passed through automated server webhooks (Make.com/n8n) straight into your Google Sheets/CRM and dispatched to your sales team on WhatsApp or Telegram within 2 seconds, ensuring you connect with prospects while interest is at its peak.',
    'automation',
    '{"speed": "<2 seconds", "destinations": ["WhatsApp Group", "Telegram VIP Alert", "Google Sheets", "CRM"]}'::jsonb
),
(
    'Global & Localized SEO Architecture',
    'We execute comprehensive search engine optimization: technical Core Web Vitals audit, high-buyer-intent keyword mapping across local cities and international territories (Germany/DACH, UK, Global), multilingual hreflang architecture, and monthly topical authority articles that drive consistent inbound organic revenue.',
    'seo',
    '{"markets": ["Local Cities", "DACH Region (Germany)", "UK & USA", "Global"], "focus": ["Buyer-Intent Keywords", "Technical Audit", "Topical Authority"]}'::jsonb
),
(
    'Digi Ritual Team & Leadership Structure: SEO, Video, Animation, Branding, Web & AI',
    'Digi Ritual (Ritual.ai) is powered by an in-house powerhouse team of 25 to 50+ digital experts, organized under specialized domain leadership: 1. SEO Managers Shubham and Rahul (5+ years verified experience delivering top Google rankings); 2. Creative, Video, 2D/3D Animation, Logo Design & Big Digital Branding led by Santosh and Siddharth; 3. 3D Web Development, Custom AI Agents, E-commerce, and Hospital Management Systems (HMS) led by Raghav.',
    'team_leadership',
    '{"agency": "Digi Ritual", "seo_managers": ["Shubham", "Rahul"], "creative_leads": ["Santosh", "Siddharth"], "tech_lead": "Raghav", "team_size": "25-50+ in-house experts"}'::jsonb
)
ON CONFLICT DO NOTHING;
