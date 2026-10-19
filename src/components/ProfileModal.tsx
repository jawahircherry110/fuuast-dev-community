"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  CheckCircle2,
  User,
  Camera,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  LogIn,
  UserPlus,
} from "lucide-react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (profile: any) => void;
  initialProfile?: any;
}

export default function ProfileModal({
  isOpen,
  onClose,
  onSaved,
  initialProfile,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"register" | "login">("register");

  // Registration Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    rollNo: "",
    department: "CS" as "CS" | "SE" | "AI",
    semester: "6th Semester",
    bio: "",
    skills: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    photoUrl: "",
    github: "",
    linkedin: "",
  });

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // General State
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedProfile, setSubmittedProfile] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialProfile) {
      setProfileForm({
        name: initialProfile.name || "",
        rollNo: initialProfile.rollNo || "",
        department: initialProfile.department || "CS",
        semester: initialProfile.semester || "6th Semester",
        bio: initialProfile.bio || "",
        skills: Array.isArray(initialProfile.skills)
          ? initialProfile.skills.join(", ")
          : initialProfile.skills || "",
        email: initialProfile.email || "",
        phone: initialProfile.phone || "",
        password: "",
        confirmPassword: "",
        photoUrl: initialProfile.photoUrl || "",
        github: initialProfile.github || "",
        linkedin: initialProfile.linkedin || "",
      });
      setActiveTab("register");
    }
  }, [initialProfile, isOpen]);

  if (!isOpen) return null;

  // Compress uploaded photo to lightweight Base64 string
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_SIZE = 320;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL("image/jpeg", 0.8);
            setProfileForm((prev) => ({ ...prev, photoUrl: compressed }));
          }
        };
      };
    } catch {
      setErrorMessage("Could not process photo. Please try a different image.");
    }
  };

  const handleRemovePhoto = () => {
    setProfileForm((prev) => ({ ...prev, photoUrl: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!profileForm.name.trim() || !profileForm.rollNo.trim()) {
      setErrorMessage("Please fill in your Full Name and Roll Number.");
      return;
    }

    if (!profileForm.email.trim() && !profileForm.phone.trim()) {
      setErrorMessage("Please provide at least an Email address or Phone number.");
      return;
    }

    // Check password if creating a new profile
    if (!initialProfile && (!profileForm.password || profileForm.password.length < 8)) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: profileForm.name.trim(),
        rollNo: profileForm.rollNo.trim().toUpperCase(),
        department: profileForm.department,
        semester: profileForm.semester,
        bio: profileForm.bio.trim(),
        skills: profileForm.skills,
        email: profileForm.email.trim(),
        phone: profileForm.phone.trim(),
        password: profileForm.password.trim(),
        photoUrl: profileForm.photoUrl,
        github: profileForm.github.trim(),
        linkedin: profileForm.linkedin.trim(),
        status: initialProfile?.status === "approved" ? "approved" : "pending",
      };

      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit registration.");
        setIsSubmitting(false);
        return;
      }

      const saved = data.profile || {
        ...payload,
        id: `std-${Date.now()}`,
        skills: profileForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        status: "pending",
      };

      localStorage.setItem("fuuast_my_profile", JSON.stringify(saved));
      setSubmittedProfile(saved);
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setLoginError("Please enter your Email/Phone/Roll No and Password.");
      return;
    }

    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginIdentifier.trim(),
          password: loginPassword.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.profile) {
        setLoginError(data.error || "Invalid credentials. Please try again.");
        setIsLoggingIn(false);
        return;
      }

      localStorage.setItem("fuuast_my_profile", JSON.stringify(data.profile));
      onSaved(data.profile);
      onClose();
    } catch {
      setLoginError("Login failed due to a network error.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleFinishSuccess = () => {
    if (submittedProfile) {
      onSaved(submittedProfile);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-5 sm:p-6 my-6 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* POST-REGISTRATION SUCCESS SCREEN */}
        {submittedProfile ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Clock className="w-8 h-8" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 mb-2">
              Status: Awaiting Admin Verification
            </span>

            <h3 className="text-xl font-bold text-slate-900">
              Registration Request Submitted!
            </h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto mt-2 leading-relaxed">
              Your FUUAST student profile has been submitted to the Admin team for verification.
              Once approved, your profile card and photo will be published on the Community Roster.
            </p>

            {/* Profile Preview Card */}
            <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50 text-left flex items-center gap-3">
              {submittedProfile.photoUrl ? (
                <img
                  src={submittedProfile.photoUrl}
                  alt={submittedProfile.name}
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                  {submittedProfile.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-slate-900 truncate">
                  {submittedProfile.name}
                </h4>
                <p className="text-xs text-slate-500">
                  BS{submittedProfile.department} • {submittedProfile.semester}
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                  Roll No: {submittedProfile.rollNo}
                </p>
              </div>
            </div>

            <button
              onClick={handleFinishSuccess}
              className="mt-6 w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
            >
              Continue to Student Directory
            </button>
          </div>
        ) : (
          <div>
            {/* Header with Tabs */}
            <div className="mb-5 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("register");
                    setErrorMessage("");
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "register"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  {initialProfile ? "Edit Profile" : "Register (Sign Up)"}
                </button>

                {!initialProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("login");
                      setLoginError("");
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === "login"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" /> Student Login
                  </button>
                )}
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                {activeTab === "register"
                  ? initialProfile
                    ? "Update Student Profile"
                    : "Create FUUAST Student Profile"
                  : "Sign In to Your Student Account"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === "register"
                  ? "Join the CS, SE & AI student roster. Registrations are verified by FUUAST admin."
                  : "Enter your registered email, phone or roll number and password."}
              </p>
            </div>

            {/* TAB 1: REGISTRATION */}
            {activeTab === "register" && (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                {errorMessage && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Profile Picture Upload Section */}
                <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 flex items-center gap-4">
                  <div className="relative">
                    {profileForm.photoUrl ? (
                      <img
                        src={profileForm.photoUrl}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 text-slate-400 flex flex-col items-center justify-center border border-slate-300">
                        <Camera className="w-6 h-6" />
                        <span className="text-[9px] mt-0.5">Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="text-xs font-semibold text-slate-800">
                      Profile Picture / Headshot
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Upload your picture. It will appear on your verified profile card.
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoSelect}
                      className="hidden"
                      id="student-photo-upload"
                    />

                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="student-photo-upload"
                        className="px-3 py-1 rounded-md text-xs font-medium bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 cursor-pointer transition-colors shadow-2xs"
                      >
                        {profileForm.photoUrl ? "Change Photo" : "Upload Picture"}
                      </label>
                      {profileForm.photoUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name & Roll No */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Ullah"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. FA22-BCS-041"
                      value={profileForm.rollNo}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, rollNo: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase"
                    />
                  </div>
                </div>

                {/* Department & Semester */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Department *
                    </label>
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
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Semester *
                    </label>
                    <select
                      value={profileForm.semester}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, semester: e.target.value })
                      }
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
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="student@fuuast.edu.pk"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, email: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number (WhatsApp)
                    </label>
                    <input
                      type="text"
                      placeholder="0300-1234567"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Password Fields (Required for new signup) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-medium text-slate-700">
                        Password (Min 8 Chars) *
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-600 text-[10px] flex items-center gap-0.5"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!initialProfile}
                      placeholder="••••••••"
                      value={profileForm.password}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, password: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      required={!initialProfile && profileForm.password.length > 0}
                      placeholder="••••••••"
                      value={profileForm.confirmPassword}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Skills / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Python, Flutter, C++, React"
                    value={profileForm.skills}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, skills: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Short Bio & FYP / Collaboration Goals
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description about your programming interests or FYP project..."
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                {/* Social Profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      LinkedIn Profile (Optional)
                    </label>
                    <span className="block text-[10px] text-slate-400 mb-1">
                      Only displayed if provided
                    </span>
                    <input
                      type="text"
                      placeholder="https://linkedin.com/in/username"
                      value={profileForm.linkedin}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, linkedin: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      GitHub Profile (Optional)
                    </label>
                    <span className="block text-[10px] text-slate-400 mb-1">
                      Only displayed if provided
                    </span>
                    <input
                      type="text"
                      placeholder="https://github.com/username"
                      value={profileForm.github}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, github: e.target.value })
                      }
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                {/* Verification Notice */}
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-700 flex items-start gap-2">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    <strong>Verification Process:</strong> Your profile request will be sent
                    to the FUUAST Admin dashboard. Once verified, your profile and photo will be
                    published on the community roster.
                  </span>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : initialProfile
                      ? "Save Changes"
                      : "Submit for Verification"}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: LOGIN */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-4 py-2">
                {loginError && (
                  <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email, Phone or Roll Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FA22-BCS-041 or student@fuuast.edu.pk"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Password (8+ characters)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 text-[10px] flex items-center gap-0.5"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {isLoggingIn ? "Signing In..." : "Sign In to My Profile"}
                </button>

                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-500">
                    Don&apos;t have an account yet?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("register");
                        setErrorMessage("");
                      }}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Register here
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
