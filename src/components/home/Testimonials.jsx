"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Quote, Star } from "lucide-react";

const reviews = [
  {
    name: "Sarah Ahmed",
    role: "Avid Reader",
    text: "Fable completely changed how I discover ebooks. I can easily find hidden gems from new writers all over the world. The interface makes reading a absolute breeze.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    name: "Marcus Brody",
    role: "Independent Writer",
    text: "Publishing my ebook on Fable was seamless. I uploaded once and started reaching readers globally within days. The analytics dashboard is incredibly detailed!",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
  },
  {
    name: "Elena Rostova",
    role: "Book Blogger",
    text: "The platform's UI is phenomenally clean. Navigating through different genres, filtering books, and discovering indie authors is pure joy.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
  {
    name: "Zayan Malik",
    role: "Fantasy Author",
    text: "As a writer, the role-based system gives me absolute control. Tracking my sales and managing transactions through Stripe is fully automated and secure.",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    name: "Chloe Jenkins",
    role: "Casual Reader",
    text: "I love the secure checkout system. Buying ebooks is fast, safe, and they instantly appear in my dashboard. Highly recommended platform!",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  },
  {
    name: "David Kim",
    role: "Sci-Fi Enthusiast",
    text: "The bookmarking and public browsing features are top-notch. I can save books to read later without any hassle. A perfect ecosystem for bookworms.",
    img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.610, 0.355, 1.0] },
  },
};

export default function Testimonials() {
  return (
    <section className="bg-[#f6f1ea] px-6 py-24 md:px-12 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#AE7C54]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#053c41]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#AE7C54]/25 bg-[#AE7C54]/8 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#894329]"
          >
            <Sparkles size={13} className="text-[#AE7C54]" />
            Writers & Readers Community
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black  text-[#053c41] md:text-3xl lg:text-4xl tracking-tight"
          >
            Loved by Book Lovers <br className="hidden md:block"/> Across the Globe
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#053c41]/75 max-w-2xl mx-auto text-base mt-5 font-medium leading-relaxed"
          >
            Don't just take our word for it. Here is what our passionate community of digital readers and self-published writers have to say.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.01 }}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#AE7C54]/10 bg-[#053c41] p-8 shadow-xl shadow-[#053c41]/8 transition-all duration-300 hover:border-[#FCB886]/40 hover:shadow-2xl hover:shadow-[#031f22]/20 group"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#AE7C54] to-[#FCB886] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} className="fill-[#FCB886] text-[#FCB886]" />
                    ))}
                  </div>
                  <Quote size={28} className="text-[#f6f1ea]/10 group-hover:text-[#FCB886]/20 transition-colors duration-300" fill="currentColor" />
                </div>

                <p className="text-[#f6f1ea]/85 text-[14.5px] leading-relaxed font-medium italic mb-8">
                  “{item.text}”
                </p>
              </div>

              <div className="flex items-center gap-4 border-t border-[#f6f1ea]/10 pt-5 mt-auto">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={item.img}
                    fill
                    alt={item.name}
                    className="rounded-full object-cover border-2 border-[#FCB886]/20 group-hover:border-[#FCB886] transition-colors duration-300"
                  />
                </div>

                <div>
                  <h4 className="text-white font-bold text-sm tracking-wide">
                    {item.name}
                  </h4>
                  <p className="text-[#FCB886]/90 text-xs font-semibold mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}