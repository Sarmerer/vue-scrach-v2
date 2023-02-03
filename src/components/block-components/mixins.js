import { mapState } from 'vuex'
import { Block } from '../../types/block'
import { BlockComponent } from '../../types/block-component'

export const props = {
  block: { type: Block },
  component: { type: BlockComponent },
}

export const computed = {
  ...mapState(['scratch']),

  template() {
    return this.block.template
  },

  componentStyle() {
    const isActive = this.block.isActive

    return {
      backgroundColor: this.template.colors.background,
      color: this.template.colors.text,
    }
  },
}

export default { props, computed }
