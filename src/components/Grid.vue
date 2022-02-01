<template>
  <div>
    <!-- <v-regular-polygon
      v-for="(cell, index) in cells"
      :key="'cell-' + index"
      :config="configHexagon"
      :x="10"
      :y="10"
    ></v-regular-polygon> -->
    <grid-cell
      v-for="(cell, index) in cells"
      :key="'cell-' + index"
      :x="cell.x"
      :y="cell.y"
    ></grid-cell>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { configHexagon } from '@/shapes'
import GridCell from './GridCell.vue'
export default defineComponent({
  components: { GridCell },
  name: 'Grid',
  props: {
    cellNumber: {
      type: Number,
      default: 200
    },
    gridWidth: {
      type: Number,
      default: 25
    }
  },
  created () {
    let currX = this.paddingX
    let currY = this.paddingY
    ;[...Array(this.cellNumber)].forEach(i => {
      if (
        currX >
        this.gridWidth * (this.configHexagon.radius + this.gapX) + this.paddingX
      ) {
        currY += this.configHexagon.radius + this.gapY
        currX = this.paddingX
      }
      this.cells.push({
        x: currX,
        y: currY
      })
      currX += this.configHexagon.radius + this.gapX
    })
  },
  data () {
    return {
      paddingY: 50,
      paddingX: 50,
      gapX: 22,
      gapY: 15.5,
      configHexagon,
      cells: [] as { x: number; y: number }[]
    }
  }
})
</script>

<style></style>
