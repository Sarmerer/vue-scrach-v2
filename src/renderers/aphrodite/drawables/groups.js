import { BlockInput } from '../../../types/block-input'
import { Constraints } from '../constraints'
import { Drawable } from './drawable'

export class Groups extends Drawable {
  constructor(block) {
    super(block)
  }

  measure() {
    let widestInput = Constraints.MinInputWidth
    for (const input of this.drawable.inputs) {
      if (input.width < widestInput) continue

      widestInput = input.width
    }

    for (const input of this.drawable.inputs) {
      input.groupWidth = widestInput
    }
  }
}
