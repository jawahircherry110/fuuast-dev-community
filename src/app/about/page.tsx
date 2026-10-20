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
  Sparkles,
  Rocket,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  Network,
  Compass,
  Building2,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "About | FUUAST Islamabad Dev Community",
  description:
    "Our mission and goals: empowering FUUAST CS, SE, and AI students by providing a collaborative platform to connect with developers and find career opportunities together.",
};

export default function AboutPage() {
  const goals = [
    {
      icon: Rocket,
      title: "Empower Every Student",
      badge: "Skill & Confidence",
      description: (
        <>
          We equip every student with practical peer mentorship and hands-on guidance so they can{" "}
          <span className="text-blue-600 font-semibold">master modern software engineering</span>, build production-grade projects, and graduate with complete confidence.
        </>
      ),
    },
    {
      icon: Network,
      title: "Connect With Developers",
      badge: "Peer Community",
      description: (
        <>
          We break down academic silos by providing a platform to{" "}
          <span className="text-blue-600 font-semibold">connect with other developers</span> across BSCS, BSSE, and BSAI for FYP teamwork, code reviews, and study circles.
        </>
      ),
    },
    {
      icon: Briefcase,
      title: "Find New Opportunities",
      badge: "Careers & Placements",
      description: (
        <>
          We bridge the gap between classrooms and tech companies, helping students discover{" "}
          <span className="text-blue-600 font-semibold">internships, software house roles</span>, and freelance opportunities to launch their tech careers.
        </>
      ),
    },
    {
      icon: TrendingUp,
      title: "Grow Together As One",
      badge: "Collective Growth",
      description: (
        <>
          When one student lands a job or wins a hackathon, our entire campus rises. We foster an inclusive ecosystem where{" "}
          <span className="text-blue-600 font-semibold">knowledge sharing and mutual growth</span> are prioritized.
        </>
      ),
    },
  ];

  const pillars = [
    {
      icon: HeartHandshake,
      title: "Peer-to-Peer Learning & Mentorship",
      tag: "Knowledge Sharing",
      desc: (
        <>
          Senior students and alumni mentor juniors in{" "}
          <span className="text-blue-600 font-semibold">programming fundamentals</span>, Data Structures, Algorithms, full-stack frameworks, and practical development workflows.
        </>
      ),
    },
    {
      icon: Target,
      title: "FYP & Project Teammates Matching",
      tag: "Collaboration",
      desc: (
        <>
          A dedicated matchmaking platform where CS, SE, and AI students find{" "}
          <span className="text-blue-600 font-semibold">complementary partners</span> to engineer impactful Final Year Projects, research papers, and startup prototypes.
        </>
      ),
    },
    {
      icon: Award,
      title: "Curated Placements & Internships",
      tag: "Career Launchpad",
      desc: (
        <>
          Bridging the gap to the Islamabad and Rawalpindi software industry by providing direct access to{" "}
          <span className="text-blue-600 font-semibold">verified internship openings</span>, alumni referrals, and hiring tech leads.
        </>
      ),
    },
    {
      icon: Code2,
      title: "Open Source & Portfolio Building",
      tag: "Engineering Proof",
      desc: (
        <>
          Encouraging students to build public GitHub repositories, contribute to open-source software, and create{" "}
          <span className="text-blue-600 font-semibold">verifiable developer portfolios</span> that stand out to top recruiters.
        </>
      ),
    },
  ];

  const values = [
    {
      title: "100% Student-Centric",
      desc: "Built by students, for students. Completely free, open, and dedicated to academic, technical, and professional success.",
    },
    {
      title: "Cross-Disciplinary Strength",
      desc: "Uniting BSCS theory, BSSE software architecture, and BSAI intelligent systems into a cohesive campus tech ecosystem.",
    },
    {
      title: "Verified Student Directory",
      desc: "Admin-verified profiles ensure authentic student credentials, genuine skill tags, and trusted peer-to-peer networking.",
    },
    {
      title: "Real-World Outcome Driven",
      desc: "Focusing on tangible results: working applications, clean GitHub repositories, industry certifications, and early career placements.",
    },
  ];

  return (
    <div className="py-12 bg-white">
      {/* Page Header / Hero */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-16">
        <div className="flex justify-center mb-5">
          <img
            src="/logo.png"
            alt="FUUAST Dev Community Logo"
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
          <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
          <span>FUUAST Islamabad • Academic Developer Community</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.18]">
          Our Mission: <span className="text-blue-600">Empowering Students</span>, Connecting Developers &{" "}
          <span className="text-blue-600">Growing Together</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Federal Urdu University of Arts, Science and Technology (FUUAST) Islamabad is home to brilliant minds in{" "}
          <span className="text-blue-600 font-semibold">Computer Science, Software Engineering, and AI</span>.
          Our community was founded with a clear purpose: to{" "}
          <span className="text-blue-600 font-semibold">empower every student</span> by providing a collaborative platform to{" "}
          <span className="text-blue-600 font-semibold">connect with other developers</span> and discover{" "}
          <span className="text-blue-600 font-semibold">new career opportunities</span> to learn, build, and excel together.
        </p>
      </div>

      {/* Metrics Bar */}
      <section className="py-8 bg-slate-50/70 border-y border-slate-100 mb-16">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">3 Degrees</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">BSCS, BSSE & BSAI</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">100% Peer-Led</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">By Students, For Students</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">Verified Roster</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Admin-Approved Profiles</div>
          </div>
          <div className="p-3">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">Islamabad Campus</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-0.5">Near Bahria Enclave</div>
          </div>
        </div>
      </section>

      {/* Primary Goals Section */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-100/70 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" /> What We Are Set Out To Do
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Our Core Goals: <span className="text-blue-600">Empower, Connect & Accelerate</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
            Everything we build is designed to create a thriving academic ecosystem where students help students succeed in the technology world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((goal, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <goal.icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                    {goal.badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{goal.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{goal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Strategic Pillars */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">
            Academic & Practical Pillars
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How We Support <span className="text-blue-600">FUUAST Students</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-2">
            A comprehensive support system spanning your first semester through graduation and career launch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  {pillar.tag}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">{pillar.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Campus & Department Overview */}
      <section className="max-w-5xl mx-auto px-4 mb-20">
        <div className="p-8 sm:p-10 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600 tracking-wider">
              Department of Computer Science & IT
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 mb-3 tracking-tight">
              Islamabad Campus Tech Ecosystem
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-3">
              Established under the federal charter, <span className="text-blue-600 font-semibold">FUUAST Islamabad</span> offers rigorous four-year BS degrees in Computer Science (BSCS), Software Engineering (BSSE), and Artificial Intelligence (BSAI).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              The Dev Community serves as the official student-driven technical hub—enabling peer code reviews, shared lecture insights, hackathons, and direct access to alumni working at leading tech enterprises.
            </p>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-200/70">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Federal Urdu University, Near Bahria Enclave, Islamabad, Pakistan</span>
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">What We Stand For</h3>
            <ul className="space-y-3.5 text-sm text-slate-600">
              {values.map((v, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-800">{v.title}:</strong> {v.desc}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Community CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-indigo-50 border border-blue-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Be Part of the <span className="text-blue-600">FUUAST Developer Network</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto mt-2 mb-6 leading-relaxed">
            Register your profile on the community roster to make yourself visible to FYP teammates, project leads, alumni, and recruiters.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/students"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" /> Join Student Directory
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              Contact Community Team <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
