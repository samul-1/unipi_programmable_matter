import { GridPoint, IParticle } from './interfaces';
import store from './store';
import { sampleSize } from 'lodash';
import { getGridDensityAndDiameter } from './stats';
import {
  getRandomRow,
  getRandomCol,
  getRandomBool,
  gridPointToGridCoordinates,
} from './utils';
import { v4 as uuidv4 } from 'uuid';

const DELAY = 100;

// pushes particles for a new run to the store
const createParticles = () => {
  //eslint-disable-next-line @typescript-eslint/no-extra-semi
  [...Array(store.state.numParticles)].forEach((_i) => {
    store.commit('pushParticle', {
      id: uuidv4(),
      currentRow: getRandomRow(),
      currentCol: getRandomCol(),
      isObstacle: false,
      clockwise: getRandomBool(0.5),
    } as IParticle);
  });
};

const createObstacles = () => {
  store.state.obstacleCoordinates.forEach((p) => {
    store.commit('pushParticle', {
      id: uuidv4(),
      currentRow: p[0],
      currentCol: p[1],
      isObstacle: true,
      clockwise: false, // doesn't matter
    });
  });
};

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

  return selectTargetFromInterval(
    freeNeighborInterval,
    obstacle,
    particle.clockwise
  );
};

const selectTargetFromInterval = (
  interval: GridPoint[],
  thereIsObstacle: boolean,
  clockwise: boolean
): GridPoint | null => {
  let algorithm = store.state.algorithm;
  let targetIndex;

  if (algorithm === 'c') {
    // algorithm 'c' becomes 'b' if there is an adjacent obstacle, 'a' otherwise
    algorithm = thereIsObstacle ? 'b' : 'a';
  }

  if (interval.length < 2 || interval.length === 6) {
    // no algorithm makes a move on an interval 1, 2, or 6 cells long
    return null;
  }
  if (interval.length === 5 && algorithm === 'b') {
    // algorithm 'b' selects second or fourth cell in a 5-cell interval
    targetIndex = Math.random() > 0.5 ? 1 : 3;

    if (interval.length % 2 === 0 && !clockwise) {
      targetIndex--;
    }
  } else {
    // algorithm 'a' or 'b' on a non-5-cell interval always selects the middle cell
    targetIndex = Math.floor(interval.length / 2);
  }

  return interval[targetIndex];
};

const makeMove = (particle: IParticle): void => {
  const target = store.getters.getParticleTarget(particle.id);

  // particle was extended towards a free cell; contract into it
  if (target && store.getters.isGridPointFree(target)) {
    store.commit('moveParticleToTarget', {
      id: particle.id,
    });
  } else {
    // particle is contracted inside of a cell; expand towards next target if any
    const target = getNextTarget(particle);
    if (target) {
      store.commit('updateParticleTarget', {
        id: particle.id,
        target,
      });
    }
  }
};

const MAX_ROUNDS = 500;

export const run = async (): Promise<void> => {
  // reset state
  await store.dispatch('startRun');
  createParticles();
  createObstacles();

  // add log with initial data for the run
  await store.dispatch('addLogRecord');

  const { diameter: initialDiameter, density: initialDensity } =
    getGridDensityAndDiameter(store.getters.populatedGrid);
  await store.dispatch('updateCurrentLogRecord', {
    initialDensity,
    initialDiameter,
  });

  let rounds = 0;
  let moves = 0;

  // eslint-disable-next-line no-constant-condition
  const handle = setInterval(async () => {
    // select a subset of all the particles that'll get a chance to make a move this turn
    const activeParticles = getActiveParticles();

    // update round and moves counters
    moves += activeParticles.length;
    rounds++;

    // move particles
    activeParticles.forEach((p) => makeMove(p));

    // check if problem has been solved or if we've run out of moves
    if (
      // failure
      rounds > MAX_ROUNDS ||
      // success
      store.getters.nonObstacleParticles.every(
        (p: IParticle) =>
          store.getters.isPointIsolated(
            store.getters.getPoint(p.currentRow, p.currentCol)
          ) && store.getters.getParticleState(p) === 'contracted'
      )
    ) {
      clearInterval(handle); // stop particles from moving

      const finalConfiguration = JSON.parse(
        JSON.stringify(
          (store.getters.populatedGrid as GridPoint[]).map((p) =>
            gridPointToGridCoordinates(p)
          )
        )
      );
      // get final stats and update log record
      const { density: finalDensity, diameter: finalDiameter } =
        getGridDensityAndDiameter(
          store.getters.populatedGrid as GridPoint[]
        );
      await store.dispatch('updateCurrentLogRecord', {
        finalDensity,
        finalDiameter,
        moves,
        rounds,
        successful: !(rounds > MAX_ROUNDS),
        finalConfiguration,
      });

      if (store.state.runCount < store.state.maxRuns) {
        await run();
      }
    }
  }, DELAY);
};
