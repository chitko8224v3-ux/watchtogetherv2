import React, { useState, useEffect } from 'react';
import {
  Play,
  LogIn,
  Zap,
  Users2,
  RefreshCw,
  Radio,
  Film,
  Crown,
  History,
  Trash2,
  Star,
  BookmarkPlus,
  Sparkles,
} from 'lucide-react';
import { BUILTIN_DEMO_VIDEOS, getSavedSamples, getWatchedHistory } from '../data/demoMedia';
import { ActiveRoomInfo, DemoVideo, WatchedMovieRecord } from '../types';
import { RecentRoom } from '../utils/roomRegistry';

interface LobbyProps {
  initialCode?: string;
  initialName: string;
  isConnecting: boolean;
  errorMessage: string | null;
  activeRooms: ActiveRoomInfo[];
  recentRooms: RecentRoom[];
  isLoadingRooms: boolean;
  onRefreshRooms: () => void;
  onClearRecentRooms: () => void;
  onCreateRoom: (name: string, initialMediaUrl?: string) => void;
  onJoinRoom: (name: string, code: string) => void;
  onOpenLibrary?: () => void;
}

export function Lobby({
  initialCode = '',
  initialName,
  isConnecting,
  errorMessage,
  activeRooms,
  recentRooms,
  isLoadingRooms,
  onRefreshRooms,
  onClearRecentRooms,
  onCreateRoom,
  onJoinRoom,
  onOpenLibrary,
}: LobbyProps) {
  const [name, setName] = useState(initialName || '');
  const [code, setCode] = useState(initialCode || '');
  const [savedSamples, setSavedSamples] = useState<DemoVideo[]>([]);
  const [watchedHistory, setWatchedHistory] = useState<WatchedMovieRecord[]>([]);

  useEffect(() => {
    setSavedSamples(getSavedSamples());
    setWatchedHistory(getWatchedHistory());
  }, []);

  const getFinalName = () => name.trim() || `Guest ${Math.floor(100 + Math.random() * 900)}`;

  const handleCreate = (demoUrl?: string) => {
    onCreateRoom(getFinalName(), demoUrl);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode.length < 4) return;
    onJoinRoom(getFinalName(), cleanCode);
  };

  const handleQuickJoin = (roomCode: string) => {
    onJoinRoom(getFinalName(), roomCode.trim().toUpperCase());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-radial-gradient">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-600/15 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-xl z-10 my-6">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-sky-500 text-3xl shadow-xl shadow-indigo-500/25 mb-3 transform hover:scale-105 transition-transform">
            🎬
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
            Watch Together
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Pick an active room, launch with saved samples or custom streams, or paste a room code. Everything syncs in real time!
          </p>
        </div>

        {/* Main Box */}
        <div className="space-y-4">
          {/* Card 1: Your Display Name */}
          <div className="bg-[#141622] border border-white/10 rounded-2xl p-4 shadow-xl">
            <label htmlFor="name-input" className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Your Display Name
            </label>
            <input
              id="name-input"
              type="text"
              maxLength={20}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex, Sam, Taylor..."
              className="w-full bg-[#1b1e2c] border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Card 2: Live Available Rooms */}
          <div className="bg-[#141622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Available Rooms
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {activeRooms.length} Active
                </span>
              </div>
              <button
                onClick={onRefreshRooms}
                disabled={isLoadingRooms}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Refresh rooms list"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRooms ? 'animate-spin text-indigo-400' : ''}`} />
              </button>
            </div>

            {activeRooms.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#1b1e2c] border border-white/5 text-center text-xs text-slate-400">
                <Radio className="w-6 h-6 text-slate-500 mx-auto mb-1.5 opacity-60" />
                <p className="font-semibold text-slate-300">No public rooms active right now</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Start a room below or enter a private code to join.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {activeRooms.map((room) => (
                  <div
                    key={room.code}
                    className="p-3 rounded-xl bg-[#1b1e2c] hover:bg-[#202434] border border-white/5 hover:border-indigo-500/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-extrabold text-sm text-indigo-300 tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          {room.code}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300">
                          <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="truncate max-w-[120px]">{room.hostName}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-white/5">
                          <Users2 className="w-3 h-3" />
                          {room.viewerCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                        <Film className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate text-slate-300 font-medium">
                          {room.movieTitle || 'No video loaded yet'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleQuickJoin(room.code)}
                      disabled={isConnecting}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white shadow-md hover:scale-[1.03] active:scale-[0.98] transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>Join</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: User's Saved Samples & Watched History Quick Launch */}
          {(savedSamples.length > 0 || watchedHistory.length > 0) && (
            <div className="bg-[#141622] border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-xl bg-gradient-to-b from-[#181a29] to-[#141622]">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Your Saved Samples ({savedSamples.length})</span>
                </div>
                {onOpenLibrary && (
                  <button
                    onClick={onOpenLibrary}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View All Samples →
                  </button>
                )}
              </div>

              {savedSamples.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {savedSamples.map((sample) => (
                    <div
                      key={sample.id || sample.url}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs transition-colors"
                    >
                      <div className="min-w-0 flex-1 mr-2">
                        <div className="font-semibold text-white truncate">{sample.title}</div>
                        <div className="text-[10px] text-slate-400 truncate font-mono">{sample.url}</div>
                      </div>
                      <button
                        onClick={() => handleCreate(sample.url)}
                        disabled={isConnecting}
                        className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-[11px] flex items-center gap-1 shrink-0 transition-all hover:scale-105"
                      >
                        <Play className="w-3 h-3 fill-amber-300" />
                        <span>Host Sample</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400">
                  You have watched movies available in history. Open Library to save them as permanent samples!
                </p>
              )}
            </div>
          )}

          {/* Card 4: Recent Rooms (Local Rejoin) */}
          {recentRooms.length > 0 && (
            <div className="bg-[#141622] border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <History className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Recent Rooms</span>
                </div>
                <button
                  onClick={onClearRecentRooms}
                  className="text-[10px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
                  title="Clear recent rooms history"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentRooms.map((r) => (
                  <button
                    key={r.code}
                    onClick={() => handleQuickJoin(r.code)}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1b1e2c] hover:bg-[#222638] border border-white/10 text-xs text-slate-200 hover:text-white transition-all group"
                  >
                    <span className="font-mono font-bold text-indigo-300 tracking-wider">{r.code}</span>
                    {r.movieTitle && (
                      <span className="text-[10px] text-slate-400 max-w-[90px] truncate">
                        {r.movieTitle}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Card 5: Create a New Room */}
          <div className="bg-[#141622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Start a New Party</span>
              <span className="text-[11px] font-normal lowercase text-indigo-400">host controls playback</span>
            </h3>
            <button
              onClick={() => handleCreate()}
              disabled={isConnecting}
              className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-500 via-indigo-600 to-sky-500 hover:from-indigo-400 hover:to-sky-400 text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isConnecting ? 'Creating Room...' : 'Create Instant Room'}</span>
            </button>

            {/* Quick Demo Previews */}
            <div className="mt-3.5 pt-3 border-t border-white/5">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Or quick launch with built-in sample movies:</span>
              <div className="flex flex-wrap gap-1.5">
                {BUILTIN_DEMO_VIDEOS.slice(0, 3).map((demo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCreate(demo.url)}
                    disabled={isConnecting}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    <Play className="w-3 h-3 fill-slate-300" />
                    <span>{demo.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 6: Manual Room Code Entry */}
          <div className="bg-[#141622] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Join with Room Code
            </h3>
            <form onSubmit={handleJoin} className="flex gap-2.5">
              <input
                type="text"
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                placeholder="ROOM CODE"
                className="flex-1 bg-[#1b1e2c] border border-white/10 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-center tracking-widest text-indigo-300 placeholder-slate-600 uppercase outline-none transition-all"
              />
              <button
                type="submit"
                disabled={isConnecting || code.trim().length < 4}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/10 text-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Join</span>
              </button>
            </form>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs leading-relaxed text-center font-medium animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <p className="text-[12px] text-slate-500 text-center leading-relaxed px-4 pt-1">
            Playback is synced directly between devices. Any movie you watch can be saved as a sample with one click!
          </p>
        </div>
      </div>
    </div>
  );
}
