"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[#AE7C54]/10 bg-[#0f6f7a]/10 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#AE7C54] rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-5 h-5" />
            </div>
            <span className="text-[#f6f1ea] font-bold text-lg font-serif">Fable</span>
          </Link>
          <p className="text-[#f6f1ea]/60 text-sm leading-relaxed">
            A digital platform connecting ebook lovers with talented writers. Discover, read, and share original ebooks from around the world.
          </p>
         <div className="flex gap-4 text-[#f6f1ea]/60">
  <a href="#" className="hover:text-[#AE7C54] transition-colors"><FaFacebook size={18} /></a>
  <a href="#" className="hover:text-[#AE7C54] transition-colors"><FaTwitter size={18} /></a>
  <a href="#" className="hover:text-[#AE7C54] transition-colors"><FaInstagram size={18} /></a>
  <a href="#" className="hover:text-[#AE7C54] transition-colors"><FaGithub size={18} /></a>
</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-[#f6f1ea] font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
          <ul className="space-y-2 text-[#f6f1ea]/60 text-sm">
            <li><Link href="/" className="hover:text-[#AE7C54] transition-colors">Home</Link></li>
            <li><Link href="/browse" className="hover:text-[#AE7C54] transition-colors">Browse Ebooks</Link></li>
            <li><Link href="/dashboard" className="hover:text-[#AE7C54] transition-colors">Dashboard</Link></li>
            <li><Link href="/auth/login" className="hover:text-[#AE7C54] transition-colors">Login</Link></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-[#f6f1ea] font-semibold text-sm uppercase tracking-wider mb-4">Genres</h3>
          <ul className="space-y-2 text-[#f6f1ea]/60 text-sm">
            <li><Link href="/browse?genre=Fiction" className="hover:text-[#AE7C54] transition-colors">Fiction</Link></li>
            <li><Link href="/browse?genre=Mystery" className="hover:text-[#AE7C54] transition-colors">Mystery</Link></li>
            <li><Link href="/browse?genre=Romance" className="hover:text-[#AE7C54] transition-colors">Romance</Link></li>
            <li><Link href="/browse?genre=Sci-Fi" className="hover:text-[#AE7C54] transition-colors">Sci-Fi</Link></li>
            <li><Link href="/browse?genre=Fantasy" className="hover:text-[#AE7C54] transition-colors">Fantasy</Link></li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-[#f6f1ea] font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
          <ul className="space-y-2 text-[#f6f1ea]/60 text-sm">
            <li><a href="#" className="hover:text-[#AE7C54] transition-colors">About</a></li>
            <li><a href="#" className="hover:text-[#AE7C54] transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-[#AE7C54] transition-colors">Privacy Policy</a></li>
          </ul>

          <h3 className="text-[#f6f1ea] font-semibold text-sm uppercase tracking-wider mt-6 mb-4">Newsletter</h3>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-[#0f6f7a] border border-[#AE7C54]/30 text-[#f6f1ea] placeholder-[#f6f1ea]/40 text-sm rounded-lg px-3 py-2 outline-none focus:border-[#AE7C54] transition-colors"
            />
            <button className="bg-[#AE7C54] hover:bg-[#e8a95c] text-white text-sm rounded-lg px-3 py-2 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>

      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-7xl mx-auto px-6 border-t border-[#AE7C54]/20 mt-12 pt-8 text-center text-[#f6f1ea]/40 text-xs"
      >
        <p>&copy; {new Date().getFullYear()} Fable. All rights reserved.</p>
      </motion.div>
    </footer>
  );
}