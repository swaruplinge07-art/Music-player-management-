import React, { useState } from 'react';
import { MusicPlayerProvider } from './context/MusicPlayerContext';
import { WorkstationHeader, type StudioTab } from './components/WorkstationHeader';
import { PlayerDeck } from './components/PlayerDeck';
import { HeroBanner } from './components/HeroBanner';
import { TopChartsShelf } from './components/TopChartsShelf';
import { RecommendationsShelf } from './components/RecommendationsShelf';
import { PlaylistTable } from './components/PlaylistTable';
import { GraphCanvasView } from './components/GraphCanvasView';
import { TrieTerminalView } from './components/TrieTerminalView';
import { HeapLeaderboardView } from './components/HeapLeaderboardView';
import { DsaMatrixView } from './components/DsaMatrixView';
import { DsaInspectorModal } from './components/DsaInspectorModal';
import { GraphModal } from './components/GraphModal';
import { DsaToast } from './components/DsaToast';

const StudioMain: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<StudioTab>('playlist');

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0C10] text-white select-none">
      {/* Top Workstation Command Bar */}
      <WorkstationHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Studio Body: 2-Column Split Console */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: Dedicated Audio Transport Deck & Data Structure HUD */}
        <PlayerDeck />

        {/* Right Column: Dynamic Algorithmic Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 bg-[#0B0D13]">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* TAB 1: PLAYLIST & TRAVERSAL */}
            {currentTab === 'playlist' && (
              <>
                <HeroBanner />
                <TopChartsShelf />
                <RecommendationsShelf />
                <PlaylistTable />
              </>
            )}

            {/* TAB 2: SONIC GRAPH (BFS EMBEDDED CANVAS) */}
            {currentTab === 'graph' && <GraphCanvasView />}

            {/* TAB 3: TRIE PREFIX SEARCH TERMINAL */}
            {currentTab === 'trie' && <TrieTerminalView />}

            {/* TAB 4: MAX-HEAP CHARTS & LEADERBOARD */}
            {currentTab === 'heap' && <HeapLeaderboardView />}

            {/* TAB 5: DSA ARCHITECTURE & COMPLEXITY MATRIX */}
            {currentTab === 'dsa' && <DsaMatrixView />}
          </div>
        </main>
      </div>

      {/* Slide-over DSA Telemetry Inspector Modal */}
      <DsaInspectorModal />

      {/* Fallback Graph Modal */}
      <GraphModal />

      {/* Live DSA Event Notification Toast */}
      <DsaToast />
    </div>
  );
};

export default function App() {
  return (
    <MusicPlayerProvider>
      <StudioMain />
    </MusicPlayerProvider>
  );
}
