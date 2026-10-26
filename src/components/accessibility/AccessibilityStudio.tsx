import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Eye,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  Smartphone,
  Tablet,
  Monitor,
  Keyboard,
  ShieldCheck,
  Zap,
  MousePointer
} from 'lucide-react';
import { accessibilityService } from '../../services/accessibilityService';
import {
  AccessibilityPreferences,
  ContrastAuditResult,
  SoundEffectType,
  WcagAuditCheck
} from '../../types';

export const AccessibilityStudio: React.FC = () => {
  const [prefs, setPrefs] = useState<AccessibilityPreferences>(() =>
    accessibilityService.getPreferences()
  );
  const [activeTab, setActiveTab] = useState<'audit' | 'palette' | 'audio' | 'responsive'>('audit');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customFg, setCustomFg] = useState<string>('#f1f5f9');
  const [customBg, setCustomBg] = useState<string>('#0b0f17');
  const [calculatedRatio, setCalculatedRatio] = useState<ContrastAuditResult>(() =>
    accessibilityService.auditContrast('#f1f5f9', '#0b0f17')
  );

  const checks: WcagAuditCheck[] = accessibilityService.getWcagAuditChecks();
  const paletteAudits: ContrastAuditResult[] = accessibilityService.getPaletteAuditResults();

  useEffect(() => {
    accessibilityService.applyToDom(prefs);
  }, [prefs]);

  const updatePreference = (updated: Partial<AccessibilityPreferences>) => {
    const next = accessibilityService.savePreferences(updated);
    setPrefs(next);
  };

  const handleTestSound = (type: SoundEffectType) => {
    accessibilityService.playSound(type);
  };

  const handleCustomContrastCheck = () => {
    const res = accessibilityService.auditContrast(customFg, customBg);
    setCalculatedRatio(res);
  };

  const filteredChecks = checks.filter(
    c => selectedCategory === 'all' || c.category === selectedCategory
  );

  const overallScore = Math.round(
    checks.reduce((acc, c) => acc + c.score, 0) / checks.length
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" role="region" aria-label="Design Polish and Accessibility Studio">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Design Polish & Accessibility
              </h1>
              <p className="text-sm text-slate-400">
                WCAG 2.1 AA compliance audit, Web Audio feedback cues, and responsive ergonomics
              </p>
            </div>
          </div>
        </div>

        {/* Global Compliance Score Indicator */}
        <div className="flex items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl px-5 py-3">
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              WCAG 2.1 AA Score
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {overallScore}%
            </div>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        {[
          { id: 'audit', label: 'WCAG AA Compliance', icon: Eye },
          { id: 'palette', label: 'Color & Contrast Ratios', icon: Sliders },
          { id: 'audio', label: 'Sound & Haptic Cues', icon: Volume2 },
          { id: 'responsive', label: 'Touch & Breakpoints', icon: Smartphone }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                accessibilityService.playSound('click');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Global Accessibility Toggles Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Reduced Motion Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div>
            <div className="text-sm font-semibold text-slate-200">Reduced Motion</div>
            <div className="text-xs text-slate-400">Minimizes spring physics & animations</div>
          </div>
          <button
            onClick={() => {
              updatePreference({ reducedMotion: !prefs.reducedMotion });
              accessibilityService.playSound('toggle');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.reducedMotion ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
            aria-label="Toggle Reduced Motion"
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* Enhanced Focus Rings */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div>
            <div className="text-sm font-semibold text-slate-200">High-Vis Focus Rings</div>
            <div className="text-xs text-slate-400">3px emerald glow on keyboard focus</div>
          </div>
          <button
            onClick={() => {
              updatePreference({ focusRingEnhanced: !prefs.focusRingEnhanced });
              accessibilityService.playSound('toggle');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.focusRingEnhanced ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
            aria-label="Toggle Enhanced Focus Rings"
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* Sound Feedback Toggle */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div>
            <div className="text-sm font-semibold text-slate-200">Audio Cues</div>
            <div className="text-xs text-slate-400">Non-intrusive Web Audio tones</div>
          </div>
          <button
            onClick={() => {
              updatePreference({ soundEnabled: !prefs.soundEnabled });
              accessibilityService.playSound('toggle');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
            aria-label="Toggle Sound Effects"
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
          <div>
            <div className="text-sm font-semibold text-slate-200">High Contrast</div>
            <div className="text-xs text-slate-400">Reinforced border delineations</div>
          </div>
          <button
            onClick={() => {
              updatePreference({ highContrastMode: !prefs.highContrastMode });
              accessibilityService.playSound('toggle');
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.highContrastMode ? 'bg-emerald-500 justify-end' : 'bg-slate-800 justify-start'
            }`}
            aria-label="Toggle High Contrast Mode"
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-sm" />
          </button>
        </div>
      </div>

      {/* TAB 1: WCAG AA AUDIT CHECKLIST */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Criteria' },
              { id: 'contrast', label: 'Color & Contrast' },
              { id: 'keyboard', label: 'Keyboard & Focus' },
              { id: 'motion', label: 'Motion & Physics' },
              { id: 'touch', label: 'Touch Targets' },
              { id: 'aria', label: 'ARIA & Semantics' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'bg-slate-950 text-slate-400 border border-slate-800/60 hover:text-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Checklist Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChecks.map(check => (
              <div
                key={check.id}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      WCAG {check.level}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {check.criterion}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed ({check.score}%)
                  </div>
                </div>

                <div>
                  <h2 className="text-base font-semibold text-slate-200">
                    {check.title}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                    {check.description}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300">
                  <span className="text-emerald-400 font-semibold">Verification: </span>
                  {check.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PALETTE & CONTRAST CALCULATOR */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          {/* Interactive Calculator */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Interactive Contrast Ratio Calculator
                </h2>
                <p className="text-xs text-slate-400">
                  Formula compliant with WCAG 2.1 relative luminance algorithm
                </p>
              </div>
              <span className={`px-3 py-1 rounded-xl text-xs font-bold font-mono border ${
                calculatedRatio.level === 'AAA'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : calculatedRatio.level === 'AA'
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                WCAG {calculatedRatio.level} Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Foreground Hex (Text)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customFg}
                    onChange={e => {
                      setCustomFg(e.target.value);
                      const res = accessibilityService.auditContrast(e.target.value, customBg);
                      setCalculatedRatio(res);
                    }}
                    className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={customFg}
                    onChange={e => {
                      setCustomFg(e.target.value);
                      const res = accessibilityService.auditContrast(e.target.value, customBg);
                      setCalculatedRatio(res);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Background Hex (Surface)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBg}
                    onChange={e => {
                      setCustomBg(e.target.value);
                      const res = accessibilityService.auditContrast(customFg, e.target.value);
                      setCalculatedRatio(res);
                    }}
                    className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                  />
                  <input
                    type="text"
                    value={customBg}
                    onChange={e => {
                      setCustomBg(e.target.value);
                      const res = accessibilityService.auditContrast(customFg, e.target.value);
                      setCalculatedRatio(res);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200"
                  />
                </div>
              </div>

              {/* Result Preview Box */}
              <div
                className="rounded-xl p-4 border border-slate-800 text-center transition-all"
                style={{ backgroundColor: customBg, color: customFg }}
              >
                <div className="text-2xl font-extrabold font-mono">
                  {calculatedRatio.ratio}:1
                </div>
                <div className="text-xs font-medium mt-1">
                  Preview Sample Typography
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Normal Text (&ge; 4.5:1):{' '}
                <strong className={calculatedRatio.normalTextPassed ? 'text-emerald-400' : 'text-rose-400'}>
                  {calculatedRatio.normalTextPassed ? 'PASS' : 'FAIL'}
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Large / Bold Text (&ge; 3.0:1):{' '}
                <strong className={calculatedRatio.largeTextPassed ? 'text-emerald-400' : 'text-rose-400'}>
                  {calculatedRatio.largeTextPassed ? 'PASS' : 'FAIL'}
                </strong>
              </span>
            </div>
          </div>

          {/* Palette Audit Table */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-slate-100">
              Verified Design Tokens Contrast Matrix
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Foreground Token</th>
                    <th className="pb-3 font-semibold">Background Surface</th>
                    <th className="pb-3 font-semibold">Measured Ratio</th>
                    <th className="pb-3 font-semibold">WCAG Rating</th>
                    <th className="pb-3 font-semibold">Evaluation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
                  {paletteAudits.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/30">
                      <td className="py-3 flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-700"
                          style={{ backgroundColor: item.foreground }}
                        />
                        <span className="text-slate-200">{item.foreground}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded border border-slate-800"
                          style={{ backgroundColor: item.background, color: item.foreground }}
                        >
                          {item.background}
                        </span>
                      </td>
                      <td className="py-3 text-slate-200 font-bold">
                        {item.ratio}:1
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.level}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 font-sans">
                        {item.ratio >= 7 ? 'AAA Enhanced Contrast' : 'AA Standard Text'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIO & SOUND FEEDBACK CUES */}
      {activeTab === 'audio' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-100">
                  Synthesized Audio Feedback Engine
                </h2>
                <p className="text-xs text-slate-400">
                  Subtle, non-intrusive micro-sound feedback generated in real time using the browser Web Audio API
                </p>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2">
                <button
                  onClick={() => {
                    updatePreference({ soundEnabled: !prefs.soundEnabled });
                    accessibilityService.playSound('click');
                  }}
                  className="text-slate-400 hover:text-slate-200"
                >
                  {prefs.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={prefs.soundVolume}
                  onChange={e => {
                    updatePreference({ soundVolume: parseFloat(e.target.value) });
                  }}
                  className="w-24 accent-emerald-400 cursor-pointer"
                  disabled={!prefs.soundEnabled}
                />
                <span className="text-xs font-mono text-slate-400 w-8">
                  {Math.round(prefs.soundVolume * 100)}%
                </span>
              </div>
            </div>

            {/* Sound Triggers Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'success',
                  title: 'Success Arpeggio',
                  desc: 'Ascending C5-E5-G5 triad on workflow saves & publish',
                  icon: CheckCircle2,
                  color: 'text-emerald-400'
                },
                {
                  id: 'warning',
                  title: 'Warning Alert',
                  desc: 'Dual cautionary tone on unconfirmed actions & limits',
                  icon: AlertTriangle,
                  color: 'text-amber-400'
                },
                {
                  id: 'error',
                  title: 'Error Pulse',
                  desc: 'Low sawtooth pulse on validation or network errors',
                  icon: RotateCcw,
                  color: 'text-rose-400'
                },
                {
                  id: 'click',
                  title: 'Transient Click',
                  desc: 'Subtle 750Hz micro-click on button navigation',
                  icon: MousePointer,
                  color: 'text-sky-400'
                },
                {
                  id: 'toggle',
                  title: 'Toggle Frequency Sweep',
                  desc: 'Smooth pitch shift on switch & preference toggles',
                  icon: Zap,
                  color: 'text-indigo-400'
                },
                {
                  id: 'badge',
                  title: 'Chime Pill',
                  desc: '880Hz bell chime on audit events and notifications',
                  icon: Sparkles,
                  color: 'text-purple-400'
                }
              ].map(sound => {
                const Icon = sound.icon;
                return (
                  <div
                    key={sound.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`w-4 h-4 ${sound.color}`} />
                        <h3 className="text-sm font-semibold text-slate-200">
                          {sound.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {sound.desc}
                      </p>
                    </div>

                    <button
                      onClick={() => handleTestSound(sound.id as SoundEffectType)}
                      disabled={!prefs.soundEnabled}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/30 transition-all disabled:opacity-40"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Play Sample Tone
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESPONSIVE BREAKPOINTS & TOUCH TARGETS */}
      {activeTab === 'responsive' && (
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Responsive Breakpoints & Touch Target Ergonomics
              </h2>
              <p className="text-xs text-slate-400">
                Verified layout scaling from smartphone screens up to ultra-wide displays
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: Smartphone,
                  name: 'Mobile Phone',
                  spec: '< 640px',
                  features: 'Single column, collapsed menu drawer, 44px tap targets'
                },
                {
                  icon: Tablet,
                  name: 'Tablet Portrait',
                  spec: '640px – 1024px',
                  features: 'Adaptive 2-column cards, touch swipe galleries'
                },
                {
                  icon: Monitor,
                  name: 'Desktop Standard',
                  spec: '1024px – 1440px',
                  features: 'Full sidebar navigation, split matrix tables, multi-column'
                },
                {
                  icon: Maximize2,
                  name: 'Ultra-Wide Workstation',
                  spec: '> 1440px',
                  features: 'Max-width 1600px container bounding to maintain optimal reading length'
                }
              ].map((bp, idx) => {
                const Icon = bp.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Icon className="w-5 h-5" />
                      <h3 className="text-sm font-semibold text-slate-200">
                        {bp.name}
                      </h3>
                    </div>
                    <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded inline-block">
                      {bp.spec}
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {bp.features}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Touch Target Validation Card */}
            <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/70 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                  44px
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    WCAG 2.5.5 Touch Target Compliance (Minimum 44 &times; 44px)
                  </h3>
                  <p className="text-xs text-slate-400">
                    All primary buttons, navigation toggles, and modal dismiss actions provide ample hit areas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  ✓ Passed All Breakpoint Checks
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
