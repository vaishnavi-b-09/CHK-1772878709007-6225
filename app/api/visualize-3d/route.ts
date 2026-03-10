import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { prompt, currentScene } = await req.json();
    const cleanPrompt = prompt.toLowerCase();
    const apiKey = process.env.OPENAI_API_KEY;

    console.log(`🔹 3D Request: "${prompt}"`);

    // --- STRATEGY 1: TRY OPENAI ---
    if (apiKey) {
        const systemInstruction = `You are a 3D Scene Manager (JSON).
Current Scene: ${JSON.stringify(currentScene)}
Task: Return a MODIFIED JSON array based on User Request.

Rules:
1. Return ONLY valid JSON array.
2. Available types: 'box', 'sphere', 'cylinder', 'cone', 'torus'.
3. If "Create": Add new object with unique ID.
4. If "Move/Color": Find object and modify props.
5. Position/Rotation/Scale are [x,y,z]. Color is hex/string.

Example Output: [{"id":"1","type":"box","position":[0,0,0],"color":"red","args":[1,1,1]}]

USER REQUEST: "${prompt}"

Return the updated scene as a JSON array.`;

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: systemInstruction }],
                    response_format: { type: "json_object" }
                })
            });

            if (response.ok) {
                const data = await response.json();
                let jsonStr = data.choices?.[0]?.message?.content;

                if (jsonStr) {
                    jsonStr = jsonStr.replace(/```json/g, "").replace(/```/g, "").trim();
                    const parsed = JSON.parse(jsonStr);
                    const newScene = parsed.scene || parsed;

                    console.log(`✅ Success with OpenAI`);
                    return NextResponse.json({ scene: newScene });
                }
            }
        } catch (e) {
            console.warn(`❌ OpenAI failed, using fallback...`);
        }
    }

    // --- STRATEGY 2: LOCAL 3D ENGINE (Backup) ---
    console.warn("⚠️ Switching to Local 3D Engine...");

    // Clone the current scene to modify it
    let newScene = [...(currentScene || [])];

    // 1. "CLEAR" Command
    if (cleanPrompt.includes("clear") || cleanPrompt.includes("delete all")) {
        return NextResponse.json({ scene: [] });
    }

    // 2. "SOLAR SYSTEM" Command (Complex Demo)
    if (cleanPrompt.includes("solar system")) {
        return NextResponse.json({
            scene: [
                { id: "sun", type: "sphere", position: [0, 0, 0], color: "#FFD700", args: [2, 32, 32] },
                { id: "mercury", type: "sphere", position: [3, 0, 0], color: "gray", args: [0.4, 32, 32] },
                { id: "earth", type: "sphere", position: [5, 0, 0], color: "blue", args: [0.6, 32, 32] },
                { id: "mars", type: "sphere", position: [7, 0, 0], color: "red", args: [0.5, 32, 32] },
                // Add a simple ring for effect
                { id: "orbit1", type: "torus", position: [0, 0, 0], rotation: [Math.PI / 2, 0, 0], color: "#444", args: [5, 0.05, 16, 100] }
            ]
        });
    }

    // 3. PARSE COLOR & SHAPE
    // Detect Color
    const colors = ["red", "blue", "green", "yellow", "orange", "purple", "white", "black", "pink"];
    const foundColor = colors.find(c => cleanPrompt.includes(c)) || "white";

    // Detect Position words
    let pos = [0, 0, 0];
    if (cleanPrompt.includes("left")) pos[0] -= 3;
    if (cleanPrompt.includes("right")) pos[0] += 3;
    if (cleanPrompt.includes("up") || cleanPrompt.includes("top")) pos[1] += 3;
    if (cleanPrompt.includes("down")) pos[1] -= 3;

    // Detect Shape
    const id = Date.now().toString(); // Simple ID

    if (cleanPrompt.includes("box") || cleanPrompt.includes("cube")) {
        newScene.push({ id, type: "box", position: pos, color: foundColor, args: [1, 1, 1] });
    }
    else if (cleanPrompt.includes("sphere") || cleanPrompt.includes("ball")) {
        newScene.push({ id, type: "sphere", position: pos, color: foundColor, args: [1, 32, 32] });
    }
    else if (cleanPrompt.includes("cylinder")) {
        newScene.push({ id, type: "cylinder", position: pos, color: foundColor, args: [1, 1, 2, 32] });
    }
    else if (cleanPrompt.includes("cone")) {
        newScene.push({ id, type: "cone", position: pos, color: foundColor, args: [1, 2, 32] });
    }
    else {
        // Default if we don't understand, just add a random shape so user sees something happen
        newScene.push({ id, type: "box", position: [Math.random() * 4 - 2, Math.random() * 4, 0], color: foundColor, args: [1, 1, 1] });
    }

    return NextResponse.json({ scene: newScene });
}