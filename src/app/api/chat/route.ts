import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase admin/server client for pgvector RAG queries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: Record<string, string>;
}

// Built-in European & Multilingual Fallback Knowledge Base
const KB: { agency: string; entries: KnowledgeEntry[] } = {
  agency: "Ritual.ai",
  entries: [
    {
      id: "team",
      keywords: ["team", "who", "founders", "leadership", "people", "kaun", "members", "experince", "experience", "shubham", "rahul", "santosh", "siddharth", "raghav", "टीम", "लोग"],
      answer: {
        en: "Meet the Digi Ritual Team: Our agency is powered by 25 to 50+ in-house experts. Our SEO division is managed by Shubham and Rahul (both with 5+ years of Google ranking mastery). Creative videos, 2D/3D animation, and branding are spearheaded by Santosh and Siddharth. Our web engineering, custom AI agents, E-commerce, and Hospital Management Systems are led by Raghav. Together, we deliver end-to-end digital excellence.",
        hi: "Digi Ritual की टीम: हमारी एजेंसी में 25 से 50+ इन-हाउस एक्सपर्ट्स की टीम काम करती है। हमारे SEO विंग को शुभम (Shubham) और राहुल (Rahul) लीड करते हैं जिन्हें 5+ साल का शानदार एक्सपीरियंस है। वीडियो, 2D/3D एनीमेशन और ब्रांडिंग का काम संतोष (Santosh) और सिद्धार्थ (Siddharth) संभालते हैं। वहीं 3D वेबसाइट्स, AI एजेंट्स, ई-कॉमर्स और हॉस्पिटल मैनेजमेंट सिस्टम्स को राघव (Raghav) लीड करते हैं।",
        de: "Das Digi Ritual Team: Hinter unserer Agentur steht ein 25–50-köpfiges In-House-Team. Den SEO-Bereich leiten Shubham und Rahul (mit über 5 Jahren Erfahrung), Video & 2D/3D-Animation führen Santosh und Siddharth, und den Bereich 3D-Web, KI-Agenten sowie Krankenhaus-Managementsysteme steuert Raghav.",
        fr: "L'équipe Digi Ritual : notre agence réunit 25 à 50+ experts. Shubham et Rahul (5+ ans d'expérience) dirigent le SEO, Santosh et Siddharth pilotent l'animation 2D/3D et la vidéo, et Raghav dirige le développement web, l'IA et les systèmes HMS.",
        es: "El equipo de Digi Ritual: contamos con un equipo interno de 25 a 50+ profesionales. Shubham y Rahul (5+ años de experiencia) lideran SEO, Santosh y Siddharth la animación 2D/3D y vídeo, y Raghav el desarrollo web y sistemas de IA."
      }
    },
    {
      id: "seo",
      keywords: ["seo", "search", "ranking", "keywords", "google", "suchmaschine", "shubham", "rahul", "एसईओ"],
      answer: {
        en: "Digi Ritual SEO Architecture: Our SEO division is led by Shubham and Rahul, senior managers with over 5 years of proven experience in technical SEO, high-buyer-intent keyword architecture, and organic traffic growth. Supported by their dedicated team, they optimize Core Web Vitals and ensure your business dominates Google search results.",
        hi: "Digi Ritual SEO सर्विसेज: हमारे SEO डिपार्टमेंट को शुभम (Shubham) और राहुल (Rahul) लीड करते हैं, जिनके पास 5+ साल का बेहतरीन अनुभव है। वे कीवर्ड मैपिंग, टेक्निकल SEO और गूगल रैंकिंग को इस तरह ऑप्टिमाइज़ करते हैं कि आपकी साइट पर सिर्फ ऑर्गेनिक ही नहीं, बल्कि असली खरीदार (buyers) आते हैं।",
        de: "Digi Ritual SEO: Unser SEO-Team wird von Shubham und Rahul geleitet (über 5 Jahre Erfahrung in Google-Rankings und Intent-Keyword-Mapping). Sie stellen sicher, dass Ihre Website für kaufbereite Kunden ganz oben rankt.",
        fr: "SEO Digi Ritual : piloté par Shubham et Rahul (5+ ans d'expertise SEO), ciblant les mots-clés transactionnels pour maximiser votre visibilité sur Google.",
        es: "SEO en Digi Ritual: liderado por Shubham y Rahul (5+ años de experiencia), optimizando el posicionamiento orgánico en Google para atraer clientes cualificados."
      }
    },
    {
      id: "reels_animation",
      keywords: ["reel", "reels", "video", "content", "short", "animation", "2d", "3d", "motion", "explainer", "santosh", "siddharth", "branding", "logo", "रील्स", "वीडियो", "एनीमेशन"],
      answer: {
        en: "Creative, Branding & 2D/3D Animation: At Digi Ritual, our creative and media production is led by Santosh and Siddharth. They orchestrate high-production post videos, viral 9:16 reels, 2D/3D animation, dynamic motion graphics, logo design, and complete corporate branding. They deliver 3-4 viral reels weekly and scale top performers directly into high-ROI ad campaigns.",
        hi: "क्रिएटिव, ब्रांडिंग और 2D/3D एनीमेशन: Digi Ritual में हमारे वीडियो, रील्स और ब्रांडिंग विंग को संतोष (Santosh) और सिद्धार्थ (Siddharth) लीड करते हैं। वे वायरल 9:16 रील्स, 2D/3D एनीमेशन वीडियो, लोगो डिजाइन और बड़े डिजिटल ब्रांडिंग कैंपेन तैयार करते हैं, जिससे आपका ब्रांड सोशल मीडिया पर अलग ही चमकता है।",
        de: "Video, 2D/3D-Animation & Branding: Bei Digi Ritual leiten Santosh und Siddharth die Kreativproduktion (virale Reels, 2D/3D-Animationen, Logo-Design und komplettes Unternehmens-Branding) für maximale Social-Media-Reichweite.",
        fr: "Création vidéo, animation 2D/3D et branding : chez Digi Ritual, Santosh et Siddharth supervisent la production de reels viraux, animations 2D/3D et identité de marque.",
        es: "Vídeo, animación 2D/3D y branding: en Digi Ritual, Santosh y Siddharth dirigen la creación de reels virales, animaciones 2D/3D y diseño de identidad de marca."
      }
    },
    {
      id: "web_development",
      keywords: ["website", "3d", "3d website", "landing page", "single page", "multiple page", "portal", "raghav", "वेबसाइट"],
      answer: {
        en: "Web & Systems Engineering: Led by Raghav at Digi Ritual, our tech engineering division builds next-gen digital platforms: captivating 3D interactive websites (Three.js/WebGL), high-converting single-page landing pages for ad funnels, and enterprise multi-page portals with global multilingual SEO, backed by our 25-50+ developer squad.",
        hi: "वेबसाइट डेवलपमेंट (3D और मल्टी-पेज): Digi Ritual में हमारे वेब और सिस्टम विंग को राघव (Raghav) लीड करते हैं। हम 3D इंटरएक्टिव वेबसाइट्स (Three.js/WebGL), ऐड्स के लिए सुपरफास्ट लैंडिंग पेजेस और इंटरनेशनल मल्टी-पेज कॉर्पोरेट पोर्टल्स बनाते हैं, जिन्हें हमारी 25-50 लोगों की टेक टीम डेवलप करती है।",
        de: "Webentwicklung & Portale: Geleitet von Raghav entwickelt Digi Ritual immersive 3D-Websites (Three.js), performante Landingpages und mehrsprachige Unternehmensportale.",
        fr: "Développement web 3D et portails : dirigé par Raghav chez Digi Ritual, créant des sites 3D immersifs et des pages de destination à fort taux de conversion.",
        es: "Desarrollo web 3D y portales: liderado por Raghav en Digi Ritual, creando webs 3D interactivas y landing pages de alta conversión."
      }
    },
    {
      id: "software_systems",
      keywords: ["hospital", "management", "system", "hms", "ecommerce", "e-commerce", "store", "erp", "crm", "raghav", "हॉस्पिटल", "सिस्टम"],
      answer: {
        en: "E-Commerce & Hospital Management Systems (HMS): Raghav and our systems engineering team develop scalable E-commerce stores with payment gateways (Stripe/Razorpay) and specialized Hospital Management Systems (doctor schedules, patient records, OPD billing), alongside custom ERP/CRM tools that fully digitize enterprise workflows.",
        hi: "ई-कॉमर्स और हॉस्पिटल मैनेजमेंट सिस्टम्स (HMS/ERP): राघव (Raghav) और हमारी टेक टीम हॉस्पिटल मैनेजमेंट सिस्टम्स (डॉक्टर शेड्यूलिंग, पेशेंट रिकॉर्ड्स, OPD बिलिंग), ई-कॉमर्स स्टोर्स और कस्टम ERP/CRM सिस्टम्स तैयार करते हैं जो किसी भी हॉस्पिटल या बिजनेस को पूरी तरह ऑटोमेट कर देते हैं।",
        de: "E-Commerce & Krankenhaus-Managementsysteme: Raghav und unser Team entwickeln spezialisierte Krankenhaus-Software (HMS mit Terminplanung und Abrechnung) sowie skalierbare E-Commerce-Systeme.",
        fr: "E-commerce et systèmes hospitaliers (HMS) : Raghav et notre équipe conçoivent des plateformes e-commerce et des solutions hospitalières complètes.",
        es: "Comercio electrónico y software hospitalario (HMS): Raghav y nuestro equipo desarrollan tiendas online y sistemas de gestión hospitalaria a medida."
      }
    },
    {
      id: "ads",
      keywords: ["ads", "ad", "meta", "facebook", "instagram", "google", "campaign", "target", "exclude", "media buyer", "विज्ञापन"],
      answer: {
        en: "Dedicated Ads Specialist & Media Buying: Digi Ritual assigns dedicated Media Buyers to your brand. We conduct deep audience research: exactly knowing who to target (high-intent buyers) and who to exclude (negative audiences) so not a single dollar of your budget is wasted, driving maximum ROAS.",
        hi: "डेडिकेटेड ऐड्स स्पेशलिस्ट और मीडिया बाइंग: Digi Ritual में हम आपके लिए एक डेडिकेटेड मीडिया बायर नियुक्त करते हैं जो Meta और Google ऐड्स चलाता है। हम पूरी रिसर्च करके टारगेट करते हैं और फालतू लोगों को एक्सक्लूड करते हैं ताकि आपका बजट सिर्फ उन लोगों पर लगे जो सच में खरीदना चाहते हैं।",
        de: "Dedizierter Media Buyer & Präzises Ad-Targeting: Digi Ritual stellt Ihnen einen erfahrenen Media Buyer bereit, der Zielgruppen exakt ansteuert und Streuverluste konsequent ausschließt.",
        fr: "Achat média et ciblage publicitaire : Digi Ritual affecte un Media Buyer dédié pour cibler précisément les acheteurs et optimiser vos budgets Meta et Google.",
        es: "Compra de medios y publicidad segmentada: en Digi Ritual asignamos un especialista dedicado para maximizar el retorno de inversión en Meta y Google."
      }
    },
    {
      id: "automation",
      keywords: ["automation", "automate", "make", "n8n", "telegram", "whatsapp", "sheets", "crm", "lead", "ऑटोमेशन"],
      answer: {
        en: "Instant 2-Second WhatsApp CRM Routing: Digi Ritual connects your customer touchpoints to an automated pipeline. Every inquiry is qualified by AI and pushed to your sales team on WhatsApp or Telegram within 2 seconds.",
        hi: "2-सेकंड WhatsApp ऑटोमेशन: Digi Ritual आपके लीड फ्लो को सुपरफास्ट बनाता है। जैसे ही कोई कस्टमर बात करता है, उसका पूरा डेटा 2 सेकंड के भीतर आपकी टीम के WhatsApp या Telegram पर VIP अलर्ट के साथ पहुंच जाता है।",
        de: "2-Sekunden WhatsApp-Lead-Routing: Digi Ritual leitet jeden qualifizierten Interessenten innerhalb von 2 Sekunden direkt an Ihr Vertriebsteam weiter.",
        fr: "Routage WhatsApp en 2 secondes : Digi Ritual qualifie chaque prospect et alerte votre équipe commerciale en 2 secondes.",
        es: "Alertas WhatsApp en 2 segundos: Digi Ritual califica a los clientes potenciales y los envía a tu equipo en 2 segundos."
      }
    }
  ]
};

const FALLBACKS: Record<string, string> = {
  en: "That sounds like a fantastic vision! At Digi Ritual, we'd love to help you scale it to the next level. What industry is your business in, and what is your main focus right now?",
  hi: "अरे वाह, यह तो बहुत ही शानदार विजन है! Digi Ritual में हमारी पूरी टीम इसे बहुत बेहतरीन तरीके से स्केल कर सकती है। आपका बिजनेस किस इंडस्ट्री में है और अभी आपका सबसे बड़ा फोकस किस चीज़ पर है?",
  de: "Ein hervorragender Ansatz! Bei Digi Ritual unterstützen wir Sie gerne dabei, diese Vision umzusetzen. In welcher Branche sind Sie tätig und was ist Ihr wichtigstes Ziel?",
  fr: "C'est une excellente vision ! Chez Digi Ritual, nous serions ravis de propulser ce projet. Quel est votre secteur d'activité et votre objectif prioritaire ?",
  es: "¡Una visión excelente! En Digi Ritual estaremos encantados de escalar este proyecto. ¿En qué sector opera su negocio y cuál es su objetivo principal?"
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = (body.message || "").trim();
    const lang: string = body.lang || "en";
    const rawHistory: Array<{ role: string; content: string }> = Array.isArray(body.history) ? body.history : [];
    const geo = body.geo || null;
    const clientLocation = geo ? `${geo.city}, ${geo.region}, ${geo.country}` : "Global";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const lower = message.toLowerCase();

    // 1. Lead Detection (Email / Phone)
    const emailMatch = lower.match(/[^\s@]+@[^\s@]+\.[^\s@]+/);
    const phoneMatch = lower.match(/(\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9})/);

    if (emailMatch || (phoneMatch && phoneMatch[0].length >= 8)) {
      const email = emailMatch ? emailMatch[0] : null;
      const phone = phoneMatch ? phoneMatch[0] : null;

      // Save lead to Supabase if configured
      if (supabase) {
        try {
          await supabase.from("leads").insert([
            {
              email,
              phone,
              market_region: geo && geo.city ? `${geo.city}, ${geo.region || geo.country}` : (lang === "de" ? "DACH" : "Global"),
              detected_lang: lang,
              intent_score: 95,
              suggested_tier: "Growth Automation Suite",
              summary: `Lead from chat: "${message}"`,
              metadata: { fullMessage: message, timestamp: new Date().toISOString() }
            }
          ]);
        } catch (dbErr) {
          console.warn("Supabase lead insertion skipped:", dbErr);
        }
      }

      const ackReplies: Record<string, string> = {
        de: "Vielen Dank! Ihre Kontaktdaten wurden erfasst. Unser Team wird sich in Kürze mit einer maßgeschneiderten Wachstums-Roadmap bei Ihnen melden.",
        hi: "धन्यवाद! आपका संपर्क विवरण सुरक्षित रूप से दर्ज कर लिया गया है। हमारी टीम जल्द ही आपसे संपर्क करेगी।",
        fr: "Merci beaucoup ! Vos coordonnées ont bien été enregistrées. Notre équipe vous contactera rapidement avec une proposition détaillée.",
        es: "¡Muchas gracias! Tus datos han sido recibidos. Nuestro equipo se pondrá en contacto pronto con una propuesta a medida.",
        en: "Thank you! Your contact details have been safely received. Our enterprise team will review your scope and reach out shortly."
      };

      return NextResponse.json({
        reply: ackReplies[lang] || ackReplies.en,
        isLeadCaptured: true,
        intentScore: 95,
        detectedCategory: "lead_captured",
        suggestedProduct: "Growth Automation Suite",
        provider: "ritual-lead-engine",
        leadData: { email, phone, timestamp: new Date().toISOString() }
      });
    }

    const geminiApiKey = process.env.GEMINI_API_KEY;
    let retrievedDocs: any[] = [];
    let ragContextText = "";

    // 2. RAG Step: Generate Embedding using Gemini embedding model
    if (geminiApiKey && supabase) {
      try {
        const embedRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "models/gemini-embedding-001",
              content: { parts: [{ text: message }] },
              outputDimensionality: 768
            }),
            signal: AbortSignal.timeout(5000)
          }
        );

        if (embedRes.ok) {
          const embedData = await embedRes.json();
          const queryEmbedding = embedData?.embedding?.values;

          if (Array.isArray(queryEmbedding) && queryEmbedding.length === 768) {
            // Perform vector similarity search in Supabase pgvector
            const { data: matched, error: matchErr } = await supabase.rpc("match_documents", {
              query_embedding: queryEmbedding,
              match_threshold: 0.40,
              match_count: 3
            });

            if (!matchErr && Array.isArray(matched) && matched.length > 0) {
              retrievedDocs = matched;
              ragContextText = matched
                .map((doc: any) => `[Topic: ${doc.title || doc.category}]\n${doc.content}`)
                .join("\n\n");
            }
          }
        }
      } catch (ragErr) {
        console.warn("RAG retrieval skipped or timed out, continuing with domain knowledge:", ragErr);
      }
    }

    // 3. Fallback Context from Knowledge Base if RAG returned empty
    if (!ragContextText) {
      let bestEntry: KnowledgeEntry | null = null;
      let maxMatches = 0;
      for (const entry of KB.entries) {
        const matchCount = entry.keywords.filter(kw => lower.includes(kw)).length;
        if (matchCount > maxMatches) {
          maxMatches = matchCount;
          bestEntry = entry;
        }
      }
      if (bestEntry) {
        ragContextText = `[Topic: ${bestEntry.id}]\n${bestEntry.answer[lang] || bestEntry.answer.en}`;
      }
    }

    // 4. Generate Response using Google Gemini with Grounded Prompt
    let geminiReply: string | null = null;
    if (geminiApiKey) {
      try {
        const systemPrompt = `You are a real, warm, and highly skilled human partner and growth consultant at Digi Ritual (global brand: Ritual.ai).
You are directly chatting with a business owner or client.

STRICT CONVERSATIONAL RULES (SOUND 100% HUMAN, NEVER ROBOTIC):
1. BANNED: NEVER START WITH "Digi Ritual में आपका स्वागत है!" OR "Welcome to Digi Ritual!".
   - Repeating welcome greetings in an ongoing conversation sounds like an annoying, robotic IVR bot.
   - Jump straight into the conversation naturally!
2. PRAISE & ENTHUSIASM (तारीफ और हौसला):
   - When the client shares their idea, vision, goal, or problem, enthusiastically validate and compliment them!
   - Examples: "अरे वाह, यह तो बहुत ही शानदार विजन है!", "वाह, आपका कॉन्सेप्ट वाकई बहुत सॉलिड है!", "Great vision! This has tremendous potential in the market."
3. ASK ABOUT THEM & THEIR BUSINESS (असली कंसल्टेंट की तरह उनकी ज़रूरतों को समझो):
   - Don't just lecture about yourself or Digi Ritual. Show genuine curiosity about THEIR business:
   - Ask clarifying questions: "आपका बिजनेस अभी किस स्टेज पर है?", "अभी आपका मेन फोकस किस चीज़ पर है — लीड्स, सेल्स या ब्रांडिंग?", "क्या आप इसे लोकल मार्केट में स्केल करना चाहते हैं या ग्लोबली?"
4. NATURAL CONVERSATIONAL HINDI/HINGLISH (NO TEXTBOOK AI HINDI):
   - Never use robotic/bookish words like: 'जटिल', 'माहिर', 'विस्तार से', 'पावरहाउस टीम', 'चुटकियों में'. These scream "AI generated".
   - Speak naturally like a real founder or director on WhatsApp / consultation calls.
5. CONTEXTUAL TEAM ATTRIBUTION (DO NOT DUMP ALL NAMES AT ONCE):
   - Only bring up the specific team leader relevant to what the client is asking:
     * If asking about SEO / Google Ranking: Mention Shubham & Rahul (5+ years of verified ranking experience).
     * If asking about Videos, Reels, 2D/3D Animation, Logo, Branding: Mention Santosh & Siddharth.
     * If asking about 3D Website, AI Agents, E-commerce, or Hospital Management System (HMS) / ERP: Mention Raghav.
     * ONLY if they specifically ask "Who is in your team?" or "Tell me about Digi Ritual's entire team", then introduce all of them together alongside our 24-50+ member in-house squad.
6. LENGTH & TONE:
   - Keep replies crisp (2 to 4 sentences maximum).
   - Warm, confident, consultative, and authentic. Always end with a natural question to keep the conversation flowing.

Client Geographic Location: ${clientLocation}

Retrieved Grounded Context from Database:
${ragContextText || "All verified Digi Ritual capabilities and leadership."}

Response Language: "${lang}". Match user language naturally (natural Hindi/Hinglish if user speaks in Hindi).`;

        // Multi-turn conversational history for Gemini
        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        // Build prior turns from history
        for (const msg of rawHistory.slice(-5)) {
          const role = msg.role === "assistant" ? "model" : "user";
          const text = (msg.content || "").trim();
          if (!text) continue;

          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += "\n" + text;
          } else {
            // First message in Gemini contents must be from user
            if (contents.length === 0 && role === "model") continue;
            contents.push({ role, parts: [{ text }] });
          }
        }

        // Ensure current user message is at the end
        if (
          contents.length === 0 ||
          contents[contents.length - 1].role !== "user" ||
          contents[contents.length - 1].parts[0].text !== message
        ) {
          if (contents.length > 0 && contents[contents.length - 1].role === "user") {
            contents[contents.length - 1].parts[0].text = message;
          } else {
            contents.push({ role: "user", parts: [{ text: message }] });
          }
        }

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }]
              },
              contents,
              generationConfig: {
                maxOutputTokens: 300,
                temperature: 0.75
              }
            }),
            signal: AbortSignal.timeout(12000)
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            geminiReply = candidateText.trim();
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini generation skipped or timed out:", geminiErr);
      }
    }

    // 5. Final Assembly & Categorization
    let detectedCategory = "general";
    let intentScore = 50;
    let suggestedProduct = "Starter Growth Pipeline";

    if (lower.includes("team") || lower.includes("kaun") || lower.includes("who") || lower.includes("shubham") || lower.includes("rahul") || lower.includes("santosh") || lower.includes("raghav") || lower.includes("siddharth")) {
      detectedCategory = "team";
      intentScore = 75;
      suggestedProduct = "Executive Strategy Consultation";
    } else if (lower.includes("price") || lower.includes("cost") || lower.includes("preis") || lower.includes("budget") || lower.includes("kitna")) {
      detectedCategory = "pricing";
      intentScore = 85;
      suggestedProduct = "Custom Enterprise Funnel";
    } else if (lower.includes("seo") || lower.includes("ranking") || lower.includes("google")) {
      detectedCategory = "seo";
      intentScore = 80;
      suggestedProduct = "Dominant SEO Growth Engine";
    } else if (lower.includes("hospital") || lower.includes("hms") || lower.includes("ecommerce") || lower.includes("store")) {
      detectedCategory = "software_systems";
      intentScore = 85;
      suggestedProduct = "Enterprise Systems & HMS Suite";
    } else if (lower.includes("web") || lower.includes("3d") || lower.includes("landing")) {
      detectedCategory = "web_development";
      intentScore = 80;
      suggestedProduct = "3D Interactive Web Architecture";
    } else if (lower.includes("whatsapp") || lower.includes("auto") || lower.includes("crm")) {
      detectedCategory = "automation";
      intentScore = 80;
      suggestedProduct = "Real-Time Lead Engine";
    } else if (lower.includes("reel") || lower.includes("video") || lower.includes("animation") || lower.includes("branding") || lower.includes("logo")) {
      detectedCategory = "reels_animation";
      intentScore = 75;
      suggestedProduct = "Creative Growth & Branding Engine";
    } else if (lower.includes("ad") || lower.includes("meta") || lower.includes("target")) {
      detectedCategory = "ads";
      intentScore = 70;
      suggestedProduct = "Precision Paid Media Pipeline";
    }

    const reply = geminiReply || (KB.entries.find(e => e.id === detectedCategory)?.answer[lang] || FALLBACKS[lang] || FALLBACKS.en);

    return NextResponse.json({
      reply,
      isLeadCaptured: false,
      intentScore,
      detectedCategory,
      suggestedProduct,
      sources: retrievedDocs.map(d => ({ title: d.title, similarity: d.similarity })),
      provider: geminiReply ? (retrievedDocs.length > 0 ? "supabase-rag+gemini" : "google-gemini") : "ritual-ai-engine",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Chat API Route Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
