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
      return width
    }

    if (!this.drawable.block.isInline) {
      return width + Constraints.RowSocketDepth
    }

    if (!this.drawable.connection.isConnected()) {
      return width + Constraints.EmptyInlineInputWidth
    }

    const connection = this.drawable.connection.getTargetBlock()
    return width + connection.width
  }

  measureHeight() {
    let height = Constraints.MinInputHeight
    switch (this.drawable.type) {
      case BlockInput.Value:
        height = 0
        if (this.drawable.block.isInline) {
          height += Constraints.FieldPaddingY * 2
        }

        const target = this.drawable.connection?.getTargetBlock()
        if (!target) {
          height = Constraints.MinInputHeight
          break
        }

        height += target.height
        break
      case BlockInput.Statement:
        let curr = this.drawable?.connection?.getTargetBlock()
        let stackHeight = 0
        while (curr) {
          stackHeight += curr.height

          const next = curr.nextConnection?.getTargetBlock()
          if (!next) break

          curr = next
        }

        height = Math.max(Constraints.MinInputWidth, stackHeight)
        break
    }

    return height
  }
}
