'use client';

import { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import type { SnippetFormData, Tag, Category } from '@/types';

interface SnippetFormProps {
  initialData?: Partial<SnippetFormData>;
  tags: Tag[];
  categories: Category[];
  onSubmit: (data: SnippetFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'yaml', 'json', 'markdown', 'bash', 'shell'
];

export default function SnippetForm({
  initialData,
  tags,
  categories,
  onSubmit,
  onCancel,
  loading = false,
}: SnippetFormProps) {
  const [formData, setFormData] = useState<SnippetFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    code: initialData?.code || '',
    language: initialData?.language || 'typescript',
    tagIds: initialData?.tagIds || [],
    categoryId: initialData?.categoryId || undefined,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-100">Language *</label>
          <select
            value={formData.language}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm"
            required
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-100">Category</label>
          <select
            value={formData.categoryId || ''}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || undefined })}
            className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Visibility *</label>
        <select
          value={formData.visibility}
          onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'public' | 'private' | 'unlisted' })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm"
          required
        >
          <option value="public">Public - Anyone can view and discover</option>
          <option value="unlisted">Unlisted - Anyone with the link can view</option>
          <option value="private">Private - Only you can view</option>
        </select>
        <p className="mt-1 text-xs text-gray-400">
          {formData.visibility === 'public' && 'Your snippet will be visible to everyone and appear in public feeds'}
          {formData.visibility === 'unlisted' && 'Your snippet can be shared via link but won\'t appear in public feeds'}
          {formData.visibility === 'private' && 'Your snippet will only be visible to you'}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Code *</label>
        <textarea
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm font-mono"
          rows={15}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={formData.tagIds.includes(tag.id) ? 'opacity-100' : 'opacity-50'}
            >
              <TagBadge tag={tag} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-md border border-gray-700 bg-gray-800 text-gray-100 px-3 py-2 text-sm"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-100">Resources (URLs)</label>
        <div className="space-y-2">
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
                placeholder="https://example.com"
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
          >
            Add Resource URL
          </Button>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isFavorite}
            onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
            className="rounded border-gray-600 bg-gray-700"
          />
          <span className="text-sm font-medium text-gray-100">Mark as favorite</span>
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
}

