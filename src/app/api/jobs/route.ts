import { NextResponse } from "next/server";
import { getJobs, saveJob, deleteJob } from "@/lib/db";

export async function GET() {
  try {
    const jobs = await getJobs();
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.company || !body.applyLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await saveJob(body);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    }

    await deleteJob(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
