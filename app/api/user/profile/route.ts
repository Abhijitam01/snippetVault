import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/middleware/auth';
import { z } from 'zod';

const RESERVED_USERNAMES = new Set([
  'api',
  'auth',
  'dashboard',
  'settings',
  'snippets',
  'tags',
  'categories',
  'collections',
  'search',
  'import',
  'export',
  'embed',
  's',
]);

const updateProfileSchema = z.object({
  name: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().min(1).max(100).nullable().optional()
  ),
  username: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const normalized = v.trim().toLowerCase();
      return normalized === '' ? undefined : normalized;
    },
    z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional()
  ),
  bio: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().max(500).nullable().optional()
  ),
  avatar: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().url().nullable().optional()
  ),
  website: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().url().nullable().optional()
  ),
  githubUrl: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().url().nullable().optional()
  ),
  twitterUrl: z.preprocess(
    (v) => {
      if (typeof v !== 'string') return v;
      const trimmed = v.trim();
      return trimmed === '' ? null : trimmed;
    },
    z.string().url().nullable().optional()
  ),
});

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.userId },
      select: {
        id: true,
        name: true,
        email: true,
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
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await getUserFromRequest(request);
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    // Check if username is already taken
    if (validatedData.username) {
      if (RESERVED_USERNAMES.has(validatedData.username)) {
        return NextResponse.json(
          { error: 'This username is reserved' },
          { status: 400 }
        );
      }
      const existingUser = await prisma.user.findUnique({
        where: { username: validatedData.username },
      });

      if (existingUser && existingUser.id !== currentUser.userId) {
        return NextResponse.json(
          { error: 'Username already taken' },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.userId },
      data: {
        ...(validatedData.name !== undefined && { name: validatedData.name }),
        ...(validatedData.username !== undefined && { username: validatedData.username }),
        ...(validatedData.bio !== undefined && { bio: validatedData.bio }),
        ...(validatedData.avatar !== undefined && { avatar: validatedData.avatar }),
        ...(validatedData.website !== undefined && { website: validatedData.website }),
        ...(validatedData.githubUrl !== undefined && { githubUrl: validatedData.githubUrl }),
        ...(validatedData.twitterUrl !== undefined && { twitterUrl: validatedData.twitterUrl }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        website: true,
        githubUrl: true,
        twitterUrl: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

