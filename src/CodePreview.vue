<template>
  <pre class="scratch__code-preview" v-text="code"></pre>
</template>

<script>
import { Scratch } from './types/scratch'

export default {
  name: 'ScratchCodePreview',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  computed: {
    code() {
      return this.scratch.generator.code
    },
  },
}
</script>

<style scoped>
.scratch__code-preview {
  flex: 0 0 200px;
  padding: 10px;
  background-color: ghostwhite;
  font-size: 12px;
  margin: 0;
  white-space: break-spaces;
}
</style>
