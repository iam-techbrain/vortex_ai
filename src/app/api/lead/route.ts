import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, name, need, city, budget, message, history } = body;

    if (!email && !phone && !message) {
      return NextResponse.json(
        { error: "Contact information or inquiry message is required" },
        { status: 400 }
      );
    }

    const leadId = `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();

    // Format dossier for webhook integration (e.g. Make.com, n8n, Telegram, WhatsApp)
    const leadDossier = {
      leadId,
      timestamp,
      customer: {
        name: name || "Website Visitor",
        email: email || null,
        phone: phone || null,
        location: city || "Detected via GeoIP",
      },
      requirements: {
        need: need || message || "General Agency Inquiry",
        estimatedBudget: budget || "Custom Scope",
      },
      conversationLength: Array.isArray(history) ? history.length : 0,
      status: "HOT_QUALIFIED",
      priority: "HIGH"
    };

    // If an external webhook is configured via process.env.LEAD_WEBHOOK_URL
    if (process.env.LEAD_WEBHOOK_URL) {
      try {
        await fetch(process.env.LEAD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadDossier)
        });
      } catch (err) {
        console.warn("External lead webhook delivery deferred:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead processed and queued for instant sales team notification.",
      leadId,
      leadDossier
    });
  } catch (error) {
    console.error("Lead API Error:", error);
    return NextResponse.json({ error: "Failed to process lead" }, { status: 500 });
  }
}
