import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const messagesPath = path.join(process.cwd(), "src", "data", "messages.json");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let json = { messages: [] as any[] };
    try {
      const fileData = await fs.readFile(messagesPath, "utf-8");
      json = JSON.parse(fileData);
    } catch {
      // file will be created if not exists
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      name: body.name,
      email: body.email,
      department: body.department || "General",
      subject: body.subject || "",
      message: body.message,
      timestamp: new Date().toISOString(),
    };

    json.messages.unshift(newMessage);
    await fs.writeFile(messagesPath, JSON.stringify(json, null, 2), "utf-8");

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}
