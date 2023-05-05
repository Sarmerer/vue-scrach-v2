import { Scratch } from '../../src/types/scratch'

export default {
  data() {
    return {
      scratch: null,
      didInit: false,
    }
  },

  async created() {
    const scratch = new Scratch()

    this.onInit(scratch)
    this.scratch = scratch
    this.didInit = true
  },

  methods: {
    onInit(scratch) {},

    mapModulesToCategories(modules) {
      const categories = []
      for (const [name, module] of Object.entries(modules)) {
        categories.push({
          name,
          blocks: Object.keys(module.blocks),
          background: module.style?.background,
          text: module.style?.text,
        })
      }

      return categories
    },
  },
}
