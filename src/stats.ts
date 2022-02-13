import { GridPoint } from './interfaces';

const getGridPointDistance = (p1: GridPoint, p2: GridPoint): number =>
  Math.sqrt(
    Math.pow(p1.gridRow - p2.gridRow, 2) +
      Math.pow(p1.gridCol - p2.gridCol, 2)
  );

// https://stackoverflow.com/a/53107778/12424975
const pairsOfArray = (array: unknown[]) =>
  array.reduce(
    (acc, val, i1) => [
      ...(acc as unknown[]),
      ...new Array(array.length - 1 - i1)
        .fill(0)
        .map((v, i2) => [array[i1], array[i1 + 1 + i2]]),
    ],
    []
  );

export const getGridDensityAndDiameter = (
  grid: GridPoint[]
): { density: number; diameter: number } => {
  let density = 0;
  let diameter = 0;
  const pairs = pairsOfArray(grid) as [GridPoint, GridPoint][];

  pairs.forEach((p) => {
    const distance = getGridPointDistance(p[0], p[1]);
    density += distance;
    diameter = Math.max(diameter, distance);
  });

  return { density, diameter };
};
