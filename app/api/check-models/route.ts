import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { prompt } = await req.json();
    console.log(`🔹 AI Request: "${prompt}"`);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

    const systemInstruction = `You are an Expert SVG Technical Illustrator.
Task: Generate a stand-alone <svg> string for the user's request.

RULES:
1. Output ONLY the raw <svg>...</svg> code. No markdown. No comments.
2. The SVG MUST possess: xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600".
3. Use rich colors, stroke-width (2px+), and clear details.
4. Background must be transparent.
5. For diagrams (Solar System, Circuit, Anatomy), use correct shapes/symbols.

EXAMPLE:
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <circle cx="400" cy="300" r="50" fill="red" />
</svg>

USER REQUEST: "${prompt}"

SVG CODE:`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: systemInstruction }]
            })
        });

        if (!response.ok) {
            const err = await response.json();
            console.error("OpenAI API Error:", err);
            throw new Error(err.error?.message || "API Failed");
        }

        const data = await response.json();
        let svg = data.choices?.[0]?.message?.content;

        if (!svg) throw new Error("Empty response from AI");

        // Clean up markdown
        svg = svg.replace(/```xml/g, "").replace(/```svg/g, "").replace(/```/g, "").trim();
        const svgStart = svg.indexOf("<svg");
        const svgEnd = svg.lastIndexOf("</svg>") + 6;
        if (svgStart > -1 && svgEnd > -1) {
            svg = svg.substring(svgStart, svgEnd);
        }

        return NextResponse.json({ code: svg, type: 'svg' });

    } catch (error: any) {
        console.warn("⚠️ API Failed, falling back to local engine:", error.message);

        // --- FALLBACK (If internet fails during demo) ---
        let fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><text x="400" y="300" font-size="20" text-anchor="middle">Could not connect to AI</text></svg>`;

        if (prompt.includes("solar")) {
            fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
                <circle cx="400" cy="300" r="40" fill="#FFD700" stroke="orange" stroke-width="2"/>
                <circle cx="400" cy="300" r="120" fill="none" stroke="gray" stroke-dasharray="4"/>
                <circle cx="520" cy="300" r="15" fill="#4169E1" />
                <text x="520" y="335" font-size="12" text-anchor="middle" fill="#333">Earth</text>
            </svg>`;
        }

        return NextResponse.json({ code: fallbackSvg, type: 'svg' });
    }
}