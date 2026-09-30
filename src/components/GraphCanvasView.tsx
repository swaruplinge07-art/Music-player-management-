import React, { useState } from 'react';
import { Network, Play, Info } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export const GraphCanvasView: React.FC = () => {
  const {
    currentSong,
    playSong,
    playlistSongs,
    dsaGraph,
  } = useMusicPlayer();

  const [filterType, setFilterType] = useState<'all' | 'genre' | 'tempo' | 'era'>('all');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

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
  const width = 860;
  const height = 620;
  const centerX = width / 2;
  const centerY = height / 2;

  const nodePositions = new Map<string, { x: number; y: number }>();
  const hop1Nodes = nodes.filter((n) => depthMap.get(n.id) === 1);
  const hop2Nodes = nodes.filter(
    (n) => (depthMap.get(n.id) || 0) >= 2 || depthMap.get(n.id) === undefined
  );

  nodePositions.set(activeSongId, { x: centerX, y: centerY });

  const r1 = 170;
  hop1Nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / (hop1Nodes.length || 1) - Math.PI / 2;
    nodePositions.set(node.id, {
      x: centerX + r1 * Math.cos(angle),
      y: centerY + r1 * Math.sin(angle),
    });
  });

  const r2 = 270;
  hop2Nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / (hop2Nodes.length || 1);
    nodePositions.set(node.id, {
      x: centerX + r2 * Math.cos(angle),
      y: centerY + r2 * Math.sin(angle),
    });
  });

  const hoveredSong = playlistSongs.find((s) => s.id === hoveredNodeId);

  return (
    <div className="space-y-4">
      {/* View Header */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/80 border border-cyan-800 text-cyan-400 rounded-xl">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">
                Musical Similarity Graph & BFS Explorer
              </h2>
              <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                O(V + E) BFS Traversal
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Adjacency List where songs are vertices and undirected weighted edges map acoustic similarity (Genre, Tempo BPM, Era).
            </p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center bg-black/50 border border-neutral-800 rounded-xl p-1 text-xs font-mono">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Edges ({edges.length})
          </button>
          <button
            onClick={() => setFilterType('genre')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'genre'
                ? 'bg-[#1DB954]/20 text-[#1DB954] font-bold border border-[#1DB954]/50'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Genre (Weight: 3)
          </button>
          <button
            onClick={() => setFilterType('tempo')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterType === 'tempo'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-800'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tempo (Weight: 2)
          </button>
        </div>
      </div>

      {/* SVG Graph Interactive Stage */}
      <div className="relative bg-[#090B0E] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl h-[640px] flex items-center justify-center">
        {/* Legend */}
        <div className="absolute top-4 left-4 z-10 bg-neutral-900/90 border border-neutral-800 p-3.5 rounded-xl text-xs font-mono space-y-1.5 backdrop-blur-md shadow-xl pointer-events-none">
          <div className="font-semibold text-neutral-300 uppercase tracking-wider text-[10px] mb-1">
            BFS Depth Rings
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#1DB954] ring-2 ring-[#1DB954]/40" />
            <span className="text-white">Active Root (Depth 0)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-400/40" />
            <span className="text-cyan-300">1-Hop Direct Neighbors (Depth 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-purple-400 ring-2 ring-purple-400/40" />
            <span className="text-purple-300">2-Hop Extended Neighbors (Depth 2)</span>
          </div>
        </div>

        {/* SVG Drawing */}
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full max-h-full">
          {/* Concentric rings */}
          <circle
            cx={centerX}
            cy={centerY}
            r={r1}
            fill="none"
            stroke="#1E232F"
            strokeDasharray="4 4"
          />
          <circle
            cx={centerX}
            cy={centerY}
            r={r2}
            fill="none"
            stroke="#171A23"
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

            let strokeColor = '#242938';
            let strokeWidth = 1.2;
            let opacity = 0.45;

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
              <g key={`edge-canvas-${idx}`}>
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
                {(isConnectedToHovered || isConnectedToActive) && (
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 4}
                    fill="#a3a3a3"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.reason} (W:{edge.weight})
                  </text>
                )}
              </g>
            );
          })}

          {/* Vertices */}
          {nodes.map((node) => {
            const pos = nodePositions.get(node.id);
            if (!pos) return null;

            const isActive = node.id === activeSongId;
            const depth = depthMap.get(node.id);
            const isHovered = hoveredNodeId === node.id;

            let fillColor = '#1A1E29';
            let strokeColor = '#374151';
            let radius = 23;

            if (isActive) {
              fillColor = '#1DB954';
              strokeColor = '#ffffff';
              radius = 29;
            } else if (depth === 1) {
              fillColor = '#06b6d4';
              strokeColor = '#38bdf8';
              radius = 25;
            } else if (depth === 2) {
              fillColor = '#a855f7';
              strokeColor = '#c084fc';
              radius = 23;
            }

            return (
              <g
                key={`canvas-node-${node.id}`}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  const fullSong = playlistSongs.find((s) => s.id === node.id);
                  if (fullSong) playSong(fullSong);
                }}
              >
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

                <circle
                  r={radius}
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth={isHovered || isActive ? 3 : 1.5}
                />

                <clipPath id={`clip-canvas-${node.id}`}>
                  <circle r={radius - 2} />
                </clipPath>
                <image
                  href={node.coverUrl}
                  x={-radius + 2}
                  y={-radius + 2}
                  width={(radius - 2) * 2}
                  height={(radius - 2) * 2}
                  clipPath={`url(#clip-canvas-${node.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />

                <text
                  y={radius + 14}
                  fill={isActive ? '#1DB954' : '#ffffff'}
                  fontSize="10"
                  fontWeight={isActive ? 'bold' : 'normal'}
                  textAnchor="middle"
                  className="select-none pointer-events-none drop-shadow"
                >
                  {node.title.length > 18 ? node.title.slice(0, 16) + '...' : node.title}
                </text>
                <text
                  y={radius + 26}
                  fill="#9ca3af"
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

        {/* Hover inspection tooltip */}
        {hoveredSong && (
          <div className="absolute bottom-5 right-5 z-20 bg-neutral-900/95 border border-[#1DB954]/50 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-xs text-left animate-in fade-in duration-150">
            <div className="flex items-center gap-3 mb-2">
              <img
                src={hoveredSong.coverUrl}
                alt={hoveredSong.title}
                className="w-12 h-12 rounded object-cover shadow"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">{hoveredSong.title}</div>
                <div className="text-xs text-neutral-400 truncate">{hoveredSong.artist}</div>
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
              Play & Re-Run BFS
            </button>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#12161F] border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Info className="w-4 h-4 text-cyan-400" />
          Click any vertex node to play the track and dynamically re-anchor the BFS exploration tree.
        </span>
        <span className="text-neutral-500">
          Vertices: {nodes.length} | Edges: {edges.length}
        </span>
      </div>
    </div>
  );
};
