/* eslint-disable @typescript-eslint/no-explicit-any */
import { GridPoint, IParticle } from '@/interfaces';
import { createStore } from 'vuex';

export default createStore({
  state: {
    gridPoints: [] as GridPoint[],
    particles: [] as IParticle[],
    move: true,
  },
  getters: {
    getPoint: (state) => (row: number, col: number) =>
      state.gridPoints.find(
        (p) => p.gridCol == col && p.gridRow == row
      ),
    getNeighbors: (state) => (point: GridPoint) =>
      state.gridPoints.filter(
        (p) =>
          // top left
          (p.gridCol == point.gridCol - 1 &&
            p.gridRow == point.gridRow - 1) ||
          //top right
          (p.gridCol == point.gridCol + (point.gridRow % 2) &&
            p.gridRow == point.gridRow - 1) ||
          // center left
          (p.gridCol == point.gridCol - 1 &&
            p.gridRow == point.gridRow) ||
          // center right
          (p.gridRow == point.gridRow &&
            p.gridCol == point.gridCol + (point.gridRow % 2)) ||
          // bottom left
          (p.gridCol == point.gridCol - 1 &&
            p.gridRow == point.gridRow) ||
          // bottom right
          (p.gridRow == point.gridRow + 1 &&
            p.gridCol == point.gridCol + (point.gridRow % 2))
      ),
  },
  mutations: {
    updateParticlePosition: (
      state,
      { id, newPoint }: { id: string; newPoint: GridPoint }
    ) => {
      const target = state.particles.find((p) => p.id == id);
      console.log('TARGET', target);
      if (target) {
        target.currentCol = newPoint.gridCol;
        target.currentRow = newPoint.gridRow;
      }
    },
    pushGridPoints: (state, points) =>
      state.gridPoints.push(...points),
    pushParticle: (state, particle) => state.particles.push(particle),
  },
});
