<template>
  <div>
    <grid-cell
      @ready="$emit('ready')"
      v-for="(cell, index) in cells"
      :key="'cell-' + index"
      :x="cell.x"
      :row="getRow(index)"
      :col="getCol(index)"
      :y="cell.y"
      :ref="'cell-' + index"
      :index="index"
      :gridWidth="gridWidth"
    ></grid-cell>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineComponent } from '@vue/runtime-core'
import { configHexagon } from '@/shapes'
import GridCell from './GridCell.vue'
import { mapState } from 'vuex'
export default defineComponent({
  components: { GridCell },
  name: 'Grid',
  props: {
    gridWidth: {
      type: Number,
      default: 4
    }
  },
  created () {
    let currX = this.paddingX
    let currY = this.paddingY
    this.gapX = this.configHexagon.radius
    this.gapY = this.configHexagon.radius / 1.38
    ;[...Array(this.cellNumber)].forEach((_i: number) => {
      if (
        currX >
        this.gridWidth * (this.configHexagon.radius + this.gapX) +
          this.paddingX -
          this.configHexagon.radius
      ) {
        currY += this.configHexagon.radius + this.gapY
        currX = this.paddingX
      }
      console.log('pushing')
      this.pushCell({
        x: currX,
        y: currY
      })
      currX += this.configHexagon.radius + this.gapX
    })
  },
  data () {
    return {
      paddingY: 25,
      paddingX: 120,
      gapX: 0,
      gapY: 0,
      configHexagon,
      cells: [] as any
    }
  },
  methods: {
    pushCell (cell: any) {
      this.cells.push(cell)
    },
    getRow (index: number) {
      return Math.floor(index / this.gridWidth)
    },
    getCol (index: number) {
      return Math.floor(index % this.gridWidth)
    }
  },
  computed: {
    cellNumber (): number {
      return this.gridWidth * this.gridWidth
    }
  }
})
</script>

<style></style>
