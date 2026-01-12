// app/api/snippets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSnippetSchema } from '@/lib/validations';
import { ZodError } from 'zod';

// GET /api/snippets - Get all snippets
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language');
    const categoryId = searchParams.get('categoryId');
    const isFavorite = searchParams.get('isFavorite');

    const snippets = await prisma.snippet.findMany({
      where: {
        ...(language && { language }),
        ...(categoryId && { categoryId }),
        ...(isFavorite && { isFavorite: isFavorite === 'true' }),
      },
      include: {
        tags: true,
        category: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error('Error fetching snippets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippets' },
      { status: 500 }
    );
  }
}

// POST /api/snippets - Create new snippet
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createSnippetSchema.parse(body);

    const snippet = await prisma.snippet.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        code: validatedData.code,
        language: validatedData.language,
        categoryId: validatedData.categoryId || null,
        notes: validatedData.notes || null,
        resources: validatedData.resources && validatedData.resources.length > 0
          ? JSON.stringify(validatedData.resources)
          : null,
        tags: validatedData.tagIds && validatedData.tagIds.length > 0
          ? {
              connect: validatedData.tagIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        tags: true,
        category: true,
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