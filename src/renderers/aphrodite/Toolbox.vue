<template>
  <div class="scratch__toolbox">
    <div class="toolbox__categories">
      <div
        v-for="category in categories"
        :key="category.name"
        class="toolbox__category"
        @click="setActiveCategory(category)"
      >
        <div class="toolbox__category__header">
          <div class="toolbox__category__label">
            <div
              class="toolbox__category__marker"
              :style="{ backgroundColor: category.background }"
            ></div>
            <label v-text="category.name"></label>
          </div>
          <i
            v-if="activeCategoryName == category.name"
            class="fas fa-angle-up"
          ></i>
          <i v-else class="fas fa-angle-down"></i>
        </div>

        <div v-if="activeCategoryName == category.name" class="toolbox__flyout">
          <button
            v-show="activeCategoryName == 'Variables'"
            class="scratch__add-variable"
            @click="createVariable"
          >
            Add variable
          </button>

          <div class="toolbox__items">
            <AphroditeBlocks
              :style="activeCategorySize"
              v-bind="{ scratch: renderer }"
            >
              <BlockRenderer
                v-for="block in rendererBlocks"
                :key="block.id"
                v-bind="{ block }"
                @mousedown.native.stop="spawnBlock($event, block)"
              />
            </AphroditeBlocks>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Scratch } from '../../types/scratch'

import BlockRenderer from './Block.vue'

const BLOCKS_MARGIN_TOP = 25
const BLOCKS_MARGIN_LEFT = 50

export default {
  props: {
    scratch: {
      type: Scratch,
      requited: true,
    },

    categories: {
      type: Array,
      required: true,
    },
  },

  components: {
    AphroditeBlocks: () => import('./Blocks.vue'),
    BlockRenderer,
  },

  data() {
    return {
      renderer: null,
      activeCategory: null,
    }
  },

  computed: {
    rendererBlocks() {
      return this.renderer?.blocks || []
    },

    activeCategoryName() {
      return this.activeCategory?.name || ''
    },

    activeCategorySize() {
      const blocks = this.renderer.blocks
      const width = this.getWidestBlock(blocks) + BLOCKS_MARGIN_LEFT
      const height =
        this.getTotalBlocksHeight(blocks) +
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
        this.initCategory(category)
      } else {
        this.renderer = null
      }

      this.activeCategory = category
    },

    initCategory(category) {
      const renderer = new Scratch()
      const blocks = Array.isArray(category.blocks) ? category.blocks : []
      let offsetTop = BLOCKS_MARGIN_TOP

      for (const type of blocks) {
        const block = renderer.spawnBlock(type, BLOCKS_MARGIN_TOP, offsetTop)
        if (!block) continue

        block.freeze()
        offsetTop += block.height + BLOCKS_MARGIN_TOP
      }

      this.renderer = renderer
    },

    createVariable() {
      const name = prompt('Enter a name for a variable')
      if (!name?.length) return

      this.scratch.addVariable(name)
    },

    spawnBlock(event, block) {
      event = this.scratch.normalizeMouseEvent(event)
      block = this.scratch.spawnBlock(block.type, event.clientX, event.clientY)

      block.dragStart(event)
    },

    getWidestBlock(blocks) {
      return blocks.reduce((acc, block) => {
        return acc > block.width ? acc : block.width
      }, 0)
    },

    getTotalBlocksHeight(blocks) {
      return blocks.reduce((acc, block) => acc + block.height, 0)
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
  border-right: 1px solid #e7e8ea;
  overflow-y: scroll;
}

.toolbox__category {
  position: relative;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e7e8ea;
}

.toolbox__category__header {
  height: 46px;
  min-width: 260px;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.toolbox__category__label {
  display: flex;
  align-items: center;
  gap: 12px;

  font-family: 'Noto Sans';
  font-weight: 600;
  font-size: 16px;
  color: #11142d;
}

.toolbox__category__marker {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.scratch__add-variable {
  align-self: stretch;
  margin: 10px 10px 0 10px;
}

.toolbox__flyout {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  border-right: 1px solid #e7e8ea;
  background-color: white;
}
</style>
