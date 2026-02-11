'use client';

import { useState, FormEvent, forwardRef } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import CodeEditor from './CodeEditor';
import { cn } from '@/lib/utils';
import type { SnippetFormData, Tag } from '@/types';

interface SnippetFormProps {
  initialData?: Partial<SnippetFormData>;
  tags: Tag[];
  onSubmit: (data: SnippetFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'yaml', 'json', 'markdown', 'bash', 'shell'
];

const SnippetForm = forwardRef<HTMLFormElement, SnippetFormProps>(({
  initialData,
  tags,
  onSubmit,
  onCancel,
  loading = false,
}, ref) => {
  const [formData, setFormData] = useState<SnippetFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    code: initialData?.code || '',
    language: initialData?.language || 'typescript',
    tagIds: initialData?.tagIds || [],
    notes: initialData?.notes || '',
    resources: initialData?.resources || [],
    isFavorite: initialData?.isFavorite || false,
    visibility: initialData?.visibility || 'public',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="e.g., Binary Search Algorithm"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-mono placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
          rows={3}
          placeholder="What does this snippet do?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Language *</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
            required
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-white dark:bg-zinc-900">
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Visibility *</label>
          <select
            value={formData.visibility}
            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' | 'unlisted' })}
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 text-gray-900 dark:text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
            required
          >
            <option value="public">Public - Searchable</option>
            <option value="unlisted">Unlisted - Link only</option>
            <option value="private">Private - Only you</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Code *</label>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/60 overflow-hidden shadow-sm">
          <CodeEditor
            value={formData.code}
            onChange={(value) => setFormData({ ...formData, code: value })}
            language={formData.language}
            placeholder="Enter your code here..."
            minHeight="350px"
            maxHeight="700px"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Tags</label>
        <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={cn("transition-all", formData.tagIds.includes(tag.id) ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-70')}
            >
              <TagBadge tag={tag} />
            </button>
          ))}
          {tags.length === 0 && (
            <span className="text-xs text-gray-400 font-mono italic">No tags created yet.</span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 text-gray-900 dark:text-white px-4 py-3 text-sm font-mono placeholder:text-gray-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all"
          rows={4}
          placeholder="Add any extra notes or explanations..."
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 font-mono uppercase tracking-tight">Resources (URLs)</label>
        <div className="space-y-3">
          {formData.resources.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => {
                  const newResources = [...formData.resources];
                  newResources[index] = e.target.value;
                  setFormData({ ...formData, resources: newResources });
                }}
                placeholder="https://docs.example.com"
                className="flex-1"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => {
                  const newResources = formData.resources.filter((_, i) => i !== index);
                  setFormData({ ...formData, resources: newResources });
                }}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormData({ ...formData, resources: [...formData.resources, ''] });
            }}
            className="w-full border-dashed"
          >
            + Add Resource URL
          </Button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
            className="h-4 w-4 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-zinc-900 text-violet-600 focus:ring-violet-500/40"
          />
          <span className="text-sm font-semibold text-gray-700 dark:text-white/80 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors font-mono uppercase tracking-tight">Mark as favorite</span>
        </label>
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
});

SnippetForm.displayName = 'SnippetForm';

export default SnippetForm;

