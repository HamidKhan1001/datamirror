import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Load backend targeting endpoints, fallback to standard local FastAPI uvicorn port
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";
    const backendSecret = process.env.BACKEND_SECRET || "local_backend_secret";

    const response = await fetch(`${backendUrl}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${backendSecret}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return NextResponse.json(
        { detail: errorMsg || "Failed to complete backend analysis profile." },
        { status: response.status }
      );
    }

    const analysisData = await response.json();
    return NextResponse.json(analysisData);
  } catch (error: any) {
    console.error("[Next.js API Route /api/analyze Error]", error);
    return NextResponse.json(
      { detail: error.message || "Connection to profiling server failed." },
      { status: 500 }
    );
  }
}
