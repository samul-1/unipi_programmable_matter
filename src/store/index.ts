/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
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
    schedulerHandle: null as number | null,
  },
  getters: {
    nonObstacleParticles: (state) =>
      state.particles.filter((p) => !p.isObstacle),
    isGridPointFree: (state) => (point: GridPoint) =>
      !state.particles.find(
        (p) =>
          p.currentRow == point.gridRow &&
          p.currentCol == point.gridCol
      ),
    isPointIsolated: (state, getters) => (point: GridPoint) =>
      (getters.getNeighbors(point) as GridPoint[]).every((p) =>
        getters.isGridPointFree(p)
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
        console.error('!!!!', 'from', particlePoint, 'to', target);
        throw new Error();
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
        let currentInterval = [] as GridPoint[];
        let lastFreeIndex = -1;
        let hasEncounteredOccupiedCell = false;
        let stop = false;

        const intervals = [] as GridPoint[][];
        toInspect.forEach((p, i) => {
          if (stop) {
            return;
          }
          if (getters.isGridPointFree(p)) {
            currentInterval.push(p);

            if (
              currentInterval.length === 6 ||
              i === toInspect.length - 1
            ) {
              intervals.push(currentInterval);
              stop = true;
            }

            // if (i >= neighbors.length && i === lastFreeIndex) {
            //   stop = true;
            // }
            // if (!hasEncounteredOccupiedCell && i < neighbors.length) {
            //   lastFreeIndex = i;
            // }
          } else {
            if (currentInterval.length === 5) {
              stop = true;
            }
            // hasEncounteredOccupiedCell = true;
            intervals.push([...currentInterval]);
            currentInterval = [];
          }
        });

        intervals.sort(
          (a: GridPoint[], b: GridPoint[]) => b.length - a.length
        );

        return intervals[0];
      },
    getNeighbors: (state, getters) => (point: GridPoint) =>
      [
        ...(getters.topLeftNeighbor(point)
          ? [getters.topLeftNeighbor(point)]
          : []),
        ...(getters.topRightNeighbor(point)
          ? [getters.topRightNeighbor(point)]
          : []),
        ...(getters.centerRightNeighbor(point)
          ? [getters.centerRightNeighbor(point)]
          : []),
        ...(getters.bottomRightNeighbor(point)
          ? [getters.bottomRightNeighbor(point)]
          : []),
        ...(getters.bottomLeftNeighbor(point)
          ? [getters.bottomLeftNeighbor(point)]
          : []),
        ...(getters.centerLeftNeighbor(point)
          ? [getters.centerLeftNeighbor(point)]
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
