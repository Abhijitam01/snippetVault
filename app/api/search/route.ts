import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';

// Parse search query for operators (AND, OR, NOT)
function parseSearchQuery(query: string): {
  terms: string[];
  excludeTerms: string[];
  mode: 'AND' | 'OR';
} {
  const trimmed = query.trim();
  const excludeTerms: string[] = [];
  const includeTerms: string[] = [];
  let mode: 'AND' | 'OR' = 'OR';

  // Check for explicit AND/OR operators
  if (trimmed.includes(' AND ')) {
    mode = 'AND';
  }

  // Split by spaces but preserve quoted strings
  const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [trimmed];

  parts.forEach((part) => {
    const cleanPart = part.replace(/^"|"$/g, '');
    if (cleanPart.startsWith('-') || cleanPart.startsWith('NOT ')) {
      const excludeTerm = cleanPart.replace(/^-\s*|^NOT\s+/i, '').trim();
      if (excludeTerm) excludeTerms.push(excludeTerm);
    } else if (cleanPart.toLowerCase() === 'and' || cleanPart.toLowerCase() === 'or') {
      // Skip operators
    } else {
      if (cleanPart) includeTerms.push(cleanPart);
    }
  });

  return {
    terms: includeTerms.length > 0 ? includeTerms : [trimmed],
    excludeTerms,
    mode,
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const language = searchParams.get('language');
    const isFavorite = searchParams.get('isFavorite');
    const tagIds = searchParams.getAll('tagIds');
    const userId = searchParams.get('userId');

    // Build where clause
    const where: {
      AND?: any[];
      OR?: any[];
      NOT?: any[];
      language?: string;
      isFavorite?: boolean;
      tags?: { some: { id: { in: string[] } } };
      userId?: string;
    } = {};

    // Text search with operators
    if (query && query.trim()) {
      const { terms, excludeTerms, mode } = parseSearchQuery(query.trim());

      if (terms.length > 0) {
        const searchConditions = terms.flatMap((term) => [
          { title: { contains: term, mode: 'insensitive' as const } },
          { description: { contains: term, mode: 'insensitive' as const } },
          { code: { contains: term, mode: 'insensitive' as const } },
          { notes: { contains: term, mode: 'insensitive' as const } },
        ]);

        if (mode === 'AND') {
          // All terms must match
          where.AND = searchConditions.map((condition) => ({
            OR: [
              { title: condition.title },
              { description: condition.description },
              { code: condition.code },
              { notes: condition.notes },
            ],
          }));
        } else {
          // Any term can match (OR)
          where.OR = searchConditions;
        }
      }

      // Exclude terms
      if (excludeTerms.length > 0) {
        where.NOT = excludeTerms.flatMap((term) => [
          { title: { contains: term, mode: 'insensitive' as const } },
          { description: { contains: term, mode: 'insensitive' as const } },
          { code: { contains: term, mode: 'insensitive' as const } },
          { notes: { contains: term, mode: 'insensitive' as const } },
        ]);
      }
    }

    // Filter by language
    if (language) {
      where.language = language;
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

    // Filter by user
    if (userId) {
      where.userId = userId;
    }

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 100, // Limit results
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

