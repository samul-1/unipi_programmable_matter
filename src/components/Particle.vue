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
import { IParticle } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'

export default defineComponent({
  name: 'Particle',
  props: {
    particle: {
      type: Object as PropType<IParticle>,
      required: true
    }
  },
  data () {
    return {}
  },
  computed: {
    position (): { x: number; y: number } {
      const point = this.$store.getters.getPoint(
        this.particle.currentRow,
        this.particle.currentCol
      )
      if (point) {
        return { x: point.x, y: point.y }
      }

      return { x: 0, y: 0 }
    },
    x () {
      return this.position.x
    },
    y () {
      return this.position.y
    }
  }
})
</script>

<style></style>
