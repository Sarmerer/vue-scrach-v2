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
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

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
