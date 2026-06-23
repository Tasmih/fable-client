"use client";

import { motion } from "framer-motion";
import { Users, BookOpen, Landmark, Award } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "15,000+",
    label: "Active Readers",
    desc: "Discovering worldwide original stories daily.",
  },
  {
    icon: BookOpen,
    value: "2,400+",
    label: "Original Ebooks",
    desc: "Spanning across fiction, mystery, sci-fi, and horror.",
  },
  {
    icon: Landmark,
    value: "$45K+",
    label: "Writer Earnings",
    desc: "Secured, processed, and paid out via Stripe.",
  },
  {
    icon: Award,
    value: "4.9/5",
    label: "Platform Rating",
    desc: "Loved by independent authors and avid readers.",
  },
];

const duplicatedStats = [...stats, ...stats];

export default function PlatformStats() {
  return (
    <section className="bg-[#f6f1ea] py-12 md:py-16 overflow-hidden relative w-full">
      
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#f6f1ea] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#f6f1ea] to-transparent z-10 pointer-events-none" />

      <div className="w-full">
     
        <motion.div
          className="flex gap-6 w-max px-6"
          animate={{
            x: ["0%", "-50%"], 
          }}
          transition={{
            ease: "linear",
            duration: 25, 
            repeat: Infinity,
          }}
          
          whileHover={{ animationPlayState: "paused" }} 
        >
          {duplicatedStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group relative flex-shrink-0 w-[280px] sm:w-[320px] rounded-2xl border border-[#AE7C54]/15 bg-white p-6 shadow-md transition-all duration-300 hover:border-[#053c41]/30 hover:shadow-xl cursor-pointer"
              >
                {/* Icon Box */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f6f1ea] text-[#AE7C54] transition-colors duration-300 group-hover:bg-[#053c41] group-hover:text-white">
                  <Icon size={20} />
                </div>

                {/* Counter Value */}
                <h3 className="mt-4 text-2xl font-black tracking-tight text-[#031f22] md:text-3xl">
                  {stat.value}
                </h3>

                {/* Label */}
                <h4 className="mt-1 text-xs font-bold uppercase tracking-wider text-[#AE7C54]">
                  {stat.label}
                </h4>

                {/* Description */}
                <p className="mt-1.5 text-xs leading-relaxed text-[#053c41]/75 font-medium">
                  {stat.desc}
                </p>

                {/* Bottom line indicator */}
                <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-[#AE7C54]/10 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 group-hover:bg-[#AE7C54]" />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}