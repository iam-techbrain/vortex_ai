"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const UI_DATA = {
  en: {
    name: "English",
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
    hearVoice: "Hear Voice",
    heroTag: "Voice-Activated AI"
  },
  de: {
    name: "Deutsch",
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
    hearVoice: "Stimme hören",
    heroTag: "Sprachgestützte KI"
  },
  fr: {
    name: "Français",
    heroT: "Développez votre activité avec une IA qui parle à chaque client.",
    heroS: "Les annonces attirent les visiteurs. Notre IA multilingue répond, qualifie chaque lead et prévient votre équipe instantanément.",
    greet: "Bonjour ! Je suis l'IA vocale de Ritual. Je peux vous expliquer la publicité, les reels, le SEO et l'automatisation. Parlez-moi ou écrivez-moi !",
    ph: "Écrivez ou activez le micro…",
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
    hearVoice: "Écouter la voix",
    heroTag: "IA Vocale Interactive"
  },
  es: {
    name: "Español",
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
    hearVoice: "Escuchar voz",
    heroTag: "IA de Voz Activa"
  },
  hi: {
    name: "हिंदी (Hindi)",
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
    hearVoice: "आवाज़ सुनें",
    heroTag: "AI वॉइस एजेंट सक्रिय"
  }
};

type SupportedLang = "en" | "hi" | "de" | "fr" | "es";

const STEPS = [
  { t: "Targeted Global Ads", d: "Meta and Google campaigns deployed per country and language. Each ad opens this page directly into AI conversation." },
  { t: "Multilingual AI Brain", d: "Browser and IP location detected in <50ms. AI answers from domain knowledge, qualifies needs, and captures contact." },
  { t: "Secure Next.js Backend", d: "Server-side Route Handlers validate lead payloads. Webhook URLs and internal logic remain securely protected on the server." },
  { t: "Make.com / n8n Automation", d: "Central workflow engine enriches lead data, applies custom routing rules, and logs entry to Google Sheets." },
  { t: "Instant WhatsApp Alert", d: "Your sales team gets an immediate VIP notification alert on WhatsApp or Telegram with the lead dossier within 2 seconds." }
];

interface GeoData {
  city: string;
  region: string;
  country: string;
  countryCode: string;
  suggestedLang: SupportedLang;
  suggestedLangLabel: string;
  localNotes: string;
}

export default function HomePage() {
  const [lang, setLang] = useState<SupportedLang>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [voiceEngine, setVoiceEngine] = useState<"system" | "elevenlabs">("system");
  const [speakingSnippet, setSpeakingSnippet] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [currentlySpeakingIdx, setCurrentlySpeakingIdx] = useState<number | null>(null);
  const [geoInfo, setGeoInfo] = useState<GeoData | null>(null);
  const [showGeoToast, setShowGeoToast] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentUI = UI_DATA[lang];

  // Auto-detect browser language on mount
  useEffect(() => {
    const saved = localStorage.getItem("ritual_lang") as SupportedLang | null;
    if (saved && UI_DATA[saved]) {
      setLang(saved);
    } else if (typeof navigator !== "undefined") {
      const browserCode = (navigator.language || "en").toLowerCase().slice(0, 2) as SupportedLang;
      if (UI_DATA[browserCode]) setLang(browserCode);
    }
  }, []);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{ role: "assistant", content: UI_DATA[lang].greet }]);
    stopSpeech();
  }, [lang]);

    // Auto-detect system location & suggest local language
  useEffect(() => {
    fetch("/api/geo")
      .then(res => res.json())
      .then((data: GeoData & { success: boolean }) => {
        if (data && data.success) {
          setGeoInfo(data);
          const saved = localStorage.getItem("ritual_lang") as SupportedLang | null;
          // If user hasn't explicitly customized language, adapt to local city language
          if (!saved && data.suggestedLang && UI_DATA[data.suggestedLang]) {
            setLang(data.suggestedLang);
            setShowGeoToast(true);
          }
        }
      })
      .catch(e => console.warn("Geo lookup fallback", e));
  }, []);

  // Clock in HUD
  useEffect(() => {
    const updateClock = () => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour12: false }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto scroll chat log internally without moving or jumping the page
  useEffect(() => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping]);

  // Setup Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          setInputValue(transcript);
          handleSend(transcript);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  // Speech Synthesis & ElevenLabs Player
  const stopSpeech = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCurrentlySpeakingIdx(null);
    setSpeakingSnippet("");
  };

  const fallbackSpeech = (clean: string, msgIdx?: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(clean);
    const langCodes: Record<SupportedLang, string> = { en: "en-US", hi: "hi-IN", de: "de-DE", fr: "fr-FR", es: "es-ES" };
    utter.lang = langCodes[lang] || "en-US";
    utter.rate = 1.0;
    utter.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice =
      voices.find(v => v.lang.startsWith(utter.lang) && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Neural"))) ||
      voices.find(v => v.lang.startsWith(utter.lang));
    if (matchingVoice) utter.voice = matchingVoice;

    utter.onstart = () => {
      setIsSpeaking(true);
      setSpeakingSnippet(clean.slice(0, 42));
      if (msgIdx !== undefined) setCurrentlySpeakingIdx(msgIdx);
    };
    utter.onend = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingIdx(null);
      setSpeakingSnippet("");
    };
    utter.onerror = () => {
      setIsSpeaking(false);
      setCurrentlySpeakingIdx(null);
      setSpeakingSnippet("");
    };

    window.speechSynthesis.speak(utter);
  };

  const speakText = async (text: string, msgIdx?: number) => {
    stopSpeech();
    if (!voiceEnabled && msgIdx === undefined) return;

    const clean = text.replace(/[*_#`[\]()]/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return;

    // 1. If Free System Voice is selected, skip ElevenLabs entirely (0 Tokens Used)
    if (voiceEngine === "system") {
      fallbackSpeech(clean, msgIdx);
      return;
    }

    // 2. Otherwise Try ElevenLabs AI Voice API
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clean })
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setSpeakingSnippet(clean.slice(0, 42));
          if (msgIdx !== undefined) setCurrentlySpeakingIdx(msgIdx);
        };
        audio.onended = () => {
          setIsSpeaking(false);
          setCurrentlySpeakingIdx(null);
          setSpeakingSnippet("");
          URL.revokeObjectURL(url);
        };
        audio.onerror = () => {
          fallbackSpeech(clean, msgIdx);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("ElevenLabs TTS playback issue, using browser fallback", e);
    }

    // 2. Fallback to Browser Speech Synthesis
    fallbackSpeech(clean, msgIdx);
  };

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopSpeech();
      const langCodes: Record<SupportedLang, string> = { en: "en-US", hi: "hi-IN", de: "de-DE", fr: "fr-FR", es: "es-ES" };
      recognitionRef.current.lang = langCodes[lang] || "en-US";
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend) return;

    stopSpeech();
    const updatedHistory: Message[] = [...messages, { role: "user", content: textToSend }];
    setMessages(updatedHistory);
    setInputValue("");
    setIsTyping(true);

    try {
      // Call Next.js backend API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          lang,
          history: updatedHistory.slice(-6),
          geo: geoInfo
        })
      });

      const data = await response.json();
      const reply = data.reply || currentUI.chips[0];

      setIsTyping(false);
      const newMessages: Message[] = [...updatedHistory, { role: "assistant", content: reply }];
      setMessages(newMessages);

      if (autoSpeak) {
        speakText(reply, newMessages.length - 1);
      }

      // If lead captured, also trigger backend lead API
      if (data.isLeadCaptured && data.leadData) {
        fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data.leadData,
            message: textToSend,
            history: newMessages
          })
        }).catch(err => console.warn(err));
      }
    } catch (error) {
      console.error(error);
      setIsTyping(false);
      const fallbackReply = "I'm ready to answer any questions about our ads, reels, SEO, or WhatsApp automation.";
      setMessages(prev => [...prev, { role: "assistant", content: fallbackReply }]);
    }
  };

  const handleStepPlay = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 1400));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Navigation */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="disp font-bold text-xl tracking-tight text-slate-900">
            Digi Ritual<span className="text-slate-400 font-normal ml-0.5">.ai</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            {/* Link to visual system page */}
            <Link
              href="/how-it-works"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <span>⚡ Visual System Architecture</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </Link>

            {geoInfo && geoInfo.city && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-slate-50 border border-slate-200 text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>📍 {geoInfo.city}</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-800 font-medium">Suggested: {geoInfo.suggestedLangLabel}</span>
              </div>
            )}
            <span className="hidden sm:inline text-xs text-slate-400 font-mono">
              Lang: {currentUI.name}
            </span>

            <select
              aria-label="Select Language"
              value={lang}
              onChange={e => {
                const newLang = e.target.value as SupportedLang;
                setLang(newLang);
                localStorage.setItem("ritual_lang", newLang);
              }}
              className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs bg-white font-medium focus:outline-none focus:border-slate-900"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="de">Deutsch</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-5 pt-12 pb-16 grid lg:grid-cols-2 gap-10 items-start">
          <div className="lg:pt-6">
            {/* Sleek Unified Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/90 text-xs text-slate-700 mb-6 shadow-2xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-slate-900">Voice-Activated AI</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">Multilingual</span>
              {geoInfo?.city && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-600">📍 {geoInfo.city}</span>
                </>
              )}
              {currentTime && (
                <>
                  <span className="text-slate-300">·</span>
                  <span className="text-slate-400 font-mono text-[11px]">{currentTime}</span>
                </>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-[1.18] tracking-tight max-w-xl">
              {lang === "en" ? (
                <>
                  Grow your business with an AI <br className="hidden sm:inline" />
                  that talks to every customer.
                </>
              ) : (
                currentUI.heroT
              )}
            </h1>
            <p className="mt-5 text-slate-600 text-base sm:text-lg max-w-lg leading-relaxed">
              {currentUI.heroS}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {currentUI.chips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(chip)}
                  className="chip font-medium hover:border-slate-800"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Container */}
          <div className="flex flex-col gap-2" style={{ height: "min(640px, 80vh)" }}>
            {showGeoToast && geoInfo && (
              <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700 animate-fadeIn shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-sm">📍</span>
                  <span>
                    Connecting from <b>{geoInfo.city}, {geoInfo.region}</b>! Local language suggested: <b>{geoInfo.suggestedLangLabel}</b>.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGeoToast(false)}
                  className="text-slate-400 hover:text-slate-800 ml-2 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="glow flex-1 min-h-0">
            <div id="chatCard" className={`card overflow-hidden flex flex-col h-full ${isSpeaking ? "is-speaking" : ""}`}>
              {/* Spacious, Premium AI Chat Header */}
              <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 bg-white">
                {/* Left: AI Avatar, Identity & Status */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                      isSpeaking
                        ? "bg-slate-950 text-emerald-400 shadow-md ring-2 ring-emerald-400/40"
                        : "bg-slate-900 text-white shadow-xs"
                    }`}>
                      {isSpeaking ? (
                        <div className="flex items-center gap-0.5 h-3.5 px-0.5">
                          <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                          <span className="w-0.5 h-4 bg-emerald-300 rounded-full animate-pulse"></span>
                          <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                          <span className="w-0.5 h-3.5 bg-emerald-300 rounded-full animate-pulse"></span>
                        </div>
                      ) : (
                        <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                      )}
                    </div>
                    {/* Live indicator dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      isSpeaking ? "bg-emerald-500 animate-ping" : isListening ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                    }`}></span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 tracking-tight whitespace-nowrap">Digi Ritual AI</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        isSpeaking
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isListening
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isSpeaking ? "bg-emerald-500 animate-pulse" : isListening ? "bg-amber-500 animate-ping" : "bg-emerald-500"
                        }`}></span>
                        <span>{isSpeaking ? "Speaking" : isListening ? "Listening" : "Online"}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate max-w-[170px] sm:max-w-none">
                      {isSpeaking ? `"${speakingSnippet}…"` : "Conversational Growth Assistant"}
                    </p>
                  </div>
                </div>

                {/* Right: Clean Voice Engine & Auto-Speech Toggle */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Voice Engine Selector */}
                  <div className="relative">
                    <select
                      value={voiceEngine}
                      onChange={e => {
                        setVoiceEngine(e.target.value as "system" | "elevenlabs");
                        stopSpeech();
                      }}
                      className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-2 pr-6 py-1.5 focus:outline-none cursor-pointer appearance-none transition whitespace-nowrap"
                      title="Switch between Free Voice (0 tokens) and ElevenLabs"
                    >
                      <option value="system">💻 Free Voice</option>
                      <option value="elevenlabs">⚡ ElevenLabs</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-slate-400 text-[9px]">
                      ▼
                    </div>
                  </div>

                  {/* Auto-Speech Toggle Pill Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = !autoSpeak;
                      setAutoSpeak(next);
                      if (!next) stopSpeech();
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap border ${
                      autoSpeak
                        ? "bg-slate-900 border-slate-900 text-white shadow-2xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                    title={autoSpeak ? "Auto-Speech is ON: AI speaks aloud automatically" : "Auto-Speech is OFF: Click speaker icon on any message to listen"}
                  >
                    <span className="text-xs">{autoSpeak ? "🔊" : "🔈"}</span>
                    <span className="hidden sm:inline">Auto-Speech:</span>
                    <span className="font-semibold">{autoSpeak ? "ON" : "OFF"}</span>
                  </button>
                </div>
              </div>

              {/* Chat Message Feed (Container-only smooth scroll) */}
              <div id="log" ref={chatFeedRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`msg ${msg.role === "assistant" ? "bot" : "usr"}`}>
                    <div>{msg.content}</div>
                    {msg.role === "assistant" && (
                      <div className="mt-2.5 flex items-center justify-start border-t border-slate-100 pt-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (currentlySpeakingIdx === idx) {
                              stopSpeech();
                            } else {
                              speakText(msg.content, idx);
                            }
                          }}
                          className={`msg-voice-action ${currentlySpeakingIdx === idx ? "speaking" : ""}`}
                          title="Listen to this message"
                        >
                          {currentlySpeakingIdx === idx ? (
                            <>
                              <span className="mini-bars"><span></span><span></span><span></span></span>
                              <span>Speaking…</span>
                            </>
                          ) : (
                            <>
                              <span>🔊</span>
                              <span>{currentUI.listenBtn}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {/* High-Tech Animated Search & Reasoning State */}
                {isTyping && (
                  <div className="msg bot flex flex-col gap-2.5 p-4 bg-white/95 border border-slate-200/90 rounded-2xl shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="relative flex items-center justify-center w-6 h-6">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-40"></span>
                          <span className="relative flex items-center justify-center w-5 h-5 rounded-full bg-slate-900 text-white shadow-sm">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                              <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-900 tracking-tight">Digi Ritual AI</span>
                          <span className="text-[11px] text-slate-500 font-normal">is analyzing & searching knowledge</span>
                          <span className="inline-flex items-center gap-0.5 ml-0.5">
                            <span className="w-1 h-1 rounded-full bg-slate-700 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1 h-1 rounded-full bg-slate-700 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1 h-1 rounded-full bg-slate-700 animate-bounce"></span>
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60 hidden sm:inline-block">
                        RAG + GEMINI
                      </span>
                    </div>

                    {/* Animated Skeleton Shimmer Lines */}
                    <div className="space-y-1.5 pt-1">
                      <div className="h-2 w-5/6 rounded-full bg-slate-100 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/60 to-transparent animate-skeleton-shimmer"></div>
                      </div>
                      <div className="h-2 w-3/5 rounded-full bg-slate-100 overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/60 to-transparent animate-skeleton-shimmer" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={logEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-gray-100 flex items-center gap-2 bg-white/90">
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`mic-btn ${isListening ? "listening" : ""}`}
                  aria-label="Voice input"
                  title="Click to speak (Voice Recognition)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                </button>

                <input
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  placeholder={isListening ? currentUI.listening : currentUI.ph}
                  className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-slate-900 bg-white"
                  autoComplete="off"
                />

                <button
                  onClick={() => handleSend()}
                  className="btn text-sm py-2 px-4"
                >
                  {currentUI.send}
                </button>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* 5-Step Architecture Walkthrough Section */}
        <section className="border-t border-gray-100 py-16 bg-slate-50/50">
          <div className="max-w-6xl mx-auto px-5">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">How The Platform Works</h2>
                <p className="text-slate-600 mt-2 max-w-xl text-sm">
                  From first ad click to a qualified lead alert on your team&apos;s phone. Select a step to explore.
                </p>
              </div>
              <button onClick={handleStepPlay} className="btn text-sm">
                <span>▶ Run Sample Lead Flow</span>
              </button>
            </div>

            {/* Progress Track */}
            <div className="track">
              <div id="prog" style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}></div>
            </div>

            {/* Steps Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {STEPS.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`step ${activeStep === idx ? "on" : ""}`}
                >
                  <div className="n">{idx + 1}</div>
                  <div className="disp font-bold mt-3 leading-tight text-[15px] text-slate-900">{step.t}</div>
                </button>
              ))}
            </div>

            {/* Detail Box */}
            <div className="card mt-5 p-5 text-slate-700 min-h-[96px] bg-white">
              <div className="disp font-bold text-lg mb-1 text-slate-900">
                {activeStep + 1}. {STEPS[activeStep].t}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{STEPS[activeStep].d}</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © 2026 Ritual.ai · Autonomous AI Growth Stack
      </footer>
    </div>
  );
}
