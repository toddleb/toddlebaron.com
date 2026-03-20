// src/engine/3d/types.ts — Shared types for 3D object library
import type * as THREE from 'three';

export interface DeskObject {
  name: string;
  group: THREE.Group;
  /** Update called each frame (delta in seconds) */
  update?: (delta: number, elapsed: number) => void;
  /** Cleanup resources */
  dispose?: () => void;
}

export interface DeskObjectOptions {
  position?: [number, number, number];
  scale?: number;
  rotation?: [number, number, number];
}
