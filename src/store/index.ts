/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable */
import {
  ExtensionAngle,
  GridPoint,
  IParticle,
  ParticleState,
  RunStats,
} from '@/interfaces';
import { pointsEqual } from '@/utils';
import { createStore } from 'vuex';

const getDefaultState = () => ({
  gridPoints: [] as GridPoint[],
  particles: [] as IParticle[],
  move: true,
  algorithm: 'c' as 'a' | 'b' | 'c',
  logs: [] as RunStats[],
  runCount: 0,
  maxRuns: 5,
  gridWidth: 15,
  numParticles: 20,
});

const initialState = getDefaultState();

export default createStore({
  state: initialState,
  getters: {
    populatedGrid: (state, getters) =>
      state.gridPoints.filter((p) => !getters.isGridPointFree(p)),
    nonObstacleParticles: (state) =>
      state.particles.filter((p) => !p.isObstacle),
    obstacleParticles: (state) =>
      state.particles.filter((p) => p.isObstacle),
    isGridPointFree: (state) => (point: GridPoint) =>
      !state.particles.find(
        (p) =>
          p.currentRow == point.gridRow &&
          p.currentCol == point.gridCol
      ),
    isGridPointObstacle: (state) => (point: GridPoint) =>
      state.particles.find(
        (p) =>
          p.currentRow == point.gridRow &&
          p.currentCol == point.gridCol
      )?.isObstacle,
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
        let thereIsNearbyObstacle = false;

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

            if (getters.isGridPointObstacle(p)) {
              thereIsNearbyObstacle = true;
            }
            // hasEncounteredOccupiedCell = true;
            intervals.push(currentInterval);
            currentInterval = [];
          }
        });

        intervals.sort(
          (a: GridPoint[], b: GridPoint[]) => b.length - a.length
        );

        return {
          freeNeighborInterval: intervals[0],
          obstacle: thereIsNearbyObstacle,
        };
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
  actions: {
    startRun({ state }) {
      state.particles.length = 0;
      state.runCount++;
      // reset state except for logs
      // Object.assign(state, {
      //   ...initialState,
      //   gridPoints: state.gridPoints, // keep the grid as it's only rendered once
      //   logs: state.logs, // keep logs from last run
      //   runCount: state.runCount + 1, //update run count
      // });
    },
    addLogRecord({ commit, state, getters }) {
      commit('addLogRecord', {
        algorithm: state.algorithm,
        particleNumber: state.particles.length,
        obstacleNumber: state.particles.filter((p) => p.isObstacle)
          .length,
        rounds: 0,
        moves: 0,
        initialDiameter: 0,
        initialDensity: 0,
        initialConfiguration: JSON.parse(
          JSON.stringify(getters.populatedGrid)
        ),
      } as RunStats);
    },
    updateCurrentLogRecord({ state }, payload) {
      const target = state.logs[state.logs.length - 1];
      Object.assign(target, { ...target, ...payload });
    },
  },
  mutations: {
    addLogRecord: (state, payload) => state.logs.push(payload),
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
    pushGridPoints: (state, points) => {
      console.log('pushing points');
      (points as GridPoint[]).forEach((p) => {
        if (
          !state.gridPoints.find(
            (p2) =>
              p.gridCol === p2.gridCol && p.gridRow === p2.gridRow
          )
        ) {
          state.gridPoints.push(p);
        }
      });
    },
    pushParticle: (state, particle) => {
      console.log('push particle');
      state.particles.push(particle);
    },
  },
});
