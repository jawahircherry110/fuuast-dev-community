"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import ProfileModal from "@/components/ProfileModal";

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

  useEffect(() => {
    // Public directory only receives approved students
    fetch("/api/profiles", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles && Array.isArray(data.profiles)) {
          const approvedOnly = data.profiles.filter(
            (p: StudentProfile) => p.status === "approved"
          );
          setProfiles(approvedOnly);
        }
      })
      .catch(() => {});

    // Check logged in student profile
    const saved = localStorage.getItem("fuuast_my_profile");
    if (saved) {
      try {
        setMyProfile(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("fuuast_my_profile");
    setMyProfile(null);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-3">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          Community Roster
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          FUUAST Islamabad Student Developers
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Connect with verified peers across BS Computer Science, Software Engineering, and Artificial Intelligence
          for collaborative coding, study groups, and Final Year Projects.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* ========================================================
            MY PROFILE AREA: PENDING, APPROVED, OR SIGNUP BANNER
        ======================================================== */}
        {myProfile ? (
          myProfile.status === "pending" ? (
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
                      <h2 className="text-base font-semibold text-slate-900">{myProfile.name}</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Verification Pending
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
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

              <div className="p-3 rounded-xl bg-white/80 border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Awaiting Admin Review:</strong> Your registration has been submitted
                  to the FUUAST Admin desk. Once the department coordinator verifies your student
                  details and photo, your profile card will automatically appear live on this directory.
                </div>
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
                  <h3 className="text-sm font-semibold text-rose-900">
                    Profile Verification Not Approved
                  </h3>
                  <p className="text-xs text-rose-700 mt-0.5">
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
                      <h2 className="text-base font-semibold text-slate-900">{myProfile.name}</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified Student Profile
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
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
                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl mb-3">
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
            </div>
          )
        ) : (
          /* NOT LOGGED IN BANNER */
          <div className="mb-10 p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-base font-semibold text-slate-900">
                Are you a CS, SE or AI student at FUUAST Islamabad?
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Register with your email or phone & upload your photo. Once verified by admin, your profile card goes live.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Student Sign Up / Login
            </button>
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
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
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

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
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
