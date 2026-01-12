# SnippetVault

A modern, full-featured code snippet manager built with Next.js 14, TypeScript, and Prisma. Organize, search, and manage your code snippets with ease.

## Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete snippets
- 🎨 **Syntax Highlighting** - Powered by Prism.js with support for 20+ languages
- 🏷️ **Tag & Category Management** - Organize snippets with tags and categories
- 🔍 **Advanced Search & Filters** - Search by query, language, tags, category, and favorites
- ⭐ **Favorites** - Mark your most important snippets
- 📝 **Personal Notes** - Add notes and resource links to each snippet
- 💾 **Export/Import** - Backup and restore your snippets as JSON
- 🌙 **Dark Theme** - Beautiful dark theme UI optimized for developers
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔔 **Toast Notifications** - Real-time feedback for all actions

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Database:** Prisma ORM with SQLite
- **Styling:** Tailwind CSS
- **Syntax Highlighting:** Prism.js
- **Validation:** Zod
- **Notifications:** React Hot Toast

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd snippetvault
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
```

For production, you can use a different database URL.

### 4. Set Up the Database

Generate Prisma Client and push the schema to the database:

```bash
npm run db:push
# or
yarn db:push
# or
pnpm db:push
```

This will create the SQLite database file and set up all the tables.

### 5. Seed the Database (Optional)

Populate the database with sample data:

```bash
npm run db:seed
# or
yarn db:seed
# or
pnpm db:seed
```

This will create 5 sample snippets covering:
- React hooks
- Express middleware
- Algorithms
- Docker/DevOps
- Utility functions

Plus sample tags and categories.

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to the database
- `npm run db:seed` - Seed the database with sample data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
snippetvault/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # API endpoints
│   │   ├── snippets/      # Snippet CRUD operations
│   │   ├── tags/          # Tag operations
│   │   ├── categories/    # Category operations
│   │   ├── search/        # Search endpoint
│   │   ├── export/        # Export endpoint
│   │   └── import/        # Import endpoint
│   └── snippets/          # Snippet pages
├── components/            # React components
│   ├── layout/           # Layout components
│   ├── snippets/         # Snippet-related components
│   └── ui/               # Reusable UI components
├── lib/                  # Utilities and helpers
│   ├── hooks/           # Custom React hooks
│   ├── prisma.ts        # Prisma client instance
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
├── prisma/              # Database configuration
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Database seed script
└── types/               # TypeScript type definitions
```

## API Routes

### Snippets
- `GET /api/snippets` - Get all snippets (with optional filters)
- `POST /api/snippets` - Create a new snippet
- `GET /api/snippets/[id]` - Get a single snippet
- `PUT /api/snippets/[id]` - Update a snippet
- `DELETE /api/snippets/[id]` - Delete a snippet

### Tags
- `GET /api/tags` - Get all tags
- `POST /api/tags` - Create a new tag
- `DELETE /api/tags/[id]` - Delete a tag

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/[id]` - Get a single category
- `PUT /api/categories/[id]` - Update a category
- `DELETE /api/categories/[id]` - Delete a category

### Search
- `GET /api/search` - Search snippets with filters (query, language, tagIds, categoryId, isFavorite)

### Export/Import
- `GET /api/export` - Export all snippets as JSON
- `POST /api/import` - Import snippets from JSON

## Supported Languages

SnippetVault supports syntax highlighting for:

TypeScript, JavaScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby, Swift, Kotlin, HTML, CSS, SQL, YAML, JSON, Markdown, Bash, Shell

## Usage

### Creating a Snippet

1. Click "New Snippet" in the sidebar
2. Fill in the title, code, and language (required)
3. Optionally add description, tags, category, notes, and resource URLs
4. Mark as favorite if desired
5. Click "Save"

### Searching and Filtering

- Use the search bar to search by text (searches title, description, code, and notes)
- Use filters to narrow down by:
  - Language
  - Category
  - Tags (select multiple)
  - Favorites only

### Exporting and Importing

- Click "Export" in the header to download all snippets as JSON
- Click "Import" in the header to upload a JSON file and import snippets

## Database Schema

The application uses three main models:

- **Snippet** - Contains title, code, language, description, notes, resources (JSON), isFavorite, and relations to tags and category
- **Tag** - Many-to-many relationship with Snippet (name, color)
- **Category** - One-to-many relationship with Snippet (name, description, icon)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.
