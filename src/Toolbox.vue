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
        @click="setHoveredCategory(category)"
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

    <div v-show="hoveredCategoryOptions.length" class="toolbox__flyout">
      <button
        v-show="hoveredCategoryName == 'variables'"
        class="scratch__add-variable"
        @click="toolbox.addVariable()"
      >
        Add variable
      </button>

      <BlocksRenderer
        :scratch="toolbox"
        :blocks="hoveredCategoryOptions"
        :style="{ width: `${hoveredCategoryWidth}px` }"
        class="toolbox__options"
      >
        <template #blocks>
          <BlockDrawer
            v-for="block in hoveredCategoryOptions"
            :key="block.id"
            v-bind="{ block }"
            @mousedown.native.stop="
              toolbox.spawnBlock($event, block), setHoveredCategory(null)
            "
          />
        </template>
      </BlocksRenderer>
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
    hoveredCategoryOptions() {
      return this.hoveredCategory?.blocks || []
    },

    hoveredCategoryName() {
      return this.hoveredCategory?.name || ''
    },

    hoveredCategoryWidth() {
      return this.hoveredCategory?.width || 0
    },
  },

  created() {
    Object.assign(this.$options.components, {
      BlockDrawer: this.toolbox.renderer.BlockComponent,
      BlocksRenderer: this.toolbox.renderer.BlocksContainerComponent,
    })
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

.toolbox__options {
  position: relative;
  height: 100%;
  user-select: none;
}
</style>
