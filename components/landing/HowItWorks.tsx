"use client";
// Force recompile for theme updates
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Share2, 
  Globe, 
  Lock, 
  Database 
} from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: "organize",
    title: "Organize Everything",
    description: "Stop losing code in random files. Tag, categorize, and store your snippets in one secure vault.",
    icon: Database,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    features: ["Smart tagging system", "Language auto-detection", "Folder-like structure"]
  },
  {
    id: "search",
    title: "Find in Milliseconds",
    description: "Powerful search that understands code. Filter by language, tags, or content instantly.",
    icon: Search,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    features: ["Fuzzy search", "Filter by tags", "Command palette interface"]
  },
  {
    id: "share",
    title: "Share Securely",
    description: "Share code with your team or the world. diverse visibility options for every use case.",
    icon: Share2,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    features: ["Public links", "Private team sharing", "Embed everywhere"]
  }
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  // Handle scroll to update active step
  useEffect(() => {
    const handleScroll = () => {
      const stepElements = steps.map((step) => document.getElementById(step.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      stepElements.forEach((element, index) => {
        if (element && element.offsetTop <= scrollPosition) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="how-it-works" className="py-24 sm:py-32 relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 sm:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Workflow optimized for <span className="text-violet-600 dark:text-violet-400">speed</span>
          </h2>
          <p className="text-gray-500 dark:text-[#A3A3A3] text-lg max-w-2xl mx-auto">
            Designed to fit perfectly into your development workflow without getting in your way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Sticky Navigation */}
          <div className="hidden lg:block relative">
            <div className="sticky top-32 space-y-8">
              {steps.map((step, index) => (
                <a
                  key={step.id}
                  href={`#${step.id}`}
                  className={cn(
                    "block p-6 rounded-2xl transition-all duration-300 border backdrop-blur-sm group cursor-pointer",
                    activeStep === index
                      ? "bg-white dark:bg-white/5 border-violet-500/30 shadow-lg scale-105"
                      : "bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5"
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' });
                    setActiveStep(index);
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "p-3 rounded-xl transition-colors",
                      activeStep === index ? step.bgColor : "bg-gray-100 dark:bg-white/5",
                      activeStep === index ? step.color : "text-gray-400 dark:text-white/40"
                    )}>
                      <step.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className={cn(
                        "text-xl font-bold mb-2 transition-colors",
                        activeStep === index ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/60"
                      )}>
                        {step.title}
                      </h3>
                      <p className={cn(
                        "text-sm leading-relaxed transition-colors",
                        activeStep === index ? "text-gray-500 dark:text-[#A3A3A3]" : "text-gray-400/60 dark:text-white/20"
                      )}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="space-y-24 sm:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                id={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20%" }}
                transition={{ duration: 0.5 }}
                className="relative pt-8 lg:pt-0"
              >
                {/* Mobile Heading (visible only on small screens) */}
                <div className="lg:hidden mb-8 flex items-center gap-4">
                  <div className={cn("p-3 rounded-xl", step.bgColor, step.color)}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                </div>

                {/* Content Card */}
                <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Mock Window Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-[#262626] bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                    </div>
                    <div className="ml-4 px-3 py-1 bg-gray-200 dark:bg-[#262626] rounded text-[10px] font-mono text-gray-500 dark:text-gray-400 w-full max-w-[200px]">
                      snippetvault.app/{step.id}
                    </div>
                  </div>

                  {/* Feature Visualizations */}
                  <div className="p-6 sm:p-8 min-h-[300px] flex flex-col justify-center">
                    {index === 0 && (
                      <div className="space-y-3">
                        {["Startups / Auth Middleware", "Personal / React Hooks", "Work / Database Utils"].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-[#262626] bg-gray-50 dark:bg-[#0A0A0A] hover:border-blue-500/30 transition-colors">
                            <Database className="w-4 h-4 text-blue-500" />
                            <span className="text-sm font-mono text-gray-600 dark:text-gray-300">{item}</span>
                            <div className="ml-auto flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {index === 1 && (
                      <div className="relative">
                        <div className="absolute inset-0 bg-violet-500/5 blur-2xl rounded-full"></div>
                        <div className="relative bg-white dark:bg-[#0A0A0A] border border-violet-500/30 rounded-lg p-4 shadow-lg">
                          <div className="flex items-center gap-2 text-gray-400 mb-4 border-b border-gray-100 dark:border-[#262626] pb-2">
                            <Search className="w-4 h-4" />
                            <span className="text-sm">IsUserAuthenticated...</span>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-mono text-violet-600 dark:text-violet-400">
                              <span className="text-pink-500">function</span> <span className="text-blue-500">isUserAuthenticated</span>() &#123;
                            </div>
                            <div className="text-sm font-mono text-gray-500 pl-4">
                              <span className="text-gray-400">// Found in 12ms</span>
                            </div>
                            <div className="text-sm font-mono text-gray-500 pl-4">
                             ...
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {index === 2 && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 text-center">
                          <Globe className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                          <div className="font-semibold text-gray-900 dark:text-white">Public</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Anyone with link</div>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#262626] border border-gray-100 dark:border-white/5 text-center opacity-50">
                          <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <div className="font-semibold text-gray-900 dark:text-white">Private</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Only you</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feature Bullets */}
                  <div className="bg-gray-50 dark:bg-[#0A0A0A]/50 px-6 py-4 border-t border-gray-100 dark:border-[#262626]">
                    <div className="flex flex-wrap gap-4">
                      {step.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <div className={cn("w-1.5 h-1.5 rounded-full", step.bgColor.replace("/10", ""))}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
