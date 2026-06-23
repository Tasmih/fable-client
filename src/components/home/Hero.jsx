"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const slides = [
  {
    badge: "Original Ebook Sharing Platform",
    title: "Discover & Read Original Ebooks",
    description:
      "Explore original ebooks, discover talented writers, bookmark your favorites, and purchase securely through Fable.",
    image: "/hero-banner.jpg",
  },
  {
    badge: "Explore Stories by Genre",
    title: "Find Your Next Favorite Story",
    description:
      "Browse fiction, mystery, romance, sci-fi, fantasy, horror, and more from one clean ebook platform.",
    image: "/hero-banner-2.jpg",
  },
  {
    badge: "Readers, Writers & Admins",
    title: "One Platform for Every Role",
    description:
      "Readers can buy ebooks, writers can publish stories, and admins can manage the entire platform with analytics.",
    image: "/hero-banner-3.jpg",
  },
];

const textContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const fromLeft = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const fromTop = {
  hidden: {
    opacity: 0,
    y: -24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

const buttonVariant = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    slides.forEach((item) => {
      const image = new Image();
      image.src = item.image;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[activeSlide];

  return (
    <section className="bg-[#f6f1ea] px-4 pb-8 pt-3 md:px-8 md:pb-10 md:pt-4">
      <div className="mx-auto max-w-7xl">
       
        <div className="group relative h-[calc(100vh-160px)] min-h-[440px] max-h-[500px] overflow-hidden rounded-[1.35rem] border border-[#AE7C54]/20 bg-[#053c41] shadow-2xl shadow-[#053c41]/15">
          <div className="absolute inset-0 overflow-hidden">
            {slides.map((item, index) => (
              <motion.div
                key={item.image}
                initial={false}
                animate={{
                  opacity: activeSlide === index ? 1 : 0,
                  scale: activeSlide === index ? 1 : 1.03,
                }}
                transition={{
                  duration: 0.85,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url('${item.image}')`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#031f22]/85 via-[#053c41]/60 to-[#053c41]/15 transition-colors duration-700 group-hover:from-[#031f22]/78 group-hover:via-[#894329]/42 group-hover:to-[#AE7C54]/12" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031f22]/58 via-transparent to-[#031f22]/15" />

          {/* প্যাডিং ও কনটেন্ট অ্যালাইনমেন্ট অপ্টিমাইজড */}
          <div className="relative h-full grid items-center gap-6 px-6 py-5 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                variants={textContainer}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, x: -20 }}
                className="max-w-3xl flex flex-col justify-center h-full"
              >
                <motion.div
                  variants={fromTop}
                  className="mb-3 inline-flex w-max items-center gap-2 rounded-full border border-[#FCB886]/35 bg-[#f6f1ea]/12 px-3.5 py-1 text-[11px] font-bold tracking-wide text-[#f6f1ea] shadow-inner shadow-black/20 backdrop-blur transition group-hover:border-[#FCB886]/60 group-hover:bg-[#AE7C54]/25"
                >
                  <Sparkles size={12} className="text-[#FCB886]" />
                  {slide.badge}
                </motion.div>

                <motion.h1
                  variants={fromLeft}
                  className="text-2xl font-black leading-tight tracking-tight text-white drop-shadow-xl md:text-4xl lg:text-5xl"
                >
                  {slide.title}
                </motion.h1>

                <motion.p
                  variants={fromLeft}
                  className="mt-2.5 max-w-xl text-xs leading-6 text-[#f6f1ea]/85 drop-shadow md:text-sm"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  variants={textContainer}
                  className="mt-4 flex flex-col gap-2.5 sm:flex-row"
                >
                  <motion.div variants={buttonVariant}>
                    <Link
                      href="/ebooks"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#AE7C54] px-5 py-2.5 text-xs font-black text-white shadow-xl shadow-black/25 transition hover:-translate-y-0.5 hover:bg-[#894329] hover:shadow-2xl sm:w-auto"
                    >
                      <BookOpen size={14} />
                      Browse Ebooks
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>

                  <motion.div variants={buttonVariant}>
                    <Link
                      href="/dashboard"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#f6f1ea]/25 bg-[#f6f1ea]/12 px-5 py-2.5 text-xs font-black text-white shadow-inner shadow-black/20 backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#f6f1ea] hover:text-[#053c41] sm:w-auto"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                  </motion.div>

                  <motion.div variants={buttonVariant}>
                    <Link
                      href="/ebooks?genre=Fiction"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#FCB886]/35 bg-[#FCB886]/18 px-5 py-2.5 text-xs font-black text-[#f6f1ea] backdrop-blur transition hover:-translate-y-0.5 hover:bg-[#FCB886] hover:text-[#053c41] sm:w-auto"
                    >
                      <Search size={14} />
                      Explore Genres
                    </Link>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={textContainer}
                  className="mt-5 grid max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-3"
                >
                  <motion.div variants={buttonVariant}>
                    <InfoCard title="Public Browse" text="No login required" />
                  </motion.div>

                  <motion.div variants={buttonVariant}>
                    <InfoCard title="Secure Payment" text="Stripe checkout" />
                  </motion.div>

                  <motion.div variants={buttonVariant}>
                    <InfoCard title="Role Based" text="User, Writer, Admin" />
                  </motion.div>
                </motion.div>

                <div className="mt-4 flex items-center gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeSlide === index
                          ? "w-6 bg-[#AE7C54]"
                          : "w-1.5 bg-[#f6f1ea]/35 hover:bg-[#FCB886]"
                      }`}
                      aria-label={`Go to banner slide ${index + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

           
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
              className="hidden self-center lg:block"
            >
              <div className="ml-auto max-w-[340px]">
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.25 }}
                  className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#FCB886]/25 bg-[#031f22]/55 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#FCB886] shadow-inner shadow-black/20 backdrop-blur"
                >
                  <Sparkles size={10} />
                  Platform Highlights
                </motion.div>

                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-[1.35rem] border border-[#f6f1ea]/16 bg-[#031f22]/58 p-4 shadow-2xl shadow-black/25 backdrop-blur-md transition-colors duration-500 group-hover:border-[#FCB886]/30 group-hover:bg-[#031f22]/64"
                >
                  <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#AE7C54] text-white shadow-lg transition group-hover:bg-[#894329]">
                    <ShieldCheck size={20} />
                  </div>

                  <h2 className="text-base font-black text-white">
                    A complete reading platform
                  </h2>

                  <p className="mt-1.5 text-[11px] leading-5 text-[#f6f1ea]/80">
                    Browse ebooks, view details, buy securely, save bookmarks,
                    and manage your reading from a clean dashboard.
                  </p>

                  <div className="mt-3.5 space-y-1.5">
                    <MiniPoint text="Readers can purchase and read ebooks." />
                    <MiniPoint text="Writers can publish and manage ebooks." />
                    <MiniPoint text="Admins can manage users and transactions." />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, text }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-[#f6f1ea]/15 bg-[#031f22]/42 p-2.5 shadow-inner shadow-black/20 backdrop-blur transition-colors duration-500 hover:border-[#FCB886]/35 hover:bg-[#AE7C54]/20"
    >
      <h3 className="text-[11px] font-black text-white leading-tight">{title}</h3>
      <p className="mt-0.5 text-[10px] font-semibold text-[#f6f1ea]/65">{text}</p>
    </motion.div>
  );
}

function MiniPoint({ text }) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 rounded-xl border border-[#f6f1ea]/12 bg-[#f6f1ea]/10 px-3 py-2 transition-colors hover:border-[#FCB886]/30 hover:bg-[#FCB886]/15"
    >
      <div className="h-1.5 w-1.5 rounded-full bg-[#FCB886] shrink-0" />
      <p className="text-[11px] font-semibold text-[#f6f1ea]/80 truncate">{text}</p>
    </motion.div>
  );
}