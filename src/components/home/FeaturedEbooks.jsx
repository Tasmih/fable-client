"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEbooks } from "@/lib/actions/ebooks";
import { ArrowRight, BookOpen, Star } from "lucide-react";

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 28,
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

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);

        const data = await getEbooks({
          page: 1,
          limit: 6,
          sort: "newest",
        });

        setEbooks(data.ebooks || []);
      } catch {
        setEbooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="bg-[#f6f1ea] px-4 pb-16 pt-6 md:px-8 md:pb-20 md:pt-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mb-10 flex flex-col items-center text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#AE7C54]/25 bg-white px-5 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-[#AE7C54] shadow-sm">
            <Star size={13} />
            Freshly Added
          </div>

          <h2 className="text-3xl font-black tracking-tight text-[#053c41] md:text-3xl">
            Featured Ebooks
          </h2>

          <p className="mt-3 max-w-2xl text-xs leading-6 text-[#053c41]/70 md:text-sm">
            Explore the latest original ebooks published by talented writers
            on Fable.
          </p>

          <Link
            href="/ebooks"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#053c41]/15 bg-[#053c41] px-5 py-2.5 text-xs font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#AE7C54]"
          >
            Browse All
            <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading && (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-2xl border border-[#053c41]/10 bg-white p-3 shadow-sm"
              >
                <div className="h-52 rounded-xl bg-[#053c41]/10 md:h-64" />
                <div className="mt-4 h-4 w-3/4 rounded bg-[#053c41]/10" />
                <div className="mt-2 h-3 w-1/2 rounded bg-[#053c41]/10" />
                <div className="mt-4 h-9 rounded bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && ebooks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-[#AE7C54]/20 bg-white p-12 text-center shadow-sm"
          >
            <BookOpen size={46} className="mx-auto text-[#AE7C54]" />

            <h3 className="mt-4 text-2xl font-black text-[#053c41]">
              No featured ebooks yet
            </h3>

            <p className="mt-2 text-sm text-[#053c41]/70">
              Latest published ebooks will appear here automatically.
            </p>
          </motion.div>
        )}

        {!loading && ebooks.length > 0 && (
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-2 gap-5 md:grid-cols-3"
          >
            {ebooks.map((ebook) => (
              <motion.div key={ebook._id} variants={cardVariant}>
                <Link
                  href={`/ebooks/${ebook._id}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-[#053c41]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:border-[#AE7C54]/35 hover:shadow-2xl hover:shadow-[#053c41]/12"
                >
                  <div className="relative overflow-hidden bg-[#f6f1ea]">
                    <img
                      src={
                        ebook.coverImage ||
                        "https://placehold.co/500x700?text=Fable+Ebook"
                      }
                      alt={ebook.title}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 md:h-64"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#031f22]/60 via-transparent to-transparent opacity-70" />

                    <span className="absolute left-3 top-3 rounded-full bg-[#053c41]/90 px-3 py-1 text-xs font-black text-white shadow backdrop-blur">
                      {ebook.genre || "Ebook"}
                    </span>

                    <span className="absolute bottom-3 right-3 rounded-full bg-[#AE7C54] px-3 py-1 text-xs font-black text-white shadow">
                      ${ebook.price}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-black leading-6 text-[#053c41] md:text-lg">
                      {ebook.title}
                    </h3>

                    <p className="mt-2 line-clamp-1 text-xs font-semibold text-[#053c41]/60 md:text-sm">
                      by {ebook.writerName || "Unknown Writer"}
                    </p>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-black text-[#AE7C54] md:text-sm">
                        View Details
                        <ArrowRight size={14} />
                      </span>

                      <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-xs font-bold text-[#053c41]">
                        Available
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}