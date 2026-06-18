"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Sarah Ahmed",
    role: "Avid Reader",
    text: "Fable completely changed how I discover ebooks. I can easily find hidden gems from new writers all over the world.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Marcus Brody",
    role: "Independent Writer",
    text: "Publishing my ebook on Fable was seamless. I uploaded once and started reaching readers globally within days.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 w-full bg-[#0b0f0e]">
      
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          What People Say About Fable
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm mt-3">
          Readers and writers love the seamless experience of discovering and publishing ebooks.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {reviews.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/50 border border-white/10 backdrop-blur-xl p-8 rounded-2xl space-y-6 hover:border-[#AE7C54]/40 transition-all duration-300"
          >

            {/* Text */}
            <p className="text-slate-300 italic text-base leading-relaxed">
              “{item.text}”
            </p>

            {/* User */}
            <div className="flex items-center gap-4">
              <Image
                src={item.img}
                width={48}
                height={48}
                alt={item.name}
                className="rounded-full w-12 h-12 object-cover border border-white/10"
              />

              <div>
                <h4 className="text-white font-bold text-sm">
                  {item.name}
                </h4>
                <p className="text-[#AE7C54] text-xs font-semibold">
                  {item.role}
                </p>
              </div>
            </div>

          </motion.div>
        ))}

      </div>
    </section>
  );
}