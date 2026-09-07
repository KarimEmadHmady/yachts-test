'use client';

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import { leadService } from "@/services/leadService";
import { ScrollAnimate } from "@/components/common/ScrollAnimate";

export default function ContactCta() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await leadService.createEnquiry({
        ...form,
        type: "contact",
        page_url: window.location.href,
      });
      setStatus("sent");
      setForm({ name: "", email: "", phone: "" });
    } catch {
      setStatus("error");
    }
  };

  const handleClosePopup = () => {
    setStatus("idle");
  };

  return (
    <section className="relative bg-white dark:bg-[#012241] transition-colors duration-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <ScrollAnimate
          direction="up"
          delay={100}
          duration={850}
          className="relative rounded-[24px] border border-white/10 bg-[#f7f7f7] dark:bg-[#0E2D4A] px-6 py-8 sm:px-10 sm:py-10"
        >
          <h2 className="font-serif font-bold text-lg sm:text-2xl text-black dark:text-white mb-3 max-w-2xl leading-snug">
            We&apos;re Here To Help You Set Sail On Your Perfect Journey
          </h2>
          <p className="text-sm text-black dark:text-white/70 leading-relaxed max-w-2xl mb-8">
            Have Questions Or Needs Assistance Planning Your Yacht Experience?
            Our Team Is Ready To Provide Personalized Support And Guidance
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Name"
              required
              className="flex-1 rounded-full border border-black dark:border-white bg-transparent text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 text-sm px-5 py-3 focus:outline-none focus:border-[#C9A868] transition-colors"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="E-Mail"
              required
              className="flex-1 rounded-full border border-black dark:border-white bg-transparent text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 text-sm px-5 py-3 focus:outline-none focus:border-[#C9A868] transition-colors"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              required
              className="flex-1 rounded-full border border-black dark:border-white  bg-transparent text-black dark:text-white placeholder:text-black/50 dark:placeholder:text-white/50 text-sm px-5 py-3 focus:outline-none focus:border-[#C9A868] transition-colors"
            />
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#C9A868]/60 text-[#C9A868] text-sm font-medium px-6 py-3 hover:bg-[#C9A868]/10 transition-colors duration-200 disabled:opacity-60 whitespace-nowrap"
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : status === "error" ? "Retry" : "Send"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>

          {status === "error" && (
            <p className="text-xs text-red-500 mt-3">Something went wrong, please try again.</p>
          )}

          <p className="text-xs text-black/50 dark:text-white/50 text-center mt-6">
            By Submitting This Form, You Agree That We May Use This Information
            In Accordance With Our{" "}
            <Link href="/privacy-policy" className="text-[#C9A868] hover:underline">
              Privacy Policy
            </Link>
          </p>
        </ScrollAnimate>
      </div>

      {status === "sent" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-cta-thank-you-title"
          onClick={handleClosePopup}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center">
              <BadgeCheck className="h-16 w-16 text-[#fffff]" strokeWidth={1.5} fill="#0E2D4A" />
            </div>
            <h2
              id="contact-cta-thank-you-title"
              className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#0E2D4A] sm:text-3xl"
            >
              Thank You
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-black/50">
              Your Message Has Been Sent Successfully. Our Team Will Get Back To You Shortly.
            </p>
            <button
              type="button"
              onClick={handleClosePopup}
              className="mt-8 rounded-full border border-[#C9A868] px-6 py-2.5 text-sm text-[#C9A868] transition-colors hover:bg-[#C9A868] hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}