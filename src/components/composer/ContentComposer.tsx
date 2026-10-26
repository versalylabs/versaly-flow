/**
 * PulseBrand Agency OS - Multi-Network Content Creation & Composer
 * Phase 10: Content Creation & Composer
 * Localized for East African Multi-Network Social Distribution
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { SocialPlatform, PostFormat, ContentStage, ContentItem } from '../../types';
import {
  FileText,
  Plus,
  Send,
  Eye,
  Smartphone,
  Sparkles,
  Share2,
  Calendar,
  Layers,
  Image as ImageIcon,
  Video,
  Hash,
  Smile,
  CheckCircle2,
  AlertCircle,
  Clock,
  Instagram,
  Linkedin,
  Twitter,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Heart,
  Repeat,
  Bookmark,
  Building2,
  Save,
  Check
} from 'lucide-react';

interface PlatformSpec {
  name: string;
  charLimit: number;
  hashtagLimit: number;
  aspectRatio: string;
  recommendedFormat: string;
  accentColor: string;
}

const PLATFORM_SPECS: Record<SocialPlatform, PlatformSpec> = {
  instagram: {
    name: 'Instagram',
    charLimit: 2200,
    hashtagLimit: 30,
    aspectRatio: '1:1 or 4:5 (9:16 Reels)',
    recommendedFormat: 'High-res visual + first 3 lines hook',
    accentColor: '#e1306c'
  },
  linkedin: {
    name: 'LinkedIn',
    charLimit: 3000,
    hashtagLimit: 5,
    aspectRatio: '1.91:1 or PDF Carousel',
    recommendedFormat: 'B2B Thought leadership + data takeaways',
    accentColor: '#0a66c2'
  },
  twitter: {
    name: 'Twitter / X',
    charLimit: 280,
    hashtagLimit: 2,
    aspectRatio: '16:9',
    recommendedFormat: 'Snappy punchline + 1-2 focused hashtags',
    accentColor: '#1d9bf0'
  },
  tiktok: {
    name: 'TikTok',
    charLimit: 2200,
    hashtagLimit: 5,
    aspectRatio: '9:16 Fullscreen',
    recommendedFormat: 'Dynamic 3-second hook + trending audio reference',
    accentColor: '#00f2fe'
  },
  facebook: {
    name: 'Facebook',
    charLimit: 63206,
    hashtagLimit: 3,
    aspectRatio: '16:9 or 1:1',
    recommendedFormat: 'Conversational community post + link preview',
    accentColor: '#1877f2'
  },
  youtube: {
    name: 'YouTube Shorts',
    charLimit: 5000,
    hashtagLimit: 15,
    aspectRatio: '9:16 Shorts / 16:9 Video',
    recommendedFormat: 'SEO-rich title + timestamps in description',
    accentColor: '#ff0000'
  }
};

const KENYAN_HASHTAG_BANKS = [
  '#MadeInKenya',
  '#NairobiBusiness',
  '#TwigaSolar',
  '#KerichoTea',
  '#CleanEnergyKE',
  '#AfroWellness',
  '#SiliconSavannah',
  '#MagicalKenya',
  '#EastAfricaTech',
  '#NairobiLiving'
];

export const ContentComposer: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    activeClient,
    contentItems,
    createContentItem,
    addToast
  } = useAgency();

  // Scoped clients for active tenant
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const defaultClientId = activeClient?.id || scopedClients[0]?.id || '';

  // Composer Form State
  const [selectedClientId, setSelectedClientId] = useState<string>(defaultClientId);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState(
    scopedClients.length > 0
      ? 'Harnessing clean East African renewable energy with rooftop industrial solar arrays across Nairobi. ⚡️🌱\n\nCommercial ROI in KES guaranteed within 36 months while eliminating diesel reliance.\n\n#TwigaSolar #CleanEnergyKE #MadeInKenya'
      : ''
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['linkedin', 'twitter']);
  const [format, setFormat] = useState<PostFormat>('single_image');
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('linkedin');
  const [mediaUrl, setMediaUrl] = useState(
    scopedClients.length > 0
      ? 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop'
      : ''
  );
  const [selectedStage, setSelectedStage] = useState<ContentStage>('internal_review');
  const [scheduledDate, setScheduledDate] = useState('2026-09-28T09:00');

  const selectedClient = scopedClients.find(c => c.id === selectedClientId) || scopedClients[0] || null;

  // Toggle platform selection
  const handleTogglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => {
      const next = prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      if (next.length === 0) return [platform]; // keep at least 1
      if (!next.includes(previewPlatform)) {
        setPreviewPlatform(next[0]);
      }
      return next;
    });
  };

  // Insert hashtag from bank
  const handleInsertHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption(prev => `${prev.trim()} ${tag}`);
    }
  };

  // Insert emoji
  const handleInsertEmoji = (emoji: string) => {
    setCaption(prev => `${prev} ${emoji}`);
  };

  // Submit new post draft
  const handleSubmitPost = (targetStage: ContentStage) => {
    if (!caption.trim()) {
      addToast('Validation Error', 'Caption text cannot be blank', 'error');
      return;
    }
    if (!selectedClient) {
      addToast('Validation Error', 'Please select a client brand', 'error');
      return;
    }

    const postTitle = title.trim() || `${selectedClient.name} - ${format.replace('_', ' ')} (${selectedPlatforms.join(', ')})`;
    const extractedTags = caption.match(/#[a-z0-9_]+/gi) || [];

    const created = createContentItem({
      tenantId: workspace.id,
      clientId: selectedClient.id,
      creatorId: currentUser.id,
      title: postTitle,
      caption: caption.trim(),
      platforms: selectedPlatforms,
      format,
      stage: targetStage,
      mediaUrls: mediaUrl ? [mediaUrl] : [],
      scheduledDate: targetStage === 'scheduled' ? new Date(scheduledDate).toISOString() : undefined,
      tags: extractedTags
    });

    addToast('Post Successfully Created', `Draft added in ${targetStage.replace('_', ' ')} status`, 'success');

    // Reset title and keep working
    setTitle('');
  };

  // Active platform spec
  const currentSpec = PLATFORM_SPECS[previewPlatform] || PLATFORM_SPECS.linkedin;
  const currentChars = caption.length;
  const charRemaining = currentSpec.charLimit - currentChars;
  const isOverCharLimit = charRemaining < 0;
  const hashtagCount = (caption.match(/#[a-z0-9_]+/gi) || []).length;
  const isOverHashtagLimit = hashtagCount > currentSpec.hashtagLimit;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Content Creation & Composer</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">Multi-Network Social Studio</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Social Post Composer & Device Preview</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Create high-converting social campaigns with network-specific character constraints, Kenyan hashtag banks,
            and pixel-accurate mobile device previews.
          </p>
        </div>

        {/* Client Brand Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl self-start md:self-auto">
          <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Brand:</span>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2.5 py-1 rounded-lg focus:outline-none focus:border-emerald-500 font-semibold cursor-pointer"
          >
            {scopedClients.length === 0 ? (
              <option value="">No clients enrolled</option>
            ) : (
              scopedClients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.industry})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {scopedClients.length === 0 && (
        <div className="bg-amber-950/30 border border-amber-800/60 rounded-xl p-4 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>No client brands enrolled yet.</strong> To schedule and publish posts, add your first client brand under the Client Dossiers section.
            </span>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout: Composer Studio (7 cols) + Live Mobile Mockup (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Post Editor & Controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Target Platforms Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Select Target Social Networks
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {selectedPlatforms.length} networks enabled
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(Object.keys(PLATFORM_SPECS) as SocialPlatform[]).map(platform => {
                const isSelected = selectedPlatforms.includes(platform);
                const spec = PLATFORM_SPECS[platform];

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => handleTogglePlatform(platform)}
                    className={`p-2.5 rounded-lg border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500/80 shadow-md shadow-emerald-950/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-900 border border-slate-800">
                      {platform === 'instagram' && <Instagram className="w-3.5 h-3.5 text-pink-400" />}
                      {platform === 'linkedin' && <Linkedin className="w-3.5 h-3.5 text-blue-400" />}
                      {platform === 'twitter' && <Twitter className="w-3.5 h-3.5 text-sky-400" />}
                      {platform === 'tiktok' && <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
                      {platform === 'facebook' && <Share2 className="w-3.5 h-3.5 text-blue-500" />}
                      {platform === 'youtube' && <Video className="w-3.5 h-3.5 text-red-500" />}
                    </div>
                    <span className="text-[10px] font-bold text-slate-200 capitalize truncate w-full">
                      {spec.name}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-400' : 'bg-slate-700'}`}></span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post Format & Creative Directives */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Post Format & Asset Type
              </span>
              {selectedClient?.toneOfVoice && (
                <span className="text-[10px] font-mono text-emerald-400 truncate max-w-[200px]">
                  Tone: {selectedClient.toneOfVoice[0]}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'single_image', label: 'Single Visual', icon: ImageIcon },
                { id: 'carousel', label: 'Swipe Carousel', icon: Layers },
                { id: 'video_reel', label: 'Vertical Reel', icon: Video },
                { id: 'thread', label: 'Multi-Thread', icon: FileText }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as PostFormat)}
                  className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                    format === f.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <f.icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              ))}
            </div>

            {/* Media Asset URL */}
            <div className="pt-1">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                Visual Media URL (Image or Video Asset)
              </label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Copywriting Editor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Post Copy & Hook
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono font-bold ${isOverCharLimit ? 'text-red-400' : 'text-emerald-400'}`}>
                  {currentChars} / {currentSpec.charLimit} chars
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                  isOverHashtagLimit ? 'bg-red-950/60 text-red-400 border-red-800/40' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {hashtagCount}/{currentSpec.hashtagLimit} tags
                </span>
              </div>
            </div>

            {/* Title / Internal Headline */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Internal Post Title (e.g., Solar ROI Case Study #14)"
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            {/* Caption Textarea */}
            <div className="relative">
              <textarea
                rows={6}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write compelling social caption with hook, value proposition, and CTA..."
                className={`w-full bg-slate-950 border text-xs text-slate-100 p-3 rounded-lg focus:outline-none leading-relaxed font-sans ${
                  isOverCharLimit ? 'border-red-500' : 'border-slate-800 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Quick Emoji Bar & Hashtag Bank */}
            <div className="space-y-2 pt-1 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Quick Emojis:</span>
                  {['🌱', '⚡️', '🇰🇪', '📈', '☕️', '✨', '🎯', '🔥'].map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => handleInsertEmoji(em)}
                      className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kenyan Hashtag Bank */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Hash className="w-3 h-3 text-emerald-400" />
                  <span>Kenyan Brand Tag Bank:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {KENYAN_HASHTAG_BANKS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleInsertHashtag(tag)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 hover:bg-emerald-950/60 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-700/50 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Publishing Dispatch & Approval Gate Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Pipeline Stage & Action
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Author: {currentUser.name} ({currentUser.role.replace('_', ' ')})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Target Pipeline Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value as ContentStage)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="draft">Save as Creator Draft</option>
                  <option value="internal_review">Submit to Internal Agency Review</option>
                  <option value="client_review">Submit to Client Sign-off Gate</option>
                  <option value="scheduled">Schedule for Automated Dispatch</option>
                </select>
              </div>

              {selectedStage === 'scheduled' && (
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Scheduled Publish Date (EAT)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
              <button
                type="button"
                onClick={() => handleSubmitPost('draft')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmitPost(selectedStage)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {selectedStage === 'scheduled'
                    ? 'Lock & Schedule Post'
                    : selectedStage === 'client_review'
                    ? 'Submit for Client Sign-off'
                    : 'Submit to Review Queue'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Mobile Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            {/* Device Preview Header & Network Switcher */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Mobile Screen Preview
                </span>
              </div>

              {/* Preview Platform Selector */}
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-0.5 rounded-lg text-xs">
                {selectedPlatforms.map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setPreviewPlatform(platform)}
                    className={`px-2 py-0.5 rounded font-mono text-[10px] capitalize transition-colors ${
                      previewPlatform === platform
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Screen Mockup Frame */}
            <div className="mx-auto max-w-[340px] bg-slate-950 border-4 border-slate-800 rounded-[28px] overflow-hidden shadow-2xl space-y-3 p-3 text-slate-200 font-sans">
              {/* Phone Status Bar Mock */}
              <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-2 pt-1">
                <span>09:41</span>
                <span className="flex items-center gap-1">5G ⚡️ 100%</span>
              </div>

              {/* Feed Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                    style={{ backgroundColor: selectedClient?.accentColor || '#10b981' }}
                  >
                    {(selectedClient?.name || 'PB').substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>{selectedClient?.name || 'Brand Name'}</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {previewPlatform === 'instagram' && `@${(selectedClient?.name || 'brand').toLowerCase().replace(/\s+/g, '')}`}
                      {previewPlatform === 'linkedin' && `${selectedClient?.industry || 'Enterprise'} · Promoted`}
                      {previewPlatform === 'twitter' && `@${(selectedClient?.name || 'brand').toLowerCase().replace(/\s+/g, '')}`}
                      {previewPlatform === 'tiktok' && `@${(selectedClient?.name || 'brand').toLowerCase().replace(/\s+/g, '')}`}
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-slate-500">•••</span>
              </div>

              {/* Visual Media Mockup */}
              {mediaUrl && (
                <div className="w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative group aspect-square flex items-center justify-center">
                  <img
                    src={mediaUrl}
                    alt="Creative Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1080&auto=format&fit=crop';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono text-slate-200">
                    {format.replace('_', ' ').toUpperCase()}
                  </div>
                </div>
              )}

              {/* Social Action Bar */}
              <div className="flex items-center justify-between text-slate-400 px-1 pt-1">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 hover:text-red-400 cursor-pointer" />
                  <MessageSquare className="w-4 h-4 hover:text-white cursor-pointer" />
                  <Repeat className="w-4 h-4 hover:text-emerald-400 cursor-pointer" />
                </div>
                <Bookmark className="w-4 h-4 hover:text-white cursor-pointer" />
              </div>

              {/* Caption Preview */}
              <div className="px-1 text-xs space-y-1">
                <div className="text-white text-[11px] leading-relaxed whitespace-pre-line">
                  <span className="font-bold mr-1.5">{selectedClient?.name}</span>
                  {caption}
                </div>
                <div className="text-[9px] font-mono text-slate-500 pt-1">
                  14 minutes ago · Verified via PulseBrand Engine
                </div>
              </div>
            </div>

            {/* Spec Compliance Box */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5 text-xs">
              <div className="text-[11px] font-bold text-slate-200 uppercase tracking-wide flex items-center justify-between">
                <span>{currentSpec.name} Specifications</span>
                <span className="font-mono text-emerald-400 text-[10px]">Optimal Aspect: {currentSpec.aspectRatio}</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {currentSpec.recommendedFormat}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
