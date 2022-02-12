import { GridPoint, IParticle } from './interfaces';
import store from './store';
import { sampleSize } from 'lodash';
import { getGridDensityAndDiameter } from './stats';

const DELAY = 100;

const getActiveParticles = (): IParticle[] =>
  store.getters.nonObstacleParticles;
// sampleSize(
//   store.getters.nonObstacleParticles,
//   Math.floor(Math.random() * (store.state.particles.length - 1) + 1)
// );

const getNextTarget = (particle: IParticle): GridPoint | null => {
  const particlePoint = store.getters.getPoint(
    particle.currentRow,
    particle.currentCol
  );
  const { freeNeighborInterval, obstacle } =
    store.getters.getFreeNeighborsInterval(particlePoint) as {
      freeNeighborInterval: GridPoint[];
      obstacle: boolean;
    };

  return selectTargetFromInterval(freeNeighborInterval, obstacle);
};

const selectTargetFromInterval = (
  interval: GridPoint[],
  thereIsObstacle: boolean
): GridPoint | null => {
  let algorithm = store.state.algorithm;
  let targetIndex;

  if (algorithm === 'c') {
    algorithm = thereIsObstacle ? 'b' : 'a';
  }

  if (interval.length <= 2 || interval.length === 6) {
    return null;
  }
  if (interval.length === 5 && algorithm === 'b') {
    targetIndex = Math.random() > 0.5 ? 1 : 3;
  } else {
    targetIndex = Math.floor(interval.length / 2);
  }

  return interval[targetIndex];
};

const makeMove = (particle: IParticle): void => {
  const target = store.getters.getParticleTarget(particle.id);
  if (target && store.getters.isGridPointFree(target)) {
    store.commit('moveParticleToTarget', {
      id: particle.id,
    });
  } else {
    const target = getNextTarget(particle);
    if (target) {
      store.commit('updateParticleTarget', {
        id: particle.id,
        target,
      });
    }
  }
};

export const run = (): void => {
  store.dispatch('addLogRecord');

  const { diameter: initialDiameter, density: initialDensity } =
    getGridDensityAndDiameter(store.getters.populatedGrid);
  store.dispatch('updateCurrentLogRecord', {
    initialDensity,
    initialDiameter,
  });
  console.log('initial record', store.state.logs[0]);

  let rounds = 0;
  let moves = 0;
  // eslint-disable-next-line no-constant-condition
  const handle = setInterval(() => {
    const activeParticles = getActiveParticles();

    moves += activeParticles.length;
    rounds++;

    activeParticles.forEach((p) => makeMove(p));

    if (
      store.getters.nonObstacleParticles.every(
        (p: IParticle) =>
          store.getters.isPointIsolated(
            store.getters.getPoint(p.currentRow, p.currentCol)
          ) && store.getters.getParticleState(p) === 'contracted'
      )
    ) {
      clearInterval(handle);

      const { density: finalDensity, diameter: finalDiameter } =
        getGridDensityAndDiameter(store.getters.populatedGrid);

      store.dispatch('updateCurrentLogRecord', {
        finalDensity,
        finalDiameter,
        moves,
        rounds,
        successful: true,
      });
      console.log('final record', store.state.logs[0]);
    }
  }, DELAY);
};

const getStatistics = (): { diameter: number; density: number } => {
  // TODO implement
  return { diameter: 0, density: 0 };
};
