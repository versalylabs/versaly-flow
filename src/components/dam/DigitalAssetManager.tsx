/**
 * PulseBrand Agency OS - Digital Asset Management (DAM)
 * Phase 14: Digital Asset Management (DAM)
 * Tagged media library, brand asset kits (logos, fonts, photography), cloud uploader simulation,
 * aspect ratio presets (1:1, 4:5, 16:9, 9:16), usage counters across campaigns, and CDN link copying.
 */

import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import { DigitalAsset } from '../../types';
import {
  FolderOpen,
  Image as ImageIcon,
  Film,
  Type,
  FileText,
  UploadCloud,
  Search,
  Filter,
  Building2,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Eye,
  SlidersHorizontal,
  Plus,
  Sparkles,
  Layers,
  Tag,
  Share2,
  Grid,
  List,
  CheckCircle2,
  X
} from 'lucide-react';

type AssetCategoryFilter = 'all' | 'photography' | 'logo' | 'video' | 'typography' | 'vector_icon';
type AspectRatioFilter = 'all' | '1:1' | '4:5' | '16:9' | '9:16';

export const DigitalAssetManager: React.FC = () => {
  const {
    workspace,
    currentUser,
    clients,
    digitalAssets,
    createDigitalAsset,
    deleteDigitalAsset,
    addToast
  } = useAgency();

  // Scoped clients and assets
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<AssetCategoryFilter>('all');
  const [aspectFilter, setAspectFilter] = useState<AspectRatioFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>('grid');

  // Asset Inspection & Upload Modals
  const [inspectedAsset, setInspectedAsset] = useState<DigitalAsset | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);

  // New Upload Form State
  const [uploadName, setUploadName] = useState<string>('');
  const [uploadClientId, setUploadClientId] = useState<string>(scopedClients[0]?.id || '');
  const [uploadCategory, setUploadCategory] = useState<DigitalAsset['category']>('photography');
  const [uploadUrl, setUploadUrl] = useState<string>('');
  const [uploadFormat, setUploadFormat] = useState<string>('JPG');
  const [uploadAspectRatio, setUploadAspectRatio] = useState<DigitalAsset['aspectRatio']>('1:1');
  const [uploadTags, setUploadTags] = useState<string>('brand_asset, social_ready');

  // Filtered Assets
  const filteredAssets = digitalAssets.filter(asset => {
    if (asset.tenantId !== workspace.id) return false;
    if (selectedClientId !== 'all' && asset.clientId !== selectedClientId) return false;
    if (categoryFilter !== 'all' && asset.category !== categoryFilter) return false;
    if (aspectFilter !== 'all' && asset.aspectRatio !== aspectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = asset.name.toLowerCase().includes(q);
      const matchTags = asset.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchTags) return false;
    }
    return true;
  });

  const handleCopyUrl = (asset: DigitalAsset) => {
    navigator.clipboard?.writeText(asset.url);
    setCopiedAssetId(asset.id);
    setTimeout(() => setCopiedAssetId(null), 2500);
    addToast('CDN Link Copied', `Direct asset link for "${asset.name}" ready to paste`, 'info');
  };

  const handleCreateAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) {
      addToast('Validation Error', 'Asset title is required', 'error');
      return;
    }

    const defaultFallbackUrl = uploadCategory === 'video'
      ? 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&auto=format&fit=crop'
      : uploadCategory === 'logo'
      ? 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&auto=format&fit=crop'
      : 'https://images.unsplash.com/photo-1608248597359-0021c17ca4ca?w=1200&auto=format&fit=crop';

    createDigitalAsset({
      tenantId: workspace.id,
      clientId: uploadClientId || scopedClients[0]?.id || 'client_01',
      name: uploadName.trim(),
      url: uploadUrl.trim() || defaultFallbackUrl,
      thumbnailUrl: uploadUrl.trim() || defaultFallbackUrl,
      category: uploadCategory,
      fileFormat: uploadFormat.toUpperCase(),
      fileSizeBytes: Math.floor(Math.random() * 3000000) + 1200000,
      dimensions: {
        width: uploadAspectRatio === '16:9' ? 1920 : uploadAspectRatio === '9:16' ? 1080 : 2048,
        height: uploadAspectRatio === '16:9' ? 1080 : uploadAspectRatio === '9:16' ? 1920 : 2048
      },
      aspectRatio: uploadAspectRatio,
      tags: uploadTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean),
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name
    });

    setIsUploadModalOpen(false);
    setUploadName('');
    setUploadUrl('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <span>{workspace.name}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-semibold font-mono">Digital Asset Management (DAM)</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-300 font-mono">{filteredAssets.length} Assets in Cloud Vault</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <span>Brand Media Vault & Digital Asset Management</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Centralized media repository across Kenyan client retainers, high-res photography, vector logos,
            font specimens, aspect ratio tags, and campaign usage frequency tracking.
          </p>
        </div>

        {/* Upload Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/30"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload New Asset</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Brand Selector, Search, Category Tabs, and View Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Brand Vaults ({scopedClients.length})</option>
              {scopedClients.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assets by tag or name..."
              className="bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none w-44 md:w-56"
            />
          </div>

          {/* Aspect Ratio Filter */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-2 py-1 rounded-lg text-xs font-mono">
            <span className="text-slate-500 text-[10px]">Ratio:</span>
            {(['all', '1:1', '4:5', '16:9', '9:16'] as AspectRatioFilter[]).map(aspect => (
              <button
                key={aspect}
                onClick={() => setAspectFilter(aspect)}
                className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${
                  aspectFilter === aspect
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {aspect}
              </button>
            ))}
          </div>
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-lg text-xs">
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-1.5 rounded ${viewLayout === 'grid' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewLayout('table')}
            className={`p-1.5 rounded ${viewLayout === 'table' ? 'bg-slate-800 text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { id: 'all', label: 'All Files', icon: Layers },
          { id: 'photography', label: 'Photography & Creative', icon: ImageIcon },
          { id: 'logo', label: 'Brand Logos & Vector Marks', icon: Sparkles },
          { id: 'video', label: 'Video Footage & Reels', icon: Film },
          { id: 'typography', label: 'Font Kits & Guidelines', icon: Type }
        ].map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as AssetCategoryFilter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                categoryFilter === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid View */}
      {viewLayout === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
              No digital media matches current search or filter criteria.
            </div>
          ) : (
            filteredAssets.map(asset => {
              const client = scopedClients.find(c => c.id === asset.clientId);

              return (
                <div
                  key={asset.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
                >
                  {/* Thumbnail / Media Container */}
                  <div
                    onClick={() => setInspectedAsset(asset)}
                    className="w-full aspect-square bg-slate-950 overflow-hidden relative cursor-pointer"
                  >
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1608248597359-0021c17ca4ca?w=600&auto=format&fit=crop';
                      }}
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                        {asset.aspectRatio}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-slate-300 uppercase">
                        {asset.fileFormat}
                      </span>
                    </div>

                    {/* Usage Badge */}
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-slate-300">
                      Used: <strong className="text-white">{asset.usageCount}x</strong>
                    </div>

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="px-2.5 py-1 bg-black/80 rounded-lg text-xs font-semibold text-white flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Inspect</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Client Brand Indicator */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: client?.accentColor || '#10b981' }}
                        ></span>
                        <span className="text-[11px] font-bold text-slate-400 truncate">
                          {client?.name || 'Brand'}
                        </span>
                      </div>

                      {/* Asset Title */}
                      <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {asset.name}
                      </h3>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] font-mono bg-slate-950 text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                      <span className="text-[10px] font-mono text-slate-500">
                        {(asset.fileSizeBytes / 1000000).toFixed(1)} MB
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyUrl(asset)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-slate-400 hover:text-emerald-400 transition-colors"
                          title="Copy CDN Link"
                        >
                          {copiedAssetId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteDigitalAsset(asset.id)}
                          className="p-1.5 bg-slate-950 hover:bg-red-950/60 border border-slate-800 hover:border-red-800/40 rounded text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Table View Layout */}
      {viewLayout === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Client Brand</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Ratio / Format</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Usage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredAssets.map(asset => {
                const client = scopedClients.find(c => c.id === asset.clientId);
                return (
                  <tr key={asset.id} className="hover:bg-slate-950/60 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-950 overflow-hidden shrink-0 border border-slate-800">
                        <img src={asset.thumbnailUrl || asset.url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-white line-clamp-1">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">By {asset.uploadedByName}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: client?.accentColor || '#10b981' }}></span>
                        <span className="font-semibold text-slate-200">{client?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize text-slate-300 font-mono">
                      {asset.category.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {asset.aspectRatio} · {asset.fileFormat}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {(asset.fileSizeBytes / 1000000).toFixed(2)} MB
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {asset.usageCount} posts
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setInspectedAsset(asset)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleCopyUrl(asset)}
                          className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-300"
                        >
                          {copiedAssetId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => deleteDigitalAsset(asset.id)}
                          className="p-1.5 bg-slate-950 hover:bg-red-950/60 rounded border border-slate-800 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Inspect Asset Drawer Modal */}
      {inspectedAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span>Asset Inspection & Usage Dossier</span>
              </div>
              <button
                onClick={() => setInspectedAsset(null)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Media Preview */}
              <div className="w-full aspect-square rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                <img
                  src={inspectedAsset.url}
                  alt={inspectedAsset.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Asset Metadata Specifications */}
              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="font-bold text-white text-sm">{inspectedAsset.name}</h3>
                  <div className="text-slate-400 mt-0.5">
                    Category: <span className="text-emerald-400 capitalize">{inspectedAsset.category.replace('_', ' ')}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">File Format:</span>
                    <span className="text-white font-bold">{inspectedAsset.fileFormat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Aspect Ratio:</span>
                    <span className="text-emerald-400 font-bold">{inspectedAsset.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dimensions:</span>
                    <span className="text-white">{inspectedAsset.dimensions?.width} × {inspectedAsset.dimensions?.height} px</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">File Weight:</span>
                    <span className="text-white">{(inspectedAsset.fileSizeBytes / 1000000).toFixed(2)} MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Campaign Usage:</span>
                    <span className="text-emerald-400 font-bold">{inspectedAsset.usageCount} posts</span>
                  </div>
                </div>

                {/* Direct CDN Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">CDN Endpoint</label>
                  <div className="flex items-center gap-2 p-2 bg-slate-950 border border-slate-800 rounded text-[11px] font-mono text-slate-300">
                    <span className="truncate flex-1">{inspectedAsset.url}</span>
                    <button
                      onClick={() => handleCopyUrl(inspectedAsset)}
                      className="text-emerald-400 hover:text-white font-bold shrink-0"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectedAsset(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload New Asset Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>Upload Media Asset to Brand Vault</span>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xs font-mono"
              >
                ✕ ESC
              </button>
            </div>

            <form onSubmit={handleCreateAssetSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Asset Name / Title *</label>
                <input
                  type="text"
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. Westlands Roastery Espresso Flight Hero"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Brand Client *</label>
                <select
                  value={uploadClientId}
                  onChange={(e) => setUploadClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {scopedClients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as DigitalAsset['category'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 capitalize"
                  >
                    <option value="photography">Photography</option>
                    <option value="logo">Logo & Vector</option>
                    <option value="video">Video & Reel</option>
                    <option value="typography">Typography</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Aspect Ratio</label>
                  <select
                    value={uploadAspectRatio}
                    onChange={(e) => setUploadAspectRatio(e.target.value as DigitalAsset['aspectRatio'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Vertical Feed)</option>
                    <option value="16:9">16:9 (Landscape)</option>
                    <option value="9:16">9:16 (Stories/Reels)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">CDN Image/Video URL (Optional)</label>
                <input
                  type="url"
                  value={uploadUrl}
                  onChange={(e) => setUploadUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... (auto-assigned if blank)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="hero, campaign, instagram, kenya"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Register Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
