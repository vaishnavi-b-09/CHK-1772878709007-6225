import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, fileContent } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

        const systemPrompt = `You are an Expert Educational Tutor.

TASK:
1. Explain the concept clearly for a university student.
2. Determine the best way to VISUALIZE this concept. Choose ONE strategy:
   - "3D": For physical objects (engines, organs, molecules, buildings).
   - "FLOW": For processes, timelines, algorithms, cycles.
   - "CODE": For programming, math formulas, abstract logic.

3. Generate the DATA for that visualization.
   - If 3D: Return a JSON list of shapes (box, sphere) to build it.
   - If FLOW: Return a list of Nodes and Edges for React Flow.
   - If CODE: Return a runnable code snippet (Python or JS) or a Math formula explanation.

Topic: ${topic}
${fileContent ? `File Content: ${fileContent}` : ''}

You must respond with valid JSON in this exact format:
{
  "explanation": "Markdown text explanation...",
  "strategy": "3D" | "FLOW" | "CODE",
  "visualizationData": {}
}`;

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: systemPrompt }],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            throw new Error(errorData.error?.message || "API request failed");
        }

        const data = await response.json();
        const generatedContent = data.choices?.[0]?.message?.content;

        if (!generatedContent) {
            throw new Error("No content generated");
        }

        return NextResponse.json(JSON.parse(generatedContent));

    } catch (error: any) {
        console.error("Explain Concept Error:", error.message);
        return NextResponse.json({ error: `Failed to explain concept: ${error.message}` }, { status: 500 });
    }
}