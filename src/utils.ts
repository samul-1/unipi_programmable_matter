import { GridPoint } from './interfaces';
import store from './store';

export const pointsEqual = (p1: GridPoint, p2: GridPoint): boolean =>
  !!p1 &&
  !!p2 &&
  p1.gridCol === p2.gridCol &&
  p1.gridRow === p2.gridRow;

export const getRandomRow = () => {
  return Math.floor(
    Math.random() * 2 * Math.floor(store.state.gridWidth * 0.5) + 7
  );
};
export const getRandomCol = () => {
  return Math.floor(
    Math.random() * 2 * Math.floor(store.state.gridWidth * 0.5) + 8
  );
};
export const getRandomBool = (probabilityTrue = 0.2) => {
  return Math.random() > 1 - probabilityTrue;
};

export const gridPointToGridCoordinates = (
  p: GridPoint
): [number, number] => [p.gridRow, p.gridCol];
