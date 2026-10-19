import { NextResponse } from "next/server";
import { getMessages, saveMessage, deleteMessage } from "@/lib/db";

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await saveMessage(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 });
    }

    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
