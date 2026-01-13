import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { checkExport, trackExport } from '@/lib/middleware/usage';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check export limits
    const exportCheck = await checkExport(currentUser.userId);
    if (!exportCheck.allowed) {
      return exportCheck.response!;
    }

    // Only export current user's snippets
    const snippets = await prisma.snippet.findMany({
      where: {
        userId: currentUser.userId,
      },
      include: {
        tags: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      snippets: snippets.map((snippet: { title: string; description: string | null; code: string; language: string; tags: Array<{ name: string }>; category: { name: string } | null; notes: string | null; resources: string | null; isFavorite: boolean; createdAt: Date; updatedAt: Date }) => ({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags.map((tag: { name: string }) => tag.name),
        category: snippet.category?.name,
        notes: snippet.notes,
        resources: snippet.resources ? JSON.parse(snippet.resources) : [],
        isFavorite: snippet.isFavorite,
        createdAt: snippet.createdAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
      })),
    };

    // Track export for usage limits
    await trackExport(currentUser.userId);

    return NextResponse.json(exportData, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="snippets-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Error exporting snippets:', error);
    return NextResponse.json(
      { error: 'Failed to export snippets' },
      { status: 500 }
    );
  }
}

