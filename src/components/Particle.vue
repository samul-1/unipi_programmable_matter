<template>
  <v-circle
    v-if="state == 'contracted'"
    :config="{
      x,
      y,
      radius: 16,
      fill: particle.color
    }"
  ></v-circle>
  <v-ellipse v-else :config="ellipseConfigs[angle]"></v-ellipse>
</template>

<script lang="ts">
import {
  ExtensionAngle,
  GridPoint,
  IParticle,
  ParticleState
} from '@/interfaces'
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
  created () {
    setInterval(() => this.moveToRandomNeighbor(), 250)
  },
  data () {
    return {}
  },
  methods: {
    moveToRandomNeighbor () {
      if (!this.move) {
        return
      }
      console.log(
        'NEIGHBORS',
        this.neighborPoints.map(
          (p: GridPoint) => `(${p.gridRow}, ${p.gridCol})`
        )
      )
      if (this.target && this.$store.getters.isGridPointFree(this.target)) {
        this.$store.commit('moveParticleToTarget', {
          id: this.particle.id
        })
      } else {
        const targetIndex =
          null ?? Math.floor(Math.random() * this.neighborPoints.length)
        const target = this.neighborPoints[targetIndex]
        this.$store.commit('updateParticleTarget', {
          id: this.particle.id,
          target
        })
      }
    }
  },

  computed: {
    ellipseConfigs () {
      return {
        '60': {
          x: this.x - 20,
          y: this.y - 30,
          radiusX: 35,
          radiusY: 15,
          fill: this.particle.color,
          rotation: 60
        },
        '180': {
          x: this.x + 35,
          y: this.y,
          radiusX: 40,
          radiusY: 15,
          fill: this.particle.color,
          rotation: 180
        },
        '-180': {
          x: this.x - 35,
          y: this.y,
          radiusX: 40,
          radiusY: 15,
          fill: this.particle.color,
          rotation: -180
        },
        '-60': {
          x: this.x + 20,
          y: this.y - 30,
          radiusX: 35,
          radiusY: 15,
          fill: this.particle.color,
          rotation: -60
        },
        '240': {
          x: this.x + 17,
          y: this.y + 30,
          radiusX: 35,
          radiusY: 15,
          fill: this.particle.color,
          rotation: 240
        },
        '-240': {
          x: this.x - 17,
          y: this.y + 30,
          radiusX: 35,
          radiusY: 15,
          fill: this.particle.color,
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
    ...mapState(['move'])
  }
})
</script>

<style></style>
