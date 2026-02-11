# SnippetVault

A minimal, developer-focused code snippet manager. Organize, search, and manage your code snippets with ease.

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

## Supported Languages

TypeScript, JavaScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, HTML, CSS, SQL, YAML, JSON, Markdown, Bash, Shell

## Theme

SnippetVault features a premium **Violet/Purple** theme that adapts seamlessly to both **Light** and **Dark** modes. The design focuses on clarity, readability, and a developer-centric aesthetic with a subtle vertical-lines background pattern.

Built with ❤️ by [Abhijitam Dubey](https://abhijitamdubey.site)
