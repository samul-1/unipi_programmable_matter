export interface GridPoint {
  x: number;
  y: number;
  gridRow: number;
  gridCol: number;
}

export interface IParticle {
  id: string;
  color: 'yellow' | 'red' | 'blue' | 'green';
  //state: ;
  targetPoint?: GridPoint;
  //extensionAngle?: ExtensionAngle;
  currentRow: number;
  currentCol: number;
}

export type ExtensionAngle = 60 | 180 | -60 | -180 | 240 | -240;
export type ParticleState = 'contracted' | 'extended';
