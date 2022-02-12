export interface GridPoint {
  x: number;
  y: number;
  gridRow: number;
  gridCol: number;
}

export interface IParticle {
  id: string;
  targetPoint?: GridPoint;
  currentRow: number;
  currentCol: number;
  isObstacle: boolean;
}

export interface RunStats {
  algorithm: 'a' | 'b' | 'c';
  rounds: number;
  moves: number;
  initialDensity: number;
  initialDiameter: number;
  finalDensity?: number;
  finalDiameter?: number;
  particleNumber: number;
  obstacleNumber: number;
  initialConfiguration: GridPoint[];
  finalConfiguration?: GridPoint[];
  successful?: boolean;
}

export type ExtensionAngle = 60 | 180 | -60 | -180 | 240 | -240;
export type ParticleState = 'contracted' | 'extended';
