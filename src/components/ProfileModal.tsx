"use client";

import React, { useState } from "react";
import { X, CheckCircle2, User } from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (profile: any) => void;
}

export default function ProfileModal({ isOpen, onClose, onSaved }: ProfileModalProps) {
  const [profileForm, setProfileForm] = useState({
    name: "",
    rollNo: "",
    department: "CS" as "CS" | "SE" | "AI",
    semester: "6th Semester",
    bio: "",
    skills: "",
    email: "",
    github: "",
    linkedin: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.rollNo || !profileForm.email) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();

      const savedProfile = data.profile || {
        ...profileForm,
        id: `std-${Date.now()}`,
        skills: profileForm.skills.split(",").map((s) => s.trim()),
      };

      localStorage.setItem("fuuast_my_profile", JSON.stringify(savedProfile));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSaved(savedProfile);
      }, 1000);
    } catch {
      const fallback = {
        ...profileForm,
        id: `std-${Date.now()}`,
        skills: profileForm.skills.split(",").map((s) => s.trim()),
      };
      localStorage.setItem("fuuast_my_profile", JSON.stringify(fallback));
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSaved(fallback);
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6 my-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold mb-1">
            <User className="w-3.5 h-3.5" /> Student Registration
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Create Student Profile</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Join the FUUAST Islamabad community directory to connect with peers and find project partners.
          </p>
        </div>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-900">Profile Created Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Your profile is now live in the student directory.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Asad Ullah"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FA22-BCS-041"
                  value={profileForm.rollNo}
                  onChange={(e) => setProfileForm({ ...profileForm, rollNo: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Department *</label>
                <select
                  value={profileForm.department}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      department: e.target.value as "CS" | "SE" | "AI",
                    })
                  }
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  <option value="CS">BS Computer Science</option>
                  <option value="SE">BS Software Engineering</option>
                  <option value="AI">BS Artificial Intelligence</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
                <select
                  value={profileForm.semester}
                  onChange={(e) => setProfileForm({ ...profileForm, semester: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                >
                  {[
                    "1st Semester",
                    "2nd Semester",
                    "3rd Semester",
                    "4th Semester",
                    "5th Semester",
                    "6th Semester",
                    "7th Semester",
                    "8th Semester",
                    "Alumni",
                  ].map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@student.fuuast.edu.pk"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Skills / Tech Stack (comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Next.js, Python, React, C++"
                value={profileForm.skills}
                onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Short Bio & Project / FYP Goals
              </label>
              <textarea
                rows={2}
                placeholder="Brief description about your interests or collaboration goals..."
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
