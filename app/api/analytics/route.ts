import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { checkAnalytics } from '@/lib/middleware/usage';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const user = await requireAuth(request);

    // Check if user has access to analytics
    const accessCheck = await checkAnalytics(user.userId);
    if (!accessCheck.allowed) {
      return accessCheck.response!;
    }

    // Get user's snippets with view and like counts
    const snippets = await prisma.snippet.findMany({
      where: { userId: user.userId },
      include: {
        _count: {
          select: { likes: true },
        },
      },
      orderBy: { viewCount: 'desc' },
    });

    const totalViews = snippets.reduce(
      (sum, snippet) => sum + snippet.viewCount,
      0
    );
    const totalLikes = snippets.reduce(
      (sum, snippet) => sum + snippet._count.likes,
      0
    );

    // Most viewed snippets (top 5)
    const mostViewedSnippets = snippets
      .filter((s) => s.viewCount > 0)
      .slice(0, 5)
      .map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        language: snippet.language,
        viewCount: snippet.viewCount,
        createdAt: snippet.createdAt.toISOString(),
      }));

    // Most liked snippets (top 5)
    const mostLikedSnippets = snippets
      .filter((s) => s._count.likes > 0)
      .sort((a, b) => b._count.likes - a._count.likes)
      .slice(0, 5)
      .map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        language: snippet.language,
        likeCount: snippet._count.likes,
      }));

    return NextResponse.json({
      totalViews,
      totalLikes,
      totalSnippets: snippets.length,
      mostViewedSnippets,
      mostLikedSnippets,
      recentActivity: [], // Can be expanded later
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

