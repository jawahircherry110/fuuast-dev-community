import { NextResponse } from "next/server";
import { findStudentAuth } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/Phone/Roll Number and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const result = await findStudentAuth(identifier, password);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      profile: result.profile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Login failed. Please check your network and try again." },
      { status: 500 }
    );
  }
}
