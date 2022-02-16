<template>
  <v-rect v-if="particle.isObstacle" :config="config"></v-rect>
  <v-circle v-else-if="state == 'contracted'" :config="config"></v-circle>
  <v-ellipse v-else :config="ellipseConfigs[angle]"></v-ellipse>
</template>

<script lang="ts">
import {
  ExtensionAngle,
  GridPoint,
  IParticle,
  ParticleState
} from '@/interfaces'
import {
  configCircle,
  configSquare,
  diagonalEllipseConfig,
  horizontalEllipseConfig,
  OFFSET_180_DEG_ELLIPSE_X,
  OFFSET_180_DEG_ELLIPSE_Y,
  OFFSET_240_DEG_ELLIPSE_X,
  OFFSET_240_DEG_ELLIPSE_Y,
  OFFSET_60_DEG_ELLIPSE_X,
  OFFSET_60_DEG_ELLIPSE_Y
} from '@/shapes'
import { defineComponent, PropType } from '@vue/runtime-core'
import { mapState } from 'vuex'

export default defineComponent({
  name: 'Particle',
  props: {
    particle: {
      type: Object as PropType<IParticle>,
      required: true
    }
  },
  // created () {
  //   setInterval(() => this.makeMove(), 20)
  // },
  data () {
    return {}
  },
  methods: {
    makeMove () {
      if (!this.move) {
        return
      }
      if (this.target && this.$store.getters.isGridPointFree(this.target)) {
        this.$store.commit('moveParticleToTarget', {
          id: this.particle.id
        })
      } else {
        const target = this.getNextTarget()
        if (target) {
          this.$store.commit('updateParticleTarget', {
            id: this.particle.id,
            target
          })
        }
      }
    },
    getNextTarget (): GridPoint | null {
      const freeNeighborInterval = this.$store.getters.getFreeNeighborsInterval(
        this.point
      ) as GridPoint[]

      if (freeNeighborInterval.length > 2 && freeNeighborInterval.length < 6) {
        const targetIndex = Math.floor(freeNeighborInterval.length / 2)
        return freeNeighborInterval[targetIndex]
      }

      return null
    }
  },

  computed: {
    ellipseConfigs () {
      return {
        '60': {
          x: this.x - OFFSET_60_DEG_ELLIPSE_X, //10,
          y: this.y - OFFSET_60_DEG_ELLIPSE_Y, //15,
          ...diagonalEllipseConfig,
          fill: this.fillColor,
          rotation: 60
        },
        '180': {
          x: this.x + OFFSET_180_DEG_ELLIPSE_X, // 17.5,
          y: this.y + OFFSET_180_DEG_ELLIPSE_Y,
          ...horizontalEllipseConfig,
          fill: this.fillColor,
          rotation: 180
        },
        '-180': {
          x: this.x - OFFSET_180_DEG_ELLIPSE_X,
          y: this.y + OFFSET_180_DEG_ELLIPSE_Y,
          ...horizontalEllipseConfig,
          fill: this.fillColor,
          rotation: -180
        },
        '-60': {
          x: this.x + OFFSET_60_DEG_ELLIPSE_X, // + 10,
          y: this.y - OFFSET_60_DEG_ELLIPSE_Y, // - 15,
          ...diagonalEllipseConfig,
          fill: this.fillColor,
          rotation: -60
        },
        '240': {
          x: this.x + OFFSET_240_DEG_ELLIPSE_X, //+ 8.5,
          y: this.y + OFFSET_240_DEG_ELLIPSE_Y, // 15,
          ...diagonalEllipseConfig,
          fill: this.fillColor,
          rotation: 240
        },
        '-240': {
          x: this.x - OFFSET_240_DEG_ELLIPSE_X, // 8.5,
          y: this.y + OFFSET_240_DEG_ELLIPSE_Y, // 15,
          ...diagonalEllipseConfig,
          fill: this.fillColor,
          rotation: -240
        }
      }
    },
    point () {
      return this.$store.getters.getPoint(
        this.particle.currentRow,
        this.particle.currentCol
      )
    },
    position (): { x: number; y: number } {
      if (this.point) {
        return { x: this.point.x, y: this.point.y }
      }

      return { x: 0, y: 0 }
    },
    x () {
      return this.position.x
    },
    y () {
      return this.position.y
    },
    neighborPoints (): GridPoint[] {
      return this.$store.getters.getNeighbors(this.point)
    },
    state (): ParticleState {
      return this.$store.getters.getParticleState(this.particle.id)
    },
    angle (): ExtensionAngle {
      return this.$store.getters.getParticleExtensionAngle(this.particle.id)
    },
    target (): GridPoint | undefined {
      return this.$store.getters.getParticleTarget(this.particle.id)
    },
    isIsolated (): boolean {
      return this.$store.getters.isPointIsolated(this.point)
    },
    fillColor (): string {
      return this.particle.isObstacle
        ? 'black'
        : this.isIsolated
        ? 'green'
        : 'black'
    },
    config () {
      return {
        x: this.x - (this.particle.isObstacle ? configSquare.width / 2 : 0),
        y: this.y - (this.particle.isObstacle ? configSquare.width / 2 : 0),
        fill: this.fillColor,
        ...(this.particle.isObstacle ? configSquare : configCircle)
      }
    },
    ...mapState(['move'])
  }
})
</script>

<style></style>
