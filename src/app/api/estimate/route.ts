import { NextResponse } from "next/server";

interface RoadmapStep {
  title: string;
  description: string;
  phase: string;
}

const ROADMAPS: Record<string, { days: string; steps: RoadmapStep[]; deliverables: string[] }> = {
  ecom: {
    days: "6 – 8 Days",
    steps: [
      { phase: "Day 1", title: "Product Catalog & SKU Ingestion", description: "Your SKU variants, pricing, FAQs, and refund policies loaded into the AI agent." },
      { phase: "Day 2–3", title: "High-Converting Reels Scripting", description: "Scripting 12 problem-solution reels specifically tailored to your products." },
      { phase: "Day 4–5", title: "Shopify/WooCommerce Webhook Link", description: "Automating cart recovery and lead notifications via WhatsApp." },
      { phase: "Day 6", title: "Go-Live & Traffic Deployment", description: "Launching targeted ads directly to your conversational AI landing page." }
    ],
    deliverables: [
      "Catalog Ingestion & Pricing Matrix",
      "12 Viral Short-Form Video Scripts",
      "Automated Order & WhatsApp Webhook Link",
      "Live Meta Video Ads Campaign"
    ]
  },
  local: {
    days: "5 – 7 Days",
    steps: [
      { phase: "Day 1", title: "City Geo-Fencing & Service Scheduling", description: "Programming your clinic/office appointment slots, consultation fees, and local address." },
      { phase: "Day 2–3", title: "Local Language Reels & Google Ads Setup", description: "Targeting your specific 15km city radius with native dialect hooks." },
      { phase: "Day 4–5", title: "Direct WhatsApp Booking Integration", description: "Lead inquiries routed straight to your reception desk phone." },
      { phase: "Day 6", title: "Production Launch", description: "Patients and clients start booking appointments automatically." }
    ],
    deliverables: [
      "15km Geo-Targeted Ad Funnel",
      "Multi-Language Reception Desk AI",
      "Real-time WhatsApp Staff Alerts",
      "Appointment Booking System"
    ]
  },
  agency: {
    days: "8 – 11 Days",
    steps: [
      { phase: "Day 1–2", title: "B2B Case Study & Portfolio Training", description: "Structuring your past client results and high-ticket discovery framework." },
      { phase: "Day 3–5", title: "Thought Leadership Reels Production", description: "Establishing your authority with high-intent short-form video content." },
      { phase: "Day 6–8", title: "VIP CRM & Calendar Routing", description: "Qualified high-ticket prospects booked directly into founder's calendar." },
      { phase: "Day 9", title: "Live Campaign Launch", description: "Autonomous lead qualification running 24/7." }
    ],
    deliverables: [
      "B2B Authority Video Series",
      "Founder Calendar Auto-Booking",
      "Private Guardrailed Client Qualifier",
      "Lead Enrichment & Scoring Engine"
    ]
  },
  coach: {
    days: "6 – 8 Days",
    steps: [
      { phase: "Day 1", title: "Course Curriculum Knowledge Ingestion", description: "AI trained on your course modules, FAQs, and student testimonials." },
      { phase: "Day 2–3", title: "Daily Reels & Story Script Engine", description: "Scripts crafted to convert social media viewers into DM chats." },
      { phase: "Day 4–5", title: "Payment Gateway & Group Links", description: "Immediate payment link and community access dispatched upon qualification." },
      { phase: "Day 6", title: "Launch & Automated Enrolments", description: "AI handles hundreds of student inquiries simultaneously." }
    ],
    deliverables: [
      "Community Onboarding Flow",
      "Direct Payment Link Dispatcher",
      "Webinar & Course Q&A Voice Agent",
      "Daily Social Content Scripts"
    ]
  }
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const niche: string = body.niche || "ecom";
    const goal: string = body.goal || "full";

    const data = ROADMAPS[niche] || ROADMAPS.ecom;

    return NextResponse.json({
      niche,
      goal,
      timelineDays: data.days,
      roadmap: data.steps,
      deliverables: data.deliverables,
      checklist: [
        "Product & Price List / Syllabus",
        "Official WhatsApp Sales Number",
        "Target Geographic Territories"
      ],
      feasibilityScore: 98.4
    });
  } catch (error) {
    console.error("Estimator API Error:", error);
    return NextResponse.json({ error: "Failed to generate estimate" }, { status: 500 });
  }
}
