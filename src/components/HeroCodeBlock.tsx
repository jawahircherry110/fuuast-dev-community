"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Cpu, Laptop, Layers, Sparkles, Play } from "lucide-react";

export default function HeroCodeBlock() {
  const [activeDept, setActiveDept] = useState<"CS" | "SE" | "AI">("AI");
  const [copied, setCopied] = useState(false);

  const fullCodeString = `// FUUAST Islamabad Developer Community
interface DepartmentOverview {
  degree: string;
  campus: string;
  focus: string[];
  techStack: string[];
  openForFYP: boolean;
}

export function getDepartment(dept: "CS" | "SE" | "AI"): DepartmentOverview {
  const departments = {
    CS: {
      degree: "BS Computer Science",
      campus: "Near Bahria Enclave, Islamabad",
      focus: ["Data Structures & Algorithms", "Operating Systems", "Distributed Systems"],
      techStack: ["C++", "Python", "Linux", "PostgreSQL"],
      openForFYP: true,
    },
    SE: {
      degree: "BS Software Engineering",
      campus: "Near Bahria Enclave, Islamabad",
      focus: ["Software Architecture", "CI/CD & DevOps", "Automated Testing"],
      techStack: ["TypeScript", "Next.js", "Docker", "Git"],
      openForFYP: true,
    },
    AI: {
      degree: "BS Artificial Intelligence",
      campus: "Near Bahria Enclave, Islamabad",
      focus: ["Large Language Models & RAG", "Deep Learning", "AI Agents"],
      techStack: ["Python", "PyTorch", "FastAPI", "VectorDB"],
      openForFYP: true,
    },
  };

  return departments[dept];
}

const student = getDepartment("${activeDept}");`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullCodeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deptDetails = {
    CS: {
      name: "BS Computer Science",
      tag: "BSCS",
      headline: "DSA, Systems & Distributed Computing",
      color: "blue",
    },
    SE: {
      name: "BS Software Engineering",
      tag: "BSSE",
      headline: "Clean Architecture, DevOps & Full-Stack",
      color: "sky",
    },
    AI: {
      name: "BS Artificial Intelligence",
      tag: "BSAI",
      headline: "LLMs, RAG, PyTorch & AI Agents",
      color: "indigo",
    },
  };

  return (
    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-left font-mono text-xs">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Mac / Terminal Window Buttons */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 inline-block" />
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700/60">
            <Terminal className="w-3.5 h-3.5 text-blue-400" />
            <span>departments.ts</span>
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-[11px] border border-slate-700/50"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Dept Selector Pills */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/60 border-b border-slate-800/60 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[10px] uppercase font-bold mr-1">
            Run:
          </span>
          <button
            onClick={() => setActiveDept("CS")}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
              activeDept === "CS"
                ? "bg-blue-600 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Laptop className="w-3 h-3" />
            <span>&quot;CS&quot;</span>
          </button>
          <button
            onClick={() => setActiveDept("SE")}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
              activeDept === "SE"
                ? "bg-sky-600 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>&quot;SE&quot;</span>
          </button>
          <button
            onClick={() => setActiveDept("AI")}
            className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md transition-all ${
              activeDept === "AI"
                ? "bg-indigo-600 text-white font-semibold shadow-xs"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>&quot;AI&quot;</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Click to test function
        </span>
      </div>

      {/* Code Body with Line Numbers & Syntax Highlighting */}
      <div className="p-4 sm:p-5 overflow-x-auto text-[11px] sm:text-xs leading-relaxed max-h-[460px] overflow-y-auto">
        <div className="flex font-mono">
          {/* Line Numbers */}
          <div className="select-none text-slate-600 pr-3 sm:pr-4 text-right space-y-0.5">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Syntax Highlighted Code */}
          <div className="flex-1 space-y-0.5 whitespace-pre">
            {/* 1 */}
            <div>
              <span className="text-slate-500 italic">// FUUAST Islamabad Developer Community</span>
            </div>
            {/* 2 */}
            <div>
              <span className="text-purple-400 font-semibold">export </span>
              <span className="text-purple-400 font-semibold">function </span>
              <span className="text-blue-400 font-semibold">getDepartment</span>
              <span className="text-slate-300">(</span>
              <span className="text-sky-300">dept</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-300">&quot;CS&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;SE&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;AI&quot;</span>
              <span className="text-slate-300">) {"{"}</span>
            </div>
            {/* 3 */}
            <div>
              <span className="text-purple-400 font-semibold">  const </span>
              <span className="text-sky-300">departments </span>
              <span className="text-slate-400">= {"{"}</span>
            </div>

            {/* 4 - CS Block */}
            <div
              onClick={() => setActiveDept("CS")}
              className={`rounded px-1.5 py-0.5 cursor-pointer transition-colors ${
                activeDept === "CS" ? "bg-blue-950/70 border border-blue-500/40" : "hover:bg-slate-900/60"
              }`}
            >
              <div>
                <span className="text-sky-300 font-bold">    CS</span>
                <span className="text-slate-400">: {"{"}</span>
                {activeDept === "CS" && <span className="text-[10px] text-blue-400 ml-2 font-mono">◀ active</span>}
              </div>
              <div className="text-slate-400">      degree: <span className="text-emerald-300">&quot;BS Computer Science&quot;</span>,</div>
              <div className="text-slate-400">      campus: <span className="text-emerald-300">&quot;Near Bahria Enclave, Islamabad&quot;</span>,</div>
              <div className="text-slate-400">      focus: <span className="text-slate-300">[</span><span className="text-emerald-300">&quot;DSA&quot;</span>, <span className="text-emerald-300">&quot;OS&quot;</span>, <span className="text-emerald-300">&quot;Distributed Systems&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      techStack: <span className="text-slate-300">[</span><span className="text-amber-300">&quot;C++&quot;</span>, <span className="text-amber-300">&quot;Python&quot;</span>, <span className="text-amber-300">&quot;PostgreSQL&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      openForFYP: <span className="text-amber-400 font-semibold">true</span>,</div>
              <div><span className="text-slate-400">    {"}"},</span></div>
            </div>

            {/* 11 - SE Block */}
            <div
              onClick={() => setActiveDept("SE")}
              className={`rounded px-1.5 py-0.5 cursor-pointer transition-colors ${
                activeDept === "SE" ? "bg-sky-950/70 border border-sky-500/40" : "hover:bg-slate-900/60"
              }`}
            >
              <div>
                <span className="text-sky-300 font-bold">    SE</span>
                <span className="text-slate-400">: {"{"}</span>
                {activeDept === "SE" && <span className="text-[10px] text-sky-400 ml-2 font-mono">◀ active</span>}
              </div>
              <div className="text-slate-400">      degree: <span className="text-emerald-300">&quot;BS Software Engineering&quot;</span>,</div>
              <div className="text-slate-400">      campus: <span className="text-emerald-300">&quot;Near Bahria Enclave, Islamabad&quot;</span>,</div>
              <div className="text-slate-400">      focus: <span className="text-slate-300">[</span><span className="text-emerald-300">&quot;Software Architecture&quot;</span>, <span className="text-emerald-300">&quot;CI/CD & DevOps&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      techStack: <span className="text-slate-300">[</span><span className="text-amber-300">&quot;TypeScript&quot;</span>, <span className="text-amber-300">&quot;Next.js&quot;</span>, <span className="text-amber-300">&quot;Docker&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      openForFYP: <span className="text-amber-400 font-semibold">true</span>,</div>
              <div><span className="text-slate-400">    {"}"},</span></div>
            </div>

            {/* 18 - AI Block */}
            <div
              onClick={() => setActiveDept("AI")}
              className={`rounded px-1.5 py-0.5 cursor-pointer transition-colors ${
                activeDept === "AI" ? "bg-indigo-950/70 border border-indigo-500/40" : "hover:bg-slate-900/60"
              }`}
            >
              <div>
                <span className="text-sky-300 font-bold">    AI</span>
                <span className="text-slate-400">: {"{"}</span>
                {activeDept === "AI" && <span className="text-[10px] text-indigo-400 ml-2 font-mono">◀ active</span>}
              </div>
              <div className="text-slate-400">      degree: <span className="text-emerald-300">&quot;BS Artificial Intelligence&quot;</span>,</div>
              <div className="text-slate-400">      campus: <span className="text-emerald-300">&quot;Near Bahria Enclave, Islamabad&quot;</span>,</div>
              <div className="text-slate-400">      focus: <span className="text-slate-300">[</span><span className="text-emerald-300">&quot;LLMs & RAG&quot;</span>, <span className="text-emerald-300">&quot;Deep Learning&quot;</span>, <span className="text-emerald-300">&quot;Agents&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      techStack: <span className="text-slate-300">[</span><span className="text-amber-300">&quot;Python&quot;</span>, <span className="text-amber-300">&quot;PyTorch&quot;</span>, <span className="text-amber-300">&quot;FastAPI&quot;</span><span className="text-slate-300">]</span>,</div>
              <div className="text-slate-400">      openForFYP: <span className="text-amber-400 font-semibold">true</span>,</div>
              <div><span className="text-slate-400">    {"}"},</span></div>
            </div>

            {/* 25 */}
            <div>
              <span className="text-slate-400">  {"}"};</span>
            </div>
            {/* 26 */}
            <div>
              <span className="text-purple-400 font-semibold">  return </span>
              <span className="text-sky-300">departments</span>
              <span className="text-slate-300">[</span>
              <span className="text-sky-300">dept</span>
              <span className="text-slate-300">];</span>
            </div>
            {/* 27 */}
            <div>
              <span className="text-slate-300">{"}"}</span>
            </div>
            {/* 28 */}
            <div className="text-slate-700 select-none">&nbsp;</div>
            {/* 29 */}
            <div>
              <span className="text-slate-500 italic">// Call function for student inquiry</span>
            </div>
            {/* 30 */}
            <div>
              <span className="text-purple-400 font-semibold">const </span>
              <span className="text-sky-300">student </span>
              <span className="text-slate-400">= </span>
              <span className="text-blue-400 font-semibold">getDepartment</span>
              <span className="text-slate-300">(</span>
              <span className="text-emerald-300">&quot;{activeDept}&quot;</span>
              <span className="text-slate-300">);</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Live Output Bar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-2">
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 shrink-0" />
          <span className="text-slate-300 truncate">
            getDepartment(<span className="text-emerald-300">&quot;{activeDept}&quot;</span>) →{" "}
            <strong className="text-white">{deptDetails[activeDept].name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-slate-400">Near Bahria Enclave, Islamabad</span>
        </div>
      </div>
    </div>
  );
}
