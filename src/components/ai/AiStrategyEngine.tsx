import React, { useState } from 'react';
import { useAgency } from '../../context/AgencyContext';
import {
  AiContentGoal,
  AiToneStyle,
  SocialPlatform,
  AiStrategyBrief,
  AiGeneratedCaption
} from '../../types';
import {
  Sparkles,
  Zap,
  Target,
  Copy,
  Check,
  Send,
  Trash2,
  TrendingUp,
  Brain,
  Shield,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Share2,
  RefreshCw
} from 'lucide-react';

export const AiStrategyEngine: React.FC<{ onNavigateToComposer?: () => void }> = ({ onNavigateToComposer }) => {
  const {
    workspace,
    currentUser,
    clients,
    activeClient,
    setActiveClientId,
    aiBriefs,
    generateAiStrategyBrief,
    deleteAiBrief,
    createContentItem,
    addToast
  } = useAgency();

  // Scoped Data by active workspace
  const scopedClients = clients.filter(c => c.tenantId === workspace.id);
  const scopedBriefs = aiBriefs.filter(b => b.tenantId === workspace.id);

  // Generator form state
  const [selectedClientId, setSelectedClientId] = useState<string>(
    activeClient ? activeClient.id : (scopedClients[0]?.id || '')
  );
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('linkedin');
  const [topic, setTopic] = useState<string>(scopedClients.length > 0 ? 'Cutting Commercial Grid Tariffs by 48% with Rooftop Solar' : '');
  const [targetAudience, setTargetAudience] = useState<string>(
    scopedClients.length > 0 ? 'CFOs, Operations Directors & Plant Managers in Kenyan Manufacturing Facilities' : ''
  );
  const [goal, setGoal] = useState<AiContentGoal>('lead_generation');
  const [tone, setTone] = useState<AiToneStyle>('professional_authoritative');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'studio' | 'briefs_archive' | 'competitor_intel'>('studio');
  const [copiedCaptionId, setCopiedCaptionId] = useState<string | null>(null);
  const [selectedBriefId, setSelectedBriefId] = useState<string | null>(scopedBriefs[0]?.id || null);

  // Client selected details
  const currentTargetClient = scopedClients.find(c => c.id === selectedClientId) || scopedClients[0] || null;

  // Filtered briefs
  const [filterClient, setFilterClient] = useState<string>('all');
  const [searchBriefQuery, setSearchBriefQuery] = useState<string>('');

  const filteredBriefs = scopedBriefs.filter(b => {
    const matchClient = filterClient === 'all' || b.clientId === filterClient;
    const matchSearch =
      b.topic.toLowerCase().includes(searchBriefQuery.toLowerCase()) ||
      b.targetAudience.toLowerCase().includes(searchBriefQuery.toLowerCase());
    return matchClient && matchSearch;
  });

  const activeBrief = scopedBriefs.find(b => b.id === selectedBriefId) || filteredBriefs[0] || null;

  const handleGenerate = () => {
    if (!topic.trim()) {
      addToast('Missing Topic', 'Please enter a topic or campaign theme to generate brief.', 'error');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateAiStrategyBrief({
        clientId: selectedClientId,
        platform: selectedPlatform,
        topic: topic.trim(),
        targetAudience: targetAudience.trim() || 'Target Consumers and Decision Makers',
        goal,
        tone
      });
      setSelectedBriefId(generated.id);
      setIsGenerating(false);
      setActiveTab('studio');
    }, 1000);
  };

  const handleCopyCaption = (caption: AiGeneratedCaption) => {
    const fullText = `${caption.hook}\n\n${caption.body}\n\n${caption.callToAction}\n\n${caption.hashtags.join(' ')}`;
    navigator.clipboard.writeText(fullText);
    setCopiedCaptionId(caption.id);
    addToast('Copied to Clipboard', 'Full post copy & hashtags ready to paste.', 'info');
    setTimeout(() => setCopiedCaptionId(null), 2500);
  };

  const handleSendToComposer = (caption: AiGeneratedCaption) => {
    if (!currentTargetClient) return;

    createContentItem({
      tenantId: workspace.id,
      creatorId: currentUser.id,
      clientId: currentTargetClient.id,
      title: `${caption.hook.slice(0, 50)}...`,
      caption: `${caption.hook}\n\n${caption.body}\n\n${caption.callToAction}\n\n${caption.hashtags.join(' ')}`,
      platforms: [selectedPlatform],
      format: 'single_image',
      stage: 'draft',
      mediaUrls: [],
      scheduledDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      tags: caption.hashtags.map(h => h.replace('#', '')),
      feedbackNotes: `AI Generated from Brief "${activeBrief?.topic || topic}" (Score: ${caption.predictedEngagementScore}%)`
    });

    addToast('Sent to Composer', `Created new draft for ${currentTargetClient.name}.`, 'success');
    if (onNavigateToComposer) {
      onNavigateToComposer();
    }
  };

  const handleApplyQuickTopic = (quickTopic: string, quickAudience: string, quickGoal: AiContentGoal, quickTone: AiToneStyle) => {
    setTopic(quickTopic);
    setTargetAudience(quickAudience);
    setGoal(quickGoal);
    setTone(quickTone);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden border border-violet-700/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold tracking-wide uppercase mb-3 border border-violet-500/30">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              Gemini Pro Multimodal Strategy Engine
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">AI Content & Strategy Studio</h1>
            <p className="text-violet-200/80 text-sm max-w-2xl mt-1">
              Synthesize brand-aligned viral hook variations, competitive gap analysis, and high-conversion captions tailored to the East African market.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-violet-500/30 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Studio Generator
            </button>
            <button
              onClick={() => setActiveTab('competitor_intel')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'competitor_intel'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Competitor Intel
            </button>
            <button
              onClick={() => setActiveTab('briefs_archive')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'briefs_archive'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Saved Briefs ({aiBriefs.length})
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Generator Controls */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h2 className="text-base font-bold text-white">Campaign & Brand Parameters</h2>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  Model: Gemini 1.5 Pro
                </span>
              </div>

              {/* Client Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Client Brand
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => {
                    setSelectedClientId(e.target.value);
                    setActiveClientId(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-750 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  {scopedClients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} ({client.industry})
                    </option>
                  ))}
                </select>
                {currentTargetClient && (
                  <div className="mt-2 p-2.5 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400 flex items-center justify-between">
                    <div>
                      <span className="text-slate-300 font-medium">Brand Tone: </span>
                      <span className="text-violet-300 capitalize">{currentTargetClient.toneOfVoice?.join(', ') || 'Authoritative & Inspiring'}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {currentTargetClient.guidelineDetails?.keyHashtags?.[0] || '#AfricaGrowth'}
                    </span>
                  </div>
                )}
              </div>

              {/* Platform Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Social Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['linkedin', 'instagram', 'twitter', 'tiktok', 'facebook', 'youtube'] as SocialPlatform[]).map(plat => (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSelectedPlatform(plat)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium capitalize border transition-all text-center ${
                        selectedPlatform === plat
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-sm font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {plat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Strategic Content Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'lead_generation', label: 'Lead Generation' },
                    { id: 'engagement', label: 'Viral Engagement' },
                    { id: 'educational', label: 'Authority / Education' },
                    { id: 'brand_awareness', label: 'Brand Awareness' },
                    { id: 'direct_sales', label: 'Direct Conversion' }
                  ].map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGoal(g.id as AiContentGoal)}
                      className={`px-3 py-2 rounded-xl text-xs text-left border transition-all ${
                        goal === g.id
                          ? 'bg-violet-600/20 border-violet-500 text-violet-300 font-semibold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone of Voice */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Audience Tone & Cadence
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as AiToneStyle)}
                  className="w-full bg-slate-950 border border-slate-750 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="professional_authoritative">Professional & Authoritative (C-Suite & B2B)</option>
                  <option value="inspiring_storytelling">Inspiring & Narrative-Driven (Founders & Wellness)</option>
                  <option value="conversational_relatable">Conversational & Relatable (Community & D2C)</option>
                  <option value="bold_provocative">Bold & Contrarian (Thought Leaders & Disruptors)</option>
                  <option value="playful_witty">Playful & Witty (TikTok & Gen-Z Pop Culture)</option>
                </select>
              </div>

              {/* Topic & Theme */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Core Topic / Proposition
                </label>
                <textarea
                  rows={3}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. How high-altitude purple tea yields 3x more anthocyanins than green tea..."
                  className="w-full bg-slate-950 border border-slate-750 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Target Audience Persona
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. CFOs, Eco-conscious consumers, Nairobi SMEs"
                  className="w-full bg-slate-950 border border-slate-750 text-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-violet-500 transition-colors"
                />
              </div>

              {/* Quick Template Suggestion Chips */}
              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-2">Preset Angles (Click to Autofill):</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTopic(
                      'Commercial Solar Microgrids: Slashing Peak Tariff Power Costs by 48%',
                      'C-Level Executives & Plant Operators in East African Industrial Parks',
                      'lead_generation',
                      'professional_authoritative'
                    )}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    ☀️ Solar Case Study
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTopic(
                      'High-Altitude Purple Tea: The Superfood Antioxidant Secret of Mt. Kenya',
                      'Wellness Enthusiasts & Organic Tea Drinkers in Nairobi & Global Export',
                      'engagement',
                      'inspiring_storytelling'
                    )}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    🍵 Tea Superfood
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyQuickTopic(
                      'Why 90% of Paid Instagram Ads Fail in Kenya & How to Fix Them',
                      'E-commerce Founders & Digital Marketing Managers in Nairobi',
                      'educational',
                      'bold_provocative'
                    )}
                    className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    🚀 Ad Optimization
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing Brand Guidelines & Generating Brief...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    <span>Synthesize AI Strategy & Viral Hooks</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output & Viral Hook Variations */}
          <div className="lg:col-span-7 space-y-5">
            {activeBrief ? (
              <div className="space-y-5">
                {/* Active Brief Header Info */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase tracking-wide">
                          {activeBrief.platform}
                        </span>
                        <span className="text-xs text-slate-400 capitalize">
                          Goal: <strong className="text-slate-200">{activeBrief.goal.replace('_', ' ')}</strong>
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-white mt-1.5">{activeBrief.topic}</h2>
                      <p className="text-xs text-slate-400 mt-0.5">Audience: {activeBrief.targetAudience}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteAiBrief(activeBrief.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Brief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Hooks Section Heading */}
                  <div className="mt-4 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Generated Viral Hook Variations ({activeBrief.captions.length})
                    </h3>
                    <span className="text-[11px] text-slate-400">Ranked by Predicted Resonance</span>
                  </div>
                </div>

                {/* Generated Captions List */}
                <div className="space-y-4">
                  {activeBrief.captions.map((cap, index) => (
                    <div
                      key={cap.id}
                      className="bg-slate-900 border border-slate-800 hover:border-violet-500/40 rounded-2xl p-5 shadow-sm transition-all"
                    >
                      {/* Caption Top Row: Score & Hook Angle */}
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold text-xs border border-violet-500/30">
                            #{index + 1}
                          </div>
                          <span className="text-xs font-bold text-slate-200">
                            {index === 0 ? 'Curiosity & Value Hook' : index === 1 ? 'Contrarian & Disruption Hook' : 'Problem-Agitation Constraint'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs text-emerald-400 font-semibold">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span>{cap.predictedEngagementScore}% Virality Index</span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {cap.characterCount} chars
                          </span>
                        </div>
                      </div>

                      {/* Hook Headline */}
                      <div className="mt-3.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase block mb-1">
                          Scroll-Stopping Hook
                        </span>
                        <p className="text-sm font-semibold text-white leading-relaxed">
                          "{cap.hook}"
                        </p>
                      </div>

                      {/* Post Body Copy */}
                      <div className="mt-3 text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                        {cap.body}
                      </div>

                      {/* Call to Action */}
                      <div className="mt-3 bg-violet-950/30 border border-violet-800/40 p-2.5 rounded-xl text-xs text-violet-200 flex items-center gap-2">
                        <span className="font-bold text-violet-400 text-[10px] uppercase tracking-wider">CTA:</span>
                        <span>{cap.callToAction}</span>
                      </div>

                      {/* Hashtags */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cap.hashtags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[11px] font-medium bg-slate-950 text-indigo-400 border border-slate-800 px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Strategic Rationale */}
                      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span><strong>Why it works:</strong> {cap.reasoning}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCaption(cap)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium transition-colors"
                          >
                            {copiedCaptionId === cap.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendToComposer(cap)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-colors"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Push to Composer</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-4">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No Strategy Brief Selected</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Select parameters on the left and synthesize your first brand-tailored campaign brief or load an existing brief.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Competitor White-Space Intel */}
      {activeTab === 'competitor_intel' && (
        <div className="space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  Competitor Positioning & Market Gap Matrix
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Identify what competing players are overlooking in the East African market to carve out uncontested brand authority.
                </p>
              </div>

              <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-semibold">
                Client Scoped: {currentTargetClient?.name || 'Active Agency Partner'}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeBrief?.competitorAngles?.map((angle) => (
                <div
                  key={angle.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg">
                      Competitor Target: {angle.competitorName}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Market Gap</span>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Their Current Approach:</h4>
                    <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {angle.theirApproach}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider mb-1">Identified Content Gap:</h4>
                    <p className="text-xs text-slate-300 bg-amber-950/20 border border-amber-800/40 p-3 rounded-xl">
                      {angle.contentGap}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">Recommended Counter-Angle:</h4>
                    <p className="text-xs text-emerald-200 bg-emerald-950/20 border border-emerald-800/40 p-3 rounded-xl">
                      {angle.recommendedAngle}
                    </p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                      Actionable Hook Angle:
                    </span>
                    <p className="text-xs font-medium text-slate-100 italic">
                      "{angle.sampleHook}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Saved Briefs Archive */}
      {activeTab === 'briefs_archive' && (
        <div className="space-y-5">
          {/* Controls Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search briefs by topic or audience..."
                value={searchBriefQuery}
                onChange={(e) => setSearchBriefQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 w-full sm:w-72 focus:outline-none focus:border-violet-500"
              />

              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Clients</option>
                {scopedClients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredBriefs.length} saved briefs
            </span>
          </div>

          {/* Grid of Briefs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBriefs.map(brief => {
              const client = clients.find(c => c.id === brief.clientId);
              const isSelected = selectedBriefId === brief.id;

              return (
                <div
                  key={brief.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between ${
                    isSelected ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-800 hover:border-slate-750'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {client?.name || 'Brand Partner'}
                      </span>
                      <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wide">
                        {brief.platform}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-2">
                      {brief.topic}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2">
                      Audience: {brief.targetAudience}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <span>Goal: <strong className="text-slate-200 capitalize">{brief.goal.replace('_', ' ')}</strong></span>
                      <span>•</span>
                      <span>{brief.captions.length} Hooks</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBriefId(brief.id);
                        setActiveTab('studio');
                      }}
                      className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1"
                    >
                      Open in Studio <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteAiBrief(brief.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Brief"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
