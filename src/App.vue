<template>
  <div id="app">
    <Scratch />
  </div>
</template>

<script>
import Scratch from './components/Scratch.vue'

export default {
  name: 'App',

  components: { Scratch },
}
</script>

<style lang="scss" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
