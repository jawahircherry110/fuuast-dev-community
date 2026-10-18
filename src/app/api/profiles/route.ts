import { NextResponse } from "next/server";
import { getProfiles, saveProfile } from "@/lib/db";

export async function GET() {
  try {
    const profiles = await getProfiles();
    return NextResponse.json({ profiles });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.rollNo || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await saveProfile(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
