"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Users,
  ArrowRight,
  Laptop,
  Layers,
  Cpu,
  Building2,
  MapPin,
  ExternalLink,
  BookOpen,
  Sparkles,
  MessageSquareCode,
} from "lucide-react";
import { JobOpportunity } from "@/data/initialData";
import HeroCodeBlock from "@/components/HeroCodeBlock";

export default function Home() {
  const [featuredJobs, setFeaturedJobs] = useState<JobOpportunity[]>([]);

  useEffect(() => {
    fetch("/api/jobs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.jobs)) {
          setFeaturedJobs(data.jobs.slice(0, 4));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:py-20 bg-gradient-to-b from-blue-50/50 via-white to-white border-b border-slate-100 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-6 text-left space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>FUUAST Islamabad • Near Bahria Enclave</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Connecting <span className="text-blue-600">CS, SE & AI</span> Students for Collaboration & Careers
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                The official academic and peer community for Computer Science, Software Engineering,
                and Artificial Intelligence students at FUUAST Islamabad. Connect with verified peers,
                master roadmap.sh-aligned skills, find FYP teammates, and discover internships.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/feed"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5"
                >
                  <MessageSquareCode className="w-3.5 h-3.5" /> Dev Lounge
                </Link>
                <Link
                  href="/students"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" /> Explore Students
                </Link>
                <Link
                  href="/departments"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Tracks & Roadmaps
                </Link>
              </div>

              {/* Highlights Row */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>3 Specialized Tracks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Verified Profiles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Campus Dev Lounge</span>
                </div>
              </div>
            </div>

            {/* Right Column: Code Function Window */}
            <div className="lg:col-span-6 w-full">
              <HeroCodeBlock />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Metrics Bar */}
      <section className="py-8 bg-slate-50/60 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">3 Tracks</div>
            <div className="text-xs text-slate-500 mt-0.5">BSCS, BSSE & BSAI</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">Islamabad</div>
            <div className="text-xs text-slate-500 mt-0.5">Federal Urdu University</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">FYP & Teams</div>
            <div className="text-xs text-slate-500 mt-0.5">Peer Collaboration</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-semibold text-blue-600">Placements</div>
            <div className="text-xs text-slate-500 mt-0.5">Internship Hub</div>
          </div>
        </div>
      </section>

      {/* Academic Departments Overview */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              Academic Tracks
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Specialized Programs at FUUAST Islamabad
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1 max-w-xl">
              Fostering excellence across systems programming, software craftsmanship, and intelligent models.
            </p>
          </div>
          <Link
            href="/departments"
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            Explore all curriculums <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* CS */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Laptop className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wide">BSCS</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">Computer Science</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Core theory, advanced algorithms, distributed computing, database internals, and full-stack development.
              </p>
            </div>
            <Link
              href="/departments#cs"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Learn more about BSCS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* SE */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-sky-600 uppercase tracking-wide">BSSE</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">Software Engineering</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Architecture, design patterns, testing & SQA, CI/CD, mobile application engineering, and team methodologies.
              </p>
            </div>
            <Link
              href="/departments#se"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Learn more about BSSE <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* AI */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wide">BSAI</span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 mb-2">Artificial Intelligence</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Neural networks, machine learning, computer vision, natural language processing, and data science workflows.
              </p>
            </div>
            <Link
              href="/departments#ai"
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Learn more about BSAI <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section Preview */}
      <section className="py-16 bg-slate-50/60 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100/70 text-blue-700 text-xs font-semibold mb-2">
                <Briefcase className="w-3.5 h-3.5" /> Recent Openings
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Jobs & Internships for FUUAST Students
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-1">
                Opportunities in Islamabad, Rawalpindi, and remote teams.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors self-start sm:self-auto"
            >
              View All Opportunities <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredJobs.length === 0 ? (
              <div className="col-span-2 text-center py-8 bg-white rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm">No active opportunities currently listed.</p>
              </div>
            ) : (
              featuredJobs.map((job) => (
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

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 mt-1 mb-2.5">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-semibold text-slate-700">{job.stipend}</span>
                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Apply <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>

      {/* Community CTA Banner */}
      <section className="py-16 max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Ready to Connect with Fellow FUUAST Developers?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Create your student profile in less than two minutes. Connect with peers from your semester,
            find FYP teammates, and showcase your skills to alumni and recruiters.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/feed"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <MessageSquareCode className="w-4 h-4" /> Campus Dev Lounge
            </Link>
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Student Directory
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Contact Community Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
