"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GraduationCap,
  Briefcase,
  Code,
  Users,
  Menu,
  X,
  User,
  Info,
  Layers,
  Mail,
  Home as HomeIcon,
} from "lucide-react";
import ProfileModal from "@/components/ProfileModal";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myProfile, setMyProfile] = useState<{ name: string; department: string } | null>(null);

  useEffect(() => {
    const checkProfile = () => {
      const saved = localStorage.getItem("fuuast_my_profile");
      if (saved) {
        try {
          setMyProfile(JSON.parse(saved));
        } catch {}
      }
    };
    checkProfile();
    window.addEventListener("storage", checkProfile);
    return () => window.removeEventListener("storage", checkProfile);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "About", href: "/about", icon: Info },
    { name: "CS, SE & AI Tracks", href: "/departments", icon: Layers },
    { name: "Jobs & Internships", href: "/jobs", icon: Briefcase, highlight: true },
    { name: "Student Directory", href: "/students", icon: Users },
    { name: "Contact", href: "/contact", icon: Mail },
  ];

  return (
    <>
      {/* Top University Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium text-slate-200">
              Federal Urdu University of Arts, Science & Technology • Islamabad Campus
            </span>
          </div>
          <div className="hidden sm:block text-[11px] text-slate-400 font-mono">
            fuuastdevcommunity.com
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-semibold shadow-xs">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 tracking-tight text-sm sm:text-base leading-none block">
                FUUAST <span className="text-blue-600">Dev Community</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                Islamabad Campus
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : link.highlight
                      ? "text-blue-600 hover:bg-blue-50/60 font-semibold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  <link.icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Profile Action Button */}
          <div className="hidden md:flex items-center gap-3">
            {myProfile ? (
              <Link
                href="/students"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                  {myProfile.name[0]}
                </div>
                <span>{myProfile.name.split(" ")[0]} (My Profile)</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5" /> Create Profile
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-1 text-xs font-medium shadow-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 py-2 px-3 rounded-lg ${
                    isActive
                      ? "text-blue-700 bg-blue-50 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <link.icon className="w-4 h-4 text-slate-400" />
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-100">
              {myProfile ? (
                <Link
                  href="/students"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold"
                >
                  View My Profile ({myProfile.name.split(" ")[0]})
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 rounded-lg text-center bg-blue-600 text-white font-semibold flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" /> Create Student Profile
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Profile Creation Modal */}
      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(profile) => {
          setMyProfile(profile);
          setIsModalOpen(false);
        }}
      />
    </>
  );
}
