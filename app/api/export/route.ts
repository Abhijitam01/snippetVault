import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const snippets = await prisma.snippet.findMany({
      include: {
        tags: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      snippets: snippets.map((snippet: { title: string; description: string | null; code: string; language: string; tags: Array<{ name: string }>; notes: string | null; resources: string | null; isFavorite: boolean; createdAt: Date; updatedAt: Date }) => ({
        title: snippet.title,
        description: snippet.description,
        code: snippet.code,
        language: snippet.language,
        tags: snippet.tags.map((tag: { name: string }) => tag.name),
        notes: snippet.notes,
        resources: snippet.resources ? JSON.parse(snippet.resources) : [],
        isFavorite: snippet.isFavorite,
        createdAt: snippet.createdAt.toISOString(),
        updatedAt: snippet.updatedAt.toISOString(),
      })),
    };

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

