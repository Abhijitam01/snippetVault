import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateShortCode } from '../lib/shortcode';

const prisma = new PrismaClient();

async function main() {
  await prisma.snippet.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@snippetvault.com',
      password: hashedPassword,
      phone: '+1234567890',
      name: 'Demo User',
      username: 'demouser',
      bio: 'Passionate developer sharing useful code snippets',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      website: 'https://snippetvault.com',
      githubUrl: 'https://github.com/demouser',
    },
  });
  console.log('✅ Demo user created!');

  const webDev = await prisma.category.create({
    data: {
      name: 'Web Development',
      description: 'Frontend and backend web development snippets',
      icon: '🌐',
    },
  });

  const algorithms = await prisma.category.create({
    data: {
      name: 'Algorithms',
      description: 'Data structures and algorithms',
      icon: '🧮',
    },
  });

  const devops = await prisma.category.create({
    data: {
      name: 'DevOps',
      description: 'Docker, CI/CD, deployment scripts',
      icon: '🚀',
    },
  });

  const reactTag = await prisma.tag.create({
    data: { name: 'React', color: '#61DAFB' },
  });

  const tsTag = await prisma.tag.create({
    data: { name: 'TypeScript', color: '#3178C6' },
  });

  const nodeTag = await prisma.tag.create({
    data: { name: 'Node.js', color: '#339933' },
  });

  const pythonTag = await prisma.tag.create({
    data: { name: 'Python', color: '#3776AB' },
  });

  await prisma.snippet.create({
    data: {
      title: 'React Custom Hook - useLocalStorage',
      description: 'A reusable hook to sync state with localStorage',
      code: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
}`,
      language: 'typescript',
      userId: demoUser.id,
      shortCode: generateShortCode(),
      visibility: 'public',
      categoryId: webDev.id,
      tags: {
        connect: [{ id: reactTag.id }, { id: tsTag.id }],
      },
      notes: 'This hook syncs React state with localStorage. Remember to handle SSR carefully in Next.js - only access localStorage in useEffect or client components.',
      resources: JSON.stringify([
        'https://react.dev/reference/react/hooks',
        'https://usehooks.com/uselocalstorage',
      ]),
      isFavorite: true,
    },
  });

  await prisma.snippet.create({
    data: {
      title: 'Express Error Handler Middleware',
      description: 'Centralized error handling for Express apps',
      code: `import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
  });
};`,
      language: 'typescript',
      userId: demoUser.id,
      shortCode: generateShortCode(),
      visibility: 'public',
      categoryId: webDev.id,
      tags: {
        connect: [{ id: nodeTag.id }, { id: tsTag.id }],
      },
      notes: 'Always use this at the end of your middleware chain. Operational errors are expected errors that we can handle.',
      resources: JSON.stringify([
        'https://expressjs.com/en/guide/error-handling.html',
      ]),
      isFavorite: false,
    },
  });

  await prisma.snippet.create({
    data: {
      title: 'Binary Search Implementation',
      description: 'Classic binary search algorithm in Python',
      code: `def binary_search(arr: list[int], target: int) -> int:
    """
    Binary search implementation
    Returns index of target if found, else -1
    Time complexity: O(log n)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

# Example usage
sorted_array = [1, 3, 5, 7, 9, 11, 13, 15]
result = binary_search(sorted_array, 7)
print(f"Found at index: {result}")  # Output: 3`,
      language: 'python',
      userId: demoUser.id,
      shortCode: generateShortCode(),
      visibility: 'public',
      categoryId: algorithms.id,
      tags: {
        connect: [{ id: pythonTag.id }],
      },
      notes: 'Array MUST be sorted for binary search to work. For unsorted arrays, use linear search or sort first.',
      resources: JSON.stringify([
        'https://en.wikipedia.org/wiki/Binary_search_algorithm',
        'https://leetcode.com/problems/binary-search/',
      ]),
      isFavorite: true,
    },
  });

  await prisma.snippet.create({
    data: {
      title: 'Docker Compose - Full Stack App',
      description: 'Docker compose setup for Next.js + PostgreSQL',
      code: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - NODE_ENV=production
    depends_on:
      - db
    volumes:
      - ./:/app
      - /app/node_modules

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=myapp
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`,
      language: 'yaml',
      userId: demoUser.id,
      shortCode: generateShortCode(),
      visibility: 'public',
      categoryId: devops.id,
      tags: {
        connect: [{ id: nodeTag.id }],
      },
      notes: 'Remember to add .env file to .dockerignore. Use docker-compose up -d to run in background.',
      resources: JSON.stringify([
        'https://docs.docker.com/compose/',
      ]),
      isFavorite: false,
    },
  });

  await prisma.snippet.create({
    data: {
      title: 'Debounce Hook for Search',
      description: 'Custom React hook to debounce search input',
      code: `import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // Perform search
      console.log('Searching for:', debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}`,
      language: 'typescript',
      userId: demoUser.id,
      shortCode: generateShortCode(),
      visibility: 'public',
      categoryId: webDev.id,
      tags: {
        connect: [{ id: reactTag.id }, { id: tsTag.id }],
      },
      notes: 'Essential for search inputs to avoid making API calls on every keystroke. Adjust delay based on your needs.',
      resources: JSON.stringify([
        'https://usehooks.com/usedebounce',
        'https://www.freecodecamp.org/news/debounce-and-throttle-in-react/',
      ]),
      isFavorite: true,
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });