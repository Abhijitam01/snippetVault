"use client";

import { motion } from "framer-motion";
import SnippetCard from "@/components/snippets/SnippetCard";

// Mock snippets for the demo
const mockSnippets = [
  {
    id: "demo-1",
    title: "JWT Authentication Middleware",
    description: "Secure your API routes with this reusable JWT middleware. Handles token verification and user context attachment.",
    code: `import jwt from 'jsonwebtoken';\n\nexport const auth = (req, res, next) => {\n  const token = req.header('x-auth-token');\n  if (!token) return res.status(401).send('Access denied.');\n\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    req.user = decoded;\n    next();\n  } catch (ex) {\n    res.status(400).send('Invalid token.');\n  }\n};`,
    language: "typescript",
    tags: [
      { id: "t1", name: "auth", color: "#14F195", createdAt: new Date() },
      { id: "t2", name: "backend", color: "#3B82F6", createdAt: new Date() },
      { id: "t3", name: "security", color: "#EF4444", createdAt: new Date() },
    ],
    isFavorite: true,
    userId: "demo-user",
    visibility: "public",
    shortCode: "jwt-auth",
    viewCount: 1240,
    createdAt: new Date(),
    updatedAt: new Date(),
    notes: null,
    resources: null,
  },
  {
    id: "demo-2",
    title: "React useFetch Hook",
    description: "Custom hook for data fetching with loading states, error handling, and caching support.",
    code: `import { useState, useEffect } from 'react';\n\nexport const useFetch = (url) => {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(res => res.json())\n      .then(data => {\n        setData(data);\n        setLoading(false);\n      });\n  }, [url]);\n\n  return { data, loading };\n};`,
    language: "javascript",
    tags: [
      { id: "t4", name: "react", color: "#61DAFB", createdAt: new Date() },
      { id: "t5", name: "hooks", color: "#14F195", createdAt: new Date() },
      { id: "t6", name: "frontend", color: "#F59E0B", createdAt: new Date() },
    ],
    isFavorite: false,
    userId: "demo-user",
    visibility: "public",
    shortCode: "use-fetch",
    viewCount: 850,
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
    updatedAt: new Date(),
    notes: null,
    resources: null,
  },
  {
    id: "demo-3",
    title: "Database Connection Pool",
    description: "Efficient PostgreSQL connection pooling configuration using pg-pool for high-performance applications.",
    code: `import { Pool } from 'pg';\n\nconst pool = new Pool({\n  user: process.env.DB_USER,\n  host: process.env.DB_HOST,\n  database: process.env.DB_NAME,\n  password: process.env.DB_PASSWORD,\n  port: 5432,\n  max: 20,\n  idleTimeoutMillis: 30000,\n});\n\nexport default pool;`,
    language: "sql", // Using SQL color for DB related, though code is JS/TS
    tags: [
      { id: "t7", name: "database", color: "#336791", createdAt: new Date() },
      { id: "t8", name: "postgres", color: "#336791", createdAt: new Date() },
      { id: "t9", name: "performance", color: "#14F195", createdAt: new Date() },
    ],
    isFavorite: true,
    userId: "demo-user",
    visibility: "public",
    shortCode: "db-pool",
    viewCount: 2100,
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
    updatedAt: new Date(),
    notes: null,
    resources: null,
  },
];

export function ProductDemo() {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 relative overflow-hidden bg-transparent">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <span className="px-3 py-1 rounded-full border border-violet-200 dark:border-white/10 bg-violet-50 dark:bg-white/5 text-xs font-mono text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-4">
            Your Personal Code Vault
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            A home for your code
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg">
            Stop digging through old projects. Save your snippets once, organize them with tags,
            and find them instantly when you need them again.
          </p>
        </div>

        {/* Dashboard Preview Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
        >
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[800px] bg-violet-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

          {mockSnippets.map((snippet, idx) => (
            <motion.div
              key={snippet.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 + 0.2 }}
            >
              {/* @ts-ignore - Mock data aligns with required fields but TypeScript might be strict about exact types from Prisma */}
              <SnippetCard snippet={snippet} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

