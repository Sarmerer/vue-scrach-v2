<template>
  <div id="app">
    <Scratch v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch as ScratchLogic } from './types/scratch'
import Scratch from './components/Scratch.vue'

export default {
  name: 'App',

  components: { Scratch },

  data() {
    return {
      scratch: new ScratchLogic(),
    }
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
</style>
