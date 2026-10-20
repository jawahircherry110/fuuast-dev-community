"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Filter,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Clock,
  LogOut,
  AlertCircle,
  Phone,
  CheckCircle2,
  MessageSquareCode,
  Send,
  Code2,
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ProfileModal from "@/components/ProfileModal";
import { CommunityPost } from "@/data/postsData";

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: "CS" | "SE" | "AI";
  semester: string;
  bio: string;
  skills: string[];
  email: string;
  phone?: string;
  photoUrl?: string;
  status?: "pending" | "approved" | "rejected";
  github?: string;
  linkedin?: string;
  avatarBg?: string;
  createdAt?: string;
}

export default function StudentsPage() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [myProfile, setMyProfile] = useState<StudentProfile | null>(null);
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verified Student Tweeting / Lounge State
  const [myTweets, setMyTweets] = useState<CommunityPost[]>([]);
  const [showTweetBox, setShowTweetBox] = useState(false);
  const [tweetTitle, setTweetTitle] = useState("");
  const [tweetContent, setTweetContent] = useState("");
  const [tweetCategory, setTweetCategory] = useState<CommunityPost["category"]>("Problem / Query");
  const [tweetShowCode, setTweetShowCode] = useState(false);
  const [tweetCode, setTweetCode] = useState("");
  const [tweetTags, setTweetTags] = useState("");
  const [tweetSubmitting, setTweetSubmitting] = useState(false);
  const [tweetSuccess, setTweetSuccess] = useState<string | null>(null);
  const [tweetError, setTweetError] = useState<string | null>(null);

  useEffect(() => {
    let localProf: StudentProfile | null = null;
    const saved = localStorage.getItem("fuuast_my_profile");
    if (saved) {
      try {
        localProf = JSON.parse(saved);
        setMyProfile(localProf);
      } catch {}
    }

    // Public directory only receives approved students
    fetch("/api/profiles", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && Array.isArray(data.profiles)) {
          const approvedOnly = data.profiles.filter(
            (p: StudentProfile) => p.status === "approved"
          );
          setProfiles(approvedOnly);

          // If the logged-in student was approved by admin, immediately remove pending badge and mark approved
          if (localProf) {
            const foundInApproved = approvedOnly.find((p: StudentProfile) => {
              const matchRoll = Boolean(
                localProf?.rollNo &&
                  p.rollNo &&
                  p.rollNo.toString().trim().toUpperCase() ===
                    localProf.rollNo.toString().trim().toUpperCase()
              );
              const matchEmail = Boolean(
                localProf?.email &&
                  p.email &&
                  p.email.toString().trim().toLowerCase() ===
                    localProf.email.toString().trim().toLowerCase()
              );
              const matchId = Boolean(localProf?.id && p.id && p.id === localProf.id);
              return matchRoll || matchEmail || matchId;
            });

            if (foundInApproved) {
              const updated: StudentProfile = {
                ...localProf,
                ...foundInApproved,
                status: "approved",
              };
              setMyProfile(updated);
              try {
                localStorage.setItem("fuuast_my_profile", JSON.stringify(updated));
              } catch {}
            }
          }
        }
      })
      .catch(() => {});

    // Check student's real-time verification status from the server
    if (localProf && localProf.rollNo) {
      fetch(`/api/profiles?rollNo=${encodeURIComponent(localProf.rollNo.trim())}`, {
        cache: "no-store",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && (data.profile || data.status)) {
            const status = data.status || data.profile?.status;
            setMyProfile((prev) => {
              if (!prev) return null;
              const updated: StudentProfile = {
                ...prev,
                ...(data.profile || {}),
                status: status || prev.status,
              };
              try {
                localStorage.setItem("fuuast_my_profile", JSON.stringify(updated));
              } catch {}
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fuuast_my_profile");
    setMyProfile(null);
    setMyTweets([]);
  };

  // Fetch tweets authored by the logged-in student
  const fetchMyTweets = (rollNo: string) => {
    if (!rollNo) return;
    fetch("/api/posts", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.posts)) {
          const userRoll = rollNo.trim().toUpperCase();
          const userPosts = data.posts.filter(
            (p: CommunityPost) =>
              p.authorRollNo && p.authorRollNo.trim().toUpperCase() === userRoll
          );
          setMyTweets(userPosts);
        }
      })
      .catch(() => {});
  };

  // Check if student profile is already verified in directory or status is approved
  const isApprovedInDirectory = Boolean(
    myProfile &&
      profiles.some((p) => {
        const matchRoll = Boolean(
          p.rollNo &&
            myProfile.rollNo &&
            p.rollNo.toString().trim().toUpperCase() ===
              myProfile.rollNo.toString().trim().toUpperCase()
        );
        const matchEmail = Boolean(
          p.email &&
            myProfile.email &&
            p.email.toString().trim().toLowerCase() ===
              myProfile.email.toString().trim().toLowerCase()
        );
        const matchId = Boolean(p.id && myProfile.id && p.id === myProfile.id);
        return matchRoll || matchEmail || matchId;
      })
  );

  const isApproved = Boolean(
    (myProfile && myProfile.status === "approved") || isApprovedInDirectory
  );

  // Synchronize localStorage immediately if verified
  useEffect(() => {
    if (isApproved && myProfile && myProfile.status !== "approved") {
      const updated = { ...myProfile, status: "approved" as const };
      setMyProfile(updated);
      try {
        localStorage.setItem("fuuast_my_profile", JSON.stringify(updated));
      } catch {}
    }
  }, [isApproved, myProfile]);

  useEffect(() => {
    if (myProfile?.rollNo && isApproved) {
      fetchMyTweets(myProfile.rollNo);
    }
  }, [myProfile?.rollNo, isApproved]);

  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTweetError(null);
    setTweetSuccess(null);

    if (!myProfile || !isApproved) {
      setTweetError("Only verified student profiles can tweet problems to the Dev Lounge.");
      return;
    }
    if (!tweetTitle.trim()) {
      setTweetError("Please enter a title or summary for your technical query.");
      return;
    }
    if (!tweetContent.trim()) {
      setTweetError("Please describe your problem or query details.");
      return;
    }

    try {
      setTweetSubmitting(true);
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: tweetTitle.trim(),
          content: tweetContent.trim(),
          category: tweetCategory,
          codeSnippet: tweetShowCode && tweetCode.trim() ? tweetCode.trim() : undefined,
          tags: tweetTags
            .split(",")
            .map((t) => t.trim().replace(/^#/, ""))
            .filter(Boolean),
          authorId: myProfile.id || `fuuast-${myProfile.rollNo}`,
          authorName: myProfile.name,
          authorRollNo: myProfile.rollNo,
          authorDept: myProfile.department,
          authorSemester: myProfile.semester || "Student",
          authorPhotoUrl: myProfile.photoUrl || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setTweetError(data.error || "Failed to post tweet.");
      } else {
        setTweetSuccess("Problem tweeted successfully to Campus Dev Lounge! Peers can now view and comment.");
        setTweetTitle("");
        setTweetContent("");
        setTweetCode("");
        setTweetShowCode(false);
        setTweetTags("");
        fetchMyTweets(myProfile.rollNo);
      }
    } catch {
      setTweetError("Network error. Please try again.");
    } finally {
      setTweetSubmitting(false);
    }
  };

  const filtered = profiles.filter((p) => {
    if (p.status && p.status !== "approved") return false;
    const matchesDept = deptFilter === "All" || p.department === deptFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.skills && p.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesDept && matchesSearch;
  });

  return (
    <div className="py-12 bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          Community Roster
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
          FUUAST Islamabad Student Developers
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Connect with verified peers across BS Computer Science, Software Engineering, and Artificial Intelligence
          for collaborative coding, study groups, and Final Year Projects.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* ========================================================
            MY PROFILE AREA: PENDING, APPROVED, OR SIGNUP BANNER
        ======================================================== */}
        {myProfile ? (
          isApproved ? (
            /* APPROVED ACTIVE PROFILE */
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/60 border border-blue-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  {myProfile.photoUrl ? (
                    <img
                      src={myProfile.photoUrl}
                      alt={myProfile.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-blue-300 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm shrink-0">
                      {myProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">{myProfile.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Student Profile
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">
                      BS{myProfile.department} • {myProfile.semester} • Roll No: {myProfile.rollNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors shadow-2xs"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {myProfile.bio && (
                <p className="text-sm text-slate-700 leading-relaxed max-w-2xl mb-3">
                  {myProfile.bio}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-400 text-[10px] font-medium mr-1 uppercase">
                    Skills:
                  </span>
                  {myProfile.skills &&
                    myProfile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white text-blue-700 border border-blue-200/80 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                  {myProfile.linkedin && (
                    <a
                      href={
                        myProfile.linkedin.startsWith("http")
                          ? myProfile.linkedin
                          : `https://${myProfile.linkedin}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>My LinkedIn</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {myProfile.github && (
                    <a
                      href={
                        myProfile.github.startsWith("http")
                          ? myProfile.github
                          : `https://${myProfile.github}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1 shadow-2xs"
                    >
                      <span>My GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Dev Lounge Student Problem Sharing Panel */}
              <div className="mt-5 pt-5 border-t border-blue-200/90">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/90 p-4 rounded-xl border border-blue-100 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquareCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">
                          Campus Dev Lounge • Technical Problem Sharing
                        </h3>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Tweeting Unlocked
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Tweet problems, bugs, or FYP queries to peer CS, SE & AI developers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTweetBox(!showTweetBox);
                        setTweetSuccess(null);
                        setTweetError(null);
                      }}
                      className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        showTweetBox
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {showTweetBox ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Close Composer
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> Tweet Problem / Query
                        </>
                      )}
                    </button>
                    <Link
                      href="/feed"
                      className="flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <span>Explore Lounge</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Tweet Composer */}
                {showTweetBox && (
                  <form
                    onSubmit={handleTweetSubmit}
                    className="mt-4 p-5 rounded-xl bg-white border border-blue-200 shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                        <Send className="w-3.5 h-3.5 text-blue-600" />
                        <span>Compose Tweet to Campus Dev Lounge</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Visible to all FUUAST CS, SE & AI students
                      </span>
                    </div>

                    {tweetSuccess && (
                      <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{tweetSuccess}</span>
                        </div>
                        <Link
                          href="/feed"
                          className="font-bold underline text-emerald-900 hover:text-emerald-700 shrink-0"
                        >
                          View in Dev Lounge →
                        </Link>
                      </div>
                    )}

                    {tweetError && (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{tweetError}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Topic / Category
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                        {(
                          [
                            "Problem / Query",
                            "FYP Idea & Teammates",
                            "Bug & Code Help",
                            "Career & Internships",
                            "General Discussion",
                          ] as const
                        ).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setTweetCategory(cat)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all ${
                              tweetCategory === cat
                                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Problem Title or Main Question <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. CUDA Out of Memory on Colab or Next.js Hydration Mismatch"
                        value={tweetTitle}
                        onChange={(e) => setTweetTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Problem Description & Error Details <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Explain what you are trying to do, error logs, or what kind of peer input or teammates you need..."
                        value={tweetContent}
                        onChange={(e) => setTweetContent(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                        required
                      />
                    </div>

                    {/* Code snippet optional toggle */}
                    <div>
                      <button
                        type="button"
                        onClick={() => setTweetShowCode(!tweetShowCode)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        {tweetShowCode ? "Hide Code Snippet" : "+ Attach Code Snippet / Error Trace"}
                      </button>

                      {tweetShowCode && (
                        <div className="mt-2">
                          <textarea
                            rows={4}
                            placeholder="// Paste Python, JavaScript, C++, or error traceback here..."
                            value={tweetCode}
                            onChange={(e) => setTweetCode(e.target.value)}
                            className="w-full p-3 text-xs font-mono rounded-lg bg-slate-900 text-slate-100 focus:outline-none border border-slate-800 leading-relaxed"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. pytorch, react, fast-api, fyp"
                        value={tweetTags}
                        onChange={(e) => setTweetTags(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setShowTweetBox(false)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={tweetSubmitting}
                        className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        {tweetSubmitting ? "Tweeting..." : "Tweet Problem to Dev Lounge"}
                      </button>
                    </div>
                  </form>
                )}

                {/* My Dev Lounge Activity */}
                {myTweets.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-100">
                    <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                      <span>Your Dev Lounge Tweets & Queries</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-700 font-semibold">
                        {myTweets.length}
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {myTweets.slice(0, 3).map((post) => (
                        <div
                          key={post.id}
                          className="p-3 rounded-xl bg-white border border-blue-100/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs hover:border-blue-300 transition-colors"
                        >
                          <div className="space-y-1 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                {post.category}
                              </span>
                              <span className="font-semibold text-slate-900 truncate">
                                {post.title || post.content.substring(0, 45) + "..."}
                              </span>
                            </div>
                            <p className="text-slate-500 text-[11px] line-clamp-1">
                              {post.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                              {post.likes.length}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-blue-500" />
                              {post.comments.length}
                            </span>
                            <Link
                              href={`/feed#post-${post.id}`}
                              className="font-semibold text-blue-600 hover:text-blue-800 ml-1 flex items-center gap-1"
                            >
                              <span>View Discussion</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : myProfile.status === "rejected" ? (
            /* REJECTED STATE */
            <div className="mb-10 p-5 rounded-2xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-rose-900">
                    Profile Verification Not Approved
                  </h3>
                  <p className="text-sm text-rose-700 mt-0.5">
                    Your registration could not be verified by the admin. Please update your details or contact the coordinator.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  Update & Re-submit
                </button>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:bg-rose-100"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* PENDING APPROVAL STATE */
            <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/50 to-amber-50/90 border border-amber-200 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3.5">
                  {myProfile.photoUrl ? (
                    <img
                      src={myProfile.photoUrl}
                      alt={myProfile.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-sm shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl sm:text-2xl shrink-0 shadow-sm">
                      {myProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .substring(0, 2)
                        .toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">{myProfile.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Verification Pending
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-0.5">
                      BS{myProfile.department} • {myProfile.semester} • Roll No: {myProfile.rollNo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-amber-300 hover:bg-amber-50 transition-colors shadow-2xs"
                  >
                    Edit Details
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/80 border border-amber-200/80 text-sm text-amber-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Awaiting Admin Review:</strong> Your registration has been submitted
                  to the FUUAST Admin desk. Once the department coordinator verifies your student
                  details and photo, your profile card will automatically appear live on this directory.
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MessageSquareCode className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Campus Dev Lounge Tweeting:</strong> Tweeting coding problems & questions unlocks automatically upon admin verification.
                  </span>
                </div>
                <Link
                  href="/feed"
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-200/80 text-amber-900 hover:bg-amber-300 transition-colors shrink-0 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>Browse Lounge</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )
        ) : (
          /* NOT LOGGED IN BANNER */
          <div className="mb-10 p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Are you a CS, SE or AI student at FUUAST Islamabad?
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Register with your email or phone & upload your photo. Once verified, get your verified badge and tweet technical problems in the Campus Dev Lounge.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Student Sign Up / Login
              </button>
              <Link
                href="/feed"
                className="px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 transition-colors shadow-2xs whitespace-nowrap flex items-center gap-1.5"
              >
                <MessageSquareCode className="w-3.5 h-3.5" /> Dev Lounge
              </Link>
            </div>
          </div>
        )}

        {/* Directory Controls */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Dept:
            </span>
            {["All", "CS", "SE", "AI"].map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  deptFilter === d
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {d === "All" ? "All Departments" : `BS${d}`}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs">No verified student profiles found matching your search.</p>
            </div>
          ) : (
            filtered.map((student) => (
              <div
                key={student.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5 mb-3.5">
                    {student.photoUrl ? (
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl ${
                          student.avatarBg || "bg-blue-600"
                        } text-white flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm shrink-0`}
                      >
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {student.name}
                        </h3>
                        <span title="Verified FUUAST Student">
                          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                          BS{student.department} • {student.semester}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        {student.rollNo}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {student.bio || "Student at FUUAST Islamabad."}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {student.skills &&
                      student.skills.slice(0, 4).map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5">
                    {student.linkedin ? (
                      <a
                        href={
                          student.linkedin.startsWith("http")
                            ? student.linkedin
                            : `https://${student.linkedin}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center gap-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : null}
                    {student.github ? (
                      <a
                        href={
                          student.github.startsWith("http")
                            ? student.github
                            : `https://${student.github}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : null}
                  </div>

                  <a
                    href={`mailto:${student.email}`}
                    className="text-blue-600 hover:underline font-medium flex items-center gap-1 text-[11px]"
                  >
                    <Mail className="w-3 h-3" /> Connect
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Profile & Auth Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialProfile={myProfile}
        onSaved={(profile) => {
          setMyProfile(profile);
          if (profile.status === "approved") {
            setProfiles((prev) => [
              profile,
              ...prev.filter((p) => p.rollNo !== profile.rollNo),
            ]);
          }
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
