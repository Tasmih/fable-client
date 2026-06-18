"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, BookMarked, Users, Star } from "lucide-react";

const slides = [
  {
    title: "Discover & Read Original Ebooks",
    subtitle: "Explore thousands of original ebooks from talented writers around the world.",
    cta: "Browse Ebooks",
    href: "/browse",
    badge: "Featured Collection",
  },
  {
    title: "Read, Learn & Explore Stories",
    subtitle: "Find fiction, mystery, romance, sci-fi, fantasy and more in one place.",
    cta: "Explore Genres",
    href: "/browse",
    badge: "Top Genres",
  },
  {
    title: "Publish Your Own Ebook",
    subtitle: "Writers can upload, manage and sell their ebooks to a global audience.",
    cta: "Start Writing",
    href: "/auth/register",
    badge: "For Writers",
  },
];

const stats = [
  { icon: BookMarked, label: "Ebooks", value: "500+" },
  { icon: Users, label: "Writers", value: "200+" },
  { icon: Star, label: "Readers", value: "1000+" },
];

const particles = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  duration: Math.random() * 4 + 3,
  delay: Math.random() * 3,
}));

export default function Hero() {
  const [current, setCurrent] = useState(0);
  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 bg-gradient-to-br from-[#013538] via-[#072b2d] to-[#041a1c] overflow-hidden">

      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#AE7C54]/40 pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-10, 10, -10], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-24 left-24 w-72 h-72 bg-[#AE7C54]/15 blur-[150px] rounded-full" />
        <div className="absolute bottom-24 right-24 w-96 h-96 bg-[#0e4f52]/20 blur-[180px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl w-full text-center space-y-8">

        {/* Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "badge"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex px-5 py-2 rounded-full border border-[#AE7C54]/30 bg-[#AE7C54]/10 text-[#e8c9a0] text-xs tracking-widest uppercase"
          >
            ✦ {slide.badge}
          </motion.div>
        </AnimatePresence>

        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={current + "title"}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#f6f1ea] leading-tight font-serif"
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>

        {/* Subtitle */}
        <AnimatePresence mode="wait">
          <motion.p
            key={current + "sub"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-[#f6f1ea]/60 text-base md:text-xl max-w-2xl mx-auto"
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "cta"}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href={slide.href}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#AE7C54] hover:bg-[#c9956a] text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-[#AE7C54]/30"
            >
              <BookOpen size={18} />
              {slide.cta}
            </Link>
            <Link
              href="/browse"
              className="px-8 py-4 rounded-full border border-[#AE7C54]/30 text-[#f6f1ea]/80 hover:text-[#f6f1ea] hover:border-[#AE7C54] hover:bg-[#AE7C54]/10 transition"
            >
              Browse Library
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex justify-center gap-2 pt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-[#AE7C54]" : "w-2 bg-[#f6f1ea]/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="relative z-10 mt-16 w-full max-w-2xl grid grid-cols-3 gap-4"
      >
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 px-4 py-4 rounded-2xl border border-[#AE7C54]/20 bg-[#AE7C54]/5 hover:border-[#AE7C54]/40 hover:bg-[#AE7C54]/10 transition"
          >
            <Icon size={18} className="text-[#AE7C54]" />
            <span className="text-[#f6f1ea] font-bold text-lg">{value}</span>
            <span className="text-[#f6f1ea]/50 text-xs">{label}</span>
          </div>
        ))}
      </motion.div>

    </section>
  );
}