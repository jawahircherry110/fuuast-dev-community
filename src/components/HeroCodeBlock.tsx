"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal, Cpu, Laptop, Layers, Sparkles } from "lucide-react";

export default function HeroCodeBlock() {
  const [activeDept, setActiveDept] = useState<"AI" | "CS" | "SE">("AI");
  const [copied, setCopied] = useState(false);

  const deptData = {
    AI: {
      degree: "BS Artificial Intelligence",
      tag: "BSAI",
      focus: ["LLMs & RAG", "Deep Learning", "AI Agents"],
      techStack: ["Python", "PyTorch", "FastAPI", "VectorDB"],
      color: "indigo",
    },
    CS: {
      degree: "BS Computer Science",
      tag: "BSCS",
      focus: ["DSA", "Operating Systems", "Distributed Systems"],
      techStack: ["C++", "Python", "Linux", "PostgreSQL"],
      color: "blue",
    },
    SE: {
      degree: "BS Software Engineering",
      tag: "BSSE",
      focus: ["Clean Architecture", "CI/CD & DevOps", "Full-Stack"],
      techStack: ["TypeScript", "Next.js", "Docker", "Git"],
      color: "sky",
    },
  };

  const current = deptData[activeDept];

  const fullCodeString = `// FUUAST Islamabad Developer Community
interface Developer {
  name: string;
  department: "CS" | "SE" | "AI";
  campus: string;
  isVerified: boolean;
}

export function getDepartment(dept: "AI" | "CS" | "SE") {
  const departments = {
    ${activeDept}: {
      degree: "${current.degree}",
      campus: "Near Bahria Enclave, Islamabad",
      focus: ${JSON.stringify(current.focus)},
      techStack: ${JSON.stringify(current.techStack)},
      readyToCollaborate: true,
    },
  };

  return departments[dept];
}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullCodeString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
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
            <span>department.ts</span>
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
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Department Tab Switcher */}
      <div className="flex items-center gap-1 px-4 py-2 bg-slate-900/50 border-b border-slate-800/60 text-[11px]">
        <span className="text-slate-500 text-[10px] uppercase font-bold mr-2 tracking-wider">
          dept:
        </span>
        <button
          onClick={() => setActiveDept("AI")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            activeDept === "AI"
              ? "bg-indigo-600 text-white font-semibold shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Cpu className="w-3 h-3" />
          <span>BSAI</span>
        </button>
        <button
          onClick={() => setActiveDept("CS")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            activeDept === "CS"
              ? "bg-blue-600 text-white font-semibold shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Laptop className="w-3 h-3" />
          <span>BSCS</span>
        </button>
        <button
          onClick={() => setActiveDept("SE")}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
            activeDept === "SE"
              ? "bg-sky-600 text-white font-semibold shadow-xs"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>BSSE</span>
        </button>
      </div>

      {/* Code Body with Line Numbers & Syntax Highlighting */}
      <div className="p-4 sm:p-5 overflow-x-auto text-[11px] sm:text-xs leading-relaxed">
        <div className="flex font-mono">
          {/* Line Numbers */}
          <div className="select-none text-slate-600 pr-4 text-right space-y-0.5">
            {Array.from({ length: 18 }).map((_, i) => (
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
              <span className="text-purple-400 font-semibold">interface </span>
              <span className="text-teal-300">Developer </span>
              <span className="text-slate-300">{"{"}</span>
            </div>
            {/* 3 */}
            <div>
              <span className="text-slate-400">  name: </span>
              <span className="text-teal-300">string</span>
              <span className="text-slate-400">;</span>
            </div>
            {/* 4 */}
            <div>
              <span className="text-slate-400">  department: </span>
              <span className="text-emerald-300">&quot;CS&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;SE&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;AI&quot;</span>
              <span className="text-slate-400">;</span>
            </div>
            {/* 5 */}
            <div>
              <span className="text-slate-400">  isVerified: </span>
              <span className="text-teal-300">boolean</span>
              <span className="text-slate-400">;</span>
            </div>
            {/* 6 */}
            <div>
              <span className="text-slate-300">{"}"}</span>
            </div>
            {/* 7 */}
            <div className="text-slate-700 select-none">&nbsp;</div>
            {/* 8 */}
            <div>
              <span className="text-purple-400 font-semibold">export </span>
              <span className="text-purple-400 font-semibold">function </span>
              <span className="text-blue-400 font-semibold">getDepartment</span>
              <span className="text-slate-300">(</span>
              <span className="text-sky-300">dept</span>
              <span className="text-slate-400">: </span>
              <span className="text-emerald-300">&quot;AI&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;CS&quot;</span>
              <span className="text-slate-400"> | </span>
              <span className="text-emerald-300">&quot;SE&quot;</span>
              <span className="text-slate-300">) {"{"}</span>
            </div>
            {/* 9 */}
            <div>
              <span className="text-purple-400 font-semibold">  const </span>
              <span className="text-sky-300">departments </span>
              <span className="text-slate-400">= {"{"}</span>
            </div>
            {/* 10 */}
            <div>
              <span className="text-sky-200">    {activeDept}</span>
              <span className="text-slate-400">: {"{"}</span>
            </div>
            {/* 11 */}
            <div>
              <span className="text-slate-400">      degree: </span>
              <span className="text-emerald-300">&quot;{current.degree}&quot;</span>
              <span className="text-slate-400">,</span>
            </div>
            {/* 12 */}
            <div>
              <span className="text-slate-400">      campus: </span>
              <span className="text-emerald-300">&quot;Near Bahria Enclave, Islamabad&quot;</span>
              <span className="text-slate-400">,</span>
            </div>
            {/* 13 */}
            <div>
              <span className="text-slate-400">      focus: </span>
              <span className="text-slate-300">[</span>
              {current.focus.map((f, i) => (
                <span key={i}>
                  <span className="text-emerald-300">&quot;{f}&quot;</span>
                  {i < current.focus.length - 1 && <span className="text-slate-400">, </span>}
                </span>
              ))}
              <span className="text-slate-300">]</span>
              <span className="text-slate-400">,</span>
            </div>
            {/* 14 */}
            <div>
              <span className="text-slate-400">      techStack: </span>
              <span className="text-slate-300">[</span>
              {current.techStack.map((t, i) => (
                <span key={i}>
                  <span className="text-amber-300">&quot;{t}&quot;</span>
                  {i < current.techStack.length - 1 && <span className="text-slate-400">, </span>}
                </span>
              ))}
              <span className="text-slate-300">]</span>
              <span className="text-slate-400">,</span>
            </div>
            {/* 15 */}
            <div>
              <span className="text-slate-400">      collaborate: </span>
              <span className="text-amber-400 font-semibold">true</span>
              <span className="text-slate-400">,</span>
            </div>
            {/* 16 */}
            <div>
              <span className="text-slate-400">    {"}"},</span>
            </div>
            {/* 17 */}
            <div>
              <span className="text-slate-400">  {"}"};</span>
            </div>
            {/* 18 */}
            <div>
              <span className="text-purple-400 font-semibold">  return </span>
              <span className="text-sky-300">departments</span>
              <span className="text-slate-300">[</span>
              <span className="text-sky-300">dept</span>
              <span className="text-slate-300">];</span>
            </div>
            {/* 19 */}
            <div>
              <span className="text-slate-300">{"}"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Live Execution Bar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">
            return: <strong className="text-emerald-300">{current.degree}</strong>
          </span>
        </div>
        <span className="text-slate-500 font-mono text-[10px]">
          status: <span className="text-emerald-400 font-semibold">active_students</span>
        </span>
      </div>
    </div>
  );
}
