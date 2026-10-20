"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  MessageSquare,
  MessageSquareCode,
  Heart,
  Share2,
  Code2,
  Search,
  Filter,
  Sparkles,
  Send,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  Clock,
  Trash2,
  User,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Layers,
  Laptop,
  Cpu,
  Users,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CommunityPost, PostComment } from "@/data/postsData";
import ProfileModal from "@/components/ProfileModal";

export default function DevLoungePage() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [myProfile, setMyProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Post Composer State
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<CommunityPost["category"]>("Problem / Query");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [newCodeSnippet, setNewCodeSnippet] = useState("");
  const [newTags, setNewTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [composerError, setComposerError] = useState("");

  // Comments & Interaction State
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Load My Profile from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fuuast_my_profile");
    if (saved) {
      try {
        setMyProfile(JSON.parse(saved));
      } catch {}
    }
  }, []);

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/posts", { cache: "no-store" });
      const data = await res.json();
      if (data && Array.isArray(data.posts)) {
        setPosts(data.posts);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const isVerified = Boolean(myProfile && myProfile.status === "approved");

  // Handle Like Toggle
  const handleLike = async (postId: string) => {
    if (!myProfile || !myProfile.rollNo) {
      alert("Please sign in with your student profile to like discussions.");
      setIsModalOpen(true);
      return;
    }

    const rollNo = myProfile.rollNo.toUpperCase().trim();

    // Optimistic UI Update
    setPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === postId) {
          const alreadyLiked = p.likes.includes(rollNo);
          const updatedLikes = alreadyLiked
            ? p.likes.filter((r) => r !== rollNo)
            : [...p.likes, rollNo];
          return { ...p, likes: updatedLikes };
        }
        return p;
      })
    );

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "like",
          postId,
          rollNo,
        }),
      });
    } catch {
      // Revert if error
      fetchPosts();
    }
  };

  // Handle Submit Comment
  const handleAddComment = async (postId: string) => {
    const content = (commentInputs[postId] || "").trim();
    if (!content) return;

    if (!myProfile || !myProfile.name) {
      alert("Please sign in or create your student profile to reply.");
      setIsModalOpen(true);
      return;
    }

    setSubmittingComment((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "comment",
          postId,
          comment: {
            authorId: myProfile.id || `std-${Date.now()}`,
            authorName: myProfile.name,
            authorRollNo: myProfile.rollNo,
            authorDepartment: myProfile.department || "CS",
            authorSemester: myProfile.semester || "Semester",
            authorPhotoUrl: myProfile.photoUrl || "",
            content,
          },
        }),
      });

      const data = await res.json();
      if (data && data.comment) {
        setPosts((prev) =>
          prev.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                comments: [...p.comments, data.comment],
              };
            }
            return p;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
        setExpandedComments((prev) => ({ ...prev, [postId]: true }));
      }
    } catch {
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment((prev) => ({ ...prev, [postId]: false }));
    }
  };

  // Handle Create Post / Tweet
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setComposerError("");

    if (!myProfile || !myProfile.rollNo) {
      setIsModalOpen(true);
      return;
    }

    if (!isVerified) {
      setComposerError(
        "Only verified student profiles can tweet queries to the Dev Lounge. Once admin approves your student registration, you will be able to post!"
      );
      return;
    }

    if (!newContent.trim()) {
      setComposerError("Please write something for your post or question.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = newTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorId: myProfile.id,
          authorName: myProfile.name,
          authorRollNo: myProfile.rollNo,
          authorDepartment: myProfile.department,
          authorSemester: myProfile.semester,
          authorPhotoUrl: myProfile.photoUrl,
          title: newTitle.trim() || undefined,
          content: newContent.trim(),
          category: newCategory,
          codeSnippet: showCodeInput && newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
          tags: tagsArray,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setComposerError(data.error || "Failed to publish post.");
      } else if (data.post) {
        setPosts((prev) => [data.post, ...prev]);
        setNewTitle("");
        setNewContent("");
        setNewCodeSnippet("");
        setShowCodeInput(false);
        setNewTags("");
      }
    } catch {
      setComposerError("A network error occurred while posting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Post
  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await fetch(`/api/posts?id=${postId}&rollNo=${myProfile?.rollNo || ""}`, {
        method: "DELETE",
      });
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      alert("Failed to delete post.");
    }
  };

  // Handle Share Post Link
  const handleSharePost = (postId: string) => {
    const url = `${window.location.origin}/feed#${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  // Filtered Posts
  const filteredPosts = posts.filter((p) => {
    const matchesDept = selectedDept === "All" || p.authorDepartment === selectedDept;
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.content.toLowerCase().includes(q) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      p.authorName.toLowerCase().includes(q) ||
      p.authorRollNo.toLowerCase().includes(q) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesDept && matchesCat && matchesSearch;
  });

  const categoryBadgeColors: Record<string, string> = {
    "Problem / Query": "bg-blue-50 text-blue-700 border-blue-200",
    "FYP Idea & Teammates": "bg-purple-50 text-purple-700 border-purple-200",
    "Bug & Code Help": "bg-rose-50 text-rose-700 border-rose-200",
    "Career & Internships": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "General Discussion": "bg-slate-100 text-slate-700 border-slate-200",
  };

  const timeAgo = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Just now";
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="py-12 bg-slate-50/50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <MessageSquareCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Dev Lounge • Peer Discussions & Q&A</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            FUUAST <span className="text-blue-600">Dev Lounge</span> & Queries
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The live community feed where verified{" "}
            <span className="text-blue-600 font-semibold">CS, SE & AI students</span> tweet technical
            problems, find FYP teammates, debug code errors, and share knowledge together.
          </p>
        </div>

        {/* ========================================================
            TWEET / POST COMPOSER FOR VERIFIED STUDENTS
        ======================================================== */}
        <div className="mb-10 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          {myProfile ? (
            isVerified ? (
              /* VERIFIED STUDENT COMPOSER */
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    {myProfile.photoUrl ? (
                      <img
                        src={myProfile.photoUrl}
                        alt={myProfile.name}
                        className="w-10 h-10 rounded-xl object-cover border border-blue-300 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {myProfile.name[0]}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">{myProfile.name}</span>
                        <span title="Verified FUUAST Student">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 inline-block" />
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        BS{myProfile.department} • {myProfile.rollNo}
                      </span>
                    </div>
                  </div>

                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="Problem / Query">Problem / Query</option>
                    <option value="FYP Idea & Teammates">FYP Idea & Teammates</option>
                    <option value="Bug & Code Help">Bug & Code Help</option>
                    <option value="Career & Internships">Career & Internships</option>
                    <option value="General Discussion">General Discussion</option>
                  </select>
                </div>

                {composerError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{composerError}</span>
                  </div>
                )}

                <div>
                  <input
                    type="text"
                    placeholder="Short Title or Headline (e.g. CUDA memory issue in PyTorch, Looking for FYP partner)..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium placeholder-slate-400 mb-2"
                  />
                  <textarea
                    rows={3}
                    placeholder={`What technical problem or query are you facing, ${myProfile.name.split(" ")[0]}? Tweet your question or discussion...`}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-slate-400 leading-relaxed"
                  />
                </div>

                {/* Collapsible Code Snippet Input */}
                {showCodeInput ? (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Terminal className="w-3.5 h-3.5 text-blue-600" /> Optional Code Snippet
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowCodeInput(false);
                          setNewCodeSnippet("");
                        }}
                        className="text-slate-400 hover:text-slate-600 text-xs"
                      >
                        Remove code
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      placeholder="// Paste your relevant code or error stack trace here..."
                      value={newCodeSnippet}
                      onChange={(e) => setNewCodeSnippet(e.target.value)}
                      className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {!showCodeInput && (
                      <button
                        type="button"
                        onClick={() => setShowCodeInput(true)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        <Code2 className="w-3.5 h-3.5 text-blue-600" /> + Add Code Snippet
                      </button>
                    )}
                    <input
                      type="text"
                      placeholder="Tags (e.g. Next.js, PyTorch, DSA)"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Posting..." : "Tweet Query"}
                  </button>
                </div>
              </form>
            ) : (
              /* PENDING / UNVERIFIED NOTICE */
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3 border border-amber-200">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Your Student Profile is Pending Admin Verification
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                  As soon as the FUUAST department coordinator verifies your registration details, you can tweet
                  questions, technical problems, and connect directly with campus peers.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Link
                    href="/students"
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    Check Profile Status
                  </Link>
                </div>
              </div>
            )
          ) : (
            /* NOT LOGGED IN PROMPT */
            <div className="text-center py-6 sm:py-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 border border-blue-200">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Join the FUUAST Developer Conversation
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                Log in or sign up with your FUUAST roll number to tweet problems, find FYP teammates,
                and react/comment on peer technical queries.
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
                >
                  Student Sign In / Register
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            FEED FILTERS & SEARCH CONTROLS
        ======================================================== */}
        <div className="mb-6 p-4 rounded-xl border border-slate-200 bg-white flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search queries, tags, or peers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-slate-50/60"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Department Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-medium mr-1">Dept:</span>
              {["All", "CS", "SE", "AI"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDept(d)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedDept === d
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {d === "All" ? "All" : `BS${d}`}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-medium px-2.5 py-1 rounded-md border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="All">All Categories</option>
              <option value="Problem / Query">Problem / Query</option>
              <option value="FYP Idea & Teammates">FYP Idea & Teammates</option>
              <option value="Bug & Code Help">Bug & Code Help</option>
              <option value="Career & Internships">Career & Internships</option>
              <option value="General Discussion">General Discussion</option>
            </select>

            <button
              onClick={fetchPosts}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-auto"
              title="Refresh Feed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            STREAM OF POSTS / TWEETS
        ======================================================== */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-blue-600" />
            <p className="text-xs">Loading live campus feed...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-base font-bold text-slate-800">No discussions found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Be the first to tweet a problem or question to fellow FUUAST students.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredPosts.map((post) => {
              const isLikedByMe = Boolean(
                myProfile && myProfile.rollNo && post.likes.includes(myProfile.rollNo.toUpperCase().trim())
              );
              const isAuthor = Boolean(
                myProfile && myProfile.rollNo && post.authorRollNo.toUpperCase() === myProfile.rollNo.toUpperCase()
              );
              const isExpanded = Boolean(expandedComments[post.id]);

              return (
                <article
                  key={post.id}
                  id={post.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  {/* Author Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {post.authorPhotoUrl ? (
                        <img
                          src={post.authorPhotoUrl}
                          alt={post.authorName}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                          {post.authorName[0]}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-slate-900 leading-none">
                            {post.authorName}
                          </span>
                          <span title="Verified FUUAST Student">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline-block" />
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                          <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                            BS{post.authorDepartment}
                          </span>
                          <span>•</span>
                          <span>{post.authorSemester}</span>
                          <span>•</span>
                          <span className="font-mono text-slate-400">{post.authorRollNo}</span>
                          <span>•</span>
                          <span className="text-slate-400">{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          categoryBadgeColors[post.category] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {post.category}
                      </span>
                      {isAuthor && (
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete my post"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Title & Content */}
                  {post.title && (
                    <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                      {post.title}
                    </h3>
                  )}

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-3">
                    {post.content}
                  </p>

                  {/* Code Snippet Block (If Attached) */}
                  {post.codeSnippet && (
                    <div className="mb-3 rounded-xl bg-slate-950 border border-slate-800 p-3.5 overflow-x-auto text-xs font-mono">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-emerald-400" /> Code Reference
                        </span>
                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(post.codeSnippet || "");
                              alert("Code copied to clipboard!");
                            }
                          }}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" /> Copy
                        </button>
                      </div>
                      <pre className="text-emerald-400 leading-relaxed">{post.codeSnippet}</pre>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3.5">
                      {post.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar (Likes, Comments, Share) */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {/* Heart / Like Button */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          isLikedByMe
                            ? "bg-rose-50 text-rose-600 border border-rose-200"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${isLikedByMe ? "fill-rose-500 text-rose-500" : ""}`}
                        />
                        <span>{post.likes.length}</span>
                      </button>

                      {/* Comments Toggle Button */}
                      <button
                        onClick={() =>
                          setExpandedComments((prev) => ({
                            ...prev,
                            [post.id]: !prev[post.id],
                          }))
                        }
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                          isExpanded
                            ? "bg-blue-50 text-blue-700"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} Comments</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Share Post Button */}
                    <button
                      onClick={() => handleSharePost(post.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md hover:bg-slate-50 transition-colors"
                      title="Copy link to discussion"
                    >
                      {copiedPostId === post.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-medium text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">Share</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* ========================================================
                      COMMENTS DRAWER & INLINE REPLY INPUT
                  ======================================================== */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 bg-slate-50/70 p-3 sm:p-4 rounded-xl">
                      {/* Comments List */}
                      {post.comments.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          No replies yet. Be the first to help out!
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {post.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs shadow-2xs"
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  {comment.authorPhotoUrl ? (
                                    <img
                                      src={comment.authorPhotoUrl}
                                      alt={comment.authorName}
                                      className="w-6 h-6 rounded-lg object-cover shrink-0"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                      {comment.authorName[0]}
                                    </div>
                                  )}
                                  <span className="font-bold text-slate-900">
                                    {comment.authorName}
                                  </span>
                                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1 py-0.2 rounded">
                                    BS{comment.authorDepartment}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {comment.authorRollNo}
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {timeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed pl-8">
                                {comment.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Input Form */}
                      <div className="pt-2 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={
                            myProfile
                              ? "Write a reply or solution..."
                              : "Log in with student profile to reply..."
                          }
                          value={commentInputs[post.id] || ""}
                          onChange={(e) =>
                            setCommentInputs((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddComment(post.id);
                            }
                          }}
                          className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={submittingComment[post.id]}
                          className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0 disabled:opacity-50"
                        >
                          {submittingComment[post.id] ? "Replying..." : "Reply"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Modal for Login/Signup */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(profile) => {
          setMyProfile(profile);
          setIsModalOpen(false);
          fetchPosts();
        }}
      />
    </div>
  );
}
