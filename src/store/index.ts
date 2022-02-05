/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExtensionAngle,
  GridPoint,
  IParticle,
  ParticleState,
} from '@/interfaces';
import { pointsEqual } from '@/utils';
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
      (state, getters) =>
      (particleId: string): ExtensionAngle => {
        const particle = state.particles.find(
          (p) => p.id == particleId
        ) as IParticle;
        const target = particle?.targetPoint as GridPoint;
        const particlePoint = state.gridPoints.find(
          (p) =>
            p.gridCol == particle.currentCol &&
            p.gridRow == particle.currentRow
        );

        //console.log('TARGET', target, 'particlepoint', particlePoint);

        if (
          pointsEqual(target, getters.topLeftNeighbor(particlePoint))
        ) {
          return 60;
        }
        if (
          pointsEqual(target, getters.topRightNeighbor(particlePoint))
        ) {
          return -60;
        }
        if (
          pointsEqual(
            target,
            getters.centerLeftNeighbor(particlePoint)
          )
        ) {
          return -180;
        }
        if (
          pointsEqual(
            target,
            getters.centerRightNeighbor(particlePoint)
          )
        ) {
          return 180;
        }
        if (
          pointsEqual(
            target,
            getters.bottomLeftNeighbor(particlePoint)
          )
        ) {
          return -240;
        }
        if (
          pointsEqual(
            target,
            getters.bottomRightNeighbor(particlePoint)
          )
        ) {
          return 240;
        }

        throw new Error('!!');
      },
    getPoint: (state) => (row: number, col: number) =>
      state.gridPoints.find(
        (p) => p.gridCol == col && p.gridRow == row
      ),
    topLeftNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol - (point.gridRow % 2) &&
          p.gridRow == point.gridRow - 1
      ),
    topRightNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol + (1 - (point.gridRow % 2)) &&
          p.gridRow == point.gridRow - 1
      ),
    centerLeftNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol - 1 && p.gridRow == point.gridRow
      ),
    centerRightNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol + 1 && p.gridRow == point.gridRow
      ),
    bottomLeftNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol - (point.gridRow % 2) &&
          p.gridRow == point.gridRow + 1
      ),
    bottomRightNeighbor: (state) => (point: GridPoint) =>
      state.gridPoints.find(
        (p) =>
          p.gridCol == point.gridCol + (1 - (point.gridRow % 2)) &&
          p.gridRow == point.gridRow + 1
      ),
    getFreeNeighborsInterval:
      (state, getters) => (point: GridPoint) => {
        const neighbors = getters.getNeighbors(point) as GridPoint[];
        const toInspect = neighbors.concat(neighbors);
        let maximalFreeInterval = [] as GridPoint[];
        let lastFreeIndex = -1;
        let hasEncounteredOccupiedCell = false;
        let stop = false;

        toInspect.forEach((p, i) => {
          if (stop) {
            return;
          }
          if (getters.isGridPointFree(p)) {
            maximalFreeInterval.push(p);

            if (maximalFreeInterval.length === 6) {
              stop = true;
            }

            if (i >= neighbors.length && i === lastFreeIndex) {
              stop = true;
            }
            if (!hasEncounteredOccupiedCell && i < neighbors.length) {
              lastFreeIndex = i;
            }
          } else {
            if (maximalFreeInterval.length === 5) {
              stop = true;
            } else {
              hasEncounteredOccupiedCell = true;
              maximalFreeInterval = [];
            }
          }
        });

        return maximalFreeInterval;
      },
    getNeighbors: (state, getters) => (point: GridPoint) =>
      [
        ...(getters.topLeftNeighbor(point)
          ? [getters.topLeftNeighbor(point)]
          : []),
        ...(getters.topRightNeighbor(point)
          ? [getters.topRightNeighbor(point)]
          : []),
        ...(getters.centerLeftNeighbor(point)
          ? [getters.centerLeftNeighbor(point)]
          : []),
        ...(getters.centerRightNeighbor(point)
          ? [getters.centerRightNeighbor(point)]
          : []),
        ...(getters.bottomLeftNeighbor(point)
          ? [getters.bottomLeftNeighbor(point)]
          : []),
        ...(getters.bottomRightNeighbor(point)
          ? [getters.bottomRightNeighbor(point)]
          : []),
      ],
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
