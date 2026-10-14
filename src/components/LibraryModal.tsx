import React, { useState, useEffect } from 'react';
import {
  X,
  Film,
  Play,
  Sparkles,
  Youtube,
  Radio,
  Link as LinkIcon,
  Check,
  Star,
  History,
  Trash2,
  Plus,
  Clock,
  Eye,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';
import {
  BUILTIN_DEMO_VIDEOS,
  getSavedSamples,
  getWatchedHistory,
  saveWatchedMovieAsSample,
  removeSavedSample,
  clearWatchedHistory,
  isMovieSavedAsSample,
  inferMediaType,
  formatUrlTitle,
} from '../data/demoMedia';
import { DemoVideo, WatchedMovieRecord } from '../types';

interface LibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (url: string, title?: string) => void;
  currentUrl: string;
  onSampleSaved?: (sample: DemoVideo) => void;
}

export function LibraryModal({
  isOpen,
  onClose,
  onSelectVideo,
  currentUrl,
  onSampleSaved,
}: LibraryModalProps) {
  const [filter, setFilter] = useState<'all' | 'saved' | 'history' | 'video' | 'hls' | 'youtube'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Dynamic state for saved samples and history
  const [savedSamples, setSavedSamples] = useState<DemoVideo[]>([]);
  const [watchedHistory, setWatchedHistory] = useState<WatchedMovieRecord[]>([]);
  const [showAddSampleForm, setShowAddSampleForm] = useState(false);
  const [newSampleUrl, setNewSampleUrl] = useState('');
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [newSampleCategory, setNewSampleCategory] = useState('Personal Favorite');

  const refreshData = () => {
    setSavedSamples(getSavedSamples());
    setWatchedHistory(getWatchedHistory());
  };

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const url = customUrl.trim();
    const title = customTitle.trim() || undefined;
    onSelectVideo(url, title);
    onClose();
  };

  const handleSaveToSample = (url: string, title?: string, duration?: string) => {
    const saved = saveWatchedMovieAsSample({
      url,
      title,
      duration,
    });
    refreshData();
    if (onSampleSaved) onSampleSaved(saved);
  };

  const handleRemoveSample = (urlOrId: string) => {
    removeSavedSample(urlOrId);
    refreshData();
  };

  const handleAddNewSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSampleUrl.trim()) return;
    const saved = saveWatchedMovieAsSample({
      url: newSampleUrl.trim(),
      title: newSampleTitle.trim() || undefined,
      category: newSampleCategory.trim() || 'Custom Sample',
    });
    setNewSampleUrl('');
    setNewSampleTitle('');
    setShowAddSampleForm(false);
    refreshData();
    if (onSampleSaved) onSampleSaved(saved);
  };

  const handleClearHistory = () => {
    clearWatchedHistory();
    refreshData();
  };

  // Determine videos to display
  let displayedVideos: DemoVideo[] = [];
  if (filter === 'all') {
    displayedVideos = [...savedSamples, ...BUILTIN_DEMO_VIDEOS];
  } else if (filter === 'saved') {
    displayedVideos = savedSamples;
  } else if (filter === 'video') {
    displayedVideos = [...savedSamples, ...BUILTIN_DEMO_VIDEOS].filter((v) => v.type === 'video');
  } else if (filter === 'hls') {
    displayedVideos = [...savedSamples, ...BUILTIN_DEMO_VIDEOS].filter((v) => v.type === 'hls');
  } else if (filter === 'youtube') {
    displayedVideos = [...savedSamples, ...BUILTIN_DEMO_VIDEOS].filter((v) => v.type === 'youtube');
  }

  const isCurrentUrlSaved = currentUrl ? isMovieSavedAsSample(currentUrl) : false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#141622] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#191c2b] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-xl">
              🎬
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Movie & Stream Library
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {savedSamples.length} Saved Samples
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose any pre-tested movie, browse watched movies, or save your own custom sample streams.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Save Current Video Banner (if watching a movie) */}
        {currentUrl && (
          <div className="px-4 py-2.5 bg-gradient-to-r from-indigo-950/40 via-sky-950/30 to-[#141622] border-b border-indigo-500/20 flex items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300 font-medium truncate">
                Current: <strong className="text-white">{formatUrlTitle(currentUrl)}</strong>
              </span>
            </div>
            {isCurrentUrlSaved ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg shrink-0">
                <BookmarkCheck className="w-3.5 h-3.5" />
                Saved in Samples
              </span>
            ) : (
              <button
                onClick={() => handleSaveToSample(currentUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all shrink-0"
              >
                <BookmarkPlus className="w-3.5 h-3.5" />
                Save as Sample
              </button>
            )}
          </div>
        )}

        {/* Custom URL Quick Paste */}
        <div className="p-3.5 bg-[#11131c] border-b border-white/5 shrink-0">
          <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Paste custom link (.mp4 / .webm / .m3u8 / YouTube)..."
              className="flex-1 bg-[#181a26] border border-white/10 focus:border-indigo-500 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Optional title"
                className="w-36 bg-[#181a26] border border-white/10 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!customUrl.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow disabled:opacity-40 disabled:cursor-not-allowed transition-all whitespace-nowrap"
              >
                Load URL
              </button>
            </div>
          </form>
        </div>

        {/* Categories & Navigation Tab Bar */}
        <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-white/5 bg-[#131522] overflow-x-auto text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All Samples ({savedSamples.length + BUILTIN_DEMO_VIDEOS.length})
            </button>
            <button
              onClick={() => setFilter('saved')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                filter === 'saved'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-white/5'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>My Saved Samples ({savedSamples.length})</span>
            </button>
            <button
              onClick={() => setFilter('history')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                filter === 'history'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-sky-300 hover:text-sky-200 hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span>Watched Movies ({watchedHistory.length})</span>
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                filter === 'video'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> MP4
            </button>
            <button
              onClick={() => setFilter('hls')}
              className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                filter === 'hls'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Radio className="w-3.5 h-3.5" /> HLS
            </button>
            <button
              onClick={() => setFilter('youtube')}
              className={`px-2.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors ${
                filter === 'youtube'
                  ? 'bg-indigo-500 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Youtube className="w-3.5 h-3.5" /> YouTube
            </button>
          </div>

          {filter === 'saved' && (
            <button
              onClick={() => setShowAddSampleForm(!showAddSampleForm)}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddSampleForm ? 'Close' : 'Add Sample'}</span>
            </button>
          )}

          {filter === 'history' && watchedHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
              title="Clear watched history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* Manual Add Sample Form Toggle */}
        {filter === 'saved' && showAddSampleForm && (
          <form
            onSubmit={handleAddNewSample}
            className="p-4 bg-[#181a28] border-b border-indigo-500/20 flex flex-col sm:flex-row gap-2.5 animate-in slide-in-from-top-2 duration-150 shrink-0"
          >
            <input
              type="url"
              required
              value={newSampleUrl}
              onChange={(e) => setNewSampleUrl(e.target.value)}
              placeholder="Sample Video URL (.mp4 / .m3u8 / YouTube)..."
              className="flex-1 bg-[#10121b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={newSampleTitle}
              onChange={(e) => setNewSampleTitle(e.target.value)}
              placeholder="Sample Title (optional)"
              className="w-44 bg-[#10121b] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
            >
              Save Sample
            </button>
          </form>
        )}

        {/* Content Area */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0">
          {/* Watched History View */}
          {filter === 'history' ? (
            <div>
              {watchedHistory.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <History className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-60" />
                  <h4 className="text-sm font-bold text-white mb-1">No Watched Movies Yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Any movie or stream played in your rooms is automatically tracked here. You can save any watched movie into your custom samples with one click!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                    <span>Movies watched in rooms ({watchedHistory.length})</span>
                    <span className="text-[11px] text-indigo-400">
                      Click &ldquo;Save as Sample&rdquo; to keep any movie in your library
                    </span>
                  </div>
                  {watchedHistory.map((item) => {
                    const isSaved = isMovieSavedAsSample(item.url);
                    const isCurrent = currentUrl === item.url;
                    return (
                      <div
                        key={item.id}
                        className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group ${
                          isCurrent
                            ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md'
                            : 'bg-[#181a27] border-white/10 hover:border-indigo-500/30'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                              {item.type}
                            </span>
                            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {new Date(item.lastWatchedAt).toLocaleDateString()} at{' '}
                              {new Date(item.lastWatchedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {item.watchCount > 1 && (
                              <span className="text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.2 rounded-full border border-sky-500/20">
                                Watched {item.watchCount}x
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors truncate">
                            {item.title}
                          </h4>
                          <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5 max-w-lg">
                            {item.url}
                          </p>
                        </div>

                        {/* Actions for watched item */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleCopy(item.url)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                            title="Copy video URL"
                          >
                            {copiedUrl === item.url ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <LinkIcon className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Save as Sample Button */}
                          {isSaved ? (
                            <button
                              onClick={() => handleRemoveSample(item.url)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
                              title="Click to remove from saved samples"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>Saved Sample</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSaveToSample(item.url, item.title, item.duration)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-amber-500/20 text-slate-200 hover:text-amber-300 border border-white/15 hover:border-amber-500/40 transition-all flex items-center gap-1.5"
                              title="Save this watched movie to permanent samples"
                            >
                              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                              <span>Save as Sample</span>
                            </button>
                          )}

                          {/* Load for Room */}
                          <button
                            onClick={() => {
                              onSelectVideo(item.url, item.title);
                              onClose();
                            }}
                            disabled={isCurrent}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                              isCurrent
                                ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {isCurrent ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Playing
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-white" /> Watch
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Video Cards Grid (All, Saved Samples, or Type Filters) */
            <div>
              {displayedVideos.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <Star className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-60" />
                  <h4 className="text-sm font-bold text-white mb-1">
                    {filter === 'saved' ? 'No Saved Samples Yet' : 'No Videos Found'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
                    {filter === 'saved'
                      ? 'Whenever you watch a movie or custom video, click "Save as Sample" to bookmark it here for quick sync anytime!'
                      : 'Try switching categories or add a custom video URL.'}
                  </p>
                  {filter === 'saved' && (
                    <button
                      onClick={() => setShowAddSampleForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow transition-all"
                    >
                      <Plus className="w-4 h-4" /> Add Your First Sample Movie
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {displayedVideos.map((video, idx) => {
                    const isCurrent = currentUrl === video.url;
                    return (
                      <div
                        key={video.id || `${video.url}-${idx}`}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between group relative ${
                          isCurrent
                            ? 'bg-indigo-950/30 border-indigo-500/50 shadow-lg shadow-indigo-500/5'
                            : video.isCustom
                            ? 'bg-gradient-to-br from-[#1a1b2d] to-[#141624] border-amber-500/30 hover:border-amber-500/60'
                            : 'bg-[#181a27] border-white/10 hover:border-indigo-500/30 hover:bg-[#1d2030]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {video.isCustom && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  <Star className="w-3 h-3 fill-amber-400" /> Saved Sample
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                                {video.badge || video.type}
                              </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 font-semibold shrink-0">
                              {video.duration}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                            {video.title}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                            {video.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopy(video.url)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-xs flex items-center gap-1"
                              title="Copy direct video URL"
                            >
                              {copiedUrl === video.url ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-[11px] text-emerald-400 font-semibold">Copied</span>
                                </>
                              ) : (
                                <>
                                  <LinkIcon className="w-3.5 h-3.5" />
                                  <span className="text-[11px]">Copy Link</span>
                                </>
                              )}
                            </button>

                            {video.isCustom && (
                              <button
                                onClick={() => handleRemoveSample(video.url)}
                                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-xs"
                                title="Remove from saved samples"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              onSelectVideo(video.url, video.title);
                              onClose();
                            }}
                            disabled={isCurrent}
                            className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all ${
                              isCurrent
                                ? 'bg-emerald-500/20 text-emerald-300 cursor-default'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow hover:scale-[1.02] active:scale-[0.98]'
                            }`}
                          >
                            {isCurrent ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Currently Playing
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-white" /> Load for Room
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
