'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User, Link as LinkIcon, Github, Twitter } from 'lucide-react';

export default function ProfileSettingsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    bio: '',
    avatar: '',
    website: '',
    githubUrl: '',
    twitterUrl: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      // Fetch current profile data
      fetch('/api/user/profile')
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || '',
            username: data.username || '',
            bio: data.bio || '',
            avatar: data.avatar || '',
            website: data.website || '',
            githubUrl: data.githubUrl || '',
            twitterUrl: data.twitterUrl || '',
          });
        })
        .catch((err) => {
          console.error('Failed to fetch profile:', err);
        });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Redirect to profile page if username is set
      if (data.username) {
        setTimeout(() => {
          router.push(`/${data.username}`);
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white font-mono">Profile Settings</h1>
          <p className="mt-1 text-sm text-white/50 font-mono">
            Manage your public profile and social links
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-white/10 bg-black/40 p-6 space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2 font-mono">
                Display Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your display name"
                maxLength={100}
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2 font-mono">
                Username *
              </label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase() })}
                placeholder="your_username"
                maxLength={30}
                required
              />
              <p className="mt-1 text-xs text-white/50 font-mono">
                Your profile will be at: snippetvault.com/{formData.username || 'your_username'}
              </p>
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-white/80 mb-2 font-mono">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                maxLength={500}
                rows={4}
                className="w-full rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60"
              />
              <p className="mt-1 text-xs text-white/50 font-mono">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Avatar URL */}
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-white/80 mb-2 font-mono">
                Avatar URL
              </label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="mt-1 text-xs text-white/50 font-mono">
                Use services like Gravatar, GitHub, or Dicebear for avatars
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="rounded-lg border border-white/10 bg-black/40 p-6 space-y-6">
            <h3 className="text-lg font-semibold text-white font-mono flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Social Links
            </h3>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-white/80 mb-2 font-mono">
                Website
              </label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://your-website.com"
              />
            </div>

            <div>
              <label htmlFor="githubUrl" className="block text-sm font-medium text-white/80 mb-2 font-mono flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </label>
              <Input
                id="githubUrl"
                type="url"
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
              />
            </div>

            <div>
              <label htmlFor="twitterUrl" className="block text-sm font-medium text-white/80 mb-2 font-mono flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter / X
              </label>
              <Input
                id="twitterUrl"
                type="url"
                value={formData.twitterUrl}
                onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400 font-mono">{error}</p>
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
              <p className="text-sm text-green-400 font-mono">Profile updated successfully!</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Profile'}
            </Button>
            {formData.username && (
              <a
                href={`/${formData.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:text-blue-300 font-mono"
              >
                View Public Profile →
              </a>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

