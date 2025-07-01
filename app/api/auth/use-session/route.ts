import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { getUser } from "@/lib/db/queries";

export async function GET(request: Request) {
    try {
        const session = await auth.api.getSession({ headers: request.headers });

        if (!session) {
            return NextResponse.json(null);
        }

        // Get full user data from database
        const users = await getUser(session.user.email);
        if (!users || users.length === 0) {
            return NextResponse.json(null);
        }

        // Return full session with user data
        return NextResponse.json({
            ...session,
            user: {
                ...session.user,
                ...users[0]
            }
        });
    } catch (error) {
        console.error("[use-session] Error:", error);
        return NextResponse.json(null);
    }
} 