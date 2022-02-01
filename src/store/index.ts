/* eslint-disable @typescript-eslint/no-explicit-any */
import { GridPoint, IParticle } from '@/interfaces';
import { createStore } from 'vuex';

export default createStore({
  state: {
    gridPoints: [] as GridPoint[],
    particles: [] as IParticle[],
    selectedPoint: {
      x: -1,
      y: -1,
    },
  },
  getters: {
    getPoint: (state) => (row: number, col: number) =>
      state.gridPoints.find(
        (p) => p.gridCol == col && p.gridRow == row
      ),
  },
  mutations: {
    pushGridPoints: (state, points) =>
      state.gridPoints.push(...points),
    selectPoint: (state, { x, y }) =>
      (state.selectedPoint = { x, y }),
    pushParticle: (state, particle) => state.particles.push(particle),
  },
});
