"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Zap, Lock, Code2, Tag } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 flex items-center justify-center bg-transparent text-gray-900 dark:text-[#FAFAFA] border-b border-gray-100 dark:border-[#262626] min-h-[70vh] sm:min-h-[80vh]">
      <div className="max-w-[1200px] w-full text-center relative z-10 px-4">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="mb-6 flex justify-center">
            <span className="px-3 py-1 text-xs font-mono text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30 bg-violet-50 dark:bg-violet-500/10 rounded uppercase tracking-wider">
              v1.0 Public Beta
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-[36px] leading-[1.1] sm:text-[48px] md:text-[64px] lg:text-[80px] xl:text-[96px] font-bold tracking-tight mb-6 sm:mb-8 text-gray-900 dark:text-white px-2"
          >
            The Code Snippet Vault
            <br />
            <span className="text-violet-600 dark:text-violet-500">you needed.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-[16px] leading-[24px] sm:text-[18px] sm:leading-[28px] md:text-[20px] md:leading-[32px] lg:text-[22px] text-gray-500 dark:text-[#A3A3A3] mb-8 sm:mb-12 max-w-[600px] mx-auto px-4"
          >
            Store your code snippets. Organize with tags.
            Search instantly. Share with ease.
            Zero clutter. No distractions. Open source.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 mb-8 sm:mb-12 px-4"
          >
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto bg-gray-900 dark:bg-[#FAFAFA] text-white dark:text-[#0A0A0A] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-semibold hover:bg-gray-800 dark:hover:bg-white transition-colors text-center shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white/50 dark:bg-transparent text-gray-600 dark:text-[#A3A3A3] border border-gray-200 dark:border-[#262626] px-8 sm:px-10 py-3 sm:py-4 rounded text-sm sm:text-base font-medium hover:text-gray-900 dark:hover:text-[#FAFAFA] hover:border-gray-400 dark:hover:border-[#525252] hover:bg-white/80 dark:hover:bg-transparent transition-all text-center"
            >
              Learn More
            </a>
          </motion.div>

          {/* Fast Facts - Glass Cards */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto w-full px-4"
          >
            {[
              { icon: Zap, text: "Instant Search", sub: "Find code in ms" },
              { icon: Lock, text: "Safe & Secure", sub: "Private by default" },
              { icon: Code2, text: "Syntax Highlight", sub: "50+ languages" },
              { icon: Tag, text: "Smart Tags", sub: "Organize your way" },
            ].map((fact, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl hover:border-violet-500/30 dark:hover:border-violet-500/30 hover:shadow-lg transition-all w-[160px] sm:w-[180px] backdrop-blur-sm group">
                <div className="p-3 rounded-full bg-violet-50 dark:bg-white/5 mb-3 group-hover:scale-110 transition-transform text-violet-600 dark:text-violet-400 group-hover:text-violet-500 dark:group-hover:text-violet-300">
                  <fact.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white mb-1 text-center">{fact.text}</span>
                <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 text-center">{fact.sub}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
