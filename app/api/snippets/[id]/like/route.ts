import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';

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

    // Check if snippet exists
    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check if user has already liked the snippet
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_snippetId: {
          userId: currentUser.userId,
          snippetId: params.id,
        },
      },
    });

    if (existingLike) {
      // Unlike - remove the like
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { snippetId: params.id },
      });

      return NextResponse.json({
        liked: false,
        likeCount,
      });
    } else {
      // Like - add the like
      await prisma.like.create({
        data: {
          userId: currentUser.userId,
          snippetId: params.id,
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { snippetId: params.id },
      });

      return NextResponse.json({
        liked: true,
        likeCount,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getUserFromRequest(request);

    // Get like count
    const likeCount = await prisma.like.count({
      where: { snippetId: params.id },
    });

    // Check if current user has liked
    let hasLiked = false;
    if (currentUser) {
      const like = await prisma.like.findUnique({
        where: {
          userId_snippetId: {
            userId: currentUser.userId,
            snippetId: params.id,
          },
        },
      });
      hasLiked = !!like;
    }

    return NextResponse.json({
      likeCount,
      hasLiked,
    });
  } catch (error) {
    console.error('Error fetching like status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch like status' },
      { status: 500 }
    );
  }
}

