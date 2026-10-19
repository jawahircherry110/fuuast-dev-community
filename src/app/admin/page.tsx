"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Users,
  Mail,
  Briefcase,
  Lock,
  LogOut,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Phone,
  Check,
  UserCheck,
} from "lucide-react";
import { StudentProfile } from "@/app/students/page";
import { JobOpportunity } from "@/data/initialData";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);

  // Login form state
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab & Student Sub-tab
  const [activeTab, setActiveTab] = useState<"students" | "messages" | "jobs">("students");
  const [studentFilterTab, setStudentFilterTab] = useState<"pending" | "approved" | "all">("pending");

  // Admin Data State
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);

  // Search Filter
  const [searchStudent, setSearchStudent] = useState("");

  // Post Job Form State
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "Islamabad",
    type: "Internship" as "Internship" | "Full-time" | "Part-time" | "Remote",
    department: "All" as "CS" | "SE" | "AI" | "All",
    stipend: "",
    description: "",
    applyLink: "",
  });
  const [jobSuccess, setJobSuccess] = useState(false);
  const [isSubmittingJob, setIsSubmittingJob] = useState(false);

  useEffect(() => {
    // Require password every time someone navigates or returns to the admin URL
    setIsAuthenticated(false);
    setIsCheckingAuth(false);
    fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
  }, []);

  const loadAdminData = () => {
    fetch("/api/profiles?all=true", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.profiles) setStudents(data.profiles);
      })
      .catch(() => {});

    fetch("/api/contact", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.messages) setMessages(data.messages);
      })
      .catch(() => {});

    fetch("/api/jobs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch(() => {});
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        loadAdminData();
      } else {
        setLoginError(data.error || "Invalid username or password");
      }
    } catch {
      setLoginError("Login failed. Check your network or credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setLoginUser("");
    setLoginPass("");
  };

  // Student Profile Verification Handlers
  const handleApproveStudent = async (id: string) => {
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "approved" } : s))
        );
      }
    } catch {}
  };

  const handleRejectStudent = async (id: string) => {
    try {
      const res = await fetch("/api/profiles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: "rejected" } : s))
        );
      }
    } catch {}
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete profile for ${name}?`)) return;
    try {
      const res = await fetch(`/api/profiles?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setStudents(students.filter((s) => s.id !== id));
      }
    } catch {}
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      }
    } catch {}
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete opening: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/jobs?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter((j) => j.id !== id));
      }
    } catch {}
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company || !newJob.applyLink) return;

    setIsSubmittingJob(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      });
      const data = await res.json();

      if (res.ok && data.job) {
        setJobs([data.job, ...jobs]);
        setJobSuccess(true);
        setNewJob({
          title: "",
          company: "",
          location: "Islamabad",
          type: "Internship",
          department: "All",
          stipend: "",
          description: "",
          applyLink: "",
        });
        setTimeout(() => setJobSuccess(false), 3000);
      }
    } catch {} finally {
      setIsSubmittingJob(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-xs text-slate-500">Checking admin session...</p>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="py-20 px-4 bg-slate-50 min-h-[75vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight">Admin Portal Login</h1>
            <p className="text-xs text-slate-500 mt-1">
              FUUAST Islamabad Community Administration
            </p>
          </div>

          {loginError && (
            <div className="p-3 mb-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Admin Username</label>
              <input
                type="text"
                required
                placeholder="admin"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              {isLoggingIn ? "Authenticating..." : "Sign In to Admin Dashboard"}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Protected endpoint for community coordinators
          </div>
        </div>
      </div>
    );
  }

  // Pending vs Approved student groups
  const pendingStudents = students.filter((s) => s.status === "pending");
  const approvedStudents = students.filter((s) => s.status === "approved" || !s.status);

  const displayedStudents = (
    studentFilterTab === "pending"
      ? pendingStudents
      : studentFilterTab === "approved"
      ? approvedStudents
      : students
  ).filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.department.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchStudent.toLowerCase()))
  );

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Authenticated Administrator
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            FUUAST Islamabad Admin Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verify student registrations, review contact submissions, and publish internship openings.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {/* Pending Approvals Metric */}
        <div
          onClick={() => {
            setActiveTab("students");
            setStudentFilterTab("pending");
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "students" && studentFilterTab === "pending"
              ? "bg-amber-50/80 border-amber-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-semibold text-amber-700">
              {pendingStudents.length}
            </span>
            {pendingStudents.length > 0 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                Action Required
              </span>
            )}
          </div>
        </div>

        {/* Verified Students Metric */}
        <div
          onClick={() => {
            setActiveTab("students");
            setStudentFilterTab("approved");
          }}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "students" && studentFilterTab === "approved"
              ? "bg-blue-50/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Verified Students</span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">
            {approvedStudents.length}
          </div>
        </div>

        {/* Messages Metric */}
        <div
          onClick={() => setActiveTab("messages")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "messages"
              ? "bg-blue-50/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Contact Messages</span>
            <Mail className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">{messages.length}</div>
        </div>

        {/* Jobs Metric */}
        <div
          onClick={() => setActiveTab("jobs")}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === "jobs"
              ? "bg-blue-50/70 border-blue-300 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-semibold text-slate-900 mt-2">{jobs.length}</div>
        </div>
      </div>

      {/* TAB 1: STUDENT VERIFICATION & MANAGEMENT */}
      {activeTab === "students" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Student Directory & Verification Desk
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review registrations, verify student identities & photos, and manage the live directory.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, roll no, email..."
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Sub-Tabs: Pending Approvals, Verified, All */}
          <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-slate-100">
            <button
              onClick={() => setStudentFilterTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                studentFilterTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending Approvals ({pendingStudents.length})
            </button>

            <button
              onClick={() => setStudentFilterTab("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                studentFilterTab === "approved"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified / Live on Directory ({approvedStudents.length})
            </button>

            <button
              onClick={() => setStudentFilterTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                studentFilterTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              All Registrations ({students.length})
            </button>
          </div>

          {/* VIEW 1: PENDING VERIFICATION CARDS */}
          {studentFilterTab === "pending" && (
            <div className="space-y-4">
              {displayedStudents.length === 0 ? (
                <div className="py-12 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                  <h4 className="text-sm font-semibold text-slate-900">
                    No Pending Requests
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    All student registrations have been reviewed and verified!
                  </p>
                </div>
              ) : (
                displayedStudents.map((s) => (
                  <div
                    key={s.id}
                    className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      {/* Photo Thumbnail */}
                      <div className="relative shrink-0">
                        {s.photoUrl ? (
                          <img
                            src={s.photoUrl}
                            alt={s.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-300 shadow-sm"
                          />
                        ) : (
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center font-bold text-xl sm:text-2xl shadow-sm">
                            {s.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                        )}
                        <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white">
                          NEW
                        </span>
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">{s.name}</h3>
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                            {s.rollNo}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                            BS{s.department}
                          </span>
                          <span className="text-xs text-slate-500">• {s.semester}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600">
                          <a
                            href={`mailto:${s.email}`}
                            className="hover:text-blue-600 flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3 text-slate-400" />
                            {s.email}
                          </a>
                          {s.phone && (
                            <a
                              href={`tel:${s.phone}`}
                              className="hover:text-blue-600 flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-slate-400" />
                              {s.phone}
                            </a>
                          )}
                        </div>

                        {s.bio && (
                          <p className="text-xs text-slate-600 mt-2 max-w-xl line-clamp-2">
                            {s.bio}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {s.skills &&
                            s.skills.map((sk, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-700 border border-slate-200"
                              >
                                {sk}
                              </span>
                            ))}

                          {s.linkedin && (
                            <a
                              href={s.linkedin.startsWith("http") ? s.linkedin : `https://${s.linkedin}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 hover:underline flex items-center gap-1"
                            >
                              LinkedIn <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}

                          {s.github && (
                            <a
                              href={s.github.startsWith("http") ? s.github : `https://${s.github}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 hover:underline flex items-center gap-1"
                            >
                              GitHub <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <button
                        onClick={() => handleApproveStudent(s.id)}
                        className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve & Publish
                      </button>

                      <button
                        onClick={() => handleRejectStudent(s.id)}
                        className="px-3 py-2 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                        title="Decline Profile"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteStudent(s.id, s.name)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VIEW 2 & 3: APPROVED AND ALL STUDENTS TABLE */}
          {studentFilterTab !== "pending" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-y border-slate-200 font-medium">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Roll Number</th>
                    <th className="py-2.5 px-3">Track</th>
                    <th className="py-2.5 px-3">Semester</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No student records found matching filter.
                      </td>
                    </tr>
                  ) : (
                    displayedStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            {s.photoUrl ? (
                              <img
                                src={s.photoUrl}
                                alt={s.name}
                                className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div
                                className={`w-8 h-8 rounded-lg ${
                                  s.avatarBg || "bg-blue-600"
                                } text-white flex items-center justify-center font-bold text-xs shrink-0`}
                              >
                                {s.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .substring(0, 2)
                                  .toUpperCase()}
                              </div>
                            )}
                            <div>
                              <span className="font-semibold text-slate-900 block leading-tight">
                                {s.name}
                              </span>
                              {s.linkedin && (
                                <a
                                  href={s.linkedin.startsWith("http") ? s.linkedin : `https://${s.linkedin}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5 mt-0.5"
                                >
                                  LinkedIn <ExternalLink className="w-2 h-2" />
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-600">{s.rollNo}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                            BS{s.department}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{s.semester}</td>
                        <td className="py-3 px-3 text-slate-600">
                          <div>{s.email}</div>
                          {s.phone && (
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {s.phone}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {s.status === "approved" || !s.status ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Approved
                            </span>
                          ) : s.status === "rejected" ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Rejected
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {s.status === "pending" && (
                              <button
                                onClick={() => handleApproveStudent(s.id)}
                                className="px-2 py-1 rounded text-[11px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
                                title="Approve"
                              >
                                Approve
                              </button>
                            )}

                            {s.status === "approved" && (
                              <button
                                onClick={() => handleRejectStudent(s.id)}
                                className="px-2 py-1 rounded text-[11px] font-medium text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                                title="Revoke Approval"
                              >
                                Revoke
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteStudent(s.id, s.name)}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONTACT MESSAGES */}
      {activeTab === "messages" && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="mb-6">
            <h2 className="text-base font-semibold text-slate-900">Received Messages & Inquiries</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Messages submitted through the public Contact page.
            </p>
          </div>

          <div className="space-y-3">
            {messages.length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400">No contact messages received yet.</p>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 text-xs">{m.name}</span>
                      <span className="text-[11px] text-slate-500">({m.email})</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">
                        {m.department}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-400">
                        {m.timestamp ? new Date(m.timestamp).toLocaleDateString() : ""}
                      </span>
                      <button
                        onClick={() => handleDeleteMessage(m.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {m.subject && (
                    <div className="text-xs font-medium text-blue-700 mb-1">
                      Subject: {m.subject}
                    </div>
                  )}

                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    {m.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: JOBS & INTERNSHIPS (POST & MANAGE) */}
      {activeTab === "jobs" && (
        <div className="space-y-8">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <div className="mb-5">
              <h2 className="text-base font-semibold text-slate-900">Post New Job or Internship</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                This opening will immediately appear live on the public Jobs & Internships board.
              </p>
            </div>

            {jobSuccess && (
              <div className="p-3 mb-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Opportunity published successfully and is now live on the website!</span>
              </div>
            )}

            <form onSubmit={handlePostJob} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Job / Internship Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior React Developer or AI Intern"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechLogix Islamabad"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Islamabad / Remote"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
                  <select
                    value={newJob.type}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        type: e.target.value as "Internship" | "Full-time" | "Part-time" | "Remote",
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Target Track</label>
                  <select
                    value={newJob.department}
                    onChange={(e) =>
                      setNewJob({
                        ...newJob,
                        department: e.target.value as "CS" | "SE" | "AI" | "All",
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="All">All Students (CS, SE, AI)</option>
                    <option value="CS">Computer Science</option>
                    <option value="SE">Software Engineering</option>
                    <option value="AI">Artificial Intelligence</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Stipend / Salary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PKR 35,000 / month or Unpaid"
                    value={newJob.stipend}
                    onChange={(e) => setNewJob({ ...newJob, stipend: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Application Link or HR Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://company.com/apply or careers@company.pk"
                    value={newJob.applyLink}
                    onChange={(e) => setNewJob({ ...newJob, applyLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Description & Requirements *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Responsibilities, required skills, and eligibility criteria..."
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingJob}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isSubmittingJob ? "Publishing..." : "Publish Opportunity Live"}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-base font-semibold text-slate-900 mb-4">
              Current Active Job & Internship Listings ({jobs.length})
            </h2>

            <div className="space-y-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-900">{job.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700">
                        {job.type}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                        {job.department}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3">
                      <span>{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.stipend}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <a
                      href={job.applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded text-xs text-blue-600 hover:underline flex items-center gap-1"
                    >
                      View Link <ExternalLink className="w-3 h-3" />
                    </a>
                    <button
                      onClick={() => handleDeleteJob(job.id, job.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      title="Delete Job"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
