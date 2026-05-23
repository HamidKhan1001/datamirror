import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const page = searchParams.get("page") || "1";

    const authorization = request.headers.get("Authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json(
        { detail: "Credentials missing. Admin access required." },
        { status: 401 }
      );
    }

    const clientPasscode = authorization.split(" ")[1];
    const systemAdminSecret = process.env.ADMIN_SECRET_KEY || "admin123";

    // 1. Verify credentials at the Next.js server boundary
    if (clientPasscode !== systemAdminSecret) {
      return NextResponse.json(
        { detail: "Forbidden: Passcode is incorrect." },
        { status: 403 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8000";

    // 2. Select target endpoint on FastAPI backend
    let targetEndpoint = `${backendUrl}/admin/stats`;
    if (action === "scans") {
      targetEndpoint = `${backendUrl}/admin/scans?page=${page}`;
    }

    // 3. Query FastAPI backend using the system secret key
    const response = await fetch(targetEndpoint, {
      headers: {
        "Authorization": `Bearer ${systemAdminSecret}`
      }
    });

    if (!response.ok) {
      const errorMsg = await response.text();
      return NextResponse.json(
        { detail: errorMsg || "Query processing failed on backend server." },
        { status: response.status }
      );
    }

    const statsData = await response.json();
    return NextResponse.json(statsData);
  } catch (error: any) {
    console.error("[Next.js Admin Proxy API Error]", error);
    return NextResponse.json(
      { detail: error.message || "Failed to establish database proxy bridge." },
      { status: 500 }
    );
  }
}
