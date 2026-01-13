'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import SnippetList from '@/components/snippets/SnippetList';
import { useSearch } from '@/lib/hooks/useSearch';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Category, Snippet } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const { user, loading: authLoading } = useAuth();
  const { search, results, loading: searchLoading } = useSearch();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [snippets, setSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    let isMounted = true;

    // Fetch category details
    fetch(`/api/categories/${categoryId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Category not found');
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setCategory(data);
          setSnippets(data.snippets || []);
        }
      })
      .catch(() => {
        if (isMounted) {
          router.push('/dashboard');
        }
      });

    // Fetch all categories for sidebar
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setCategories(data);
        }
      });

    // Fetch snippets for this category via search
    search({ categoryId });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, router]);

  useEffect(() => {
    // Only update snippets if we have search results, otherwise keep category snippets
    if (results.length > 0) {
      setSnippets(results);
    }
  }, [results]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      search({ query, categoryId });
    } else {
      search({ categoryId });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 font-mono">Loading...</div>
      </div>
    );
  }

  if (!user || !category) {
    return null;
  }

  return (
    <MainLayout categories={categories} onSearch={handleSearch}>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            {category.icon && (
              <div className="text-4xl">{category.icon}</div>
            )}
            <div>
              <h1 className="text-3xl font-semibold text-white mb-2 font-mono">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-white/60 font-mono text-sm">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-white/50 font-mono">
            <span>{snippets.length} snippet{snippets.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white font-mono">Snippets</h2>
              <p className="text-xs text-white/50 font-mono">All snippets in this category</p>
            </div>
          </div>
          <div className="min-h-[200px] bg-black">
            <SnippetList snippets={snippets} loading={searchLoading} />
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

