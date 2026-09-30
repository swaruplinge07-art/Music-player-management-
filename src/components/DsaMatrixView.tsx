import React from 'react';
import { BookOpen, Hash } from 'lucide-react';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { DSA_REFERENCE_GUIDE } from '../data/mockSongs';

export const DsaMatrixView: React.FC = () => {
  const { dsaHashMap } = useMusicPlayer();
  const bucketMetrics = dsaHashMap.getBucketMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            DSA Architectural Reference Guide & Complexity Matrix
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Formal computational complexity benchmarks and data structure state backing the Rhythm Box engine.
          </p>
        </div>
      </div>

      {/* Complexity Matrix Table */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs font-mono text-neutral-300">
          <thead className="text-[11px] uppercase tracking-wider text-neutral-500 bg-black/40 border-b border-neutral-800">
            <tr>
              <th className="py-3 px-3">Feature</th>
              <th className="py-3 px-3">Data Structure</th>
              <th className="py-3 px-3 text-[#1DB954]">Time Complexity</th>
              <th className="py-3 px-3 text-cyan-400">Space</th>
              <th className="py-3 px-3">Key Operations</th>
              <th className="py-3 px-3">Engineering Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/40">
            {DSA_REFERENCE_GUIDE.map((row, idx) => (
              <tr key={idx} className="hover:bg-neutral-800/30 transition-colors">
                <td className="py-3 px-3 font-semibold text-white">{row.feature}</td>
                <td className="py-3 px-3 text-amber-300">{row.dataStructure}</td>
                <td className="py-3 px-3 font-bold text-[#1DB954]">{row.timeComplexity}</td>
                <td className="py-3 px-3 text-cyan-300">{row.spaceComplexity}</td>
                <td className="py-3 px-3 text-neutral-400 text-[11px]">{row.operations}</td>
                <td className="py-3 px-3 text-neutral-300 text-[11px] leading-relaxed">
                  {row.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Hash Map & Memory Bucket Inspection */}
      <div className="bg-[#12161F] border border-neutral-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Hash className="w-5 h-5 text-[#1DB954]" />
            <h3 className="font-bold text-white text-base">
              Custom Hash Map Buckets (djb2 Polynomial Hash)
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 bg-black/50 p-2 rounded-xl border border-neutral-800">
            <span>Capacity: <strong className="text-white">{bucketMetrics.capacity}</strong></span>
            <span>Size: <strong className="text-[#1DB954]">{bucketMetrics.size}</strong></span>
            <span>Load Factor: <strong className="text-amber-400">{bucketMetrics.loadFactor}</strong></span>
            <span>Collisions: <strong className="text-cyan-400">{bucketMetrics.collisionCount}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 font-mono text-xs">
          {bucketMetrics.buckets.map((b) => (
            <div
              key={`matrix-bucket-${b.index}`}
              className={`p-2 rounded-xl border text-[10px] ${
                b.chainLength > 1
                  ? 'bg-purple-950/60 border-purple-500/60 text-purple-200'
                  : b.chainLength > 0
                  ? 'bg-emerald-950/60 border-[#1DB954]/60 text-emerald-200'
                  : 'bg-black/40 border-neutral-800 text-neutral-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>[{b.index}]</span>
                <span className="font-bold">len:{b.chainLength}</span>
              </div>
              <div className="truncate mt-0.5">
                {b.keys.length > 0 ? b.keys.join(', ') : 'empty'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
