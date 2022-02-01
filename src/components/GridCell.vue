<template>
  <v-regular-polygon :config="config"></v-regular-polygon>
  <v-line :config="horizontalLineConfig"></v-line>
  <v-line :config="diag1LineConfig"></v-line>
  <v-line :config="diag2LineConfig"></v-line>
  <v-line :config="overflowXLineConfig"></v-line>

  <!-- <v-circle
    v-for="point in actionablePoints"
    :key="'act-pt-' + point.x + '-' + point.y"
    :config="{
      x: point.x,
      y: point.y,
      radius: 16,
      fill: getFillColor(point)
    }"
  ></v-circle> -->
  <!-- <v-text
    :config="{
      text: '(' + row + ', ' + col + ')',
      fontSize: 15,
      x: config.x,
      y: config.y
    }"
  /> -->

  <!-- <v-line :config="verticalLineConfig"></v-line> -->
  <!-- <v-line :config="overflowYLineConfig"></v-line> -->
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  configHexagon,
  getHexagonApothem,
  getHexagonSide,
  getHexagonXOffset
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
  data () {
    return {
      //fillColor: 'yellow'
    }
  },
  mounted () {
    this.$store.commit('pushGridPoints', this.actionablePoints)
  },
  methods: {
    getRandomColor () {
      return ['yellow', 'red', 'blue', 'green', 'purple', 'pink', 'orange'][
        0 ?? Math.floor(Math.random() * 7)
      ]
    },
    getFillColor (p: any) {
      return p.gridCol == this.selectedPoint.x &&
        p.gridRow == this.selectedPoint.y
        ? 'red'
        : 'yellow'
    }
  },
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
    overflowYLineConfig () {
      return {
        points: [
          this.x + this.radius,
          this.y,
          this.x + this.radius,
          this.y + this.apothem + 2 * this.xOffset
        ],
        stroke: 'black',
        strokeWidth: 0.3
      }
    },
    actionablePoints () {
      // the vertices and center point
      return [
        {
          // top left
          x: this.x - this.xOffset,
          y: this.y - this.apothem,
          gridCol: this.precedingPointsX,
          gridRow: this.precedingPointsY
        },
        {
          // top right
          x: this.x + this.xOffset,
          y: this.y - this.apothem,
          gridCol: this.precedingPointsX + 1,
          gridRow: this.precedingPointsY
        },
        {
          // center left
          x: this.x - this.apothem - 9,
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
          x: this.x + this.apothem + 9,
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
        {
          // bottom right
          x: this.x + this.xOffset,
          y: this.y + this.apothem,
          gridCol: this.precedingPointsX + 2,
          gridRow: this.precedingPointsY + 2
        }
      ]
    },
    selectedActionablePoint () {
      return this.actionablePoints.findIndex(
        p =>
          p.gridCol == this.selectedPoint.x && p.gridRow == this.selectedPoint.y
      )
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
    },
    ...mapState(['selectedPoint'])
  }
})
</script>

<style></style>
