"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Briefcase,
  Code,
  Users,
  Search,
  ExternalLink,
  Send,
  CheckCircle2,
  Building2,
  MapPin,
  Filter,
  Layers,
  Cpu,
  Laptop,
  Mail,
  User,
  X,
  Menu,
  Sparkles,
} from "lucide-react";
import { initialJobs, JobOpportunity } from "@/data/initialData";

export interface StudentProfile {
  id: string;
  name: string;
  rollNo: string;
  department: "CS" | "SE" | "AI";
  semester: string;
  bio: string;
  skills: string[];
  interests?: string[];
  openToCollaborate?: boolean;
  email: string;
  github?: string;
  linkedin?: string;
  avatarBg?: string;
}

export default function Home() {
  // Mobile Nav State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profiles State
  const [profiles, setProfiles] = useState<StudentProfile[]>([]);
  const [myProfile, setMyProfile] = useState<StudentProfile | null>(null);
  const [profileDeptFilter, setProfileDeptFilter] = useState<string>("All");
  const [profileSearch, setProfileSearch] = useState<string>("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: "",
    rollNo: "",
    department: "CS" as "CS" | "SE" | "AI",
    semester: "6th Semester",
    bio: "",
    skills: "",
    email: "",
    github: "",
    linkedin: "",
  });

  // Jobs State (Curated, Read-Only for Students)
  const [jobs] = useState<JobOpportunity[]>(initialJobs);
  const [jobDeptFilter, setJobDeptFilter] = useState<string>("All");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("All");
  const [jobSearch, setJobSearch] = useState<string>("");

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    department: "CS",
    subject: "",
    message: "",
  });
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState<boolean>(false);

  // Load profiles on mount (from API + local storage check for current user)
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

  // Handle Profile Creation
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.rollNo || !profileForm.email) return;

    setIsSubmittingProfile(true);

    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();

      if (data.success && data.profile) {
        setMyProfile(data.profile);
        localStorage.setItem("fuuast_my_profile", JSON.stringify(data.profile));
        setProfiles((prev) => [data.profile, ...prev.filter((p) => p.rollNo !== data.profile.rollNo)]);
        setProfileSuccess(true);
        setTimeout(() => {
          setIsProfileModalOpen(false);
          setProfileSuccess(false);
          // scroll to my-profile area smoothly
          const el = document.getElementById("profile-area");
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 1000);
      }
    } catch {
      // Local fallback
      const fallback: StudentProfile = {
        id: `std-${Date.now()}`,
        name: profileForm.name,
        rollNo: profileForm.rollNo.toUpperCase(),
        department: profileForm.department,
        semester: profileForm.semester,
        bio: profileForm.bio,
        skills: profileForm.skills ? profileForm.skills.split(",").map((s) => s.trim()) : ["Coding"],
        email: profileForm.email,
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        avatarBg: "bg-blue-600",
      };
      setMyProfile(fallback);
      localStorage.setItem("fuuast_my_profile", JSON.stringify(fallback));
      setProfiles((prev) => [fallback, ...prev]);
      setIsProfileModalOpen(false);
    } finally {
      setIsSubmittingProfile(false);
    }
  };

  // Handle Contact Submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmittingContact(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      setContactSuccess(true);
      setContactForm({
        name: "",
        email: "",
        department: "CS",
        subject: "",
        message: "",
      });
    } catch {
      setContactSuccess(true);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesDept = profileDeptFilter === "All" || p.department === profileDeptFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(profileSearch.toLowerCase()) ||
      (p.skills && p.skills.some((s) => s.toLowerCase().includes(profileSearch.toLowerCase())));
    return matchesDept && matchesSearch;
  });

  // Filtered Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesDept = jobDeptFilter === "All" || j.department === "All" || j.department === jobDeptFilter;
    const matchesType = jobTypeFilter === "All" || j.type === jobTypeFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    return matchesDept && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased font-sans">
      {/* Sleek Top Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">FUUAST Islamabad • Dept. of CS, SE & AI</span>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-400">
            fuuastdevcommunity.com
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold shadow-xs">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 tracking-tight text-sm sm:text-base leading-none block">
                FUUAST <span className="text-blue-600">Dev Community</span>
              </span>
              <span className="text-[10px] text-slate-500 tracking-normal font-normal">
                Islamabad Campus
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-slate-600">
            <a href="#about" className="hover:text-blue-600 transition-colors">
              About
            </a>
            <a href="#departments" className="hover:text-blue-600 transition-colors">
              CS, SE & AI
            </a>
            <a
              href="#jobs"
              className="px-2.5 py-1 rounded-md text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Briefcase className="w-3.5 h-3.5" /> Jobs & Internships
            </a>
            <a href="#profile-area" className="hover:text-blue-600 transition-colors">
              Student Profiles
            </a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">
              Contact
            </a>
          </nav>

          {/* User Profile Button / Action */}
          <div className="hidden md:flex items-center gap-3">
            {myProfile ? (
              <a
                href="#profile-area"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {myProfile.name[0]}
                </div>
                <span>{myProfile.name.split(" ")[0]} (My Profile)</span>
              </a>
            ) : (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" /> Create Profile
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white px-4 py-3 space-y-2 text-xs font-medium text-slate-700 shadow-sm">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-blue-600"
            >
              About
            </a>
            <a
              href="#departments"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-blue-600"
            >
              CS, SE & AI Tracks
            </a>
            <a
              href="#jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 text-blue-600 font-semibold"
            >
              Jobs & Internships
            </a>
            <a
              href="#profile-area"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-blue-600"
            >
              Student Profiles
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1.5 hover:text-blue-600"
            >
              Contact
            </a>
            <div className="pt-2 border-t border-slate-100">
              {myProfile ? (
                <a
                  href="#profile-area"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold"
                >
                  View My Profile ({myProfile.name.split(" ")[0]})
                </a>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsProfileModalOpen(true);
                  }}
                  className="w-full py-2 rounded-lg text-center bg-blue-600 text-white font-semibold"
                >
                  Create Student Profile
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="about" className="pt-12 pb-16 bg-gradient-to-b from-blue-50/40 via-white to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-medium mb-5">
            <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
            Federal Urdu University • Islamabad Campus
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
            Connecting <span className="text-blue-600">CS, SE & AI</span> Students for Collaboration & Careers
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            The dedicated academic and developer platform for students of Computer Science, Software
            Engineering, and Artificial Intelligence at FUUAST Islamabad. Find teammates, share
            projects, and explore internships.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {myProfile ? (
              <a
                href="#profile-area"
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
              >
                Go to My Profile Area
              </a>
            ) : (
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" /> Create Your Student Profile
              </button>
            )}

            <a
              href="#jobs"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
            >
              Browse Jobs & Internships
            </a>
          </div>
        </div>
      </section>

      {/* Departments Overview */}
      <section id="departments" className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Academic Tracks</h2>
          <p className="text-slate-500 text-xs mt-1">
            Programs offered at the Department of Computer Science & IT, FUUAST Islamabad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CS */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Laptop className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">BSCS</span>
            <h3 className="text-base font-semibold text-slate-900 mt-0.5 mb-1.5">Computer Science</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              Foundation in computing theory, data structures, algorithms, databases, web development, and cloud systems.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              <span className="px-2 py-0.5 rounded bg-slate-100">C++</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">Python</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">DSA</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">Next.js</span>
            </div>
          </div>

          {/* SE */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide">BSSE</span>
            <h3 className="text-base font-semibold text-slate-900 mt-0.5 mb-1.5">Software Engineering</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              Software architecture, quality assurance (SQA), DevOps, mobile app development, and enterprise applications.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              <span className="px-2 py-0.5 rounded bg-slate-100">Flutter</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">TypeScript</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">Docker</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">SQA</span>
            </div>
          </div>

          {/* AI */}
          <div className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">BSAI</span>
            <h3 className="text-base font-semibold text-slate-900 mt-0.5 mb-1.5">Artificial Intelligence</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-3">
              Machine learning, deep learning, computer vision, natural language processing, and data science workflows.
            </p>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
              <span className="px-2 py-0.5 rounded bg-slate-100">PyTorch</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">TensorFlow</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">NLP</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">FastAPI</span>
            </div>
          </div>
        </div>
      </section>

      {/* JOBS & INTERNSHIPS (Curated for students) */}
      <section id="jobs" className="py-14 bg-slate-50/60 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-xl mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100/70 text-blue-700 text-[11px] font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" /> Opportunities Board
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Jobs & Internships for Students
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Curated opportunities in Islamabad, Rawalpindi, and remote positions for CS, SE, and AI students.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by title or company..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Track:
              </span>
              {["All", "CS", "SE", "AI"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setJobDeptFilter(dept)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    jobDeptFilter === dept
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {dept}
                </button>
              ))}

              <span className="text-[11px] text-slate-400 font-medium ml-2 mr-1">Type:</span>
              {["All", "Internship", "Full-time"].map((type) => (
                <button
                  key={type}
                  onClick={() => setJobTypeFilter(type)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    jobTypeFilter === type
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {job.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{job.postedDate}</span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Stipend</span>
                    <span className="font-medium text-slate-700">{job.stipend}</span>
                  </div>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STUDENT PROFILE AREA & DIRECTORY */}
      <section id="profile-area" className="py-14 max-w-6xl mx-auto px-4">
        {/* If student has created a profile: show MY PROFILE Area */}
        {myProfile ? (
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200">
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
                    <h3 className="text-lg font-semibold text-slate-900">{myProfile.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active Profile
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    BS{myProfile.department} • {myProfile.semester} • Roll No: {myProfile.rollNo}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setProfileForm({
                    name: myProfile.name,
                    rollNo: myProfile.rollNo,
                    department: myProfile.department,
                    semester: myProfile.semester,
                    bio: myProfile.bio,
                    skills: myProfile.skills ? myProfile.skills.join(", ") : "",
                    email: myProfile.email,
                    github: myProfile.github || "",
                    linkedin: myProfile.linkedin || "",
                  });
                  setIsProfileModalOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white text-blue-700 border border-blue-300 hover:bg-blue-50 transition-colors shadow-xs"
              >
                Edit My Profile
              </button>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed max-w-2xl mb-3">
              {myProfile.bio || "Student at Federal Urdu University Islamabad."}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
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
          </div>
        ) : (
          /* Profile Creation Prompt Banner */
          <div className="mb-10 p-6 rounded-2xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-base font-semibold text-slate-900">
                Are you a CS, SE or AI student at FUUAST Islamabad?
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Create your student profile to showcase your skills, connect with peers, and collaborate on projects.
              </p>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs whitespace-nowrap"
            >
              + Create Student Profile
            </button>
          </div>
        )}

        {/* Directory Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
              Community Directory
            </h2>
            <p className="text-slate-500 text-xs mt-1">
              Registered students from Computer Science, Software Engineering, and AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={profileSearch}
                onChange={(e) => setProfileSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-1">
              {["All", "CS", "SE", "AI"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setProfileDeptFilter(dept)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    profileDeptFilter === dept
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredProfiles.map((student) => (
            <div
              key={student.id}
              className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2.5">
                  <div
                    className={`w-9 h-9 rounded-lg ${student.avatarBg || "bg-blue-600"} text-white flex items-center justify-center font-bold text-xs`}
                  >
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-900 leading-tight">
                      {student.name}
                    </h4>
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
                <span className="text-slate-400">Available</span>
                <a
                  href={`mailto:${student.email}`}
                  className="text-blue-600 hover:underline font-medium flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" /> Connect
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="py-14 bg-slate-50/50 border-t border-slate-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Contact Coordinators</h2>
            <p className="text-slate-500 text-xs mt-1">
              Have questions regarding community activities or student projects? Send a message below.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            {contactSuccess ? (
              <div className="text-center py-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Thank you. Your message has been saved and forwarded to the community team.
                </p>
                <button
                  onClick={() => setContactSuccess(false)}
                  className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 hover:bg-blue-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Ullah"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@student.fuuast.edu.pk"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Department</label>
                    <select
                      value={contactForm.department}
                      onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                    >
                      <option value="CS">Computer Science</option>
                      <option value="SE">Software Engineering</option>
                      <option value="AI">Artificial Intelligence</option>
                      <option value="General">Other / Visitor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. FYP inquiry or feedback"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Write your message here..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={isSubmittingContact}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingContact ? "Sending..." : "Submit Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-4 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-semibold text-slate-200">
              FUUAST Islamabad Developer Community
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Federal Urdu University of Arts, Science and Technology • Islamabad Campus
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            © 2026 fuuastdevcommunity.com. All rights reserved.
          </div>
        </div>
      </footer>

      {/* MODAL: CREATE / EDIT STUDENT PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 my-6 relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Student Profile</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Enter your details to create your profile in the FUUAST Islamabad community directory.
              </p>
            </div>

            {profileSuccess ? (
              <div className="py-8 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="text-sm font-semibold text-slate-900">Profile Saved!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Your profile is now live in the student directory.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ullah"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Roll Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FA22-BCS-041"
                      value={profileForm.rollNo}
                      onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Department *</label>
                    <select
                      value={profileForm.department}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          department: e.target.value as "CS" | "SE" | "AI",
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                    >
                      <option value="CS">BS Computer Science</option>
                      <option value="SE">BS Software Engineering</option>
                      <option value="AI">BS Artificial Intelligence</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
                    <select
                      value={profileForm.semester}
                      onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                    >
                      {[
                        "1st Semester",
                        "2nd Semester",
                        "3rd Semester",
                        "4th Semester",
                        "5th Semester",
                        "6th Semester",
                        "7th Semester",
                        "8th Semester",
                        "Alumni",
                      ].map((sem) => (
                        <option key={sem} value={sem}>
                          {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@student.fuuast.edu.pk"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Skills / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Python, React, C++"
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Short Bio & FYP / Project Interests
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description about your interests or project goals..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProfile}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                  >
                    {isSubmittingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
