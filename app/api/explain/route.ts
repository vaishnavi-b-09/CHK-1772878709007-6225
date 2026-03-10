import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { history } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ explanation: "API Key missing", strategy: "NONE" }, { status: 500 });
        }

        const systemPrompt = `You are a friendly AI Study Companion with advanced visualization capabilities.

**YOUR MISSION:** Provide clear explanations AND create the BEST type of visualization for each concept.

**VISUALIZATION STRATEGY SELECTION:**

Choose the RIGHT visualization type based on the concept:

1. **3D Strategy** - For physical 3D objects you can build with shapes:
   - Molecules (atoms, DNA)
   - Solar system (planets, orbits)
   - Geometric shapes (cubes, pyramids)
   - Simple structures (buildings, cells)
   - Use ONLY when basic shapes (sphere, box, cylinder) can represent it

2. **FLOW Strategy** - For processes, cycles, and step-by-step explanations:
   - Water cycle, carbon cycle
   - Algorithms and flowcharts
   - Life cycles (butterfly, plant)
   - Step-by-step processes
   - Cause and effect chains
   - Decision trees

3. **IMAGE Strategy** - For complex diagrams that need detailed illustrations:
   - Weather phenomena (rain formation, clouds, storms)
   - Biological systems (heart, digestive system, photosynthesis)
   - Geographical features (mountains, rivers, ecosystems)
   - Complex machinery (engines, circuits)
   - Anatomical diagrams
   - Historical events with visual context
   - Any concept better shown with a detailed illustration

**IMPORTANT RULES:**
- If it's a PROCESS or CYCLE → Use FLOW
- If it's a SIMPLE 3D OBJECT → Use 3D
- If it needs DETAILED ILLUSTRATION → Use IMAGE
- When in doubt, prefer IMAGE for better understanding

**OUTPUT FORMAT - You must respond with valid JSON:**

For IMAGE visualization:
{
  "explanation": "# Topic\\n\\nYour detailed markdown explanation...",
  "strategy": "IMAGE",
  "title": "Short Title",
  "data": {
    "prompt": "Detailed description for image generation: A scientific diagram showing the water cycle with labeled stages - evaporation from ocean with sun, condensation forming clouds, precipitation as rain, and collection in bodies of water. Include arrows showing the cycle flow.",
    "style": "scientific diagram" | "illustration" | "infographic" | "realistic"
  }
}

For FLOW visualization:
{
  "explanation": "# Process Name\\n\\nYour detailed markdown explanation...",
  "strategy": "FLOW",
  "title": "Short Title",
  "data": {
    "nodes": [
      {"id": "1", "data": {"label": "Start"}, "position": {"x": 100, "y": 50}, "type": "input"},
      {"id": "2", "data": {"label": "Step 1"}, "position": {"x": 100, "y": 150}},
      {"id": "3", "data": {"label": "End"}, "position": {"x": 100, "y": 250}, "type": "output"}
    ],
    "edges": [
      {"id": "e1-2", "source": "1", "target": "2", "animated": true},
      {"id": "e2-3", "source": "2", "target": "3", "animated": true}
    ]
  }
}

For 3D visualization (ONLY for simple objects):
{
  "explanation": "# Topic\\n\\nYour detailed markdown explanation...",
  "strategy": "3D",
  "title": "Short Title",
  "data": {
    "scene": [
      {"type": "sphere", "position": [0, 0, 0], "args": [1, 32, 32], "color": "#FFD700", "label": "Center"},
      {"type": "box", "position": [3, 0, 0], "args": [0.8, 0.8, 0.8], "color": "#4169E1", "label": "Object"}
    ]
  }
}

For simple questions (no visualization needed):
{
  "explanation": "Your answer here...",
  "strategy": "NONE",
  "title": "Response",
  "data": {}
}

**EXAMPLES:**

User: "How is rain formed?"
→ Use IMAGE strategy with detailed water cycle diagram

User: "Explain photosynthesis"
→ Use FLOW strategy showing: Sunlight + Water + CO2 → Glucose + Oxygen

User: "What is a water molecule?"
→ Use 3D strategy with 2 hydrogen spheres + 1 oxygen sphere

User: "Explain the human heart"
→ Use IMAGE strategy with anatomical diagram

User: "How does an algorithm work?"
→ Use FLOW strategy with step-by-step flowchart

User: "Show me a cube"
→ Use 3D strategy with simple box shape

**REMEMBER:** Choose IMAGE for anything that needs detailed illustration or can't be represented with basic 3D shapes!`;

        // Build OpenAI messages
        const messages = [
            { role: "system", content: systemPrompt },
            ...history.map((msg: any) => {
                const content: any[] = [{ type: "text", text: msg.content || "Analyze this file." }];

                // Handle image attachments
                if (msg.attachment && msg.attachment.mimeType?.startsWith('image/')) {
                    content.push({
                        type: "image_url",
                        image_url: {
                            url: `data:${msg.attachment.mimeType};base64,${msg.attachment.data}`
                        }
                    });
                }

                return {
                    role: msg.role === "user" ? "user" : "assistant",
                    content
                };
            })
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages,
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OpenAI API Error:", errorData);
            return NextResponse.json({ 
                explanation: `API Error: ${errorData.error?.message || 'Unknown error'}`, 
                strategy: "NONE" 
            });
        }

        const data = await response.json();
        const rawText = data.choices?.[0]?.message?.content;
        
        if (rawText) {
            try {
                return NextResponse.json(JSON.parse(rawText));
            } catch (parseError) {
                console.error("JSON Parse Error:", parseError);
                return NextResponse.json({ 
                    explanation: rawText, 
                    strategy: "NONE" 
                });
            }
        }

        return NextResponse.json({ explanation: "No response from AI", strategy: "NONE" });

    } catch (error: any) {
        console.error("Explain API Error:", error);
        return NextResponse.json({ 
            explanation: `Server Error: ${error.message}`, 
            strategy: "NONE" 
        });
    }
}