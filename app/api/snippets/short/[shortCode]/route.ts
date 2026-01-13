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

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet by short code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 }
    );
  }
}

