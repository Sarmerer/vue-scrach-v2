<template>
  <div class="scratch__toolbox">
    <div class="toolbox__content">
      <div class="toolbox_preset">
        <label class="toolbox_preset__label">Preset:</label>
        <select
          class="toolbox_preset__select"
          :value="toolbox.preset"
          @change="toolbox.setPreset($event.target.value)"
        >
          <option
            v-for="preset in toolbox.getAvailablePresets()"
            :value="preset.name"
            v-text="preset.name"
          ></option>
        </select>
      </div>
      <div
        v-for="(category, name) in toolbox.categories"
        :key="name"
        class="toolbox__category"
        @click="setHoveredCategory(name)"
      >
        <div
          class="toolbox__category__name"
          :style="{
            backgroundColor: category.background,
            color: category.text,
          }"
          v-text="name"
        ></div>
      </div>
    </div>

    <div v-show="options.length" class="toolbox__flyout">
      <button
        v-show="hoveredCategory == 'variables'"
        class="scratch__add-variable"
        @click="toolbox.addVariable()"
      >
        Add variable
      </button>

      <div
        class="toolbox__option"
        v-for="drawer in options"
        :key="drawer.block.id"
        @mousedown.stop="
          toolbox.spawnBlock($event, drawer.block), setHoveredCategory(null)
        "
      >
        <BlockRenderer
          class="toolbox__block"
          v-bind="{ drawer }"
          :style="{ position: 'relative' }"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Scratch } from './types/scratch'
import { Toolbox } from './types/toolbox'

export default {
  name: 'ScratchToolbox',

  props: {
    scratch: {
      type: Scratch,
      required: true,
    },
  },

  data() {
    return {
      toolbox: new Toolbox(this.scratch),
      hoveredCategory: null,
    }
  },

  computed: {
    options() {
      return this.toolbox.categories[this.hoveredCategory]?.blocks || []
    },
  },

  created() {
    this.$options.components.BlockRenderer =
      this.scratch.renderer.BlockComponent
  },

  methods: {
    setHoveredCategory(category) {
      if (this.hoveredCategory == category) category = null
      this.hoveredCategory = category
    },
  },
}
</script>

<style lang="scss" scoped>
.scratch__toolbox {
  position: relative;
  flex: 0 0 auto;
  display: flex;
  border-right: 1px solid grey;
  overflow-y: auto;
}

.toolbox__content {
  border-right: 1px solid grey;
}

.toolbox_preset {
  margin: 10px 10px;

  .toolbox_preset__label {
    margin-right: 10px;
  }
}

.scratch__add-variable {
  margin: 10px 10px 0 10px;
}

.toolbox__category__name {
  user-select: none;
  background-color: lightgrey;
  padding: 5px 10px;
}

.toolbox__option {
  position: relative;
  height: fit-content;
  user-select: none;
  padding: 10px 10px;
}

.toolbox__block {
  pointer-events: none;
  z-index: 0;
}
</style>
