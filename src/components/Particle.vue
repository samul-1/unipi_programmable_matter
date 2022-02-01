<template>
  <v-circle
    :config="{
      x,
      y,
      radius: 16,
      fill: particle.color
    }"
  ></v-circle>
</template>

<script lang="ts">
import { GridPoint, IParticle } from '@/interfaces'
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
    setInterval(() => this.moveToRandomNeighbor(), 1000)
  },
  data () {
    return {}
  },
  methods: {
    moveToRandomNeighbor () {
      if (!this.move) {
        return
      }
      const chosen = this.neighborPoints[
        Math.floor(Math.random() * this.neighborPoints.length)
      ]
      this.$store.commit('updateParticlePosition', {
        id: this.particle.id,
        newPoint: chosen
      })
    }
  },
  computed: {
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
    ...mapState(['move'])
  }
})
</script>

<style></style>
