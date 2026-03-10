import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    console.log("=== OpenAI API Test ===");
    console.log("API Key exists:", !!apiKey);
    console.log("API Key length:", apiKey?.length || 0);
    console.log("API Key prefix:", apiKey?.substring(0, 10) || "none");
    
    if (!apiKey) {
        return NextResponse.json({ 
            error: "OPENAI_API_KEY not found in environment variables",
            envVars: Object.keys(process.env).filter(k => k.includes('OPENAI'))
        });
    }

    try {
        console.log("Testing OpenAI API connection...");
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Say 'test successful' in JSON format" }],
                response_format: { type: "json_object" },
                max_tokens: 50
            })
        });

        console.log("Response status:", response.status);
        console.log("Response ok:", response.ok);

        const data = await response.json();
        console.log("Response data:", JSON.stringify(data, null, 2));

        if (!response.ok) {
            return NextResponse.json({
                error: "OpenAI API Error",
                status: response.status,
                details: data
            }, { status: response.status });
        }

        return NextResponse.json({
            success: true,
            message: "OpenAI API is working!",
            response: data
        });

    } catch (error: any) {
        console.error("Test failed:", error);
        return NextResponse.json({
            error: "Connection failed",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
