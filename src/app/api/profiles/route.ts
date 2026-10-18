import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dbPath = path.join(process.cwd(), "src", "data", "db.json");

export async function GET() {
  try {
    const fileData = await fs.readFile(dbPath, "utf-8");
    const json = JSON.parse(fileData);
    return NextResponse.json({ profiles: json.profiles || [] });
  } catch (error) {
    return NextResponse.json({ error: "Failed to read profiles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.rollNo || !body.email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileData = await fs.readFile(dbPath, "utf-8");
    const json = JSON.parse(fileData);

    const newProfile = {
      id: `std-${Date.now()}`,
      name: body.name,
      rollNo: body.rollNo.toUpperCase(),
      department: body.department || "CS",
      semester: body.semester || "6th Semester",
      bio: body.bio || "",
      skills: Array.isArray(body.skills) ? body.skills : (body.skills ? body.skills.split(",").map((s: string) => s.trim()) : []),
      interests: Array.isArray(body.interests) ? body.interests : [],
      openToCollaborate: body.openToCollaborate ?? true,
      email: body.email,
      github: body.github || "",
      linkedin: body.linkedin || "",
      avatarBg: body.department === "CS" ? "bg-blue-600" : body.department === "SE" ? "bg-sky-600" : "bg-indigo-600",
      createdAt: new Date().toISOString(),
    };

    json.profiles.unshift(newProfile);
    await fs.writeFile(dbPath, JSON.stringify(json, null, 2), "utf-8");

    return NextResponse.json({ success: true, profile: newProfile });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
  }
}
