<template>
  <div class="scratch-wrapper">
    <Toolbox v-bind="{ scratch, categories }" />
    <ScratchRenderer v-bind="{ scratch }" />
    <CodePreview v-bind="{ code }" />
  </div>
</template>

<script>
import fields_ from '../../blocks/sql/fields'
import functions_ from '../../blocks/sql/functions'
import loops_ from '../../blocks/sql/loops'
import queries_ from '../../blocks/sql/queries'
import variables_ from '../../blocks/sql/variables'

import mixins from './mixins'
import ScratchRenderer from '../../src/index.vue'
import Toolbox from '../../src/renderers/aphrodite/Toolbox.vue'
import CodePreview from '../../src/renderers/common/CodePreview.vue'

export default {
  mixins: [mixins],

  components: {
    Toolbox,
    CodePreview,
    ScratchRenderer,
  },

  computed: {
    categories() {
      const modules = {
        Data: queries_,
        Fields: fields_,
        Functions: functions_,
        Loops: loops_,
        Variables: variables_,
      }

      const categories = this.mapModulesToCategories(modules)
      return categories
    },

    code() {
      if (!this.scratch?.generator) return ''

      return this.scratch.generator.code
    },
  },

  methods: {
    onInit(scratch) {
      this.$emit('init', scratch)
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  border: 1px solid #e7e8ea;
}
</style>
