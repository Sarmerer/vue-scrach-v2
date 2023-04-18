<template>
  <div id="app">
    <ScratchRenderer v-bind="{ scratch }" />
  </div>
</template>

<script>
import { Scratch } from '../../src/types/scratch'
import toolbox from '../../toolboxes/scripting'

import ScratchRenderer from '../../src/index.vue'

export default {
  name: 'App',

  components: { ScratchRenderer },

  data() {
    return {
      scratch: null,
    }
  },

  created() {
    this.scratch = new Scratch()
    this.scratch.setToolbox(toolbox)

    this.scratch.events.addEventsListener(
      [
        Scratch.Events.BLOCK_CHANGE,
        Scratch.Events.BLOCK_DRAG,
        Scratch.Events.BLOCK_MOVE,
      ],
      this.save
    )
  },

  mounted() {
    const s = this.scratch.spawnBlock('strings:print', 100, 200)
    const s1 = this.scratch.spawnBlock('strings:print', 100, 200)
    s.nextConnection.connect(s1.previousConnection)

    const l = this.scratch.spawnBlock('lists:new', 200, 200)
    const l2 = this.scratch.spawnBlock('math:operation', 200, 200)
    l.inputs[0].connection.connect(l2.outputConnection)

    const p = this.scratch.spawnBlock('loops:repeat', 100, 100)
    p.inputs[0].connection.connect(l.outputConnection)
    p.inputs[1].connection.connect(s.previousConnection)
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
