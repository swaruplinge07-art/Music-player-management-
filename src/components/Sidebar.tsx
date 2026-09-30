import React from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Binary,
  Sparkles,
  Network,
  Cpu
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { RhythmBoxLogo } from './RhythmBoxLogo';

interface SidebarProps {
  activeView: 'home' | 'search' | 'library';
  setActiveView: (view: 'home' | 'search' | 'library') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const {
    setIsDsaInspectorOpen,
    setIsGraphModalOpen,
    playlistSongs,
    upNextQueue,
    undoStack,
    favoritesCount,
    setDsaInspectorTab,
  } = useMusicPlayer();

  const playlists = [
    { name: 'Binary Tree Lo-Fi', desc: 'Chill recursion beats', count: 12 },
    { name: 'LeetCode Hard Grooves', desc: 'Focus flow state', count: 24 },
    { name: 'Graph Traversal Synth', desc: 'BFS & Dijkstra runs', count: 18 },
    { name: 'Top 5 Max-Heap Anthems', desc: 'Priority queue bangers', count: 5 },
    { name: 'Dynamic Prog. Chill', desc: 'Optimal substructure', count: 15 },
  ];

  return (
    <aside className="w-64 bg-[#121212] flex flex-col h-full border-r border-neutral-800/60 p-3 select-none">
      {/* Brand & DSA Badge */}
      <div className="px-3 py-3 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(0,245,155,0.3)]">
            <RhythmBoxLogo size={32} />
          </div>
          <div>
            <span className="font-bold text-white text-lg tracking-tight flex items-center gap-1.5">
              Rhythm Box <span className="text-[#1DB954] font-mono text-xs px-1.5 py-0.5 rounded bg-[#1DB954]/10 border border-[#1DB954]/30">DSA</span>
            </span>
          </div>
        </div>
      </div>

      {/* Prominent DSA Inspector Button */}
      <div className="px-2 mb-3">
        <button
          onClick={() => {
            setDsaInspectorTab('live');
            setIsDsaInspectorOpen(true);
          }}
          className="w-full flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-emerald-950/80 to-neutral-900 border border-[#1DB954]/60 hover:border-[#1DB954] rounded-xl text-white font-medium shadow-[0_0_15px_rgba(29,185,84,0.2)] hover:shadow-[0_0_22px_rgba(29,185,84,0.4)] transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#1DB954]/20 border border-[#1DB954]/50 flex items-center justify-center text-[#1DB954] group-hover:scale-110 transition-transform">
              <Binary className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-[#1DB954] group-hover:text-emerald-300 transition-colors">
                DSA Visualizer
              </div>
              <div className="text-[10px] text-neutral-400">Live State & Inspector</div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded border border-neutral-700">
            [D]
          </span>
        </button>
      </div>

      {/* Primary Navigation */}
      <nav className="space-y-1 mb-4 px-2">
        <button
          onClick={() => setActiveView('home')}
          className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'home'
              ? 'text-white bg-neutral-800/80 shadow-inner'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Home className="w-5 h-5 text-current" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveView('search')}
          className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'search'
              ? 'text-white bg-neutral-800/80 shadow-inner'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Search className="w-5 h-5 text-current" />
          <span>Search</span>
          <span className="ml-auto text-[10px] font-mono text-[#1DB954] bg-[#1DB954]/10 px-1.5 py-0.5 rounded border border-[#1DB954]/30">
            Trie
          </span>
        </button>

        <button
          onClick={() => setActiveView('library')}
          className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            activeView === 'library'
              ? 'text-white bg-neutral-800/80 shadow-inner'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
          }`}
        >
          <Library className="w-5 h-5 text-current" />
          <span>Your Library</span>
          <span className="ml-auto text-[10px] font-mono text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
            {playlistSongs.length}
          </span>
        </button>
      </nav>

      <div className="h-px bg-neutral-800/80 mx-2 my-2" />

      {/* Secondary Actions */}
      <div className="px-2 space-y-1 mb-2">
        <button
          onClick={() => setIsGraphModalOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-[#1DB954] hover:bg-neutral-900/60 transition-all cursor-pointer"
        >
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Song Graph & BFS</span>
        </button>

        <button
          onClick={() => {
            setDsaInspectorTab('guide');
            setIsDsaInspectorOpen(true);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900/60 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>DSA Complexity Guide</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-neutral-400">
          <Heart className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span>Liked Songs (Hash Map)</span>
          <span className="ml-auto text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
            {favoritesCount}
          </span>
        </div>
      </div>

      <div className="h-px bg-neutral-800/80 mx-2 my-2" />

      {/* Playlists List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider px-3 py-1.5">
          Curated Playlists
        </div>
        {playlists.map((pl, idx) => (
          <div
            key={idx}
            className="px-3 py-2 rounded-lg hover:bg-neutral-800/50 cursor-pointer group transition-all"
          >
            <div className="text-xs text-neutral-300 group-hover:text-white font-medium truncate">
              {pl.name}
            </div>
            <div className="text-[10px] text-neutral-500 truncate flex items-center justify-between">
              <span>{pl.desc}</span>
              <span className="font-mono text-neutral-600">{pl.count} tracks</span>
            </div>
          </div>
        ))}
      </div>

      {/* Mini DSA Real-Time Telemetry Bar at sidebar bottom */}
      <div className="mt-auto pt-3 border-t border-neutral-800/60 px-2">
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5 text-neutral-300">
              <Cpu className="w-3.5 h-3.5 text-[#1DB954]" />
              Live DSA Telemetry
            </span>
            <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-ping" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center">
            <div className="bg-black/50 p-1.5 rounded border border-neutral-800">
              <div className="text-neutral-500">DLL Nodes</div>
              <div className="text-white font-bold">{playlistSongs.length}</div>
            </div>
            <div className="bg-black/50 p-1.5 rounded border border-neutral-800">
              <div className="text-neutral-500">Queue</div>
              <div className="text-[#1DB954] font-bold">{upNextQueue.length}</div>
            </div>
            <div className="bg-black/50 p-1.5 rounded border border-neutral-800">
              <div className="text-neutral-500">Undo Stack</div>
              <div className="text-amber-400 font-bold">{undoStack.length}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
