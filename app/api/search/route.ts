import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const language = searchParams.get('language');
    const categoryId = searchParams.get('categoryId');
    const isFavorite = searchParams.get('isFavorite');
    const tagIds = searchParams.getAll('tagIds');

    // Build where clause
    const where: {
      OR?: Array<{ [key: string]: { contains: string; mode: string } }>;
      language?: string;
      categoryId?: string;
      isFavorite?: boolean;
      tags?: { some: { id: { in: string[] } } };
    } = {};

    // Text search in title, description, code, and notes
    // SQLite doesn't support mode: 'insensitive', but contains works case-insensitively for most cases
    if (query && query.trim()) {
      const searchQuery = query.trim();
      where.OR = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { code: { contains: searchQuery } },
        { notes: { contains: searchQuery } },
      ];
    }

    // Filter by language
    if (language) {
      where.language = language;
    }

    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }

    // Filter by favorite status
    if (isFavorite !== null && isFavorite !== undefined) {
      where.isFavorite = isFavorite === 'true';
    }

    // Filter by tags (many-to-many relation)
    if (tagIds && tagIds.length > 0) {
      where.tags = {
        some: {
          id: {
            in: tagIds,
          },
        },
      };
    }

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        tags: true,
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error searching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to search snippets' },
      { status: 500 }
    );
  }
}

