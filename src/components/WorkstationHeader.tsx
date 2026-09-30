import React from 'react';
import {
  Layers,
  Network,
  TreePine,
  TrendingUp,
  BookOpen,
  ArrowUpDown,
  RotateCcw,
  Binary,
  Upload
} from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { RhythmBoxLogo } from './RhythmBoxLogo';

export type StudioTab = 'playlist' | 'graph' | 'trie' | 'heap' | 'dsa';

interface WorkstationHeaderProps {
  currentTab: StudioTab;
  setCurrentTab: (tab: StudioTab) => void;
}

export const WorkstationHeader: React.FC<WorkstationHeaderProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const {
    undoStack,
    undoLastAction,
    applySort,
    currentSort,
    setIsDsaInspectorOpen,
    setDsaInspectorTab,
    insertCustomAudioTrack,
  } = useMusicPlayer();

  const headerFileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleHeaderAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await insertCustomAudioTrack(file);
      if (headerFileInputRef.current) {
        headerFileInputRef.current.value = '';
      }
    }
  };

  const tabs: { id: StudioTab; label: string; icon: React.ReactNode; dsa: string }[] = [
    {
      id: 'playlist',
      label: 'Playlist & Traversal',
      icon: <Layers className="w-4 h-4" />,
      dsa: 'DLL',
    },
    {
      id: 'graph',
      label: 'Sonic Graph (BFS)',
      icon: <Network className="w-4 h-4" />,
      dsa: 'O(V+E)',
    },
    {
      id: 'trie',
      label: 'Trie Prefix Search',
      icon: <TreePine className="w-4 h-4" />,
      dsa: 'O(k)',
    },
    {
      id: 'heap',
      label: 'Max-Heap Charts',
      icon: <TrendingUp className="w-4 h-4" />,
      dsa: 'O(log N)',
    },
    {
      id: 'dsa',
      label: 'Architecture Matrix',
      icon: <BookOpen className="w-4 h-4" />,
      dsa: 'Guide',
    },
  ];

  return (
    <header className="h-16 bg-[#0E1117] border-b border-neutral-800/80 px-4 md:px-6 flex items-center justify-between gap-4 z-30 select-none backdrop-blur-md">
      {/* Brand & Studio Identity */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_12px_rgba(0,245,155,0.35)] cursor-pointer">
          <RhythmBoxLogo size={38} animated={true} />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white text-base tracking-tight">
              Rhythm Box
            </span>
            <span className="text-[10px] font-mono font-bold bg-[#1DB954]/15 text-[#1DB954] px-1.5 py-0.5 rounded border border-[#1DB954]/40">
              STUDIO
            </span>
          </div>
          <div className="text-[10px] font-mono text-neutral-400">
            Algorithmic Audio Workstation
          </div>
        </div>
      </div>

      {/* Center: Workstation Tab Switcher */}
      <nav className="flex items-center bg-black/60 p-1 rounded-xl border border-neutral-800 text-xs overflow-x-auto max-w-2xl">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#1DB954] text-black font-bold shadow-[0_0_12px_rgba(29,185,84,0.3)]'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`text-[9px] font-mono px-1 rounded ${
                  isActive
                    ? 'bg-black/20 text-black font-semibold'
                    : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {tab.dsa}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Sort triggers, Undo, Telemetry */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Sort Trigger Menu */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 p-1 rounded-lg text-xs font-mono">
          <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 ml-1.5" />
          <button
            onClick={() => applySort('quicksort')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              currentSort === 'quicksort'
                ? 'bg-[#1DB954] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="QuickSort by Title (O(N log N))"
          >
            QuickSort
          </button>
          <span className="text-neutral-600">|</span>
          <button
            onClick={() => applySort('mergesort')}
            className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
              currentSort === 'mergesort'
                ? 'bg-[#1DB954] text-black font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="MergeSort by Duration (O(N log N))"
          >
            MergeSort
          </button>
        </div>

        {/* Insert Audio File Action Button */}
        <input
          ref={headerFileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleHeaderAudioUpload}
          className="hidden"
          id="header-audio-input"
        />
        <button
          onClick={() => headerFileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
          title="Insert local audio file (MP3, WAV) into all 8 DSA structures"
        >
          <Upload className="w-3.5 h-3.5 text-[#1DB954]" />
          <span className="hidden sm:inline">Insert Audio</span>
        </button>

        {/* Undo Stack Action Button */}
        {undoStack.length > 0 && (
          <button
            onClick={undoLastAction}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold shadow transition-all cursor-pointer"
            title="Pop inverse command from Undo Stack (LIFO)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
            <span className="font-mono bg-amber-500/20 px-1 rounded text-[10px]">
              {undoStack.length}
            </span>
          </button>
        )}

        {/* Live DSA Inspector Trigger */}
        <button
          onClick={() => {
            setDsaInspectorTab('live');
            setIsDsaInspectorOpen(true);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/50 hover:border-emerald-400 text-[#1DB954] rounded-lg text-xs font-semibold shadow-[0_0_10px_rgba(29,185,84,0.2)] transition-all cursor-pointer"
          title="Open DSA Live Inspector Panel"
        >
          <Binary className="w-3.5 h-3.5" />
          <span className="hidden md:inline">DSA Inspector</span>
        </button>
      </div>
    </header>
  );
};
