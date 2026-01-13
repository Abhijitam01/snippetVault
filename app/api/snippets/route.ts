import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSnippetSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { generateShortCode } from '@/lib/shortcode';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language');
    const isFavorite = searchParams.get('isFavorite');
    const userId = searchParams.get('userId');
    const visibility = searchParams.get('visibility');

    // Get current user if authenticated
    const currentUser = await getUserFromRequest(request);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // Max 100
    const skip = (page - 1) * limit;

    const where = {
      ...(language && { language }),
      ...(isFavorite && { isFavorite: isFavorite === 'true' }),
      ...(userId && { userId }),
      ...(visibility && { visibility }),
      // If requesting user's own snippets, show all visibility
      // If not, only show public snippets
      ...(!userId && !currentUser && { visibility: 'public' }),
    };

    const [snippets, total] = await Promise.all([
      prisma.snippet.findMany({
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
        skip,
        take: limit,
      }),
      prisma.snippet.count({ where }),
    ]);

    // Filter out private snippets that don't belong to current user
    const filteredSnippets = snippets.filter((snippet) => {
      if (snippet.visibility === 'public' || snippet.visibility === 'unlisted') {
        return true;
      }
      if (snippet.visibility === 'private' && currentUser && snippet.userId === currentUser.userId) {
        return true;
      }
      return false;
    });

    return NextResponse.json({
      snippets: filteredSnippets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = createSnippetSchema.parse(body);

    // Generate unique short code
    let shortCode = generateShortCode();
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.snippet.findUnique({
        where: { shortCode },
      });
      if (!existing) break;
      shortCode = generateShortCode();
      attempts++;
    }

    if (attempts >= 10) {
      return NextResponse.json(
        { error: 'Failed to generate unique short code' },
        { status: 500 }
      );
    }

    const snippet = await prisma.snippet.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        code: validatedData.code,
        language: validatedData.language,
        notes: validatedData.notes || null,
        resources: validatedData.resources && validatedData.resources.length > 0
          ? JSON.stringify(validatedData.resources)
          : null,
        userId: currentUser.userId,
        shortCode,
        visibility: validatedData.visibility || 'public',
        tags: validatedData.tagIds && validatedData.tagIds.length > 0
          ? {
              connect: validatedData.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
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
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error creating snippet:', error);
    return NextResponse.json(
      { error: 'Failed to create snippet' },
      { status: 500 }
    );
  }
}