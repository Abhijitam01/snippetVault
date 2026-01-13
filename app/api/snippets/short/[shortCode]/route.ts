import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const currentUser = await getUserFromRequest(request);
    
    const snippet = await prisma.snippet.findUnique({
      where: { shortCode: params.shortCode },
      include: {
        tags: true,
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
            bio: true,
            website: true,
            githubUrl: true,
            twitterUrl: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check visibility access
    if (snippet.visibility === 'private') {
      if (!currentUser || snippet.userId !== currentUser.userId) {
        return NextResponse.json(
          { error: 'Snippet not found or not accessible' },
          { status: 404 }
        );
      }
    }

    // Increment view count
    await prisma.snippet.update({
      where: { id: snippet.id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    // Check if current user has liked this snippet
    let hasLiked = false;
    if (currentUser) {
      const like = await prisma.like.findUnique({
        where: {
          userId_snippetId: {
            userId: currentUser.userId,
            snippetId: snippet.id,
          },
        },
      });
      hasLiked = !!like;
    }

    return NextResponse.json({
      ...snippet,
      hasLiked,
    });
  } catch (error) {
    console.error('Error fetching snippet by short code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 }
    );
  }
}

