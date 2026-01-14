import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const username = (params.username || '').trim().toLowerCase();
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatar: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const snippets = await prisma.snippet.findMany({
      where: {
        userId: user.id,
        visibility: 'public',
      },
      include: {
        tags: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 100,
    });

    return NextResponse.json({ user, snippets });
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}


