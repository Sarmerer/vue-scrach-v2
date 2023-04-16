<template>
  <component :is="renderer" v-bind="{ scratch }" />
</template>

<script>
import { Scratch } from './types/scratch'

import Aphrodite from './renderers/aphrodite/index.vue'
import Dionysus from './renderers/dionysus/index.vue'

export default {
  name: 'Scratch',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  computed: {
    renderer() {
      const renderers = {
        aphrodite: Aphrodite,
        dionysus: Dionysus,
      }

      return renderers[this.scratch.renderer.name] || Aphrodite
    },
  },
}
</script>
