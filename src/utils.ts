import { GridPoint } from './interfaces';

export const pointsEqual = (p1: GridPoint, p2: GridPoint): boolean =>
  !!p1 &&
  !!p2 &&
  p1.gridCol === p2.gridCol &&
  p1.gridRow === p2.gridRow;
