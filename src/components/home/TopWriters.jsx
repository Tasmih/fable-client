"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTopWriters } from "@/lib/actions/home";
import {
  Award,
  BookOpen,
  Crown,
  Loader2,
  PenTool,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";

const manualWriterImages = [
  "https://i.ibb.co.com/ks2Zzs7b/jurica-koletic-7-YVZYZe-ITc8-unsplash.jpg",
  "https://i.ibb.co.com/YBxfmzyD/vince-veras-AJIq-ZDAUD7-A-unsplash.jpg",
  "https://i.ibb.co.com/KcVVdSSy/courtney-cook-TSZo17r3m0s-unsplash-1.jpg",
];


const manualWriterDescriptions = [
  "Known for writing engaging ebooks that keep readers connected from the first chapter to the last page.",
  "A creative storyteller bringing fresh ideas, strong imagination, and memorable reading experiences to Fable.",
  "Loved by readers for original content, consistent publishing quality, and a unique writing voice.",
];

const containerVariant = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariant = {
  hidden: {
    opacity: 0,
    y: 30,
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

export default function TopWriters() {
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopWriters = async () => {
      try {
        setLoading(true);

        const data = await getTopWriters(3);

        setWriters(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        setWriters([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopWriters();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f6f1ea] px-4 py-20 md:px-8">
      <div className="absolute -left-28 top-10 h-72 w-72 rounded-full bg-[#053c41]/10 blur-3xl" />
      <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[#FCB886]/25 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 max-w-3xl text-center"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#AE7C54]/25 bg-white px-5 py-2 text-sm font-black uppercase tracking-[0.16em] text-[#AE7C54] shadow-sm">
            <Star size={15} />
            Top Writers
          </div>

          <h2 className="text-3xl font-black leading-tight tracking-tight text-[#053c41] md:text-5xl">
            Best Selling Writers
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#053c41]/72 md:text-base">
            Meet the writers whose original ebooks are performing best on Fable
            and loved most by readers.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[1.35rem] border border-[#053c41]/10 bg-white p-7 shadow-sm"
              >
                <Loader2
                  size={34}
                  className="mx-auto animate-spin text-[#AE7C54]"
                />

                <div className="mx-auto mt-6 h-28 w-28 animate-pulse rounded-full bg-[#053c41]/10" />
                <div className="mx-auto mt-6 h-5 w-40 animate-pulse rounded bg-[#053c41]/10" />
                <div className="mx-auto mt-3 h-4 w-24 animate-pulse rounded bg-[#053c41]/10" />
                <div className="mt-6 h-20 animate-pulse rounded-xl bg-[#053c41]/10" />
              </div>
            ))}
          </div>
        ) : writers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl rounded-[1.35rem] border border-[#AE7C54]/20 bg-white p-12 text-center shadow-sm"
          >
            <PenTool size={46} className="mx-auto text-[#AE7C54]" />

            <h3 className="mt-4 text-2xl font-black text-[#053c41]">
              No top writers yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#053c41]/70">
              Top writers will appear here automatically after ebook sales are
              available.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-6 md:grid-cols-3"
          >
            {writers.map((writer, index) => {
              const writerName = writer.name || "Fable Writer";

              const writerImage =
                writer.image || 
                writer.avatar ||
                writer.photoURL ||
                manualWriterImages[index] ||
                "";



              const writerDescription =
                writer.description ||
                writer.bio ||
                manualWriterDescriptions[index] ||
                "A talented writer creating original ebooks for readers on Fable.";

              const writerSales =
                writer.sales || writer.totalSales || writer.soldCount || 0;

              return (
                <motion.div
                  key={writer.email || writerName || index}
                  variants={cardVariant}
                  whileHover={{
                    y: -8,
                    scale: 1.015,
                    transition: { duration: 0.22 },
                  }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-[#053c41]/10 bg-white p-7 text-center shadow-sm transition hover:border-[#AE7C54]/40 hover:shadow-2xl hover:shadow-[#053c41]/10"
                >
                  <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-[#053c41] via-[#07565d] to-[#AE7C54]" />

                  <div className="relative flex items-center justify-between">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                      {index === 0 ? <Crown size={14} /> : <Award size={14} />}
                      Rank #{index + 1}
                    </div>

                    <div className="inline-flex items-center gap-1 rounded-full bg-[#FCB886] px-3 py-1.5 text-xs font-black text-[#053c41]">
                      <Sparkles size={13} />
                      Top Seller
                    </div>
                  </div>

                  <div className="relative mx-auto mt-7 flex h-32 w-32 items-center justify-center rounded-full border-[6px] border-white bg-[#f6f1ea] shadow-xl shadow-black/15">
                    {writerImage ? (
                      <img
                        src={writerImage}
                        alt={writerName}
                        referrerPolicy="no-referrer"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-[#AE7C54] text-4xl font-black text-white">
                        {writerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-[#053c41]">
                    {writerName}
                  </h3>

                  <p className="mt-1 text-sm font-bold text-[#AE7C54]">
                    Best Selling Writer
                  </p>

                  <div className="mx-auto mt-5 flex max-w-[230px] items-center justify-center gap-3 rounded-xl border border-[#AE7C54]/15 bg-[#f6f1ea] px-4 py-3">
                    <BookOpen size={18} className="text-[#AE7C54]" />

                    <div className="text-left">
                      <p className="text-lg font-black leading-none text-[#053c41]">
                        {writerSales}
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#053c41]/60">
                        Ebook Sales
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 flex-1 text-sm leading-7 text-[#053c41]/70">
                    {writerDescription}
                  </p>

                  <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#AE7C54]/15 bg-white px-4 py-3 text-sm font-black text-[#AE7C54] transition group-hover:border-[#AE7C54]/35 group-hover:bg-[#AE7C54] group-hover:text-white">
                    <TrendingUp size={16} />
                    Reader Favorite
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}