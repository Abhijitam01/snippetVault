/**
 * Auth middleware for API routes
 * Handles authentication and authorization
 */

import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '../auth';
import { prisma } from '../prisma';

export interface AuthUser {
  userId: string;
  email: string;
  name?: string | null;
  username?: string | null;
}

/**
 * Extract and verify user from JWT token in request
 * @param request NextRequest object
 * @returns User object if authenticated, null otherwise
 */
export async function getUserFromRequest(request: NextRequest): Promise<AuthUser | null> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    let token: string | null = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // If no token in header, try cookies
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get('auth-token')?.value || null;
    }

    if (!token) {
      return null;
    }

    // Verify and decode token
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return null;
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
    };
  } catch (error) {
    console.error('Error extracting user from request:', error);
    return null;
  }
}

/**
 * Require authentication middleware
 * Throws error if user is not authenticated
 * @param request NextRequest object
 * @returns Authenticated user object
 * @throws Error if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Verify that the authenticated user owns a specific snippet
 * @param request NextRequest object
 * @param snippetId Snippet ID to check ownership
 * @returns True if user owns the snippet
 * @throws Error if not authenticated or not authorized
 */
export async function requireSnippetOwnership(
  request: NextRequest,
  snippetId: string
): Promise<boolean> {
  const user = await requireAuth(request);

  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
    select: { userId: true },
  });

  if (!snippet) {
    throw new Error('Snippet not found');
  }

  if (snippet.userId !== user.userId) {
    throw new Error('Not authorized to modify this snippet');
  }

  return true;
}

/**
 * Check if a snippet is public or accessible by the current user
 * @param snippetId Snippet ID to check
 * @param userId Optional user ID (if authenticated)
 * @returns Snippet if accessible, null otherwise
 */
export async function getAccessibleSnippet(
  snippetId: string,
  userId?: string
) {
  const snippet = await prisma.snippet.findUnique({
    where: { id: snippetId },
    include: {
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
        },
      },
    },
  });

  if (!snippet) {
    return null;
  }

  // If snippet is public or unlisted, anyone can view
  if (snippet.visibility === 'public' || snippet.visibility === 'unlisted') {
    return snippet;
  }

  // If private, only owner can view
  if (snippet.visibility === 'private' && snippet.userId === userId) {
    return snippet;
  }

  return null;
}
