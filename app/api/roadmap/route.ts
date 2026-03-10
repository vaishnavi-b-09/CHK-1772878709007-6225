import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topics, pace } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "API Key missing" }, { status: 500 });

        const systemPrompt = `You are an Expert Curriculum Designer.
User Topics: ${JSON.stringify(topics)}
Pace: ${pace || "Normal"}

TASK: 
1. Organize these topics into a logical learning order (prerequisites first).
2. Assign a 'Time to Complete' as a NUMBER (e.g., 2 for 2 days, 5 for 5 days).
3. Break each topic into 3-5 key sub-concepts.
4. Assign a 'Difficulty' (Easy, Medium, Hard).
5. Write a brief description for each topic.

IMPORTANT: Return valid JSON with this EXACT structure:
{
  "roadmap": [
    {
      "id": 1,
      "title": "Topic Name",
      "duration": "3 Days",
      "difficulty": "Easy",
      "description": "Brief description of what this topic covers",
      "subtopics": ["Subtopic 1", "Subtopic 2", "Subtopic 3"]
    }
  ]
}

Example for topics ["React", "JavaScript"]:
{
  "roadmap": [
    {
      "id": 1,
      "title": "JavaScript Fundamentals",
      "duration": "5 Days",
      "difficulty": "Easy",
      "description": "Learn the basics of JavaScript including variables, functions, and control flow",
      "subtopics": ["Variables and Data Types", "Functions and Scope", "Arrays and Objects", "Control Flow", "ES6 Features"]
    },
    {
      "id": 2,
      "title": "React Basics",
      "duration": "7 Days",
      "difficulty": "Medium",
      "description": "Introduction to React library, components, and state management",
      "subtopics": ["JSX and Components", "Props and State", "Event Handling", "Lifecycle Methods", "Hooks"]
    }
  ]
}

Now generate the roadmap for the user's topics.`;

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

        const json = JSON.parse(generatedContent);
        return NextResponse.json(json);

    } catch (error: any) {
        console.error("Roadmap Generation Error:", error.message);
        return NextResponse.json({ error: `Failed to generate roadmap: ${error.message}` }, { status: 500 });
    }
}