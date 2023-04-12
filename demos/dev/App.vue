<template>
  <div id="app">
    <ScratchRenderer v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from '../../src/types/scratch'

import ScratchRenderer from '../../src/index.vue'

export default {
  name: 'App',

  components: { ScratchRenderer },

  data() {
    return {
      scratch: new Scratch(),
    }
  },

  created() {
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
