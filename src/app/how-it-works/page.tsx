"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const CITIES = [
  {
    city: "Kolkata",
    country: "India 🇮🇳",
    lang: "Bengali & Hindi Accent",
    currency: "₹ INR",
    speed: "18ms",
    greet: "Hello! We are Ritual AI. We manage targeted Meta ads, viral reels, and automated customer qualification for businesses across India."
  },
  {
    city: "Berlin",
    country: "Germany 🇩🇪",
    lang: "German (Deutsch)",
    currency: "€ EUR",
    speed: "28ms",
    greet: "Hallo! Ich bin die Ritual-KI. Wir starten gezielte Anzeigen und qualifizieren Kundenanfragen automatisch auf Deutsch."
  },
  {
    city: "Paris",
    country: "France 🇫🇷",
    lang: "French (Français)",
    currency: "€ EUR",
    speed: "32ms",
    greet: "Bonjour ! Je suis l'IA de Ritual. Nous qualifions chaque prospect et alertons votre équipe instantanément."
  },
  {
    city: "Madrid",
    country: "Spain 🇪🇸",
    lang: "Spanish (Español)",
    currency: "€ EUR",
    speed: "34ms",
    greet: "¡Hola! Soy la IA de Ritual. Gestionamos campañas con IA y automatizamos tus clientes potenciales al instante."
  },
  {
    city: "New York",
    country: "United States 🇺🇸",
    lang: "English (US)",
    currency: "$ USD",
    speed: "15ms",
    greet: "Hi there! Welcome to Ritual AI. We deploy custom business agents, viral short-form reels, and automated WhatsApp CRM funnels."
  }
];

const LEADS = [
  { loc: "Kolkata, India 🇮🇳", service: "Custom AI Agent + Viral Reels", budget: "₹45,000 / month" },
  { loc: "Berlin, Germany 🇩🇪", service: "Multilingual Meta Ads + CRM Funnel", budget: "€1,200 / month" },
  { loc: "Paris, France 🇫🇷", service: "E-Commerce Video Reels + SEO", budget: "€1,600 / month" },
  { loc: "New York, USA 🇺🇸", service: "Full B2B Growth Engine", budget: "$2,400 / month" }
];

export default function HowItWorksPage() {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeTab, setActiveTab] = useState<"tab-seo" | "tab-agent" | "tab-match">("tab-seo");
  const [leadIdx, setLeadIdx] = useState(0);
  const [alertPulse, setAlertPulse] = useState(false);
  const [alertTime, setAlertTime] = useState("Just now");

  // Estimator State
  const [niche, setNiche] = useState("ecom");
  const [goal, setGoal] = useState("full");
  const [estimateData, setEstimateData] = useState<{
    timelineDays: string;
    roadmap: { phase: string; title: string; description: string }[];
  } | null>(null);

  // Fetch estimate from Next.js backend API
  useEffect(() => {
    fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ niche, goal })
    })
      .then(res => res.json())
      .then(data => setEstimateData(data))
      .catch(err => console.warn(err));
  }, [niche, goal]);

  const handleSimulateAlert = () => {
    const nextIdx = (leadIdx + 1) % LEADS.length;
    setLeadIdx(nextIdx);
    setAlertPulse(true);
    setAlertTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    setTimeout(() => setAlertPulse(false), 300);
  };

  const currentLead = LEADS[leadIdx];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="disp font-bold text-xl tracking-tight text-slate-900">
              Ritual<span style={{ background: "linear-gradient(120deg,#00b4ff,#7a3cff)", WebkitBackgroundClip: "text", color: "transparent" }}>.ai</span>
            </Link>
            <span className="tag tag-blue hidden sm:inline-flex">Visual System Architecture</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="btn-primary text-xs py-2 px-3.5">
              <span>🎙️ Live AI Voice Chat</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 py-12 space-y-20">
        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto">
          <span className="tag tag-blue mb-4">Transparent Capabilities & Process</span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
            What Does This Platform <br />
            <span style={{ background: "linear-gradient(120deg,#00b4ff,#7a3cff)", WebkitBackgroundClip: "text", color: "transparent" }}>
              Actually Do For Your Business?
            </span>
          </h1>
          <p className="text-slate-600 text-lg sm:text-xl mt-5 max-w-2xl mx-auto leading-relaxed">
            No complex technical jargon. Explore the 5 interactive visual modules below to see exactly how our AI speaks, adapts locally, and automates your customer pipeline.
          </p>

          {/* 5 Quick-Jump Visual Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-10 text-left">
            <a href="#feature-1" className="white-card p-4 hover:border-sky-400">
              <div className="step-badge bg-sky-100 text-sky-700 mb-2">01</div>
              <div className="font-bold text-sm text-slate-900">Geo Language</div>
              <div className="text-xs text-slate-500 mt-1">Auto-shifts by city/country</div>
            </a>
            <a href="#feature-2" className="white-card p-4 hover:border-purple-400">
              <div className="step-badge bg-purple-100 text-purple-700 mb-2">02</div>
              <div className="font-bold text-sm text-slate-900">2-Year AI Brain</div>
              <div className="text-xs text-slate-500 mt-1">Honest & transparent advice</div>
            </a>
            <a href="#feature-3" className="white-card p-4 hover:border-teal-400">
              <div className="step-badge bg-teal-100 text-teal-700 mb-2">03</div>
              <div className="font-bold text-sm text-slate-900">SEO & Custom Agent</div>
              <div className="text-xs text-slate-500 mt-1">Viral Reels + Product matcher</div>
            </a>
            <a href="#feature-4" className="white-card p-4 hover:border-green-400">
              <div className="step-badge bg-green-100 text-green-700 mb-2">04</div>
              <div className="font-bold text-sm text-slate-900">WhatsApp Dispatch</div>
              <div className="text-xs text-slate-500 mt-1">Hot leads sent instantly</div>
            </a>
            <a href="#feature-5" className="white-card p-4 hover:border-amber-400">
              <div className="step-badge bg-amber-100 text-amber-700 mb-2">05</div>
              <div className="font-bold text-sm text-slate-900">Timeline Estimator</div>
              <div className="text-xs text-slate-500 mt-1">Exact launch roadmap</div>
            </a>
          </div>
        </section>

        {/* Feature 1: Geo-Location & Auto-Language */}
        <section id="feature-1" className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="step-badge bg-sky-500 text-white">1</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Instant Geo-Location & Local Language Shift</h2>
          </div>
          <p className="text-slate-600 max-w-3xl mb-6">
            When visitors land on your website, our system detects their city/country within <strong>50 milliseconds</strong> and immediately switches the text, currency, and AI voice to their native language.
          </p>

          <div className="white-card p-6 sm:p-8">
            <div className="text-xs font-bold text-slate-400 mono uppercase mb-3">
              Interactive Demo — Click any city to test instant adaptation:
            </div>

            <div className="flex flex-wrap gap-2.5 mb-6">
              {CITIES.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCity(c)}
                  className={`city-pill ${selectedCity.city === c.city ? "active" : ""}`}
                >
                  <span>{c.country.split(" ")[1]}</span> {c.city}, {c.country.split(" ")[0]}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-stretch">
              <div className="md:col-span-5 border border-slate-200 rounded-2xl p-5 bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mono text-slate-500 border-b border-slate-200 pb-2 mb-4">
                    <span>IP GEO-LOCATION SENSOR</span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">● DETECTED</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-xs text-slate-400 mono">DETECTED VISITOR LOCATION:</div>
                      <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{selectedCity.city}</div>
                      <div className="text-xs font-semibold text-sky-600">{selectedCity.country}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mono">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">LANGUAGE:</span>
                        <b className="text-slate-800">{selectedCity.lang}</b>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">CURRENCY:</span>
                        <b className="text-emerald-600 font-bold">{selectedCity.currency}</b>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                  <span>Detection Latency:</span>
                  <b className="text-sky-600 font-mono">{selectedCity.speed}</b>
                </div>
              </div>

              <div className="md:col-span-7 border border-slate-200 rounded-2xl p-6 bg-white flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mono border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                      <span>LIVE USER EXPERIENCE PREVIEW</span>
                    </div>
                    <span className="tag tag-green">Zero Page Reload</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-xl">
                      🎙️
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-900">Ritual Voice & Text AI</div>
                      <div className="text-xs text-slate-500">Auto-tuned to visitor&apos;s native region</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/50 text-slate-800 text-sm leading-relaxed font-medium">
                    &ldquo;{selectedCity.greet}&rdquo;
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>⚡ Result: Client immediately feels understood</span>
                  <b className="text-sky-600">+42% Higher Inquiry Rate</b>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: 2+ Years Domain Experience AI Brain */}
        <section id="feature-2" className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="step-badge bg-purple-600 text-white">2</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Trained on 2+ Years Experience (100% Transparent Consultation)</h2>
          </div>
          <p className="text-slate-600 max-w-3xl mb-6">
            Instead of giving robotic answers or forcing visitors to fill empty forms, our AI acts like your top senior marketing consultant—giving completely honest, transparent advice that builds instant trust.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="white-card p-6 border-red-200 bg-red-50/10">
              <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-4">
                <span className="tag bg-red-100 text-red-700 border border-red-200">❌ Typical Chatbot (No Experience)</span>
                <span className="text-xs text-red-600 font-semibold mono">Customer Drops Off</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <b className="text-slate-700">Client:</b> &ldquo;I have a $500 monthly budget. Should I start with SEO or Meta Video Ads?&rdquo;
                </div>
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-900">
                  <b className="text-red-700">Generic Bot:</b> &ldquo;Please enter your name, email, and phone number so a sales representative can contact you in 48 hours.&rdquo;
                </div>
              </div>
              <div className="mt-5 p-3 rounded-xl bg-white border border-red-100 text-xs text-slate-500">
                ⚠️ <strong>Result:</strong> Zero trust created. The client closes the tab without providing their information.
              </div>
            </div>

            <div className="white-card p-6 border-emerald-200 bg-emerald-50/10">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
                <span className="tag tag-green">✅ Ritual AI (2+ Years Domain Data)</span>
                <span className="text-xs text-emerald-700 font-semibold mono">Instant Credibility</span>
              </div>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 rounded-xl bg-white border border-slate-200">
                  <b className="text-slate-700">Client:</b> &ldquo;I have a $500 monthly budget. Should I start with SEO or Meta Video Ads?&rdquo;
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-emerald-300 text-slate-900 leading-relaxed shadow-sm">
                  <div className="text-xs font-bold text-emerald-700 mb-1 flex items-center gap-1">
                    <span>🧠 Veteran Experience Advice:</span>
                  </div>
                  &ldquo;To be completely transparent with you: spending $500 on SEO right now would be a mistake because SEO requires 3 to 6 months to generate returns. Based on 2+ years of campaign data, you should put $400 into <strong>Meta Video Ads + Short Reels</strong> to generate leads starting from Day 3, and save $100 for automated WhatsApp follow-ups. Is your sales team ready to receive inquiries?&rdquo;
                </div>
              </div>
              <div className="mt-5 p-3 rounded-xl bg-white border border-emerald-100 text-xs text-slate-700 font-medium">
                ✨ <strong>Client Reaction:</strong> &ldquo;This AI genuinely cares about my business ROI instead of just trying to sell.&rdquo;
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Complete Growth Stack */}
        <section id="feature-3" className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="step-badge bg-teal-500 text-white">3</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">SEO, Reels Engine, Custom Agent & Smart Product Matching</h2>
          </div>
          <p className="text-slate-600 max-w-3xl mb-6">
            We build a dedicated AI Agent tailored specifically to your business catalog. It handles SEO, script creation for reels, and automatically matches customers to the exact right product.
          </p>

          <div className="white-card p-6 sm:p-8">
            <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-slate-100 mb-8 max-w-2xl">
              <button
                onClick={() => setActiveTab("tab-seo")}
                className={`feature-tab ${activeTab === "tab-seo" ? "active" : ""}`}
              >
                1. SEO & Viral Reels Engine
              </button>
              <button
                onClick={() => setActiveTab("tab-agent")}
                className={`feature-tab ${activeTab === "tab-agent" ? "active" : ""}`}
              >
                2. Tailored AI Agent For Your Business
              </button>
              <button
                onClick={() => setActiveTab("tab-match")}
                className={`feature-tab ${activeTab === "tab-match" ? "active" : ""}`}
              >
                3. Smart Product & Lead Matcher
              </button>
            </div>

            {activeTab === "tab-seo" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="text-xs font-bold text-sky-600 mono mb-1">STAGE 1</div>
                  <div className="font-bold text-base text-slate-900 mb-2">Intent Keyword Audit</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We audit your website and identify high-buyer-intent keywords people in your target cities search for before buying.
                  </p>
                  <span className="tag tag-blue text-[10px] mt-4">Rank on Google</span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="text-xs font-bold text-purple-600 mono mb-1">STAGE 2</div>
                  <div className="font-bold text-base text-slate-900 mb-2">Viral Reels Scripting</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    We write 3 to 4 high-retention vertical video scripts every week directly answering your customers&apos; real questions.
                  </p>
                  <span className="tag tag-purple text-[10px] mt-4">3–4 Reels / Week</span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="text-xs font-bold text-teal-600 mono mb-1">STAGE 3</div>
                  <div className="font-bold text-base text-slate-900 mb-2">Native Captions & Voice</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Videos are formatted with animated subtitles in the local language, ensuring 80%+ viewer retention on Instagram & TikTok.
                  </p>
                  <span className="tag tag-green text-[10px] mt-4">High Engagement</span>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white">
                  <div className="text-xs font-bold text-amber-600 mono mb-1">STAGE 4</div>
                  <div className="font-bold text-base text-slate-900 mb-2">Reels ➔ Ads Funnel</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Top organic reels are converted into paid Meta and Google Ads, sending visitors straight into this conversational AI.
                  </p>
                  <span className="tag tag-amber text-[10px] mt-4">Lowest Cost Per Lead</span>
                </div>
              </div>
            )}

            {activeTab === "tab-agent" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Your Dedicated 24/7 AI Sales Representative</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    Generic bots hallucinate and make false promises. We ingest your product catalog, pricing matrices, return policies, and case studies into a private, guardrailed knowledge base.
                  </p>
                  <div className="space-y-2 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Knows your exact pricing and never quotes wrong numbers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Identifies customer pain points and recommends the highest ROI solution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Handles customer inquiries in real-time across all time zones</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="text-slate-400 font-mono text-[11px]">AI AGENT SPECIFICATIONS:</div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Domain Memory:</span>
                    <strong className="text-slate-900">Your Full Catalog + FAQs</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Conversation Style:</span>
                    <strong className="text-purple-600">Helpful, Authoritative, Natural</strong>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500">Qualification Accuracy:</span>
                    <strong className="text-emerald-600">99.2% Verified Accuracy</strong>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tab-match" && (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-emerald-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag tag-green">95% Match: High-Fit</span>
                    <span className="text-xs font-bold text-emerald-600">QUALIFIED</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">E-Commerce Brand ($15k/mo revenue)</div>
                  <p className="text-xs text-slate-600 mt-2 mb-4">
                    &ldquo;We receive 200 orders monthly and need automated customer follow-ups and scaling ads.&rdquo;
                  </p>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    💡 <strong>AI Recommends:</strong> Growth Tier (Meta Ads + WhatsApp Automation).
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-amber-200 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag tag-amber">65% Match: Starter</span>
                    <span className="text-xs font-bold text-amber-600">NURTURE</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">Early-Stage Solo Founder</div>
                  <p className="text-xs text-slate-600 mt-2 mb-4">
                    &ldquo;Small budget right now, just exploring options for next quarter.&rdquo;
                  </p>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                    💡 <strong>AI Recommends:</strong> Starter consultation. Never over-sells high-ticket packages.
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white opacity-85">
                  <div className="flex items-center justify-between mb-3">
                    <span className="tag bg-slate-100 text-slate-600 border border-slate-200">10% Match: Unqualified</span>
                    <span className="text-xs font-bold text-slate-500">FILTERED</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">Spam / Student Project / Solicitation</div>
                  <p className="text-xs text-slate-600 mt-2 mb-4">
                    &ldquo;Looking for a job or free advice on university coursework.&rdquo;
                  </p>
                  <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                    🚫 <strong>AI Action:</strong> Polite rejection. Protects your sales team&apos;s valuable time.
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Feature 4: High-Intent Detection ➔ WhatsApp Alert */}
        <section id="feature-4" className="pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <span className="step-badge bg-emerald-600 text-white">4</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">High-Intent Detection ➔ Instant WhatsApp / Telegram Alert</h2>
            </div>
            <button onClick={handleSimulateAlert} className="btn-primary text-xs">
              <span>▶ Test Live WhatsApp Alert</span>
            </button>
          </div>
          <p className="text-slate-600 max-w-3xl mb-6">
            When the AI recognizes high purchase intent during conversation, it extracts key buyer parameters and immediately notifies your team on WhatsApp or Telegram within <strong>2 seconds</strong>.
          </p>

          <div className="white-card p-6 sm:p-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="text-xs font-bold text-slate-400 mono uppercase mb-2">INSTANT DATA PIPELINE:</div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="step-badge bg-sky-100 text-sky-700 shrink-0">1</div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Customer Conversations In Local Dialect</div>
                    <div className="text-xs text-slate-500 mt-0.5">Visitor asks questions regarding service scope, budget, and implementation.</div>
                  </div>
                </div>

                <div className="arrow-node py-1">↓</div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="step-badge bg-purple-100 text-purple-700 shrink-0">2</div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">AI Intent Detection (Purchase Probability &gt; 80%)</div>
                    <div className="text-xs text-slate-500 mt-0.5">AI extracts: Name, Email, Budget, Exact Need, City (Kolkata / Berlin), and Urgency.</div>
                  </div>
                </div>

                <div className="arrow-node py-1">↓</div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-start gap-3">
                  <div className="step-badge bg-emerald-100 text-emerald-700 shrink-0">3</div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">Secure Next.js Route ➔ Webhook Dispatches to WhatsApp Group</div>
                    <div className="text-xs text-slate-500 mt-0.5">Your sales team receives the complete dossier with a one-tap phone call button.</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex justify-center">
                <div className="clean-phone">
                  <div className="clean-phone-inner">
                    <div className="bg-emerald-600 text-white p-3.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-emerald-700 flex items-center justify-center text-xs">🚀</div>
                      <div className="flex-1">
                        <div className="font-bold text-xs">Sales VIP Alert Group</div>
                        <div className="text-[10px] text-emerald-100">You, Founders, Ritual AI</div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-end bg-slate-50 space-y-2 text-xs">
                      <div className="text-center text-[10px] text-slate-400 my-1">LIVE DISPATCH TODAY</div>

                      <div className={`p-3.5 rounded-2xl bg-white border border-emerald-300 shadow-sm transition-all duration-300 ${alertPulse ? "scale-105 border-emerald-500 bg-emerald-50" : ""}`}>
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-700 mb-2">
                          <span>🔥 HOT QUALIFIED LEAD!</span>
                          <span className="text-[10px] text-slate-400 font-mono">{alertTime}</span>
                        </div>
                        <div className="space-y-1.5 text-slate-800 text-xs">
                          <div>📍 <b>Location:</b> {currentLead.loc}</div>
                          <div>👤 <b>Requested Service:</b> {currentLead.service}</div>
                          <div>💰 <b>Estimated Budget:</b> {currentLead.budget}</div>
                          <div className="p-2 rounded-lg bg-slate-50 text-[11px] text-slate-600 mt-2 border border-slate-100">
                            ⚡ <b>AI Note:</b> <i>&ldquo;This client is currently active on the page and ready to buy. Reach out now to close.&rdquo;</i>
                          </div>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-sky-600">
                          <span>📞 Tap to Call Customer</span>
                          <span className="text-emerald-500">✓✓ Sent</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 5: Project Timeline & Scope Calculator */}
        <section id="feature-5" className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="step-badge bg-amber-500 text-white">5</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Project Timeline & Scope Calculator</h2>
          </div>
          <p className="text-slate-600 max-w-3xl mb-6">
            Select your business category to instantly see how many days implementation takes, the step-by-step roadmap, and what simple assets we need from you.
          </p>

          <div className="white-card p-6 sm:p-8">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mono mb-1.5 uppercase">1. SELECT YOUR BUSINESS TYPE:</label>
                  <select
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white font-medium focus:border-sky-500 focus:outline-none"
                  >
                    <option value="ecom">E-commerce / D2C Consumer Brand</option>
                    <option value="local">Local Clinic / Dental / Real Estate / Services</option>
                    <option value="agency">B2B Agency / High-Ticket Consultancy</option>
                    <option value="coach">Coaching / Ed-Tech / Content Creator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mono mb-1.5 uppercase">2. PRIMARY GOAL:</label>
                  <select
                    value={goal}
                    onChange={e => setGoal(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-3 text-sm bg-white font-medium focus:border-sky-500 focus:outline-none"
                  >
                    <option value="full">Full Engine (SEO + Reels + Voice AI + WhatsApp Funnel)</option>
                    <option value="leads">Direct Qualified Leads on WhatsApp Only</option>
                    <option value="voice">Interactive Multilingual Voice Website Only</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-1.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>⚡</span> <span>Autonomous Estimation Algorithm</span>
                  </div>
                  <p>Calculates data ingestion, webhook bridge security, and video rendering turnaround time automatically via Next.js API.</p>
                </div>
              </div>

              <div className="lg:col-span-7 border border-slate-200 rounded-2xl p-6 bg-white shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div>
                    <div className="text-xs text-slate-400 mono">PROJECTED DELIVERY TIMELINE:</div>
                    <div className="text-3xl font-extrabold text-slate-900 mt-1">
                      {estimateData?.timelineDays || "7 – 10 Days"}{" "}
                      <span className="tag tag-green ml-2 text-xs font-bold">Production Ready</span>
                    </div>
                  </div>
                  <span className="tag tag-blue">Guaranteed Scope</span>
                </div>

                <div className="mt-6 space-y-4">
                  {(estimateData?.roadmap || [
                    { phase: "Day 1", title: "Product Catalog & SKU Ingestion", description: "Your SKU variants, pricing, FAQs, and refund policies loaded into the AI agent." },
                    { phase: "Day 2–3", title: "High-Converting Reels Scripting", description: "Scripting 12 problem-solution reels specifically tailored to your products." },
                    { phase: "Day 4–5", title: "Shopify/WooCommerce Webhook Link", description: "Automating cart recovery and lead notifications via WhatsApp." },
                    { phase: "Day 6", title: "Go-Live & Traffic Deployment", description: "Launching targeted ads directly to your conversational AI landing page." }
                  ]).map((step, idx) => (
                    <div key={idx} className="roadmap-bar">
                      <div className="font-bold text-sm text-slate-900">{step.phase}: {step.title}</div>
                      <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50 p-4 rounded-xl text-xs">
                  <div className="font-bold text-slate-900 mb-1">Only 3 Items Required From Your Team:</div>
                  <div className="grid sm:grid-cols-3 gap-2 text-slate-600 mt-2">
                    <div className="flex items-center gap-1.5"><span>📄</span> <span>Product / Price List</span></div>
                    <div className="flex items-center gap-1.5"><span>📱</span> <span>WhatsApp Phone Number</span></div>
                    <div className="flex items-center gap-1.5"><span>📍</span> <span>Target Cities / Regions</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="white-card p-10 text-center border-2 border-slate-200 max-w-4xl mx-auto">
          <span className="tag tag-blue mb-3">Live Interactive Environment</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Experience It Yourself In Real-Time</h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto mt-2">
            Speak directly to our AI on the main page. Test different questions and observe how fast and intelligently it replies aloud.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn-primary text-sm">
              <span>🎙️ Launch Live Voice AI Demo</span>
            </Link>
            <a href="#feature-1" className="btn-secondary text-sm">
              <span>↑ Back To Top</span>
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        © 2026 Ritual.ai — Built For High-Conversion Multilingual Growth
      </footer>
    </div>
  );
}
