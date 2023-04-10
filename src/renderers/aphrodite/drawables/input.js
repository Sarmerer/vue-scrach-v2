import { BlockInput } from '../../../types/block-input'
import { Constraints } from '../constraints'
import { Drawable } from './drawable'

export class Input extends Drawable {
  constructor(input) {
    super(input)

    this.groupWidth = 0
  }

  measure() {
    // this.width = this.measureWidth()
    // this.height = this.measureHeight()
    this.drawable.width = this.measureWidth()
    this.drawable.height = this.measureHeight()
  }

  measureWidth() {
    let width = Constraints.FieldPaddingX * 2

    if (this.drawable.fields.length > 1) {
      width += Constraints.FieldsGap * this.drawable.fields.length - 1
    }

    if (this.drawable.type == BlockInput.Value) {
      if (!this.drawable.block.isInline) {
        width += Constraints.RowSocketDepth
      } else if (this.drawable.connection.isConnected()) {
        const connection = this.drawable.connection.getTargetBlock()
        width += connection.width + Constraints.FieldsGap * 2
      } else {
        width += Constraints.EmptyInlineInputWidth + Constraints.FieldsGap * 2
      }
    }

    for (const field of this.drawable.fields) {
      width += field.width
    }

    return width
  }

  measureHeight() {
    let height = Constraints.MinInputHeight
    switch (this.drawable.type) {
      case BlockInput.Value:
        const target = this.drawable.connection?.getTargetBlock()
        if (!target) break

        height = target.height
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
