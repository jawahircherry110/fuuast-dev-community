"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  roadmapsData,
  TrackRoadmap,
  RoadmapMilestone,
  RoadmapNode,
} from "@/data/roadmapsData";
import {
  CheckCircle2,
  Circle,
  BookOpen,
  ExternalLink,
  Sparkles,
  Cpu,
  Laptop,
  Layers,
  Search,
  RotateCcw,
  Code2,
  Terminal,
  X,
  ChevronRight,
  GraduationCap,
  Flame,
  ShieldCheck,
  Briefcase,
  Clock,
  ArrowRight,
  MapPin,
  Check,
  Share2,
} from "lucide-react";

export default function InteractiveRoadmap() {
  const [activeTrackId, setActiveTrackId] = useState<"ai" | "cs" | "se">("ai");
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>("all");
  const [completedSkills, setCompletedSkills] = useState<Record<string, boolean>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fuuast_completed_skills");
      if (saved) {
        setCompletedSkills(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save progress to localStorage
  const toggleSkillCompleted = (nodeId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCompletedSkills((prev) => {
      const next = { ...prev, [nodeId]: !prev[nodeId] };
      try {
        localStorage.setItem("fuuast_completed_skills", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleResetProgress = () => {
    if (confirm("Are you sure you want to reset your checked skills for all roadmaps?")) {
      setCompletedSkills({});
      try {
        localStorage.removeItem("fuuast_completed_skills");
      } catch {}
    }
  };

  const currentTrack: TrackRoadmap = roadmapsData[activeTrackId];

  // Calculate statistics for the active track
  const allCurrentNodes = useMemo(() => {
    const list: RoadmapNode[] = [];
    currentTrack.milestones.forEach((m) => {
      m.nodes.forEach((n) => list.push(n));
    });
    return list;
  }, [currentTrack]);

  const totalSkillsCount = allCurrentNodes.length;
  const completedSkillsCount = allCurrentNodes.filter((n) => completedSkills[n.id]).length;
  const progressPercent = totalSkillsCount > 0 ? Math.round((completedSkillsCount / totalSkillsCount) * 100) : 0;

  // Filter milestones and nodes based on search and tag filter
  const filteredMilestones = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return currentTrack.milestones
      .map((milestone) => {
        const matchingNodes = milestone.nodes.filter((node) => {
          const matchesTag =
            selectedTagFilter === "all" ||
            (selectedTagFilter === "completed" && completedSkills[node.id]) ||
            (selectedTagFilter === "uncompleted" && !completedSkills[node.id]) ||
            node.tag === selectedTagFilter;

          const matchesQuery =
            !query ||
            node.title.toLowerCase().includes(query) ||
            node.description.toLowerCase().includes(query) ||
            node.tools.some((t) => t.toLowerCase().includes(query)) ||
            (node.fuuastCourse && node.fuuastCourse.toLowerCase().includes(query));

          return matchesTag && matchesQuery;
        });

        return {
          ...milestone,
          nodes: matchingNodes,
        };
      })
      .filter((m) => m.nodes.length > 0);
  }, [currentTrack, searchQuery, selectedTagFilter, completedSkills]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    }
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      {/* Top Breadcrumb & Badge */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              FUUAST Academic & Industry Skill Roadmaps
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Developer & AI Roadmaps for Students
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
              Modeled after the industry-standard{" "}
              <a
                href="https://roadmap.sh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-medium underline underline-offset-2 hover:text-blue-700 inline-flex items-center gap-0.5"
              >
                roadmap.sh
                <ExternalLink className="w-3 h-3" />
              </a>{" "}
              framework, tailored to FUUAST BSCS, BSAI, and BSSE degree curricula.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
            >
              {copiedNotification ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  Share Roadmap
                </>
              )}
            </button>
            <a
              href="https://roadmap.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 shadow-2xs transition-colors"
            >
              roadmap.sh <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* ========================================================
            TRACK SWITCHER TABS (AI, CS, SE)
        ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-6">
          {/* AI Track */}
          <button
            onClick={() => {
              setActiveTrackId("ai");
              setSearchQuery("");
            }}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              activeTrackId === "ai"
                ? "bg-white border-indigo-500 shadow-md ring-2 ring-indigo-500/10"
                : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeTrackId === "ai"
                    ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                BSAI
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">AI Engineer Roadmap</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              LLMs, Prompt Engineering, RAG & Vector DBs, Agents, Fine-Tuning & MLOps.
            </p>
          </button>

          {/* CS Track */}
          <button
            onClick={() => {
              setActiveTrackId("cs");
              setSearchQuery("");
            }}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              activeTrackId === "cs"
                ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10"
                : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Laptop className="w-5 h-5" />
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeTrackId === "cs"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                BSCS
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Computer Science Roadmap</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              DSA, Memory, Operating Systems, Networking, Database Internals, System Design.
            </p>
          </button>

          {/* SE Track */}
          <button
            onClick={() => {
              setActiveTrackId("se");
              setSearchQuery("");
            }}
            className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
              activeTrackId === "se"
                ? "bg-white border-sky-500 shadow-md ring-2 ring-sky-500/10"
                : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activeTrackId === "se"
                    ? "bg-sky-100 text-sky-800 border border-sky-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                BSSE
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Software Engineering Roadmap</h3>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
              Clean Architecture, Full-Stack Development, SQA Testing, Docker, CI/CD & DevOps.
            </p>
          </button>
        </div>

        {/* ========================================================
            TRACK OVERVIEW & PROGRESS BAR BANNER
        ======================================================== */}
        <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
                  {currentTrack.badge}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentTrack.curriculumCode}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {currentTrack.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {currentTrack.roleDescription}
              </p>
            </div>

            {/* Progress Meter */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl min-w-[260px] shrink-0">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Your Progress
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {completedSkillsCount} / {totalSkillsCount} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                <span>Check off topics as you learn</span>
                {completedSkillsCount > 0 && (
                  <button
                    onClick={handleResetProgress}
                    className="text-rose-600 hover:underline flex items-center gap-0.5"
                    title="Reset all progress"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Search & Tag Filter Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search skills, e.g. 'RAG', 'Docker', 'DSA', 'PyTorch', 'SQL'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] text-slate-400 mr-1 font-medium">Filter:</span>
              <button
                onClick={() => setSelectedTagFilter("all")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTagFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Skills
              </button>
              <button
                onClick={() => setSelectedTagFilter("core")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTagFilter === "core"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
                }`}
              >
                ● Core (Must Learn)
              </button>
              <button
                onClick={() => setSelectedTagFilter("recommended")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTagFilter === "recommended"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                ▲ Recommended
              </button>
              <button
                onClick={() => setSelectedTagFilter("completed")}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  selectedTagFilter === "completed"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                ✓ Completed ({completedSkillsCount})
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            ROADMAP.SH STYLE VISUAL FLOWCHART / MILESTONES
        ======================================================== */}
        <div className="mt-10 relative">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-8 top-10 bottom-10 w-0.5 bg-slate-300 z-0" />

          {filteredMilestones.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200">
              <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-800 text-sm">No skills found matching your search</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try searching for a different keyword or resetting your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTagFilter("all");
                }}
                className="mt-4 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredMilestones.map((milestone) => (
                <div key={milestone.id} className="relative z-10">
                  {/* Milestone Header Box */}
                  <div className="flex items-start md:items-center gap-3.5 mb-5">
                    <div className="w-16 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      Step {milestone.stepNumber}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                        {milestone.title}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                          {milestone.category}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{milestone.subtitle}</p>
                    </div>
                  </div>

                  {/* Nodes Grid (Roadmap Flow Blocks) */}
                  <div className="md:ml-20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {milestone.nodes.map((node) => {
                      const isDone = Boolean(completedSkills[node.id]);

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition-all hover:shadow-md relative group ${
                            isDone
                              ? "bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400/40"
                              : "bg-white border-slate-200 hover:border-blue-400"
                          }`}
                        >
                          {/* Top Row: Tag & Checkbox */}
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                node.tag === "core"
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : node.tag === "recommended"
                                  ? "bg-amber-100 text-amber-800 border border-amber-200"
                                  : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              }`}
                            >
                              {node.tag === "core" ? "● Must Learn" : "▲ Recommended"}
                            </span>

                            <button
                              onClick={(e) => toggleSkillCompleted(node.id, e)}
                              className={`p-1 rounded-md transition-colors ${
                                isDone
                                  ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                                  : "text-slate-300 hover:text-slate-500 hover:bg-slate-100"
                              }`}
                              title={isDone ? "Mark as uncompleted" : "Mark as completed"}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-5 h-5 fill-emerald-100" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                          </div>

                          {/* Node Title */}
                          <h4
                            className={`font-semibold text-sm transition-colors group-hover:text-blue-600 ${
                              isDone ? "text-emerald-950 font-bold" : "text-slate-900"
                            }`}
                          >
                            {node.title}
                          </h4>

                          <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                            {node.description}
                          </p>

                          {/* Tools Badges */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {node.tools.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                              >
                                {t}
                              </span>
                            ))}
                            {node.tools.length > 3 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                                +{node.tools.length - 3} more
                              </span>
                            )}
                          </div>

                          {/* Footer info: Semester / FUUAST Course */}
                          {node.fuuastCourse && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span className="flex items-center gap-1 text-slate-600 truncate max-w-[200px]">
                                <GraduationCap className="w-3 h-3 text-blue-600 shrink-0" />
                                {node.fuuastCourse}
                              </span>
                              <span className="text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
                                Explore <ChevronRight className="w-3 h-3" />
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================
            FUUAST ACADEMIC COURSE CORRELATION GUIDE
        ======================================================== */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <GraduationCap className="w-3.5 h-3.5" /> University Final Year Project (FYP) Readiness
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">
                Connect Your Roadmap Skills with FUUAST Degree Courses
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Completing these milestone skills directly prepares you for semester labs, theoretical examinations,
                and high-impact Final Year Projects (FYP-I & FYP-II) evaluated by HEC and industry jury panels.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/students"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-colors text-center shadow-md flex items-center justify-center gap-1.5"
              >
                Find FYP Partners <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/jobs"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 transition-colors text-center border border-white/20"
              >
                Browse Matching Internships
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          DETAILED TOPIC DRAWER / MODAL (CLICK ON NODE)
      ======================================================== */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-5 sm:p-6 my-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Close details"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    selectedNode.tag === "core"
                      ? "bg-emerald-100 text-emerald-800"
                      : selectedNode.tag === "recommended"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {selectedNode.tag === "core" ? "Core Milestone" : "Recommended Skill"}
                </span>
                {selectedNode.semester && (
                  <span className="text-[11px] font-medium text-slate-500">
                    {selectedNode.semester}
                  </span>
                )}
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {selectedNode.description}
              </p>
            </div>

            {/* Completion Toggle */}
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                {completedSkills[selectedNode.id] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-medium text-slate-800">
                  {completedSkills[selectedNode.id] ? "Completed & Mastered" : "Not yet checked off"}
                </span>
              </div>
              <button
                onClick={() => toggleSkillCompleted(selectedNode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  completedSkills[selectedNode.id]
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 shadow-2xs"
                }`}
              >
                {completedSkills[selectedNode.id] ? "Mark as Incomplete" : "Mark as Completed"}
              </button>
            </div>

            {/* In-depth details */}
            <div className="mt-5 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Deep-Dive Overview
                </h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedNode.details}
                </p>
              </div>

              {/* Tools & Frameworks */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs">
                  <Code2 className="w-3.5 h-3.5 text-blue-600" /> Key Libraries, Tools & Frameworks
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Academic Course Alignment */}
              {selectedNode.fuuastCourse && (
                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-1.5 text-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-700" /> FUUAST Course Alignment
                  </h4>
                  <p className="text-amber-800 mt-0.5 text-xs">
                    {selectedNode.fuuastCourse} ({selectedNode.semester || "Undergraduate Curriculum"})
                  </p>
                </div>
              )}

              {/* Practice Project Idea */}
              {selectedNode.projectIdea && (
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200/80">
                  <h4 className="font-semibold text-indigo-900 flex items-center gap-1.5 text-xs">
                    <Flame className="w-3.5 h-3.5 text-indigo-600" /> Hands-On Project Idea
                  </h4>
                  <p className="text-indigo-800 mt-0.5 text-xs leading-relaxed">
                    {selectedNode.projectIdea}
                  </p>
                </div>
              )}

              {/* Curated Resources */}
              {selectedNode.resources && selectedNode.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1.5 flex items-center gap-1.5 text-xs">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Free Learning Docs & Tutorials
                  </h4>
                  <div className="space-y-1.5">
                    {selectedNode.resources.map((res, i) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 flex items-center justify-between text-xs transition-colors group"
                      >
                        <span className="font-medium text-slate-800 group-hover:text-blue-700">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700">
                          {res.type}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                FUUAST Developer Community
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
