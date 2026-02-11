"use client";

import { Check, Search, Tag, X } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Instant Search",
    before: "Digging through files",
    after: "Find in milliseconds",
    description: "Search by language, tag, or content. Find that regex you wrote 3 months ago instantly.",
    gradient: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10"
  },
  {
    icon: Tag,
    title: "Smart Organization",
    before: "Messy folders",
    after: "Clean tags & categories",
    description: "Organize snippets with flexible tagging. Keep your code library structured and accessible.",
    gradient: "from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10"
  },
  {
    icon: Check,
    title: "Always Available",
    before: "Lost on old laptop",
    after: "Safe in the cloud",
    description: "Your snippets are synced and backed up. Access your personal library from anywhere.",
    gradient: "from-green-500/10 to-green-500/5 dark:from-green-500/20 dark:to-green-500/10"
  }
];

export function WhySwitch() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-transparent">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4 sm:gap-6 border-b border-gray-100 dark:border-[#262626] pb-6 sm:pb-8">
          <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-gray-900 dark:text-[#FAFAFA] leading-tight max-w-md">
            Why developers choose SnippetVault
          </h2>
          <p className="text-gray-500 dark:text-[#737373] text-xs sm:text-sm max-w-sm">
            Stop rewriting the same helper functions. Build your personal knowledge base.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-[#262626] rounded-2xl p-8 hover:border-violet-500/20 dark:hover:border-violet-500/20 hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity rounded-full -mr-10 -mt-10`} />

              <div className="relative z-10">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 dark:bg-[#1A1A1A] border border-gray-100 dark:border-[#262626] flex items-center justify-center mb-4 sm:mb-6 text-gray-900 dark:text-[#FAFAFA]">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-[#FAFAFA] mb-4 sm:mb-6">{feature.title}</h3>

                <div className="space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm bg-gray-50 dark:bg-[#111111] p-4 rounded-lg">
                  <div className="flex items-center gap-3 text-gray-400 dark:text-[#525252]">
                    <X className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> <span className="line-through">{feature.before}</span>
                  </div>
                  <div className="flex items-center gap-3 text-violet-600 dark:text-violet-400 font-medium">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" /> <span>{feature.after}</span>
                  </div>
                </div>

                <p className="text-gray-500 dark:text-[#737373] text-xs sm:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
