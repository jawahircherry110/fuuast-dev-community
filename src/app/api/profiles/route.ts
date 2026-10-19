import { NextResponse } from "next/server";
import { getProfiles, saveProfile, deleteProfile } from "@/lib/db";

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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Profile ID required" }, { status: 400 });
    }

    await deleteProfile(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
