import React from "react";
import {
  Code2,
  Terminal,
  Sparkles,
  Users,
  Calendar,
  Rocket,
  Globe,
  ArrowRight,
  Cpu,
  Shield,
  Layers,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function Home() {
  const domains = [
    {
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      title: "Full-Stack Web & Mobile",
      desc: "Building modern responsive web applications and mobile apps using Next.js, React, React Native, and Node.js.",
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: "AI & Data Science",
      desc: "Exploring machine learning models, LLMs, computer vision, and data pipelines to solve real-world problems.",
    },
    {
      icon: <Shield className="w-6 h-6 text-amber-400" />,
      title: "Cybersecurity & Networks",
      desc: "Hands-on workshops in network security, ethical hacking, secure coding standards, and vulnerability assessment.",
    },
    {
      icon: <Terminal className="w-6 h-6 text-sky-400" />,
      title: "Open Source & DevOps",
      desc: "Mastering Git, CI/CD pipelines, Docker, Linux, and contributing to high-impact open source repositories.",
    },
  ];

  const highlights = [
    { number: "500+", label: "Active Student Devs" },
    { number: "25+", label: "Tech Workshops" },
    { number: "15+", label: "Open Source Projects" },
    { number: "100%", label: "Student Led & Free" },
  ];

  const upcomingEvents = [
    {
      badge: "Workshop",
      title: "Full-Stack Next.js 15 & AI Engineering",
      date: "Saturday, 4:00 PM PKT",
      location: "FUUAST CS Lab & Online Stream",
      description: "Build, deploy, and scale modern web apps with Server Components, AI APIs, and cloud hosting.",
    },
    {
      badge: "Hackathon",
      title: "FUUAST HackFest 2026",
      date: "Coming Soon",
      location: "Main Auditorium & Virtual",
      description: "A 48-hour collaborative buildathon bringing students together to solve university and community challenges.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Glow gradient background effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-indigo-600/20 via-sky-500/20 to-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[350px] bg-purple-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/25">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white block leading-none">
                FUUAST <span className="text-indigo-400">Dev Community</span>
              </span>
              <span className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                fuuastdevcommunity.com
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#domains" className="hover:text-white transition-colors">
              Domains
            </a>
            <a href="#events" className="hover:text-white transition-colors">
              Events
            </a>
            <a href="#community" className="hover:text-white transition-colors">
              Join Us
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="#community"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              Join Community <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            Federal Urdu University of Arts, Science & Technology
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.15]">
            Empowering Future{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Developers & Innovators
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed">
            The official student-led developer ecosystem at FUUAST. We connect passionate coders,
            host hands-on hackathons, collaborate on open-source, and help you launch your tech career.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#community"
              className="px-6 py-3.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <Rocket className="w-5 h-5" /> Become a Member
            </a>
            <a
              href="#events"
              className="px-6 py-3.5 rounded-xl font-semibold border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 text-slate-200 transition-all flex items-center gap-2"
            >
              <Calendar className="w-5 h-5 text-indigo-400" /> View Upcoming Events
            </a>
          </div>

          {/* Terminal / Code Card */}
          <div className="mt-14 w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden text-left backdrop-blur-sm">
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">fuuast-dev-community ~ bash</span>
              </div>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live on Hostinger
              </span>
            </div>
            <div className="p-5 font-mono text-xs sm:text-sm text-slate-300 space-y-2">
              <p className="text-slate-500"># Welcome to Federal Urdu University Developer Community</p>
              <p>
                <span className="text-indigo-400">$</span> npx fuuast-dev init --university="FUUAST"
              </p>
              <p className="text-emerald-400">
                ✔ Community loaded: Federal Urdu University of Arts, Science and Technology
              </p>
              <p className="text-sky-300">
                ℹ Domain: https://fuuastdevcommunity.com
              </p>
              <p className="text-slate-400">
                Ready to build, learn, and collaborate with student innovators across campuses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-12 border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {highlights.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-sky-300">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm text-slate-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Domains / Tracks Section */}
      <section id="domains" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-xs uppercase tracking-widest font-bold text-indigo-400 mb-2">Technical Tracks</h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Explore What We Build
          </h3>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            From modern web apps to deep learning algorithms, our working groups cover every major sector in software engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domains.map((track, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {track.icon}
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">{track.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{track.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900/30 rounded-3xl border border-slate-800/80 my-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-sky-400 mb-2">Upcoming Activities</h2>
          <h3 className="text-3xl font-bold text-white">Workshops, Hackathons & Meetups</h3>
          <p className="mt-2 text-slate-400 text-sm">
            Learn directly from senior peers, industry engineers, and guest tech speakers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcomingEvents.map((evt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-800 bg-slate-950/80 flex flex-col justify-between"
            >
              <div>
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
                  {evt.badge}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{evt.title}</h4>
                <p className="text-slate-400 text-sm mb-4 leading-relaxed">{evt.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> {evt.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" /> {evt.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action / Join */}
      <section id="community" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-900 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Build With Us?
          </h2>
          <p className="mt-4 text-slate-300 max-w-xl mx-auto text-base sm:text-lg">
            Join the official FUUAST Developer Community on WhatsApp, Discord, and GitHub. No prior experience required—just curiosity.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://chat.whatsapp.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
            >
              <Users className="w-5 h-5" /> Join WhatsApp Group
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <ExternalLink className="w-5 h-5" /> Join Discord Server
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© 2026 FUUAST Developer Community. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
            <span>for students of Federal Urdu University (fuuastdevcommunity.com)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
