<template>
  <button @click="$store.state.move = !$store.state.move">Start/stop</button>
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
      numParticles: 100,
      gridWidth: 15,
      graphicalMode: true,
      loading: true,
      readyCount: 0
    }
  },
  methods: {
    onReady () {
      this.readyCount++
      if (this.readyCount === this.gridWidth * this.gridWidth) {
        this.loading = false
        this.createParticles()
        run()
      }
    },
    lightUpCell () {
      this.$store.commit('selectPoint', {
        x: this.x,
        y: this.y
      })
    },
    createParticles () {
      //eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;[...Array(this.numParticles)].forEach(_i => {
        this.$store.commit('pushParticle', {
          id: uuidv4(),
          color: this.getRandomColor(),
          //state: 'contracted',
          currentRow: this.getRandomRow(),
          currentCol: this.getRandomCol()
        } as IParticle)
      })

      //this.testParticles().forEach(p => this.$store.commit('pushParticle', p))
    },
    testParticles () {
      return [
        {
          id: uuidv4(),
          color: this.getRandomColor(),
          currentRow: 2,
          currentCol: 7
        },
        {
          id: uuidv4(),
          color: this.getRandomColor(),
          currentRow: 3,
          currentCol: 8
        },
        {
          id: uuidv4(),
          color: this.getRandomColor(),
          currentRow: 4,
          currentCol: 7
        },
        {
          id: uuidv4(),
          color: this.getRandomColor(),
          currentRow: 3,
          currentCol: 7
        }
      ] as IParticle[]
    },
    getRandomRow () {
      return Math.floor(
        Math.random() * 2 * Math.floor(this.gridWidth * 0.66666) + 4
      )
    },
    getRandomCol () {
      return Math.floor(
        Math.random() * 2 * Math.floor(this.gridWidth * 0.66666) + 6
      )
    },
    getRandomColor () {
      const colors = ['yellow', 'red', 'blue', 'green']
      return colors[Math.floor(Math.random() * colors.length)]
    }
  },
  computed: {
    ...mapState(['cells', 'particles'])
  }
})
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
