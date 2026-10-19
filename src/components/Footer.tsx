import React from "react";
import Link from "next/link";
import { Code, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-4 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Code className="w-4 h-4" />
            </div>
            FUUAST Dev Community
          </div>
          <p className="text-slate-400 leading-relaxed text-[11px]">
            Federal Urdu University of Arts, Science & Technology — Islamabad Campus.
            Connecting students across Computer Science, Software Engineering, and AI.
          </p>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Near Bahria Enclave, Islamabad, Pakistan</span>
          </div>
        </div>

        {/* Navigation Pages */}
        <div>
          <h4 className="text-white font-semibold text-xs mb-3">Pages</h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Community
              </Link>
            </li>
            <li>
              <Link href="/departments" className="hover:text-white transition-colors">
                Tracks & Skill Roadmaps
              </Link>
            </li>
            <li>
              <Link href="/jobs" className="hover:text-white transition-colors">
                Jobs & Internships
              </Link>
            </li>
            <li>
              <Link href="/students" className="hover:text-white transition-colors">
                Student Directory
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact Coordinators
              </Link>
            </li>
          </ul>
        </div>

        {/* Academic Departments */}
        <div>
          <h4 className="text-white font-semibold text-xs mb-3">Academic Tracks</h4>
          <ul className="space-y-2 text-[11px]">
            <li>BS Computer Science (BSCS)</li>
            <li>BS Software Engineering (BSSE)</li>
            <li>BS Artificial Intelligence (BSAI)</li>
            <li>Final Year Projects (FYP)</li>
            <li>Peer Mentorship & Study Circles</li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
        <div>
          © 2026 FUUAST Islamabad Developer Community.
        </div>
        <div className="text-slate-500">
          Built for CS, SE & AI Students • Federal Urdu University
        </div>
      </div>
    </footer>
  );
}
