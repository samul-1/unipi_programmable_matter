import { GridPoint, IParticle } from './interfaces';
import store from './store';
import { sampleSize } from 'lodash';

const DELAY = 100;

const getActiveParticles = (): IParticle[] =>
  sampleSize(
    store.state.particles,
    Math.floor(Math.random() * (store.state.particles.length - 1) + 1)
  );

const getNextTarget = (particle: IParticle): GridPoint | null => {
  const particlePoint = store.getters.getPoint(
    particle.currentRow,
    particle.currentCol
  );
  const freeNeighborInterval = store.getters.getFreeNeighborsInterval(
    particlePoint
  ) as GridPoint[];

  if (
    freeNeighborInterval.length > 2 &&
    freeNeighborInterval.length < 6
  ) {
    const targetIndex = Math.floor(freeNeighborInterval.length / 2);
    return freeNeighborInterval[targetIndex];
  }

  return null;
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
  // eslint-disable-next-line no-constant-condition
  setInterval(() => {
    const activeParticles = getActiveParticles();

    activeParticles.forEach((p) => makeMove(p));
  }, DELAY);
};
