<template>
  <div>
    <v-stage
      ref="stage"
      :config="configKonva"
      @dragstart="handleDragstart"
      @dragend="handleDragend"
    >
      <v-layer>
        <!-- <v-regular-polygon
          v-for="item in list"
          :key="item.id"
          :config="{
            x: item.x,
            y: item.y,
            rotation: item.rotation,
            id: item.id,
            numPoints: 5,
            innerRadius: 30,
            outerRadius: 50,
            fill: '#89b717',
            opacity: 0.8,
            draggable: true,
            scaleX: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            scaleY: dragItemId === item.id ? item.scale * 1.2 : item.scale,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffsetX: dragItemId === item.id ? 15 : 5,
            shadowOffsetY: dragItemId === item.id ? 15 : 5,
            shadowOpacity: 0.6
          }"
        ></v-regular-polygon> -->
        <!-- <v-circle :config="configCircle"></v-circle>
        <v-regular-polygon :config="configHexagon"></v-regular-polygon> -->
        <Grid></Grid>
      </v-layer>
    </v-stage>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */

import { defineComponent } from '@vue/runtime-core'
import Grid from './Grid.vue'

const width = window.innerWidth
const height = window.innerHeight
export default defineComponent({
  name: 'Main',
  components: { Grid },
  data () {
    return {
      list: [] as any,
      dragItemId: null,
      configKonva: {
        width: width,
        height: height
      },
      configCircle: {
        x: 100,
        y: 100,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      },
      configHexagon: {
        x: 100,
        y: 150,
        sides: 6,
        radius: 70,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 4
      }
    }
  },
  methods: {
    handleDragstart (e: any) {
      // save drag element:
      this.dragItemId = e.target.id()
      // move current element to the top:
      const item = this.list.find((i: any) => i.id === this.dragItemId)
      const index = this.list.indexOf(item)
      this.list.splice(index, 1)
      this.list.push(item)
    },
    handleDragend (e: any) {
      this.dragItemId = null
    }
  },
  mounted () {
    for (let n = 0; n < 3; n++) {
      this.list.push({
        id: Math.round(Math.random() * 10000).toString(),
        x: Math.random() * width,
        y: Math.random() * height,
        rotation: Math.random() * 180,
        scale: Math.random()
      })
    }
  }
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
