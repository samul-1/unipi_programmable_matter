export const configHexagon = {
  sides: 6,
  radius: 70,
  rotation: 90,
  fill: 'transparent',
  stroke: 'black',
  strokeWidth: 1,
};

const HEXAGON_CONSTANT = 0.866;

export const getHexagonApothem = (radius: number): number =>
  (radius * Math.sqrt(3)) / 2;

export const getHexagonSide = (radius: number): number =>
  getHexagonApothem(radius) / HEXAGON_CONSTANT;

export const getHexagonXOffset = (radius: number): number =>
  Math.sqrt(
    Math.pow(getHexagonSide(radius), 2) -
      Math.pow(getHexagonApothem(radius), 2)
  );
