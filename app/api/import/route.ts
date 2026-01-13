import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { generateShortCode } from '@/lib/shortcode';

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
    const { snippets } = body;

    if (!Array.isArray(snippets)) {
      return NextResponse.json(
        { error: 'Invalid import format. Expected an array of snippets.' },
        { status: 400 }
      );
    }

    const imported = [];
    const errors = [];

    for (const snippetData of snippets) {
      try {
        // Find or create tags
        const tagConnections = [];
        if (snippetData.tags && Array.isArray(snippetData.tags)) {
          for (const tagName of snippetData.tags) {
            let tag = await prisma.tag.findUnique({
              where: { name: tagName },
            });

            if (!tag) {
              tag = await prisma.tag.create({
                data: { name: tagName },
              });
            }

            tagConnections.push({ id: tag.id });
          }
        }

        // Find category if provided
        let categoryId = null;
        if (snippetData.category) {
          let category = await prisma.category.findUnique({
            where: { name: snippetData.category },
          });

          if (!category) {
            category = await prisma.category.create({
              data: { name: snippetData.category },
            });
          }

          categoryId = category.id;
        }

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
          throw new Error('Failed to generate unique short code');
        }

        const snippet = await prisma.snippet.create({
          data: {
            title: snippetData.title || 'Untitled',
            description: snippetData.description || null,
            code: snippetData.code || '',
            language: snippetData.language || 'text',
            categoryId,
            notes: snippetData.notes || null,
            resources: snippetData.resources
              ? JSON.stringify(snippetData.resources)
              : null,
            isFavorite: snippetData.isFavorite || false,
            userId: currentUser.userId,
            shortCode,
            visibility: snippetData.visibility || 'public',
            tags: {
              connect: tagConnections,
            },
          },
          include: {
            tags: true,
            category: true,
          },
        });

        imported.push(snippet);
      } catch (error) {
        errors.push({
          snippet: snippetData.title || 'Unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      details: errors,
    });
  } catch (error) {
    console.error('Error importing snippets:', error);
    return NextResponse.json(
      { error: 'Failed to import snippets' },
      { status: 500 }
    );
  }
}

