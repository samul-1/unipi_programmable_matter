export interface GridPoint {
  x: number;
  y: number;
  gridRow: number;
  gridCol: number;
}

export interface IParticle {
  id: string;
  color: 'yellow' | 'red' | 'blue' | 'green';
  state: 'contracted' | 'extended';
  extensionAngle?: 45 | -45 | 135 | -135;
  currentRow: number;
  currentCol: number;
}
