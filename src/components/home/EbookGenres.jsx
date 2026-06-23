"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Ghost,
  Heart,
  Rocket,
  Search,
  BookText,
  WandSparkles,
  ArrowRight,
} from "lucide-react";

const genres = [
  {
    name: "Fiction",
    icon: BookText,
    description: "Original stories, unforgettable characters, and creative narratives.",
  },
  {
    name: "Mystery",
    icon: Search,
    description: "Suspense, deep secrets, and thrilling intellectual discoveries.",
  },
  {
    name: "Romance",
    icon: Heart,
    description: "Heartwarming love stories and deep emotional journeys.",
  },
  {
    name: "Sci-Fi",
    icon: Rocket,
    description: "Futuristic worlds, advanced science, and limitless imagination.",
  },
  {
    name: "Fantasy",
    icon: WandSparkles,
    description: "Magical realms, mythical creatures, and epic storytelling.",
  },
  {
    name: "Horror",
    icon: Ghost,
    description: "Dark, psychological suspense and thrilling supernatural reads.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function EbookGenres() {
  return (
    <section className="bg-[#f6f1ea] px-6 py-24 md:px-12 md:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FCB886]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AE7C54]/25 bg-[#AE7C54]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#894329]"
          >
            <BookOpen size={13} className="text-[#AE7C54]" />
            Ebook Genres
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-black text-[#053c41] md:text-3xl lg:text-4xl tracking-tight"
          >
            Explore by Genre
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base text-[#053c41]/75 max-w-xl mx-auto font-medium"
          >
            Immerse yourself in handpicked categories and find your next favorite story.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {genres.map((genre) => {
            const Icon = genre.icon;

            return (
              <motion.div
                key={genre.name}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <Link
                  href={`/ebooks?genre=${encodeURIComponent(genre.name)}`}
                  className="flex flex-col h-full rounded-2xl border border-[#AE7C54]/15 bg-white p-8 shadow-md transition-all duration-300 hover:bg-[#053c41] hover:border-[#053c41]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#AE7C54] text-white shadow-lg shadow-[#AE7C54]/20 transition-all duration-300 group-hover:bg-[#FCB886] group-hover:text-[#031f22]">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-6 text-xl font-black text-[#031f22] transition-colors duration-300 group-hover:text-white">
                    {genre.name}
                  </h3>

                  <p className="mt-3 text-sm text-[#053c41]/80 leading-relaxed font-medium transition-colors duration-300 group-hover:text-[#f6f1ea]/80">
                    {genre.description}
                  </p>

                  <div className="mt-8 pt-4 border-t border-[#053c41]/5 flex items-center gap-2 text-sm font-bold text-[#AE7C54] transition-all duration-300 group-hover:text-[#FCB886] group-hover:border-white/10 mt-auto">
                    <span>Browse {genre.name}</span>
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}