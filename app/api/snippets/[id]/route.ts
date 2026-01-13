import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { updateSnippetSchema } from '@/lib/validations';
import { ZodError } from 'zod';
import { getUserFromRequest, getAccessibleSnippet } from '@/lib/middleware/auth';
import { checkPrivateSnippets } from '@/lib/middleware/usage';
import { decrementSnippetCount } from '@/lib/features';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getUserFromRequest(request);
    const snippet = await getAccessibleSnippet(params.id, currentUser?.userId);

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found or not accessible' },
        { status: 404 }
      );
    }

    // Increment view count for public/unlisted snippets
    if (snippet.visibility !== 'private') {
      await prisma.snippet.update({
        where: { id: params.id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error('Error fetching snippet:', error);
    return NextResponse.json(
      { error: 'Failed to fetch snippet' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const validatedData = updateSnippetSchema.parse(body);

    const existing = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (existing.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to modify this snippet' },
        { status: 403 }
      );
    }

    // Check if user can set visibility to private
    if (validatedData.visibility === 'private' && existing.visibility !== 'private') {
      const privateCheck = await checkPrivateSnippets(currentUser.userId);
      if (!privateCheck.allowed) {
        return privateCheck.response!;
      }
    }

    const updateData: {
      title?: string;
      description?: string | null;
      code?: string;
      language?: string;
      categoryId?: string | null;
      notes?: string | null;
      resources?: string | null;
      isFavorite?: boolean;
      visibility?: string;
      tags?: { set: { id: string }[] };
    } = {};
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.code !== undefined) updateData.code = validatedData.code;
    if (validatedData.language !== undefined) updateData.language = validatedData.language;
    if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId || null;
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes || null;
    if (validatedData.resources !== undefined) {
      updateData.resources = validatedData.resources.length > 0
        ? JSON.stringify(validatedData.resources)
        : null;
    }
    if (validatedData.isFavorite !== undefined) updateData.isFavorite = validatedData.isFavorite;
    if (validatedData.visibility !== undefined) updateData.visibility = validatedData.visibility;
    if (validatedData.tagIds !== undefined) {
      updateData.tags = {
        set: validatedData.tagIds.map((id) => ({ id })),
      };
    }

    const snippet = await prisma.snippet.update({
      where: { id: params.id },
      data: updateData,
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
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(snippet);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating snippet:', error);
    return NextResponse.json(
      { error: 'Failed to update snippet' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const snippet = await prisma.snippet.findUnique({
      where: { id: params.id },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (snippet.userId !== currentUser.userId) {
      return NextResponse.json(
        { error: 'Not authorized to delete this snippet' },
        { status: 403 }
      );
    }

    await prisma.snippet.delete({
      where: { id: params.id },
    });

    // Decrement snippet count for usage tracking
    await decrementSnippetCount(currentUser.userId);

    return NextResponse.json({ message: 'Snippet deleted successfully' });
  } catch (error) {
    console.error('Error deleting snippet:', error);
    return NextResponse.json(
      { error: 'Failed to delete snippet' },
      { status: 500 }
    );
  }
}
