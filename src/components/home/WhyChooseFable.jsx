"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  CreditCard,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    number: "01",
    title: "Discover Original Ebooks",
    desc: "Readers can explore original ebooks across Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, and more from one clean, curated platform.",
  },
  {
    icon: CreditCard,
    number: "02",
    title: "Secure Stripe Checkout",
    desc: "Every ebook purchase is handled seamlessly through Stripe Checkout, making your transactions completely global, trusted, and secure.",
  },
  {
    icon: PenLine,
    number: "03",
    title: "Empower Talented Writers",
    desc: "Writers can effortlessly upload, publish, edit, manage their ebooks, and track real-time sales revenue from their dedicated dashboard.",
  },
];

const containerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.0] },
  },
};

export default function WhyChooseFable() {
  return (
    <section className="relative overflow-hidden bg-[#f6f1ea] px-6 py-24 md:px-12 md:py-32">
      <div className="absolute -left-28 top-12 h-96 w-96 rounded-full bg-[#FCB886]/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-28 bottom-10 h-96 w-96 rounded-full bg-[#053c41]/8 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AE7C54]/25 bg-[#AE7C54]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#894329]">
            <Sparkles size={14} className="text-[#AE7C54]" />
            Why Choose Fable
          </div>

          <h2 className="text-4xl font-black leading-tight tracking-tight text-[#053c41] md:text-3xl lg:text-6xl">
            A smarter ecosystem for <br className="hidden sm:block" /> readers and writers.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#053c41]/80 font-medium">
            Fable connects book lovers with talented creators through a beautifully clean reading environment, iron-clad payment security, and role-based advanced analytics.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                variants={fadeUp}
                whileHover={{ y: -10 }}
                className="group relative flex h-full flex-col rounded-2xl border border-[#AE7C54]/15 bg-white p-8 shadow-md transition-all duration-300 hover:border-[#053c41]/30 hover:shadow-2xl"
              >
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54] shadow-inner transition-all duration-300 group-hover:bg-[#053c41] group-hover:text-white">
                    <Icon size={26} />
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black tracking-widest text-[#AE7C54]/60">{card.number}</span>
                    <span className="h-[1px] w-8 bg-[#AE7C54]/20 group-hover:w-12 transition-all duration-300" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#031f22] tracking-tight">{card.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-[#053c41]/85 font-medium">{card.desc}</p>
                <div className="mt-8 h-[3px] w-12 rounded-full bg-[#AE7C54]/20 transition-all duration-300 group-hover:w-full group-hover:bg-[#AE7C54]" />
              </motion.div>
            );
          })}
        </motion.div>

        {/* BOTTOM CTA BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-12 max-w-5xl rounded-2xl border border-[#FCB886]/20 bg-[#053c41] p-8 shadow-2xl md:p-10 lg:mt-16 group/banner relative overflow-hidden"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between relative z-10">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#AE7C54] text-white shadow-lg group-hover/banner:rotate-[6deg] transition-transform duration-500">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white md:text-3xl">Built for the full ebook journey</h3>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#f6f1ea]/80 font-medium">
                  Browse titles, inspect immersive details, bookmark favorites, checkout securely, and read immediately. Publishing and monetization are streamlined in one powerful ecosystem.
                </p>
              </div>
            </div>

            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} className="shrink-0">
              <Link
                href="/ebooks"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#f6f1ea] px-7 py-4 text-sm font-black text-[#053c41] shadow-md hover:bg-[#FCB886] hover:text-[#031f22] group/btn transition-all duration-300"
              >
                Start Reading
                <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}