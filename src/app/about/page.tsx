import React from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Target,
  BookOpen,
  Code2,
  HeartHandshake,
  Award,
  CheckCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "About | FUUAST Islamabad Dev Community",
  description: "Learn about the mission, values, and community behind the FUUAST Islamabad Computer Science, Software Engineering, and AI developer portal.",
};

export default function AboutPage() {
  const pillars = [
    {
      icon: HeartHandshake,
      title: "Peer-to-Peer Learning",
      desc: "Senior students mentoring juniors in programming languages, data structures, algorithms, and practical development skills.",
    },
    {
      icon: Target,
      title: "FYP & Project Teammates",
      desc: "A matchmaking ground where CS, SE, and AI students find complementary teammates to build impactful Final Year Projects.",
    },
    {
      icon: Award,
      title: "Placements & Internships",
      desc: "Bridging the gap between university classrooms and software houses across Islamabad, Rawalpindi, and global remote companies.",
    },
    {
      icon: Code2,
      title: "Open Source Collaboration",
      desc: "Encouraging students to build public repositories, contribute to community projects, and build verifiable engineering portfolios.",
    },
  ];

  return (
    <div className="py-12 bg-white">
      {/* Page Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          About Our Community
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Empowering the Next Generation of Tech Leaders at FUUAST Islamabad
        </h1>
        <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Federal Urdu University of Arts, Science and Technology (FUUAST) Islamabad is home to hundreds
          of passionate students across Computer Science, Software Engineering, and Artificial Intelligence.
          This community was founded to help us build, learn, and grow together.
        </p>
      </div>

      {/* Campus & Department Overview */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">
              Department of CS & IT
            </span>
            <h2 className="text-xl font-semibold text-slate-900 mt-1 mb-3">
              Islamabad Campus Tech Ecosystem
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Established under the federal charter, FUUAST Islamabad offers rigorous four-year BS degrees
              in Computer Science (BSCS), Software Engineering (BSSE), and Artificial Intelligence (BSAI).
            </p>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              The Dev Community serves as the unofficial, student-driven technical hub—enabling peer review,
              shared notes, collaborative hackathons, and direct access to alumni working at leading tech firms.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Near Bahria Enclave, Islamabad, Pakistan</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">What We Stand For</h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>100% Student-Centric:</strong> Free and open to every enrolled student and alumnus.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Cross-Disciplinary:</strong> Bridging the gap between CS fundamentals, SE rigor, and AI innovation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Career Readiness:</strong> Real-world portfolios, CV reviews, and verified internship listings.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Community Pillars */}
      <section className="max-w-5xl mx-auto px-4 mb-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Our Core Pillars</h2>
          <p className="text-slate-500 text-xs mt-1">
            How we support FUUAST students throughout their four-year university journey.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <pillar.icon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1.5">{pillar.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Get Involved CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-200">
          <h2 className="text-xl font-semibold text-slate-900">Be Part of the FUUAST Dev Network</h2>
          <p className="text-xs text-slate-600 max-w-lg mx-auto mt-1 mb-5">
            Register your profile on the community roster to make yourself visible to project leads and recruiters.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
            >
              Join the Student Directory
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              Contact Community Leads
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
