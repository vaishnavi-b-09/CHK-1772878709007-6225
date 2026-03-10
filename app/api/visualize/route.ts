import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { prompt, mode } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

        let systemPrompt = "";

        if (mode === '2d') {
            systemPrompt = `You are a Senior SVG Engineer.
User Request: "${prompt}"

TASK: Write High-Fidelity SVG code.
RULES:
1. Use <path> commands for complex shapes.
2. Return ONLY the raw <svg viewBox="0 0 500 500">...</svg> string.
3. Transparent background.
4. NO markdown, NO explanations.`;
        } else {
            systemPrompt = `You are a Senior Three.js Developer.
User Request: "${prompt}"

TASK: Create a JSON Scene Graph.
RULES:
1. You must respond with valid JSON in this format: { "scene": [ { "type": "box", "position": [0,0,0], "args": [1,1,1], "color": "red" } ] }
2. Allowed types: 'box', 'sphere', 'cylinder', 'cone', 'torus'.
3. NO markdown, NO explanations.`;
        }

        console.log(`🎨 Generating ${mode.toUpperCase()} code for: "${prompt}"...`);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: systemPrompt }],
                ...(mode === '3d' && { response_format: { type: "json_object" } })
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(errorData.error?.message || "API request failed");
        }

        const data = await response.json();
        let generatedContent = data.choices?.[0]?.message?.content;

        if (!generatedContent) {
            throw new Error("No content generated");
        }

        // Cleanup
        generatedContent = generatedContent.replace(/```(xml|svg|json|html)?/g, "").replace(/```/g, "").trim();

        if (mode === '3d') {
            try {
                const jsonStart = generatedContent.indexOf('{');
                const jsonEnd = generatedContent.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    generatedContent = JSON.parse(generatedContent.substring(jsonStart, jsonEnd + 1));
                } else {
                    generatedContent = JSON.parse(generatedContent);
                }
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                throw new Error("Invalid JSON response from AI");
            }
        }

        return NextResponse.json({
            status: "success",
            type: mode === '2d' ? 'svg' : 'scene_json',
            code: generatedContent
        });

    } catch (error: any) {
        console.error("🔥 Visualizer Error:", error.message);
        return NextResponse.json({ 
            error: `Generation Failed: ${error.message}`,
            status: "error"
        }, { status: 500 });
    }
}