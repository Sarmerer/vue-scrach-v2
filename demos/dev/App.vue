<template>
  <div id="app">
    <CodePreview v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from '../../src/types/scratch'

import CodePreview from './CodePreview.vue'
import BlockPreview from './BlockPreview.vue'

export default {
  name: 'App',

  components: { CodePreview, BlockPreview },

  data() {
    return {
      scratch: null,
    }
  },

  created() {
    this.scratch = new Scratch()

    this.scratch.events.addEventsListener(
      [
        Scratch.Events.BLOCK_CHANGE,
        Scratch.Events.BLOCK_DRAG,
        Scratch.Events.BLOCK_MOVE,
      ],
      this.save
    )
  },

  methods: {
    save() {
      localStorage.setItem('scratch', JSON.stringify(this.scratch.toJSON()))
    },
  },
}
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 80%;
  height: 80%;
  border: 1px solid red;
}
</style>
