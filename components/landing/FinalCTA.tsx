"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-100 dark:border-[#262626] text-center">
      <div className="max-w-[600px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold text-gray-900 dark:text-[#FAFAFA] mb-4 sm:mb-6 px-4">
            Start organizing your code
          </h2>
          <p className="text-[14px] sm:text-[16px] text-gray-500 dark:text-[#737373] mb-6 sm:mb-8 px-4">
            No setup. Free to use. Open source.
          </p>

          <Link
            href="/auth/signup"
            className="inline-block bg-violet-600 dark:bg-violet-500 text-white dark:text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            Create your account →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
