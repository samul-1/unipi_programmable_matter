<template>
  <v-regular-polygon :config="config"></v-regular-polygon>
  <v-line :config="horizontalLineConfig"></v-line>
  <v-line :config="diag1LineConfig"></v-line>
  <v-line :config="diag2LineConfig"></v-line>
  <v-line :config="overflowXLineConfig"></v-line>
  <!-- <v-text
    v-for="point in actionablePoints"
    :key="index + '-p-' + point.gridCol + '-' + point.gridRow"
    :config="{
      text: '(' + point.gridRow + ', ' + point.gridCol + ')',
      fontSize: 7,
      x: point.x,
      y: point.y
    }"
  /> -->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-constant-condition */

import {
  configHexagon,
  getHexagonApothem,
  getHexagonXOffset,
  HORIZONTAL_PARTICLE_OFFSET
} from '@/shapes'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
export default defineComponent({
  name: 'GridCell',
  props: {
    index: {
      type: Number,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      required: true
    },
    gridWidth: {
      type: Number,
      required: true
    }
  },
  mounted () {
    this.$store.commit('pushGridPoints', this.actionablePoints)
    this.$emit('ready')
  },
  methods: {},
  computed: {
    config () {
      return { ...configHexagon, x: this.x, y: this.y, strokeWidth: 0.6 }
    },
    horizontalLineConfig () {
      return {
        points: [this.x - this.radius, this.y, this.x + this.radius, this.y],
        stroke: 'black',
        strokeWidth: 0.5
      }
    },
    verticalLineConfig () {
      return {
        points: [this.x, this.y - this.apothem, this.x, this.y + this.apothem],
        stroke: 'black',
        strokeWidth: 0.4
      }
    },
    diag1LineConfig () {
      return {
        points: [
          this.x - this.radius + this.xOffset,
          this.y - this.apothem,
          this.x + this.radius - this.xOffset,
          this.y + this.apothem
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    },
    diag2LineConfig () {
      return {
        points: [
          this.x + this.radius - this.xOffset,
          this.y - this.apothem,
          this.x - this.radius + this.xOffset,
          this.y + this.apothem
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    },
    overflowXLineConfig () {
      return {
        points: [
          this.x + this.radius + this.xOffset,
          this.y + this.apothem,
          this.x,
          this.y + this.apothem
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    },
    actionablePoints () {
      // the vertices and center point
      return [
        // top left
        ...(this.row == 0
          ? [
              {
                // top left
                x: this.x - this.xOffset,
                y: this.y - this.apothem,
                gridCol: this.precedingPointsX,
                gridRow: this.precedingPointsY
              }
            ]
          : []),
        ...(true || this.row == 0
          ? [
              {
                // top right
                x: this.x + this.xOffset,
                y: this.y - this.apothem,
                gridCol: this.precedingPointsX + 1,
                gridRow: this.precedingPointsY
              }
            ]
          : []),
        {
          // center left
          x: this.x - this.apothem - HORIZONTAL_PARTICLE_OFFSET,
          y: this.y,
          gridCol: this.precedingPointsX,
          gridRow: this.precedingPointsY + 1
        },
        {
          //center
          x: this.x,
          y: this.y,
          gridCol: this.precedingPointsX + 1,
          gridRow: this.precedingPointsY + 1
        },
        {
          // center right
          x: this.x + this.apothem + HORIZONTAL_PARTICLE_OFFSET,
          y: this.y,
          gridCol: this.precedingPointsX + 2,
          gridRow: this.precedingPointsY + 1
        },
        {
          // bottom left
          x: this.x - this.xOffset,
          y: this.y + this.apothem,
          gridCol: this.precedingPointsX,
          gridRow: this.precedingPointsY + 2
        },
        ...(this.row == this.gridWidth - 1
          ? [
              {
                // bottom right
                x: this.x + this.xOffset,
                y: this.y + this.apothem,
                gridCol: this.precedingPointsX + 1,
                gridRow: this.precedingPointsY + 2
              }
            ]
          : [])
      ]
    },
    radius () {
      return this.config.radius
    },
    apothem () {
      return getHexagonApothem(this.radius)
    },
    xOffset () {
      return getHexagonXOffset(this.radius)
    },
    precedingPointsX () {
      return 2 * this.col
    },
    precedingPointsY () {
      return 2 * this.row
    }
  }
})
</script>

<style></style>
