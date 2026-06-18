"use client";

import { motion } from "framer-motion";
import { BookOpen, ShieldCheck, PenLine } from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "Thousands of Original Ebooks",
    desc: "Browse a growing library of original ebooks across all genres — from Fiction and Mystery to Sci-Fi and Romance.",
    border: "hover:border-[#AE7C54]/50",
    iconBg: "bg-[#AE7C54]/10 text-[#AE7C54]",
  },
  {
    icon: ShieldCheck,
    title: "100% Secure Payments",
    desc: "All ebook purchases are powered by Stripe Checkout — fast, secure, and reliable transactions every time.",
    border: "hover:border-[#0e9f6e]/50",
    iconBg: "bg-[#0e9f6e]/10 text-[#0e9f6e]",
  },
  {
    icon: PenLine,
    title: "Empower Writers Globally",
    desc: "Writers get their own dashboard to upload, manage, and track sales of their ebooks — reaching readers worldwide.",
    border: "hover:border-[#c9956a]/50",
    iconBg: "bg-[#c9956a]/10 text-[#c9956a]",
  },
];

export default function WhyChoose() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 w-full">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-[#f6f1ea] md:text-4xl font-serif"
        >
          Why Choose Fable
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[#f6f1ea]/50 max-w-xl mx-auto text-sm mt-3"
        >
          A platform built for readers who love discovering stories and writers who dream of sharing them.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map(({ icon: Icon, title, desc, border, iconBg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`p-8 rounded-2xl border border-[#AE7C54]/10 bg-[#0f6f7a]/10 ${border} transition duration-300 group`}
          >
            <div className={`${iconBg} p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform`}>
              <Icon size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#f6f1ea] mb-3">{title}</h3>
            <p className="text-[#f6f1ea]/50 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}