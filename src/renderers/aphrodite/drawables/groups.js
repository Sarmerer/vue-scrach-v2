import { BlockInput } from '../../../types/block-input'
import { Drawable } from './drawable'

export class Groups extends Drawable {
  constructor(block) {
    super(block)
  }

  measure() {
    const groups = this.getInputGroups()

    for (let i = 0; i < groups.length; i++) {
      let groupWidth = 0
      let totalWidth = 0
      for (const input of groups[i]) {
        totalWidth += input.width
        if (input.width < groupWidth) continue

        if (input.block.isInline) {
          groupWidth = totalWidth
        } else {
          groupWidth = input.width
        }
      }

      for (const input of groups[i]) {
        input.groupWidth = groupWidth
      }
    }
  }

  /** @returns {Array<Array<BlockInput>>} */
  getInputGroups() {
    if (this.drawable.isInline) return this.getInputGroupsInline()

    return this.drawable.inputs.reduce((acc, input) => {
      if (input.group > acc.length - 1) acc.push([])
      acc[acc.length - 1].push(input)
      return acc
    }, [])
  }

  getInputGroupsInline() {
    return this.drawable.inputs.reduce((acc, input) => {
      if (input.type == BlockInput.Statement) {
        acc.push([input])
        return acc
      }

      if (!acc.length) {
        acc.push([])
      }

      acc[0].push(input)
      return acc
    }, [])
  }
}
