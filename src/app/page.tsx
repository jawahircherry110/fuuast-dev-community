"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Briefcase,
  Code,
  Users,
  Search,
  Plus,
  ExternalLink,
  Send,
  CheckCircle2,
  Building2,
  MapPin,
  Filter,
  ArrowRight,
  BookOpen,
  Layers,
  Cpu,
  Laptop,
  Mail,
  UserCheck,
  X,
} from "lucide-react";
import {
  initialProfiles,
  initialJobs,
  initialProjects,
  StudentProfile,
  JobOpportunity,
  CollabProject,
} from "@/data/initialData";

export default function Home() {
  // Profiles State
  const [profiles, setProfiles] = useState<StudentProfile[]>(initialProfiles);
  const [profileDeptFilter, setProfileDeptFilter] = useState<string>("All");
  const [profileSearch, setProfileSearch] = useState<string>("");
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [newProfileSuccess, setNewProfileSuccess] = useState<boolean>(false);

  // New Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    rollNo: "",
    department: "CS" as "CS" | "SE" | "AI",
    semester: "6th Semester",
    bio: "",
    skills: "",
    interests: "",
    github: "",
    linkedin: "",
    email: "",
  });

  // Jobs State
  const [jobs, setJobs] = useState<JobOpportunity[]>(initialJobs);
  const [jobDeptFilter, setJobDeptFilter] = useState<string>("All");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("All");
  const [jobSearch, setJobSearch] = useState<string>("");
  const [isJobModalOpen, setIsJobModalOpen] = useState<boolean>(false);
  const [newJobSuccess, setNewJobSuccess] = useState<boolean>(false);

  // New Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "Islamabad",
    type: "Internship" as "Internship" | "Full-time" | "Part-time" | "Remote",
    department: "All" as "CS" | "SE" | "AI" | "All",
    stipend: "",
    description: "",
    applyLink: "",
  });

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    department: "CS",
    subject: "",
    message: "",
  });
  const [contactSuccess, setContactSuccess] = useState<boolean>(false);

  // Handler: Add Profile
  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.rollNo || !profileForm.email) return;

    const newProfile: StudentProfile = {
      id: `p-${Date.now()}`,
      name: profileForm.name,
      rollNo: profileForm.rollNo.toUpperCase(),
      department: profileForm.department,
      semester: profileForm.semester,
      bio: profileForm.bio || "Student at FUUAST Islamabad passionate about technology.",
      skills: profileForm.skills
        ? profileForm.skills.split(",").map((s) => s.trim())
        : ["Programming"],
      interests: profileForm.interests
        ? profileForm.interests.split(",").map((i) => i.trim())
        : ["Collaboration"],
      openToCollaborate: true,
      github: profileForm.github,
      linkedin: profileForm.linkedin,
      email: profileForm.email,
      avatarBg:
        profileForm.department === "CS"
          ? "bg-blue-600"
          : profileForm.department === "SE"
          ? "bg-sky-600"
          : "bg-indigo-600",
    };

    setProfiles([newProfile, ...profiles]);
    setNewProfileSuccess(true);
    setTimeout(() => {
      setIsProfileModalOpen(false);
      setNewProfileSuccess(false);
      setProfileForm({
        name: "",
        rollNo: "",
        department: "CS",
        semester: "6th Semester",
        bio: "",
        skills: "",
        interests: "",
        github: "",
        linkedin: "",
        email: "",
      });
    }, 1200);
  };

  // Handler: Add Job / Internship
  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company || !jobForm.applyLink) return;

    const newJob: JobOpportunity = {
      id: `j-${Date.now()}`,
      title: jobForm.title,
      company: jobForm.company,
      location: jobForm.location,
      type: jobForm.type,
      department: jobForm.department,
      stipend: jobForm.stipend || "Competitive / Unspecified",
      description: jobForm.description,
      applyLink: jobForm.applyLink.startsWith("http")
        ? jobForm.applyLink
        : `https://${jobForm.applyLink}`,
      postedDate: "Just now",
    };

    setJobs([newJob, ...jobs]);
    setNewJobSuccess(true);
    setTimeout(() => {
      setIsJobModalOpen(false);
      setNewJobSuccess(false);
      setJobForm({
        title: "",
        company: "",
        location: "Islamabad",
        type: "Internship",
        department: "All",
        stipend: "",
        description: "",
        applyLink: "",
      });
    }, 1200);
  };

  // Handler: Contact Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setContactSuccess(true);
    setContactForm({
      name: "",
      email: "",
      department: "CS",
      subject: "",
      message: "",
    });
  };

  // Filtered Profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesDept =
      profileDeptFilter === "All" || p.department === profileDeptFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.rollNo.toLowerCase().includes(profileSearch.toLowerCase()) ||
      p.skills.some((s) => s.toLowerCase().includes(profileSearch.toLowerCase()));
    return matchesDept && matchesSearch;
  });

  // Filtered Jobs
  const filteredJobs = jobs.filter((j) => {
    const matchesDept =
      jobDeptFilter === "All" ||
      j.department === "All" ||
      j.department === jobDeptFilter;
    const matchesType =
      jobTypeFilter === "All" || j.type === jobTypeFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.company.toLowerCase().includes(jobSearch.toLowerCase()) ||
      j.location.toLowerCase().includes(jobSearch.toLowerCase());
    return matchesDept && matchesType && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top University Announcement Bar */}
      <div className="bg-blue-900 text-blue-100 text-xs py-2 px-4 border-b border-blue-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-300" />
            <span className="font-semibold tracking-wide">
              Federal Urdu University of Arts, Science & Technology — Islamabad Campus
            </span>
          </div>
          <div className="text-blue-200 text-[11px] font-medium">
            Department of Computer Science, Software Engineering & Artificial Intelligence
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold shadow-md shadow-blue-700/20 group-hover:bg-blue-800 transition-colors">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                  FUUAST <span className="text-blue-700">Dev Community</span>
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  ISLAMABAD
                </span>
              </div>
              <span className="text-xs text-slate-500 font-medium block">
                CS • SE • AI Student Portal
              </span>
            </div>
          </a>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <a href="#about" className="hover:text-blue-700 transition-colors">
              About
            </a>
            <a href="#departments" className="hover:text-blue-700 transition-colors">
              CS, SE & AI
            </a>
            <a href="#projects" className="hover:text-blue-700 transition-colors">
              Collab & Projects
            </a>
            {/* Jobs & Internships Tab */}
            <a
              href="#jobs"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Briefcase className="w-4 h-4 text-blue-600" />
              Jobs & Internships
            </a>
            <a href="#directory" className="hover:text-blue-700 transition-colors">
              Student Directory
            </a>
            <a href="#contact" className="hover:text-blue-700 transition-colors">
              Contact
            </a>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsJobModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-blue-700 bg-white border border-blue-300 hover:bg-blue-50 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Post Job / Internship
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all shadow-md shadow-blue-700/25"
            >
              <UserCheck className="w-4 h-4" /> Create Profile
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 bg-gradient-to-b from-blue-50/70 via-slate-50/50 to-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Campus Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 border border-blue-300 text-blue-800 text-xs font-bold mb-6">
              <GraduationCap className="w-4 h-4 text-blue-700" />
              Official Student Community • Islamabad Campus
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Connecting <span className="text-blue-700">CS, SE & AI</span> Students at FUUAST Islamabad
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              A student-driven platform designed to foster peer-to-peer collaboration, Final Year
              Project (FYP) team building, technical skill-sharing, and industry internship placements.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#directory"
                className="px-6 py-3 rounded-lg font-bold text-sm bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 transition-all flex items-center gap-2"
              >
                <Users className="w-4 h-4" /> Browse Student Directory
              </a>
              <a
                href="#jobs"
                className="px-6 py-3 rounded-lg font-bold text-sm bg-white hover:bg-slate-50 text-blue-800 border-2 border-blue-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-blue-700" /> Jobs & Internships Hub
              </a>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="px-6 py-3 rounded-lg font-bold text-sm bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4 text-blue-400" /> Join & Create Profile
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-700">3 Departments</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">CS, SE & AI Programs</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-700">100% Free</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Student-Run & Open</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-700">FYP & Projects</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Teammate Finder</div>
            </div>
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
              <div className="text-2xl sm:text-3xl font-black text-blue-700">Placements</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Twin Cities & Remote</div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            Academic Focus Areas
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Specialized Departments at FUUAST Islamabad
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Whether you are building full-stack applications, designing software architectures, or
            training neural models, there is a community track for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CS Card */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-4">
              <Laptop className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">BSCS</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Computer Science</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Core computing foundation, algorithms, data structures, database systems, distributed
              computing, and full-stack software development.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["C++", "Python", "Data Structures", "Next.js", "MySQL"].map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* SE Card */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-4">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-sky-700 tracking-wide uppercase">BSSE</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Software Engineering</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              System architecture, software design patterns, DevOps pipelines, quality assurance
              (SQA), enterprise applications, and Agile development.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Flutter", "TypeScript", "Docker", "SQA", "Git / CI/CD"].map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* AI Card */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-blue-400 hover:shadow-md transition-all">
            <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">BSAI</span>
            <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">Artificial Intelligence</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Machine learning, computer vision, natural language processing (NLP), data science, and
              building intelligent agent workflows.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["PyTorch", "TensorFlow", "FastAPI", "NLP", "Computer Vision"].map((s, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOBS & INTERNSHIPS SECTION */}
      <section id="jobs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/80 rounded-2xl border border-slate-200 my-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <Briefcase className="w-4 h-4 text-blue-700" /> Career & Internship Opportunities
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Jobs & Internships for FUUAST Students
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Curated openings in Islamabad, Rawalpindi, and remote companies for CS, SE, and AI
              students.
            </p>
          </div>

          <button
            onClick={() => setIsJobModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Upload New Job / Internship
          </button>
        </div>

        {/* Job Filters and Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search title, company, or city..."
              value={jobSearch}
              onChange={(e) => setJobSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Dept:
            </span>
            {["All", "CS", "SE", "AI"].map((dept) => (
              <button
                key={dept}
                onClick={() => setJobDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  jobDeptFilter === dept
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {dept}
              </button>
            ))}

            <span className="text-xs text-slate-500 font-semibold ml-2">Type:</span>
            {["All", "Internship", "Full-time"].map((type) => (
              <button
                key={type}
                onClick={() => setJobTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  jobTypeFilter === type
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Listing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length === 0 ? (
            <div className="col-span-2 text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500 text-sm">No job or internship matching your filter.</p>
              <button
                onClick={() => {
                  setJobDeptFilter("All");
                  setJobTypeFilter("All");
                  setJobSearch("");
                }}
                className="mt-2 text-xs font-bold text-blue-700 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                      {job.type}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {job.postedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 mb-3">
                    <span className="font-semibold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">
                      Stipend / Compensation
                    </span>
                    <span className="font-bold text-slate-800">{job.stipend}</span>
                  </div>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* STUDENT DIRECTORY & PROFILE CREATION SECTION */}
      <section id="directory" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              FUUAST Islamabad Roster
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Student Developers & Peer Directory
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Connect with fellow students across CS, SE, and AI for academic help, hackathons, and
              FYP collaboration.
            </p>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-md shadow-blue-700/20 transition-all self-start md:self-auto"
          >
            <UserCheck className="w-4 h-4" /> Create Student Profile
          </button>
        </div>

        {/* Directory Controls */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, roll no, or skill..."
              value={profileSearch}
              onChange={(e) => setProfileSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            {["All", "CS", "SE", "AI"].map((dept) => (
              <button
                key={dept}
                onClick={() => setProfileDeptFilter(dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  profileDeptFilter === dept
                    ? "bg-blue-700 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {dept === "All" ? "All Departments" : `BS${dept}`}
              </button>
            ))}
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((student) => (
            <div
              key={student.id}
              className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-full ${student.avatarBg} text-white flex items-center justify-center font-bold text-sm shadow-sm`}
                  >
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {student.name}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-blue-700">BS{student.department}</span>
                      <span>•</span>
                      <span>{student.semester}</span>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 mb-3 bg-slate-50 px-2 py-0.5 rounded inline-block">
                  {student.rollNo}
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                  {student.bio}
                </p>

                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Skills & Tech
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                {student.openToCollaborate ? (
                  <span className="text-emerald-700 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    Open to FYP / Projects
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px]">Member</span>
                )}

                <a
                  href={`mailto:${student.email}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" /> Connect
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLABORATION & PROJECTS SECTION */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/70 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
            Student Innovation
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Active Projects & FYP Collaborations
          </h2>
          <p className="mt-2 text-slate-600 text-sm">
            Discover what your peers at FUUAST Islamabad are creating and join teams looking for
            talent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {initialProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-100 text-blue-800">
                    {project.department}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                    {project.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Stack:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px]">Lead: </span>
                <span className="font-bold text-slate-800">{project.teamLead}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 sm:p-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-bold mb-2">
              <Mail className="w-4 h-4 text-blue-700" /> Get in Touch
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900">Contact Community Coordinators</h2>
            <p className="mt-2 text-slate-600 text-sm">
              Have questions regarding student profiles, FYP collaboration, posting job openings, or
              hosting an event? Send a message to the FUUAST Islamabad team.
            </p>
          </div>

          {contactSuccess ? (
            <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-blue-900">Thank you! Your message has been sent.</h3>
              <p className="text-sm text-blue-700 mt-1">
                A FUUAST Islamabad community coordinator will review your inquiry and respond to your
                email shortly.
              </p>
              <button
                onClick={() => setContactSuccess(false)}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Muhammad Ali"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@student.fuuast.edu.pk"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department / Affiliation
                  </label>
                  <select
                    value={contactForm.department}
                    onChange={(e) => setContactForm({ ...contactForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  >
                    <option value="CS">Computer Science (BSCS)</option>
                    <option value="SE">Software Engineering (BSSE)</option>
                    <option value="AI">Artificial Intelligence (BSAI)</option>
                    <option value="Alumni">FUUAST Alumni</option>
                    <option value="Recruiter">Recruiter / Industry Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FYP Partnership or Internship Query"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you or how would you like to collaborate with FUUAST students?"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 text-right">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 transition-all shadow-md shadow-blue-700/20"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
                <Code className="w-5 h-5" />
              </div>
              FUUAST Dev Community
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Federal Urdu University of Arts, Science and Technology, Islamabad Campus. Supporting CS,
              SE, and AI students in academics, projects, and career development.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Academic Tracks</h4>
            <ul className="space-y-2 text-[11px]">
              <li>BS Computer Science (BSCS)</li>
              <li>BS Software Engineering (BSSE)</li>
              <li>BS Artificial Intelligence (BSAI)</li>
              <li>Final Year Projects (FYP)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Portals & Links</h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#jobs" className="hover:text-white transition-colors">Jobs & Internships Hub</a></li>
              <li><a href="#directory" className="hover:text-white transition-colors">Student Developer Roster</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Project Collaboration</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Coordinators</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Hostinger Domain</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2">
              Configured for production deployment at:
            </p>
            <span className="font-mono text-blue-400 font-semibold block text-xs">
              https://fuuastdevcommunity.com
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 Federal Urdu University Islamabad Dev Community. Built for students by students.
          </div>
          <div>Islamabad Campus, Pakistan</div>
        </div>
      </footer>

      {/* MODAL: CREATE STUDENT PROFILE */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold mb-1">
                <UserCheck className="w-3.5 h-3.5" /> Student Profile Form
              </div>
              <h3 className="text-2xl font-black text-slate-900">Create Your Profile</h3>
              <p className="text-xs text-slate-500 mt-1">
                List yourself on the FUUAST Islamabad developer directory to connect with teammates
                and recruiters.
              </p>
            </div>

            {newProfileSuccess ? (
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 text-center my-4">
                <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-blue-900">Profile Created Successfully!</h4>
                <p className="text-xs text-blue-700 mt-1">Your card is now live on the student roster.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProfile} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asad Ullah"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FA22-BCS-088"
                      value={profileForm.rollNo}
                      onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Department *
                    </label>
                    <select
                      value={profileForm.department}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          department: e.target.value as "CS" | "SE" | "AI",
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="CS">BS Computer Science</option>
                      <option value="SE">BS Software Engineering</option>
                      <option value="AI">BS Artificial Intelligence</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                    <select
                      value={profileForm.semester}
                      onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@fuuast.edu.pk"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Skills / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, React, Python, C++, Docker"
                    value={profileForm.skills}
                    onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Short Bio & Collaboration Goals
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe your interests or what project teammates you are looking for..."
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                  >
                    Save & Publish Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD JOB OR INTERNSHIP */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 my-8 relative">
            <button
              onClick={() => setIsJobModalOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold mb-1">
                <Briefcase className="w-3.5 h-3.5" /> Career Portal
              </div>
              <h3 className="text-2xl font-black text-slate-900">Upload Job / Internship</h3>
              <p className="text-xs text-slate-500 mt-1">
                Share an internship, part-time, or full-time opportunity with students of FUUAST
                Islamabad.
              </p>
            </div>

            {newJobSuccess ? (
              <div className="p-6 rounded-xl bg-blue-50 border border-blue-200 text-center my-4">
                <CheckCircle2 className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h4 className="font-bold text-blue-900">Opportunity Uploaded Successfully!</h4>
                <p className="text-xs text-blue-700 mt-1">It is now visible on the Jobs & Internships board.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateJob} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Job / Internship Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Junior React Developer or AI Intern"
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company / Org *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DevTech Islamabad"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Islamabad / Remote"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                    <select
                      value={jobForm.type}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          type: e.target.value as "Internship" | "Full-time" | "Part-time" | "Remote",
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="Internship">Internship</option>
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Track</label>
                    <select
                      value={jobForm.department}
                      onChange={(e) =>
                        setJobForm({
                          ...jobForm,
                          department: e.target.value as "CS" | "SE" | "AI" | "All",
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                    >
                      <option value="All">All Students (CS, SE, AI)</option>
                      <option value="CS">Computer Science</option>
                      <option value="SE">Software Engineering</option>
                      <option value="AI">Artificial Intelligence</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stipend / Salary
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PKR 35,000 / month or Unpaid"
                    value={jobForm.stipend}
                    onChange={(e) => setJobForm({ ...jobForm, stipend: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Description & Requirements
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe role responsibilities, required skills, or semester eligibility..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Application Link or HR Email *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://company.com/apply or hr@company.pk"
                    value={jobForm.applyLink}
                    onChange={(e) => setJobForm({ ...jobForm, applyLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsJobModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm"
                  >
                    Publish Opportunity
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
