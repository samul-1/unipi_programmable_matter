export const configHexagon = {
  sides: 6,
  radius: 35,
  rotation: 90,
  fill: 'transparent',
  stroke: 'black',
  strokeWidth: 1,
};

export const configCircle = {
  radius: 8,
};

export const OFFSET_60_DEG_ELLIPSE_X = configHexagon.radius / 3.5;
export const OFFSET_60_DEG_ELLIPSE_Y =
  configHexagon.radius / 2.3333333;
export const OFFSET_180_DEG_ELLIPSE_X = configHexagon.radius / 2;
export const OFFSET_180_DEG_ELLIPSE_Y = 0;
export const OFFSET_240_DEG_ELLIPSE_X =
  configHexagon.radius / 4.11764706;
export const OFFSET_240_DEG_ELLIPSE_Y =
  configHexagon.radius / 2.33333333;

export const HORIZONTAL_PARTICLE_OFFSET =
  configCircle.radius / 1.777777777;

export const diagonalEllipseConfig = {
  radiusX: 17.5,
  radiusY: 7.5,
};

export const horizontalEllipseConfig = {
  radiusX: 20,
  radiusY: 7.5,
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
