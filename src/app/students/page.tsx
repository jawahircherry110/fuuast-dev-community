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
  github?: string;
  linkedin?: string;
  avatarBg?: string;
}

export default function StudentsPage() {
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [myProfile, setMyProfile] = useState<StudentProfile | null>(null);
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles) setProfiles(data.profiles);
      })
      .catch(() => {});

    const saved = localStorage.getItem("fuuast_my_profile");
    if (saved) {
      try {
        setMyProfile(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const filtered = profiles.filter((p) => {
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
          Connect with peers across BS Computer Science, Software Engineering, and Artificial Intelligence
          for collaborative coding, study groups, and Final Year Projects.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* MY PROFILE AREA */}
        {myProfile ? (
          <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50/60 border border-blue-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
                  {myProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-900">{myProfile.name}</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Your Active Profile
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    BS{myProfile.department} • {myProfile.semester} • Roll No: {myProfile.rollNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors shadow-xs"
              >
                Edit Profile
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl mb-3">
              {myProfile.bio || "Student at Federal Urdu University Islamabad."}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 text-[10px] font-medium mr-1 uppercase">Skills:</span>
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
                    href={myProfile.linkedin.startsWith("http") ? myProfile.linkedin : `https://${myProfile.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span>My LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {myProfile.github && (
                  <a
                    href={myProfile.github.startsWith("http") ? myProfile.github : `https://${myProfile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-1"
                  >
                    <span>My GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-10 p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h2 className="text-base font-semibold text-slate-900">
                Are you a CS, SE or AI student at FUUAST Islamabad?
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Create your student profile to showcase your skills, connect with peers, and collaborate on projects.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" /> Create Student Profile
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
          {filtered.map((student) => (
            <div
              key={student.id}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${student.avatarBg || "bg-blue-600"} text-white flex items-center justify-center font-bold text-xs`}
                  >
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 leading-tight">
                      {student.name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      BS{student.department} • {student.semester}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mb-2">
                  {student.rollNo}
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

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  {student.linkedin ? (
                    <a
                      href={student.linkedin.startsWith("http") ? student.linkedin : `https://${student.linkedin}`}
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
                      href={student.github.startsWith("http") ? student.github : `https://${student.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      GitHub
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
          ))}
        </div>
      </div>

      {/* Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(profile) => {
          setMyProfile(profile);
          setProfiles((prev) => [profile, ...prev.filter((p) => p.rollNo !== profile.rollNo)]);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
