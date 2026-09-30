import type { Song, BfsRecommendation } from '../types';
import { Queue } from './Queue';

/**
 * Custom Graph data structure using an Adjacency List.
 * Represents similarity relationships between songs based on genre, tempo (BPM), and era.
 * Uses Breadth-First Search (BFS) powered by our custom Queue class for the recommendation engine.
 */

export interface GraphEdge {
  targetId: string;
  weight: number;
  reason: string;
}

export interface GraphNodeData {
  id: string;
  song: Song;
  edges: GraphEdge[];
}

export class Graph {
  // Adjacency List: Map from songId -> array of edges
  private adjacencyList: Map<string, GraphEdge[]>;
  private songMap: Map<string, Song>;

  constructor() {
    this.adjacencyList = new Map();
    this.songMap = new Map();
  }

  public addVertex(song: Song): void {
    if (!this.adjacencyList.has(song.id)) {
      this.adjacencyList.set(song.id, []);
    }
    this.songMap.set(song.id, song);
  }

  public addEdge(song1Id: string, song2Id: string, weight: number, reason: string): void {
    if (!this.adjacencyList.has(song1Id) || !this.adjacencyList.has(song2Id)) {
      return;
    }

    const edges1 = this.adjacencyList.get(song1Id)!;
    // Check if edge already exists
    let exists = false;
    for (let i = 0; i < edges1.length; i++) {
      if (edges1[i].targetId === song2Id) {
        exists = true;
        break;
      }
    }

    if (!exists) {
      edges1.push({ targetId: song2Id, weight, reason });
      this.adjacencyList.get(song2Id)!.push({ targetId: song1Id, weight, reason });
    }
  }

  /**
   * Build complete graph connectivity by evaluating audio similarity heuristics.
   */
  public buildMusicGraph(songs: Song[]): void {
    this.adjacencyList.clear();
    this.songMap.clear();

    // 1. Add all vertices
    for (let i = 0; i < songs.length; i++) {
      this.addVertex(songs[i]);
    }

    // 2. Connect vertices based on sonic and stylistic attributes
    for (let i = 0; i < songs.length; i++) {
      for (let j = i + 1; j < songs.length; j++) {
        const s1 = songs[i];
        const s2 = songs[j];

        // Criterion 1: Same Genre (High weight: 3)
        if (s1.genre.toLowerCase() === s2.genre.toLowerCase()) {
          this.addEdge(s1.id, s2.id, 3, `Same Genre (${s1.genre})`);
        }
        // Criterion 2: Close Tempo (BPM difference <= 12) (Medium weight: 2)
        else if (Math.abs(s1.tempo - s2.tempo) <= 12) {
          this.addEdge(s1.id, s2.id, 2, `Harmonic Tempo (${s1.tempo} ~ ${s2.tempo} BPM)`);
        }
        // Criterion 3: Same Era / Release year match (Weight: 1)
        else if (Math.abs(s1.year - s2.year) <= 2) {
          this.addEdge(s1.id, s2.id, 1, `Contemporary Era (${s1.year})`);
        }
      }
    }
  }

  /**
   * Breadth-First Search (BFS) starting from startSongId up to maxDepth hops.
   * Uses our custom Queue class for the FIFO frontier.
   * Time Complexity: O(V + E)
   * Space Complexity: O(V)
   */
  public bfs(startSongId: string, maxDepth: number = 2): BfsRecommendation[] {
    if (!this.adjacencyList.has(startSongId)) {
      return [];
    }

    const visited = new Set<string>();
    const recommendations: BfsRecommendation[] = [];

    // Custom Queue storing { songId, depth, reasons, accumulatedScore }
    interface BFSQueueItem {
      songId: string;
      depth: number;
      reasons: string[];
      accumulatedScore: number;
    }

    const queue = new Queue<BFSQueueItem>();

    visited.add(startSongId);
    queue.enqueue({
      songId: startSongId,
      depth: 0,
      reasons: ['Currently Playing'],
      accumulatedScore: 0,
    });

    while (!queue.isEmpty()) {
      const current = queue.dequeue()!;

      // Don't expand beyond maxDepth
      if (current.depth >= maxDepth) {
        continue;
      }

      const edges = this.adjacencyList.get(current.songId) || [];

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (!visited.has(edge.targetId)) {
          visited.add(edge.targetId);

          const targetSong = this.songMap.get(edge.targetId);
          if (targetSong) {
            const nextDepth = current.depth + 1;
            const updatedReasons = [...current.reasons.filter((r) => r !== 'Currently Playing'), edge.reason];
            const updatedScore = current.accumulatedScore + edge.weight;

            recommendations.push({
              song: targetSong,
              depth: nextDepth,
              reasons: updatedReasons,
              score: updatedScore,
            });

            queue.enqueue({
              songId: edge.targetId,
              depth: nextDepth,
              reasons: updatedReasons,
              accumulatedScore: updatedScore,
            });
          }
        }
      }
    }

    // Sort recommendations by score (relevance) descending without native sort shortcuts
    for (let i = 0; i < recommendations.length; i++) {
      for (let j = i + 1; j < recommendations.length; j++) {
        if (recommendations[j].score > recommendations[i].score) {
          const temp = recommendations[i];
          recommendations[i] = recommendations[j];
          recommendations[j] = temp;
        }
      }
    }

    return recommendations;
  }

  /**
   * Returns graph metadata for SVG/Canvas rendering in the visualizer modal.
   */
  public getGraphData(): {
    nodes: { id: string; title: string; artist: string; genre: string; tempo: number; coverUrl: string }[];
    edges: { source: string; target: string; weight: number; reason: string }[];
  } {
    const nodes: { id: string; title: string; artist: string; genre: string; tempo: number; coverUrl: string }[] = [];
    const edges: { source: string; target: string; weight: number; reason: string }[] = [];
    const seenEdges = new Set<string>();

    for (const [songId, song] of this.songMap) {
      nodes.push({
        id: songId,
        title: song.title,
        artist: song.artist,
        genre: song.genre,
        tempo: song.tempo,
        coverUrl: song.coverUrl,
      });

      const neighborEdges = this.adjacencyList.get(songId) || [];
      for (let i = 0; i < neighborEdges.length; i++) {
        const edge = neighborEdges[i];
        const edgeKey = [songId, edge.targetId].sort().join('--');
        if (!seenEdges.has(edgeKey)) {
          seenEdges.add(edgeKey);
          edges.push({
            source: songId,
            target: edge.targetId,
            weight: edge.weight,
            reason: edge.reason,
          });
        }
      }
    }

    return { nodes, edges };
  }
}
