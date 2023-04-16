<template>
  <div class="scratch__toolbox">
    <div class="toolbox__categories">
      <div
        v-for="category in toolbox.categories"
        :key="category.name"
        class="toolbox__category"
        @click="setActiveCategory(category)"
      >
        <div
          class="toolbox__category__name"
          :style="{
            backgroundColor: category.background,
            color: category.text,
          }"
          v-text="category.name"
        ></div>
      </div>
    </div>

    <div v-if="scratch" class="toolbox__flyout">
      <!-- v-show="activeCategoryName == 'variables'" -->
      <button class="scratch__add-variable" @click="toolbox.addVariable">
        Add variable
      </button>

      <div class="toolbox__items">
        <AphroditeBlocks :style="activeCategorySize" v-bind="{ scratch }">
          <BlockRenderer
            v-for="block in activeCategoryBlocks"
            :key="block.id"
            v-bind="{ block }"
            @mousedown.native.stop="toolbox.spawnBlock($event, block)"
          />
        </AphroditeBlocks>
      </div>
    </div>
  </div>
</template>

<script>
import { Block } from '../../types/block'
import { Scratch } from '../../types/scratch'
import { Toolbox } from '../../types/toolbox'

import BlockRenderer from './Block.vue'

const BLOCKS_MARGIN_TOP = 25
const BLOCKS_MARGIN_LEFT = 50

export default {
  props: {
    toolbox: {
      type: Toolbox,
      required: true,
    },
  },

  components: {
    AphroditeBlocks: () => import('./Blocks.vue'),
    BlockRenderer,
  },

  data() {
    return {
      scratch: null,
      activeCategory: null,
    }
  },

  computed: {
    activeCategoryBlocks() {
      if (!this.activeCategory?.blocks) {
        return []
      }

      let offsetTop = BLOCKS_MARGIN_TOP
      return Object.values(this.activeCategory.blocks).map((factory) => {
        const block = new Block(this.scratch)
        factory(block)
        block.position.moveTo(BLOCKS_MARGIN_TOP, offsetTop)
        block.freeze()
        this.scratch.addBlock(block)
        offsetTop += block.height + BLOCKS_MARGIN_TOP

        return block
      })
    },

    activeCategoryName() {
      return this.activeCategory?.name || ''
    },

    activeCategorySize() {
      const blocks = this.activeCategoryBlocks
      const width = this.toolbox.getWidestBlock(blocks) + BLOCKS_MARGIN_LEFT
      const height =
        this.toolbox.getTotalBlocksHeight(blocks) +
        BLOCKS_MARGIN_TOP * (blocks.length + 1)

      return { width: `${width}px`, height: `${height}px` }
    },
  },

  methods: {
    setActiveCategory(category) {
      if (this.activeCategory == category) {
        category = null
      }

      if (category) {
        this.scratch = new Scratch()
      } else {
        this.scratch = null
      }

      this.activeCategory = category
    },
  },
}
</script>

<style scoped>
.scratch__toolbox {
  position: relative;
  flex: 1 0 auto;
  display: flex;
}

.toolbox__categories {
  height: 100%;
  border-right: 1px solid grey;
}

.toolbox__category__name {
  user-select: none;
  background-color: lightgrey;
  padding: 5px 10px;
}

.scratch__add-variable {
  align-self: stretch;
  margin: 10px 10px 0 10px;
}

.toolbox__flyout {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid grey;
}
</style>
