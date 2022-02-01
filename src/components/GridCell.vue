<template>
  <v-regular-polygon :config="config"></v-regular-polygon>
  <v-line :config="horizontalLineConfig"></v-line>
  <v-line :config="verticalLineConfig"></v-line>
  <v-line :config="diag1LineConfig"></v-line>
  <v-line :config="diag2LineConfig"></v-line>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { configHexagon, getHexagonApothem, getHexagonXOffset } from '@/shapes'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  name: 'GridCell',
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  },
  computed: {
    config (): any {
      return { ...configHexagon, x: this.x, y: this.y, strokeWidth: 0.6 }
    },
    horizontalLineConfig (): any {
      return {
        points: [
          this.x - this.config.radius,
          this.y,
          this.x + this.config.radius,
          this.y + this.config.radius / 4 - 5
        ],
        stroke: 'black',
        strokeWidth: 0.5
      }
    },
    verticalLineConfig (): any {
      return {
        points: [
          this.x,
          this.y - getHexagonApothem(this.config.radius),
          this.x,
          this.y + getHexagonApothem(this.config.radius)
        ],
        stroke: 'black',
        strokeWidth: 0.4
      }
    },
    diag1LineConfig (): any {
      return {
        points: [
          this.x - this.config.radius + getHexagonXOffset(this.config.radius),
          this.y - getHexagonApothem(this.config.radius),
          this.x + this.config.radius - getHexagonXOffset(this.config.radius),
          this.y + getHexagonApothem(this.config.radius)
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    },
    diag2LineConfig (): any {
      return {
        points: [
          this.x + this.config.radius - getHexagonXOffset(this.config.radius),
          this.y - getHexagonApothem(this.config.radius),
          this.x - this.config.radius + getHexagonXOffset(this.config.radius),
          this.y + getHexagonApothem(this.config.radius)
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    }
  }
})
</script>

<style></style>
