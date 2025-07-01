import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        return await auth.handler(request);
    } catch (error) {
        console.error("[auth] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        return await auth.handler(request);
    } catch (error) {
        console.error("[auth] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    return auth.handler(request);
}

export async function DELETE(request: Request) {
    return auth.handler(request);
}

export async function OPTIONS(request: Request) {
    return auth.handler(request);
}