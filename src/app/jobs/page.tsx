"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  ExternalLink,
  Mail,
  GraduationCap,
} from "lucide-react";
import { initialJobs, JobOpportunity } from "@/data/initialData";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState<string>("All");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/jobs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesDept = deptFilter === "All" || j.department === "All" || j.department === deptFilter;
    const matchesType = typeFilter === "All" || j.type === typeFilter;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesType && matchesSearch;
  });

  return (
    <div className="py-12 bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-3">
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          Career Hub
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Jobs & Internships for FUUAST Students
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Curated opportunities in Islamabad, Rawalpindi, and remote software houses specifically tailored
          for Computer Science, Software Engineering, and AI students.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {/* Controls Bar */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by role, company, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" /> Track:
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
                {d === "All" ? "All Tracks" : `BS${d}`}
              </button>
            ))}

            <span className="text-xs text-slate-400 font-medium ml-2">Type:</span>
            {["All", "Internship", "Full-time"].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  typeFilter === t
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {filtered.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
              <p className="text-slate-500 text-xs">No opportunities found matching your criteria.</p>
              <button
                onClick={() => {
                  setDeptFilter("All");
                  setTypeFilter("All");
                  setSearchQuery("");
                }}
                className="mt-2 text-xs font-medium text-blue-600 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map((job) => (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      {job.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{job.postedDate}</span>
                  </div>

                  <h2 className="text-sm font-semibold text-slate-900 leading-snug">{job.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 mb-3">
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
                    <span className="font-semibold text-slate-800">{job.stipend}</span>
                  </div>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Apply Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Employer notice card */}
        <div className="p-6 rounded-xl border border-slate-200 bg-slate-50 text-center text-xs text-slate-600">
          <p className="font-medium text-slate-900 mb-1">
            Are you a recruiter, tech lead, or FUUAST alumnus looking to hire?
          </p>
          <p className="text-slate-500 mb-3">
            Send your internship or job opening details to the community coordinators to get it featured.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-white text-blue-700 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-blue-600" /> Contact to Post an Opening
          </Link>
        </div>
      </div>
    </div>
  );
}
