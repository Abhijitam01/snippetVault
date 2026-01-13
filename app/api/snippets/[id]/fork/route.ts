import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { generateShortCode } from '@/lib/shortcode';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require authentication
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the original snippet
    const originalSnippet = await prisma.snippet.findUnique({
      where: { id: params.id },
      include: {
        tags: true,
        category: true,
      },
    });

    if (!originalSnippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check if snippet is accessible (public or unlisted)
    if (originalSnippet.visibility === 'private' && originalSnippet.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Cannot fork private snippet' },
        { status: 403 }
      );
    }

    // Generate unique short code for the forked snippet
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

    // Create the forked snippet
    const forkedSnippet = await prisma.snippet.create({
      data: {
        title: `${originalSnippet.title} (Fork)`,
        description: originalSnippet.description,
        code: originalSnippet.code,
        language: originalSnippet.language,
        categoryId: originalSnippet.categoryId,
        notes: originalSnippet.notes,
        resources: originalSnippet.resources,
        userId: currentUser.userId,
        shortCode,
        visibility: 'public', // Forked snippets default to public
        forkedFrom: originalSnippet.id,
        tags: {
          connect: originalSnippet.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        category: true,
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

    // Increment fork count on original snippet
    await prisma.snippet.update({
      where: { id: originalSnippet.id },
      data: {
        forkedCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(forkedSnippet, { status: 201 });
  } catch (error) {
    console.error('Error forking snippet:', error);
    return NextResponse.json(
      { error: 'Failed to fork snippet' },
      { status: 500 }
    );
  }
}

