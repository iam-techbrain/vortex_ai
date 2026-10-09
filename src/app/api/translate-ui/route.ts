import { NextResponse } from "next/server";

const geminiApiKey = process.env.GEMINI_API_KEY;

// Pre-cached translations for instant 0ms responses for standard languages
const BASE_CACHE: Record<string, any> = {
  en: {
    name: "English",
    flag: "🌐",
    heroT: "Grow your business with an AI that talks to every customer.",
    heroS: "Ads bring people in. Our multilingual voice AI answers, qualifies each lead, and alerts your team instantly.",
    greet: "Hi! I'm the Ritual voice AI. I can explain how we run ads, create reels, handle SEO, and automate your leads. You can speak or type to me!",
    ph: "Type or tap mic to speak…",
    send: "Send",
    chips: [
      "How do you manage ads?",
      "Tell me about reels",
      "What does SEO include?",
      "How are leads automated?",
      "Pricing & ROI"
    ],
    voiceReady: "Voice Ready",
    speaking: "Speaking aloud…",
    listening: "Listening… Speak now",
    listenBtn: "Listen",
    heroTag: "Voice-Activated AI"
  },
  fr: {
    name: "Français",
    flag: "🇫🇷",
    heroT: "Développez votre entreprise avec une IA qui parle à chaque client.",
    heroS: "Les publicités attirent les prospects. Notre IA vocale multilingue répond, qualifie chaque lead et alerte votre équipe instantanément.",
    greet: "Bonjour ! Je suis l'IA vocale de Ritual. Je peux vous expliquer nos publicités Meta/Google, la création de reels, le SEO et l'automatisation WhatsApp. Parlez-moi ou écrivez-moi !",
    ph: "Écrivez ou appuyez sur le micro…",
    send: "Envoyer",
    chips: [
      "Comment gérez-vous les pubs ?",
      "Parlez-moi des reels",
      "Que comprend le SEO ?",
      "Comment les leads sont-ils automatisés ?",
      "Tarifs & Devis"
    ],
    voiceReady: "Voix Prête",
    speaking: "Parle à voix haute…",
    listening: "Écoute… Parlez",
    listenBtn: "Écouter",
    heroTag: "IA Vocale Interactive"
  },
  hi: {
    name: "हिंदी (Hindi / Hinglish)",
    flag: "🇮🇳",
    heroT: "AI जो आपके हर ग्राहक से अपनी भाषा में बात करता है।",
    heroS: "विज्ञापन कस्टमर लाते हैं। हमारी AI उनसे बात करती है, लीड्स फ़िल्टर करती है और 2 सेकंड में WhatsApp पर अलर्ट भेजती है।",
    greet: "नमस्ते! मैं Ritual AI वॉइस असिस्टेंट हूँ। मैं आपको बता सकता हूँ कि हम Meta/Google विज्ञापन, वायरल रील्स, SEO और WhatsApp लीड ऑटोमेशन कैसे करते हैं। बोलिए या लिखिए!",
    ph: "यहाँ टाइप करें या माइक दबाकर बोलें…",
    send: "भेजें",
    chips: [
      "आप विज्ञापन कैसे मैनेज करते हैं?",
      "वायरल रील्स के बारे में बताइए",
      "SEO में क्या-क्या शामिल है?",
      "WhatsApp लीड्स कैसे ऑटोमेट होती हैं?",
      "प्राइसिंग और प्लान्स क्या हैं?"
    ],
    voiceReady: "वॉइस तैयार 🎙️",
    speaking: "बोल रहा हूँ…",
    listening: "सुन रहा हूँ… बोलिए",
    listenBtn: "सुनें",
    heroTag: "AI वॉइस एजेंट सक्रिय"
  },
  de: {
    name: "Deutsch",
    flag: "🇩🇪",
    heroT: "Wachsen Sie mit einer KI, die mit jedem Kunden spricht.",
    heroS: "Anzeigen bringen Besucher. Unsere mehrsprachige KI antwortet, qualifiziert jeden Lead und informiert Ihr Team sofort.",
    greet: "Hallo! Ich bin die Ritual-Sprach-KI. Ich erkläre Ihnen, wie wir Anzeigen schalten, Reels erstellen, SEO betreiben und Leads automatisieren. Sprechen oder schreiben Sie mir!",
    ph: "Tippen oder Mikrofon drücken…",
    send: "Senden",
    chips: [
      "Wie verwalten Sie Anzeigen?",
      "Erzählen Sie mehr über Reels",
      "Was umfasst SEO?",
      "Wie laufen Leads automatisch?",
      "Preise & Budget"
    ],
    voiceReady: "Sprache Bereit",
    speaking: "Spricht…",
    listening: "Zuhören… Sprechen Sie",
    listenBtn: "Anhören",
    heroTag: "Sprachgestützte KI"
  },
  es: {
    name: "Español",
    flag: "🇪🇸",
    heroT: "Haz crecer tu negocio con una IA que habla con cada cliente.",
    heroS: "Los anuncios traen visitas. Nuestra IA multilingüe responde, cualifica cada lead y avisa a tu equipo al instante.",
    greet: "¡Hola! Soy la IA de voz de Ritual. Puedo explicarte anuncios, reels, SEO y automatizaciones. ¡Puedes hablarme o escribirme!",
    ph: "Escribe o pulsa el micro…",
    send: "Enviar",
    chips: [
      "¿Cómo gestionan los anuncios?",
      "Háblame de los reels",
      "¿Qué incluye el SEO?",
      "¿Cómo se automatizan los leads?",
      "Precios & Planes"
    ],
    voiceReady: "Voz Lista",
    speaking: "Hablando…",
    listening: "Escuchando… Habla",
    listenBtn: "Escuchar",
    heroTag: "IA de Voz Activa"
  }
};

const dynamicCache: Record<string, any> = {};

export async function POST(req: Request) {
  try {
    const { targetLang, city } = await req.json();
    const langCode = (targetLang || "en").toLowerCase();

    // 1. Instant Cache Return
    if (BASE_CACHE[langCode]) {
      return NextResponse.json({ success: true, ui: BASE_CACHE[langCode], source: "pre-cached" });
    }
    if (dynamicCache[langCode]) {
      return NextResponse.json({ success: true, ui: dynamicCache[langCode], source: "dynamic-cached" });
    }

    // 2. Dynamic Gemini Translation for ANY language in the world
    if (geminiApiKey) {
      try {
        const prompt = `Translate this digital growth agency website UI data into the native local language of "${city || langCode}" (Language Code: ${langCode}).
Return ONLY a valid JSON object with the exact same keys as below:

${JSON.stringify(BASE_CACHE.en, null, 2)}

Requirements:
- Natural, engaging, human translation suitable for business owners.
- "flag": appropriate country/regional flag emoji.
- "name": Native language name.
- Return ONLY valid JSON, no markdown codeblocks.`;

        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 600,
                temperature: 0.2
              }
            }),
            signal: AbortSignal.timeout(6000)
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const translated = JSON.parse(aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
          if (translated.heroT && translated.greet) {
            dynamicCache[langCode] = translated;
            return NextResponse.json({ success: true, ui: translated, source: "ai-generated" });
          }
        }
      } catch (err) {
        console.warn("Dynamic UI translation fallback:", err);
      }
    }

    // Fallback to English if translation fails
    return NextResponse.json({ success: true, ui: BASE_CACHE.en, source: "fallback" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load translation" }, { status: 500 });
  }
}
