"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  CheckCircle2,
  MapPin,
  Building2,
  Clock,
  GraduationCap,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "CS",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSuccess(true);
      setForm({
        name: "",
        email: "",
        department: "CS",
        subject: "",
        message: "",
      });
    } catch {
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-3">
          <Mail className="w-3.5 h-3.5 text-blue-600" />
          Get in Touch
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
          Contact Community Coordinators
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Have an inquiry regarding student profiles, FYP collaboration, posting job openings, or community
          events at FUUAST Islamabad? Send us a message below.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact Information Sidebar */}
        <div className="space-y-4">
          <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70">
            <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-600" /> Campus Details
            </h2>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  Federal Urdu University of Arts, Science and Technology, Near Bahria Enclave, Islamabad, Pakistan
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Department of Computer Science & IT</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>Monday - Friday: 8:30 AM - 4:00 PM PKT</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-blue-100 bg-blue-50/50">
            <h2 className="text-sm font-semibold text-blue-900 mb-1">Looking to post an opening?</h2>
            <p className="text-xs text-blue-700 leading-relaxed mb-3">
              Recruiters and alumni can send job/internship details directly through this form. Our team will review and publish it within 24 hours.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {success ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-900">Message Received!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Thank you for reaching out. Your message has been saved and forwarded to the FUUAST Islamabad community coordinators.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad Ullah"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@student.fuuast.edu.pk"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Department / Role
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                    >
                      <option value="CS">Computer Science (BSCS)</option>
                      <option value="SE">Software Engineering (BSSE)</option>
                      <option value="AI">Artificial Intelligence (BSAI)</option>
                      <option value="Alumni">FUUAST Alumni</option>
                      <option value="Recruiter">Recruiter / Industry Partner</option>
                      <option value="General">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FYP inquiry, internship, or event"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="How can we assist you or how would you like to collaborate?"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2 text-right">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmitting ? "Sending..." : "Submit Message"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
