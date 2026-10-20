import { NextResponse } from "next/server";
import { getPosts, savePost, togglePostLike, addPostComment, deletePost, getProfiles } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const dept = searchParams.get("dept");
    const search = searchParams.get("search");

    let posts = await getPosts();

    if (category && category !== "All") {
      posts = posts.filter((p) => p.category === category);
    }

    if (dept && dept !== "All") {
      posts = posts.filter((p) => p.authorDepartment === dept);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      posts = posts.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          (p.title && p.title.toLowerCase().includes(q)) ||
          p.authorName.toLowerCase().includes(q) ||
          p.authorRollNo.toLowerCase().includes(q) ||
          (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    return NextResponse.json(
      { posts },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Action: Like / Heart toggle
    if (body.action === "like") {
      const { postId, rollNo } = body;
      if (!postId || !rollNo) {
        return NextResponse.json({ error: "Post ID and Roll Number required for reaction" }, { status: 400 });
      }
      const result = await togglePostLike(postId, rollNo.trim().toUpperCase());
      return NextResponse.json(result);
    }

    // 2. Action: Comment
    if (body.action === "comment") {
      const { postId, comment } = body;
      if (!postId || !comment || !comment.content || !comment.authorName) {
        return NextResponse.json({ error: "Post ID and comment content are required" }, { status: 400 });
      }

      const result = await addPostComment(postId, {
        authorId: comment.authorId || `std-${Date.now()}`,
        authorName: comment.authorName.trim(),
        authorRollNo: (comment.authorRollNo || "").trim().toUpperCase(),
        authorDepartment: comment.authorDepartment || "CS",
        authorSemester: comment.authorSemester || "Semester",
        authorPhotoUrl: comment.authorPhotoUrl || "",
        content: comment.content.trim(),
      });

      return NextResponse.json(result);
    }

    // 3. Action: Create new Post / Tweet
    const {
      authorId,
      authorName,
      authorRollNo,
      authorDepartment,
      authorSemester,
      authorPhotoUrl,
      title,
      content,
      category,
      codeSnippet,
      tags,
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Post content is required" }, { status: 400 });
    }

    if (!authorName || !authorRollNo) {
      return NextResponse.json({ error: "Author details (Name and Roll Number) are required" }, { status: 400 });
    }

    const cleanRollNo = authorRollNo.trim().toUpperCase();

    // Verify that student profile is approved/verified!
    const allProfiles = await getProfiles(false);
    const matchedProfile = allProfiles.find(
      (p: any) =>
        (p.rollNo && p.rollNo.toString().toUpperCase() === cleanRollNo) ||
        (p.id && authorId && p.id === authorId)
    );

    // If student is not approved in system, disallow posting
    if (!matchedProfile || matchedProfile.status !== "approved") {
      return NextResponse.json(
        {
          error:
            "Only verified student profiles can tweet queries to the Dev Lounge. Please wait for the admin to approve your profile registration.",
        },
        { status: 403 }
      );
    }

    const saved = await savePost({
      authorId: matchedProfile.id || authorId || `std-${Date.now()}`,
      authorName: matchedProfile.name || authorName.trim(),
      authorRollNo: cleanRollNo,
      authorDepartment: matchedProfile.department || authorDepartment || "CS",
      authorSemester: matchedProfile.semester || authorSemester || "Semester",
      authorPhotoUrl: matchedProfile.photoUrl || authorPhotoUrl || "",
      title: title ? title.trim() : undefined,
      content: content.trim(),
      category: category || "Problem / Query",
      codeSnippet: codeSnippet ? codeSnippet.trim() : undefined,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ success: true, post: saved.post }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process post action" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const rollNo = searchParams.get("rollNo");

    if (!id) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const result = await deletePost(id, rollNo ? rollNo.trim().toUpperCase() : undefined);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
