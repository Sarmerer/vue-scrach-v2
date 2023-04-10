import { BlockInput } from '../../../types/block-input'
import { Constraints } from '../constraints'
import { Drawable } from './drawable'

export class Block extends Drawable {
  constructor(block) {
    super(block)
  }

  measure() {
    this.drawable.width = this.measureWidth()
    this.drawable.height = this.measureHeight()
  }

  measureWidth() {
    if (!this.drawable.isInline) {
      return (
        this.drawable.inputs
          .map((i) => i.groupWidth)
          .sort((a, b) => b - a)[0] || 0
      )
    }

    let width = 0
    for (const input of this.drawable.inputs) {
      if (input.type !== BlockInput.Statement) {
        width += input.width
      }
    }

    return width
  }

  measureHeight() {
    let totalValuesHeight = 0
    let totalStatementsHeight = 0
    let maxInlineInputHeight = 0

    for (const input of this.drawable.inputs) {
      switch (input.type) {
        case BlockInput.Statement:
          totalStatementsHeight += input.height
          if (input.index === this.drawable.inputs.length - 1) {
            totalStatementsHeight += Constraints.StatementClosureHeight
          }
          break
        default:
          totalValuesHeight += input.height
          if (input.height > maxInlineInputHeight) {
            maxInlineInputHeight = input.height
          }
          break
      }
    }

    if (this.drawable.isInline) {
      return maxInlineInputHeight + totalStatementsHeight
    }

    if (
      this.drawable.hasNext() &&
      !this.drawable.nextConnection.isConnected()
    ) {
      totalValuesHeight += Constraints.StackSocketDepth
    }

    return totalValuesHeight + totalStatementsHeight
  }
}
