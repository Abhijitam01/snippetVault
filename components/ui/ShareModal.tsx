'use client';

import { useState } from 'react';
import { X, Copy, Check, Code, Twitter, Link as LinkIcon } from 'lucide-react';
import Button from './Button';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortCode: string;
  title: string;
  username?: string;
}

export default function ShareModal({ isOpen, onClose, shortCode, title, username }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrlBase = `${window.location.origin}/s/${shortCode}`;
  const shareUrl = username
    ? `${shareUrlBase}?username=${encodeURIComponent(username)}`
    : shareUrlBase;
  const embedCode = `<iframe src="${window.location.origin}/embed/${shortCode}" width="100%" height="400" frameborder="0"></iframe>`;

  const copyToClipboard = async (text: string, setCopiedFn: (val: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    setCopiedFn(true);
    setTimeout(() => setCopiedFn(false), 2000);
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Check out this code snippet: ${title}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-lg border border-white/10 bg-black/95 p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white font-mono">Share Snippet</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Share Link */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-mono">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(shareUrl, setCopied)}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-mono">
              Share On
            </label>
            <div className="flex gap-2">
              <button
                onClick={shareOnTwitter}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1DA1F2] text-white hover:bg-[#1a8cd8] transition-colors text-sm font-mono"
              >
                <Twitter className="w-4 h-4" />
                Twitter
              </button>
              <button
                onClick={() => {
                  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                  window.open(linkedInUrl, '_blank');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] text-white hover:bg-[#084d92] transition-colors text-sm font-mono"
              >
                <LinkIcon className="w-4 h-4" />
                LinkedIn
              </button>
            </div>
          </div>
        </div>

        {/* Embed Code */}
        <div className="border-t border-white/10 pt-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2 font-mono flex items-center gap-2">
              <Code className="w-4 h-4" />
              Embed Code
            </label>
            <p className="text-xs text-white/50 mb-2 font-mono">
              Copy this code to embed the snippet in your website or blog
            </p>
            <div className="flex gap-2">
              <textarea
                value={embedCode}
                readOnly
                rows={3}
                className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 text-sm text-white font-mono resize-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(embedCode, setEmbedCopied)}
              >
                {embedCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

