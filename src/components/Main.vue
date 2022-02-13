<template>
  <v-stage v-if="graphicalMode || loading" ref="stage" :config="configKonva">
    <v-layer>
      <Grid @ready="onReady" ref="grid" :gridWidth="gridWidth"></Grid>
    </v-layer>
    <v-layer>
      <Particle
        v-for="particle in particles"
        :key="'particle-' + particle.id"
        :particle="particle"
      ></Particle>
    </v-layer>
  </v-stage>
  <textarea
    style="position: absolute; left: 70%; top: 10%; right: 1%"
    rows="40"
    cols="30"
    :value="jsonLogs"
  ></textarea>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from 'uuid'

import { IParticle } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { mapState } from 'vuex'
import Grid from './Grid.vue'
import Particle from './Particle.vue'
import { run } from '@/scheduler'

const width = window.innerWidth
const height = window.innerHeight
export default defineComponent({
  name: 'Main',
  components: { Grid, Particle },
  created () {
    //this.createParticles()
    //run()
  },
  data () {
    return {
      configKonva: {
        width: width,
        height: height
      },
      x: 0,
      y: 0,
      result: 0,
      // numParticles: 60,
      // gridWidth: 15,
      graphicalMode: true,
      loading: true,
      readyCount: 0
      // maxRuns: 2
    }
  },
  methods: {
    async onReady () {
      console.log('ready')
      this.readyCount++

      if (this.readyCount === this.gridWidth * this.gridWidth) {
        // grid finished rendering; we now have the coordinates of all cells
        await run()
      }
    }
  },
  computed: {
    ...mapState(['cells', 'particles', 'gridWidth', 'logs']),
    jsonLogs () {
      return JSON.stringify(this.$store.state.logs as unknown[])
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
