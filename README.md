# SnippetVault

A minimal, developer-focused code snippet manager. Organize, search, and manage your code snippets with ease.

## Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete snippets
- 🎨 **Syntax Highlighting** - Powered by Prism.js with support for 20+ languages
- 🏷️ **Tag & Category Management** - Organize snippets with tags and categories
- 🔍 **Advanced Search & Filters** - Search by query, language, tags, category, and favorites
- ⭐ **Favorites** - Mark your most important snippets
- 💾 **Export/Import** - Backup and restore your snippets as JSON
- 🌙 **Dark Theme** - Beautiful dark theme UI optimized for developers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM with PostgreSQL
- **Styling:** Tailwind CSS
- **Syntax Highlighting:** Prism.js

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd snippetvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/snippetvault"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Seed default tags and categories (optional)**
   ```bash
   npm run db:seed
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed default tags and categories
- `npm run db:reset` - Clear all database data
- `npm run db:studio` - Open Prisma Studio

## Supported Languages

TypeScript, JavaScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, HTML, CSS, SQL, YAML, JSON, Markdown, Bash, Shell

## License

MIT License

---

Built with ❤️ by [Abhijitam Dubey](https://github.com/Abhijitam01)
