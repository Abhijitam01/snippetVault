"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    title: "JavaScript / TS",
    color: "#3B82F6",
    items: ["React Hooks", "Utils", "API Calls"]
  },
  {
    title: "Python",
    color: "#8B5CF6",
    items: ["Data Processing", "Flask/Django", "Scripts"]
  },
  {
    title: "Rust",
    color: "#10B981",
    items: ["Structs", "Macros", "Concurrency"]
  },
  {
    title: "Go",
    color: "#F59E0B",
    items: ["Goroutines", "Interfaces", "Web Server"]
  },
  {
    title: "SQL",
    color: "#EF4444",
    items: ["Complex Joins", "Migrations", "Optimization"]
  }
];

export function Examples() {
  return (
    <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 bg-transparent">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6 border-b border-gray-100 dark:border-[#262626] pb-6 sm:pb-8">
           <div>
             <span className="text-violet-500 dark:text-violet-400 font-mono text-[10px] sm:text-xs uppercase tracking-wider mb-2 block">Vault</span>
             <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 dark:text-[#FAFAFA] leading-tight">
               Organize by Language
             </h2>
           </div>
           <Link href="/auth/signup" className="text-gray-500 dark:text-[#A3A3A3] text-xs sm:text-sm hover:text-gray-900 dark:hover:text-[#FAFAFA] flex items-center gap-2 group">
             Start building your vault <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#262626] rounded-2xl p-6 sm:p-8 hover:border-violet-500/20 dark:hover:border-violet-500/20 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: category.color }} />
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-[#FAFAFA] uppercase tracking-wide">{category.title}</h3>
              </div>

              <ul className="space-y-2 sm:space-y-3">
                {category.items.map((item) => (
                  <li key={item}>
                    <span
                      className="block text-xs sm:text-sm text-gray-500 dark:text-[#737373] hover:text-gray-900 dark:hover:text-[#FAFAFA] transition-colors py-1 group-hover/link cursor-default font-mono"
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
          {/* Empty cell filler if needed for perfect grid or ad */}
           <div className="bg-gray-50 dark:bg-[#111111] border border-dashed border-gray-200 dark:border-[#262626] rounded-2xl p-6 sm:p-8 flex items-center justify-center text-gray-400 dark:text-[#525252]">
              <span className="text-[10px] sm:text-xs font-mono uppercase">Add your own</span>
           </div>
        </div>
      </div>
    </section>
  );
}
