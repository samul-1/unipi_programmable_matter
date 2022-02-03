/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExtensionAngle,
  GridPoint,
  IParticle,
  ParticleState,
} from '@/interfaces';
import { createStore } from 'vuex';

export default createStore({
  state: {
    gridPoints: [] as GridPoint[],
    particles: [] as IParticle[],
    move: true,
  },
  getters: {
    isGridPointFree: (state) => (point: GridPoint) =>
      !state.particles.find(
        (p) =>
          p.currentRow == point.gridRow &&
          p.currentCol == point.gridCol
      ),
    getParticleTarget:
      (state) =>
      (particleId: string): GridPoint | undefined =>
        state.particles.find((p) => p.id == particleId)?.targetPoint,
    getParticleState:
      (state) =>
      (particleId: string): ParticleState =>
        state.particles.find((p) => p.id == particleId)
          ?.targetPoint != null
          ? 'extended'
          : 'contracted',
    getParticleExtensionAngle:
      (state) =>
      (particleId: string): ExtensionAngle => {
        const particle = state.particles.find(
          (p) => p.id == particleId
        ) as IParticle;
        const target = particle?.targetPoint as GridPoint;

        if (
          // top left -60
          target.gridCol ==
            particle.currentCol - (particle.currentRow % 2) &&
          target.gridRow == particle.currentRow - 1
        ) {
          return 60;
        }
        //top right 60
        if (
          target.gridCol ==
            particle.currentCol + (1 - (particle.currentRow % 2)) &&
          target.gridRow == particle.currentRow - 1
        ) {
          return -60;
        }
        // center left -180
        if (
          target.gridCol == particle.currentCol - 1 &&
          target.gridRow == particle.currentRow
        ) {
          return -180;
        }
        // center right 180
        if (
          target.gridRow == particle.currentRow &&
          target.gridCol == particle.currentCol + 1
        ) {
          return 180;
        }
        // bottom left -240
        if (
          target.gridCol == particle.currentCol - 1 &&
          target.gridRow == particle.currentRow
        ) {
          return -240;
        }
        // bottom right 240
        if (
          target.gridRow == particle.currentRow + 1 &&
          target.gridCol ==
            particle.currentCol + (1 - (particle.currentRow % 2))
        ) {
          return 240;
        }

        throw new Error('!!');
      },
    getPoint: (state) => (row: number, col: number) =>
      state.gridPoints.find(
        (p) => p.gridCol == col && p.gridRow == row
      ),
    getNeighbors: (state) => (point: GridPoint) =>
      state.gridPoints.filter(
        (p) =>
          // top left -60
          (p.gridCol == point.gridCol - (point.gridRow % 2) &&
            p.gridRow == point.gridRow - 1) ||
          //top right 60
          (p.gridCol == point.gridCol + (1 - (point.gridRow % 2)) &&
            p.gridRow == point.gridRow - 1) ||
          // center left -180
          (p.gridCol == point.gridCol - 1 &&
            p.gridRow == point.gridRow) ||
          // center right 180
          (p.gridRow == point.gridRow &&
            p.gridCol == point.gridCol + 1) ||
          // bottom left -240
          (p.gridCol == point.gridCol - 1 &&
            p.gridRow == point.gridRow) ||
          // bottom right 240
          (p.gridRow == point.gridRow + 1 &&
            p.gridCol == point.gridCol + (1 - (point.gridRow % 2)))
      ),
  },
  mutations: {
    updateParticlePosition: (
      state,
      { id, newPoint }: { id: string; newPoint: GridPoint }
    ) => {
      const target = state.particles.find((p) => p.id == id);
      if (target) {
        target.currentCol = newPoint.gridCol;
        target.currentRow = newPoint.gridRow;
      }
    },
    updateParticleTarget: (
      state,
      {
        id,
        target,
      }: {
        id: string;
        target: GridPoint;
      }
    ) => {
      const particle = state.particles.find((p) => p.id == id);
      if (particle) {
        particle.targetPoint = target;
      }
    },
    moveParticleToTarget: (
      state,
      {
        id,
      }: {
        id: string;
      }
    ) => {
      const particle = state.particles.find((p) => p.id == id);
      if (particle) {
        particle.currentRow = (
          particle.targetPoint as GridPoint
        ).gridRow;
        particle.currentCol = (
          particle.targetPoint as GridPoint
        ).gridCol;
        particle.targetPoint = undefined;
      }
    },
    pushGridPoints: (state, points) =>
      state.gridPoints.push(...points),
    pushParticle: (state, particle) => state.particles.push(particle),
  },
});
