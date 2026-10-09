import { NextResponse } from "next/server";

const geminiApiKey = process.env.GEMINI_API_KEY;

export async function GET(req: Request) {
  try {
    // 1. Live Client Location Detection (Vercel Edge or IP Geolocation)
    const vercelCity = req.headers.get("x-vercel-ip-city");
    const vercelRegion = req.headers.get("x-vercel-ip-country-region");
    const vercelCountry = req.headers.get("x-vercel-ip-country");

    let city = vercelCity ? decodeURIComponent(vercelCity) : "";
    let region = vercelRegion ? decodeURIComponent(vercelRegion) : "";
    let country = vercelCountry || "";
    let countryCode = vercelCountry || "";

    // If running in development or non-Vercel environment, detect live via HTTPS
    if (!city || city === "undefined") {
      try {
        const ipRes = await fetch("https://ipwho.is/", {
          signal: AbortSignal.timeout(3000)
        });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData && ipData.success) {
            city = ipData.city || "";
            region = ipData.region || "";
            country = ipData.country || "";
            countryCode = ipData.country_code || "";
          }
        }
      } catch {
        // Fallback to ip-api if ipwho.is fails
        try {
          const fbRes = await fetch("http://ip-api.com/json/?fields=status,country,countryCode,regionName,city", {
            signal: AbortSignal.timeout(2000)
          });
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            if (fbData && fbData.status === "success") {
              city = fbData.city || "";
              region = fbData.regionName || "";
              country = fbData.country || "";
              countryCode = fbData.countryCode || "";
            }
          }
        } catch {}
      }
    }

    city = city || "Global";
    region = region || "";
    country = country || "Global";
    countryCode = (countryCode || "GLOBAL").toUpperCase();

    // 2. DYNAMIC AI-POWERED LANGUAGE REASONING (No Hardcoded Cities!)
    // Ask Gemini AI to dynamically understand the exact city/region and suggest the local language
    let suggestedLang = "en";
    let suggestedLangLabel = "English";
    let localNotes = `${city}, ${region || country}`;

    if (geminiApiKey && city !== "Global") {
      try {
        const prompt = `The user is accessing our digital growth agency web app from:
City: "${city}"
Region/State: "${region}"
Country: "${country}"

Tasks:
1. Identify the primary local spoken language and cultural preference for daily & business interaction in this exact location.
2. Map it to the best matching supported language code in our app: ['hi', 'en', 'de', 'fr', 'es'].
3. Return ONLY a JSON object in this exact format:
{
  "suggestedLang": "hi" | "en" | "de" | "fr" | "es",
  "languageName": "Language name in native script and English (e.g. हिंदी (Hindi) or Deutsch (German))",
  "localNote": "A friendly 1-sentence note about this location and its spoken language"
}`;

        const aiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                maxOutputTokens: 200,
                temperature: 0.2
              }
            }),
            signal: AbortSignal.timeout(3500)
          }
        );

        if (aiRes.ok) {
          const aiData = await aiRes.json();
          const parsed = JSON.parse(aiData?.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
          if (parsed.suggestedLang && ["hi", "en", "de", "fr", "es"].includes(parsed.suggestedLang)) {
            suggestedLang = parsed.suggestedLang;
            suggestedLangLabel = parsed.languageName || suggestedLang;
            localNotes = parsed.localNote || `${city}, ${region || country}`;
          }
        }
      } catch (aiErr) {
        console.warn("AI geo language reasoning skipped, using regional fallback:", aiErr);
      }
    }

    // 3. Fallback only if Gemini was offline/timed out
    if (suggestedLang === "en" && countryCode === "IN") {
      suggestedLang = "hi";
      suggestedLangLabel = "हिंदी (Hindi / Hinglish)";
    } else if (suggestedLang === "en" && ["DE", "AT", "CH"].includes(countryCode)) {
      suggestedLang = "de";
      suggestedLangLabel = "Deutsch (German)";
    } else if (suggestedLang === "en" && countryCode === "FR") {
      suggestedLang = "fr";
      suggestedLangLabel = "Français (French)";
    } else if (suggestedLang === "en" && ["ES", "MX", "AR", "CO"].includes(countryCode)) {
      suggestedLang = "es";
      suggestedLangLabel = "Español (Spanish)";
    }

    return NextResponse.json({
      success: true,
      city,
      region,
      country,
      countryCode,
      suggestedLang,
      suggestedLangLabel,
      localNotes,
      mode: "dynamic-ai-detected"
    });
  } catch (error) {
    if ((error as any)?.digest === "NEXT_PRERENDER_INTERRUPTED") { throw error; }
    console.error("Geo API Error:", error);
    return NextResponse.json({
      success: false,
      city: "Global",
      region: "",
      country: "Global",
      countryCode: "GLOBAL",
      suggestedLang: "en",
      suggestedLangLabel: "English",
      localNotes: "Default",
      mode: "fallback"
    });
  }
}
