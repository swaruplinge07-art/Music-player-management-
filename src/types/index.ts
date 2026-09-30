export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  playCount: number;
  coverUrl: string;
  audioUrl: string;
  genre: string;
  tempo: number; // in BPM
  year: number;
}

export type SortAlgorithm = 'quicksort' | 'mergesort' | 'default';

export interface SortMetrics {
  algorithm: string;
  timeComplexity: string;
  comparisons: number;
  swapsOrMerges: number;
  executionTimeMs: number;
}

export type UndoActionType = 'DELETE_SONG' | 'SORT_PLAYLIST' | 'ENQUEUE_SONG';

export interface UndoAction {
  type: UndoActionType;
  description: string;
  payload: {
    song?: Song;
    index?: number;
    previousOrder?: Song[];
    songId?: string;
  };
  timestamp: number;
}

export interface BfsRecommendation {
  song: Song;
  depth: number;
  reasons: string[];
  score: number;
}

export interface DsaComplexityInfo {
  feature: string;
  dataStructure: string;
  timeComplexity: string;
  spaceComplexity: string;
  notes: string;
  operations: string;
}
