import React, { useState } from 'react';
import { X, Network, Play, Info } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const GraphModal: React.FC = () => {
  const {
    isGraphModalOpen,
    setIsGraphModalOpen,
    currentSong,
    playSong,
    playlistSongs,
    dsaGraph,
  } = useMusicPlayer();

  const [filterType, setFilterType] = useState<'all' | 'genre' | 'tempo' | 'era'>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  if (!isGraphModalOpen) return null;

  // Retrieve full graph network data
  const { nodes, edges } = dsaGraph.getGraphData();
  const activeSongId = currentSong?.id || nodes[0]?.id;

  // Run BFS from active song to get depth classification
  const bfsResults = dsaGraph.bfs(activeSongId, 2);
  const depthMap = new Map<string, number>();
  depthMap.set(activeSongId, 0);
  bfsResults.forEach((r) => depthMap.set(r.song.id, r.depth));

  // Filter edges based on user toggle
  const filteredEdges = edges.filter((edge) => {
    if (filterType === 'all') return true;
    if (filterType === 'genre') return edge.reason.toLowerCase().includes('genre');
    if (filterType === 'tempo') return edge.reason.toLowerCase().includes('tempo');
    if (filterType === 'era') return edge.reason.toLowerCase().includes('era');
    return true;
  });

  // SVG dimensions and node positioning (Circular concentric layout)
  const width = 800;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;

  // Compute node coordinates
  // Active song is in the center
  // 1-hop nodes are on inner radius R1 = 160
  // 2-hop or other nodes are on outer radius R2 = 250
  const nodePositions = new Map<string, { x: number; y: number }>();

  const hop1Nodes = nodes.filter((n) => depthMap.get(n.id) === 1);
  const hop2Nodes = nodes.filter((n) => (depthMap.get(n.id) || 0) >= 2 || depthMap.get(n.id) === undefined);

  // Position center active node
  nodePositions.set(activeSongId, { x: centerX, y: centerY });

  // Position 1-hop nodes around inner circle
  const r1 = 160;
  hop1Nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / (hop1Nodes.length || 1) - Math.PI / 2;
    nodePositions.set(node.id, {
      x: centerX + r1 * Math.cos(angle),
      y: centerY + r1 * Math.sin(angle),
    });
  });

  // Position 2-hop nodes around outer circle
  const r2 = 250;
  hop2Nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / (hop2Nodes.length || 1);
    nodePositions.set(node.id, {
      x: centerX + r2 * Math.cos(angle),
      y: centerY + r2 * Math.sin(angle),
    });
  });

  const hoveredSong = playlistSongs.find((s) => s.id === hoveredNodeId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-neutral-700/80 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 md:px-6 bg-neutral-900 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-xl">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg">Song Relationship Graph</h3>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                  BFS Explorer • O(V + E)
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Adjacency List network where undirected weighted edges map musical acoustic similarity.
              </p>
            </div>
          </div>

          {/* Edge Filter Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  filterType === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400'
                }`}
              >
                All Edges
              </button>
              <button
                onClick={() => setFilterType('genre')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  filterType === 'genre' ? 'bg-[#1DB954]/20 text-[#1DB954] font-bold' : 'text-neutral-400'
                }`}
              >
                Genre (W: 3)
              </button>
              <button
                onClick={() => setFilterType('tempo')}
                className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                  filterType === 'tempo' ? 'bg-purple-500/20 text-purple-300 font-bold' : 'text-neutral-400'
                }`}
              >
                Tempo (W: 2)
              </button>
            </div>

            <button
              onClick={() => setIsGraphModalOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Graph Canvas / SVG Area */}
        <div className="flex-1 relative bg-neutral-950 overflow-hidden flex items-center justify-center">
          {/* Legend Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl text-xs font-mono space-y-1.5 backdrop-blur-sm pointer-events-none shadow-lg">
            <div className="font-semibold text-neutral-300 uppercase tracking-wider text-[10px] mb-1">
              BFS Frontier Legend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1DB954] ring-2 ring-[#1DB954]/40" />
              <span className="text-white">Active Song (Root / Depth 0)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
              <span className="text-cyan-300">1-Hop Direct Neighbors (Depth 1)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-400 ring-2 ring-purple-400/40" />
              <span className="text-purple-300">2-Hop Neighbors (Depth 2)</span>
            </div>
          </div>

          {/* Interactive SVG */}
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-full">
            {/* Concentric Guide Circles */}
            <circle
              cx={centerX}
              cy={centerY}
              r={r1}
              fill="none"
              stroke="#262626"
              strokeDasharray="4 4"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={r2}
              fill="none"
              stroke="#1f1f1f"
              strokeDasharray="4 4"
            />

            {/* Edges */}
            {filteredEdges.map((edge, idx) => {
              const p1 = nodePositions.get(edge.source);
              const p2 = nodePositions.get(edge.target);
              if (!p1 || !p2) return null;

              const isConnectedToHovered =
                hoveredNodeId === edge.source || hoveredNodeId === edge.target;
              const isConnectedToActive =
                activeSongId === edge.source || activeSongId === edge.target;

              let strokeColor = '#333333';
              let strokeWidth = 1.2;
              let opacity = 0.4;

              if (isConnectedToHovered) {
                strokeColor = '#38bdf8';
                strokeWidth = 2.5;
                opacity = 1;
              } else if (isConnectedToActive) {
                strokeColor = edge.weight === 3 ? '#1DB954' : '#06b6d4';
                strokeWidth = 2;
                opacity = 0.85;
              }

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={p1.x}
                    y1={p1.y}
                    x2={p2.x}
                    y2={p2.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    className="transition-all duration-300"
                  />
                  {/* Midpoint reason badge if active or hovered */}
                  {(isConnectedToHovered || isConnectedToActive) && (
                    <text
                      x={(p1.x + p2.x) / 2}
                      y={(p1.y + p2.y) / 2 - 4}
                      fill="#a3a3a3"
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="bg-black px-1"
                    >
                      {edge.reason} (W:{edge.weight})
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions.get(node.id);
              if (!pos) return null;

              const isActive = node.id === activeSongId;
              const depth = depthMap.get(node.id);
              const isHovered = hoveredNodeId === node.id;

              let fillColor = '#525252';
              let strokeColor = '#737373';
              let radius = 22;

              if (isActive) {
                fillColor = '#1DB954';
                strokeColor = '#ffffff';
                radius = 28;
              } else if (depth === 1) {
                fillColor = '#06b6d4';
                strokeColor = '#38bdf8';
                radius = 24;
              } else if (depth === 2) {
                fillColor = '#a855f7';
                strokeColor = '#c084fc';
                radius = 22;
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    const fullSong = playlistSongs.find((s) => s.id === node.id);
                    if (fullSong) playSong(fullSong);
                  }}
                >
                  {/* Glowing halo for active song */}
                  {isActive && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#1DB954"
                      strokeWidth="2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    r={radius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={isHovered || isActive ? 3 : 1.5}
                    className="shadow-2xl"
                  />

                  {/* Icon or Image thumbnail inside node */}
                  <clipPath id={`clip-${node.id}`}>
                    <circle r={radius - 2} />
                  </clipPath>
                  <image
                    href={node.coverUrl}
                    x={-radius + 2}
                    y={-radius + 2}
                    width={(radius - 2) * 2}
                    height={(radius - 2) * 2}
                    clipPath={`url(#clip-${node.id})`}
                    preserveAspectRatio="xMidYMid slice"
                  />

                  {/* Node label */}
                  <text
                    y={radius + 14}
                    fill={isActive ? '#1DB954' : '#ffffff'}
                    fontSize="10"
                    fontWeight={isActive ? 'bold' : 'normal'}
                    textAnchor="middle"
                    className="select-none pointer-events-none drop-shadow-md"
                  >
                    {node.title.length > 18 ? node.title.slice(0, 16) + '...' : node.title}
                  </text>
                  <text
                    y={radius + 26}
                    fill="#a3a3a3"
                    fontSize="8"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.genre} • {node.tempo} BPM
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Hover Card Overlay */}
          {hoveredSong && (
            <div className="absolute bottom-4 right-4 z-20 bg-neutral-900/95 border border-[#1DB954]/50 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs text-left animate-in fade-in duration-150">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={hoveredSong.coverUrl}
                  alt={hoveredSong.title}
                  className="w-12 h-12 rounded object-cover shadow"
                />
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {hoveredSong.title}
                  </div>
                  <div className="text-xs text-neutral-400 truncate">
                    {hoveredSong.artist}
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-mono text-neutral-300 space-y-1 bg-black/40 p-2 rounded border border-neutral-800">
                <div>Genre: <span className="text-[#1DB954]">{hoveredSong.genre}</span></div>
                <div>Tempo: <span className="text-cyan-400">{hoveredSong.tempo} BPM</span></div>
                <div>BFS Depth: <span className="text-purple-400">{depthMap.get(hoveredSong.id) ?? 'N/A'}</span></div>
              </div>
              <button
                onClick={() => playSong(hoveredSong)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 py-1.5 bg-[#1DB954] hover:bg-[#1ed760] text-black text-xs font-bold rounded-lg shadow cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Play & Run BFS
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            Click any node to play track and re-anchor BFS search tree.
          </span>
          <span className="text-neutral-500">
            Vertices: {nodes.length} | Edges: {edges.length}
          </span>
        </div>
      </div>
    </div>
  );
};
