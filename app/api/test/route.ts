import { NextResponse } from "next/server";

export async function GET() {
    try {
        const openaiKey = process.env.OPENAI_API_KEY;
        const firebaseKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
        
        return NextResponse.json({
            status: "success",
            message: "API is working!",
            environment: {
                openai: openaiKey ? "✅ Set" : "❌ Missing",
                firebase: firebaseKey ? "✅ Set" : "❌ Missing",
                nodeVersion: process.version,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error: any) {
        return NextResponse.json({
            status: "error",
            message: error.message
        }, { status: 500 });
    }
}

export async function POST() {
    return NextResponse.json({
        status: "success",
        message: "POST method working!"
    });
}