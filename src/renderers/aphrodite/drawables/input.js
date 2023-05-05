import { BlockInput } from '../../../types/block-input'
import { Constraints } from '../constraints'
import { Drawable } from './drawable'

export class Input extends Drawable {
  constructor(input) {
    super(input)
  }

  measure() {
    this.drawable.width = this.measureWidth()
    this.drawable.height = this.measureHeight()
  }

  measureWidth() {
    let width = Constraints.FieldPaddingX * 2

    if (this.drawable.fields.length > 1) {
      width += Constraints.FieldsGap * this.drawable.fields.length - 1
    }

    for (const field of this.drawable.fields) {
      width += field.width
    }

    if (this.drawable.type !== BlockInput.Value) {
      return Math.max(width, Constraints.MinInputWidth)
    }

    if (!this.drawable.block.isInline) {
      return width + Constraints.RowSocketDepth
    }

    if (!this.drawable.connection.isConnected()) {
      return width + Constraints.EmptyInlineInputWidth
    }

    let target = this.drawable.connection.getTargetBlock()
    return width + target.width + Constraints.RowSocketDepth
  }

  measureHeight() {
    switch (this.drawable.type) {
      case BlockInput.Value:
        return this.measureValueHeight()
      case BlockInput.Statement:
        return this.measureStatementHeight()
      default:
        return Constraints.MinInputHeight
    }
  }

  measureValueHeight() {
    let height = 0
    if (this.drawable.block.isInline) {
      height += Constraints.FieldPaddingY * 2
    }

    const target = this.drawable.connection?.getTargetBlock()
    if (!target) {
      return Constraints.MinInputHeight
    }

    return height + target.height
  }

  measureStatementHeight() {
    let curr = this.drawable?.connection?.getTargetBlock()
    let stackHeight = 0
    while (curr) {
      stackHeight += curr.height

      const next = curr.nextConnection?.getTargetBlock()
      if (!next) break

      curr = next
    }

    return Math.max(Constraints.MinInputHeight, stackHeight)
  }
}
