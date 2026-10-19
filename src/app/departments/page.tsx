import React from "react";
import Link from "next/link";
import {
  Laptop,
  Layers,
  Cpu,
  BookOpen,
  Briefcase,
  Users,
  Code,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "CS, SE & AI Tracks | FUUAST Islamabad Dev Community",
  description: "Explore the academic programs and career pathways for BS Computer Science, BS Software Engineering, and BS Artificial Intelligence at FUUAST Islamabad.",
};

export default function DepartmentsPage() {
  const departments = [
    {
      id: "cs",
      tag: "BSCS",
      name: "Computer Science",
      icon: Laptop,
      color: "blue",
      lead: "Theoretical computing foundations, robust algorithms, distributed systems, and low-level system design.",
      coreSubjects: [
        "Data Structures & Algorithms (DSA)",
        "Database Systems & Query Optimization",
        "Operating Systems & Linux Architecture",
        "Computer Networks & Distributed Systems",
        "Web & Cloud Technologies",
      ],
      techStack: ["C++", "Python", "Java", "Next.js", "PostgreSQL", "Docker", "Linux"],
      fypIdeas: [
        "Distributed High-Throughput Cache System",
        "Decentralized Academic Credential Verification",
        "Automated University Timetable Scheduling System",
      ],
      careerPaths: ["Full-Stack Engineer", "Backend Developer", "Systems Architect", "Database Administrator"],
    },
    {
      id: "se",
      tag: "BSSE",
      name: "Software Engineering",
      icon: Layers,
      color: "sky",
      lead: "Rigorous software life-cycle processes, design patterns, quality assurance, DevOps, and scalable enterprise applications.",
      coreSubjects: [
        "Software Requirements Engineering",
        "Software Architecture & Design Patterns",
        "Software Quality Assurance (SQA) & Automated Testing",
        "DevOps & Continuous Integration / Deployment (CI/CD)",
        "Mobile Application Development",
      ],
      techStack: ["Flutter", "TypeScript", "React Native", "Docker", "Selenium", "Postman", "Git"],
      fypIdeas: [
        "Enterprise Resource Planning (ERP) for Universities",
        "Cross-Platform Real-time Healthcare Consultation App",
        "Automated Security & Code Linting CI/CD Pipeline",
      ],
      careerPaths: ["Software Engineer", "SQA Automation Engineer", "Mobile App Developer", "DevOps Engineer"],
    },
    {
      id: "ai",
      tag: "BSAI",
      name: "Artificial Intelligence",
      icon: Cpu,
      color: "indigo",
      lead: "Data science, predictive modeling, deep neural networks, computer vision, and Urdu language NLP models.",
      coreSubjects: [
        "Artificial Intelligence & Search Algorithms",
        "Machine Learning & Statistical Data Analysis",
        "Deep Learning & Convolutional Neural Networks",
        "Natural Language Processing (NLP) & LLMs",
        "Computer Vision & Pattern Recognition",
      ],
      techStack: ["Python", "PyTorch", "TensorFlow", "FastAPI", "OpenCV", "Scikit-Learn", "HuggingFace"],
      fypIdeas: [
        "Urdu Speech-to-Text Clinical Transcription Model",
        "Real-Time Automated Exam Proctoring via Computer Vision",
        "LLM-Powered University Knowledge & Advising Chatbot",
      ],
      careerPaths: ["AI / ML Engineer", "Data Scientist", "NLP Specialist", "Computer Vision Engineer"],
    },
  ];

  return (
    <div className="py-12 bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-14">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 block">
          Academic Specializations
        </span>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Computer Science, Software Engineering & AI at FUUAST Islamabad
        </h1>
        <p className="mt-3 text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Deep-dive into the curriculum, industry tech stacks, Final Year Project (FYP) domains, and
          career trajectories for each computing department.
        </p>
      </div>

      {/* Departments Detail Sections */}
      <div className="max-w-5xl mx-auto px-4 space-y-12">
        {departments.map((dept) => (
          <section
            key={dept.id}
            id={dept.id}
            className="p-8 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <dept.icon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                    {dept.tag}
                  </span>
                  <h2 className="text-xl font-semibold text-slate-900 leading-tight">
                    {dept.name}
                  </h2>
                </div>
              </div>

              <Link
                href={`/students`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors self-start sm:self-auto"
              >
                <Users className="w-3.5 h-3.5" /> View {dept.tag} Students
              </Link>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              {dept.lead}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Core Subjects */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Core Subjects & Curriculum
                </h3>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  {dept.coreSubjects.map((sub, idx) => (
                    <li key={idx}>{sub}</li>
                  ))}
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Code className="w-3.5 h-3.5 text-blue-600" /> Industry Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dept.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* FYP Ideas */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Laptop className="w-3.5 h-3.5 text-blue-600" /> Potential FYP Domains
                </h3>
                <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                  {dept.fypIdeas.map((idea, idx) => (
                    <li key={idx}>{idea}</li>
                  ))}
                </ul>
              </div>

              {/* Career Paths */}
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Graduate Career Paths
                </h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {dept.careerPaths.map((career, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
