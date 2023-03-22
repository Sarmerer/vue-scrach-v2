import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'
import { Drawer } from '../../types/block-drawer'
import { Constraints } from './constraints'

export class AphroditeDrawer extends Drawer {
  /** @param {Block} block */
  constructor(block, renderer) {
    super(block, renderer)

    this.path = ''
    this.groupsWidth = []
    this.inputsHeight = []
  }

  getHeight() {
    return this.inputsHeight.reduce((acc, i) => acc + i, 0)
  }

  getStackHeight(head) {
    let next = this.renderer.getDrawer(head)
    if (!next) return 0

    let height = 0
    while (next) {
      height += next.getHeight()
      next = this.renderer.getDrawer(
        next.block.nextConnection?.getTargetBlock()
      )
    }

    return height
  }

  update() {
    this.inputsHeight = []

    for (let i = 0; i < this.getInputGroups().length; i++) {
      this.groupsWidth.push(this.getGroupWidth(i))
    }

    const path = ['m 0 0', ...this.getTop()]

    for (const input of this.block.inputs) {
      path.push(...this.getInput(input))
    }

    path.push(...this.getBottom(), ...this.getOutput(), 'z')

    this.path = path.join(' ')

    this.updateRelatives()
    this.updateFast()
  }

  updateFast() {
    const { x: absX, y: absY } = this.block

    if (this.block.previousConnection) {
      this.block.previousConnection.position.moveTo(absX, absY)
    }

    if (this.block.nextConnection) {
      this.block.nextConnection.position.moveTo(absX, absY + this.getHeight())
    }
  }

  updateRelatives() {
    this.alignStack()
    for (const input of this.block.inputs) {
      this.alignInput(input)
    }
  }

  alignStack() {
    let prev = this
    let next = this.renderer.getDrawer(
      this.block.nextConnection?.getTargetBlock()
    )
    while (next) {
      next.block.y = prev.getHeight()
      next.block.x = 0

      prev = next
      next = this.renderer.getDrawer(
        next.block.nextConnection?.getTargetBlock()
      )
    }
  }

  alignInput(input) {
    const y = this.inputsHeight
      .slice(0, input.index)
      .reduce((acc, h) => acc + h, 0)

    const x =
      input.type == BlockInput.Statement
        ? Constraints.StatementBarWidth
        : this.getGroupWidth(input.group)

    let next = input.connection?.getTargetBlock()
    while (next) {
      next.y = y
      next.x = x
      next = next.connection?.getTargetBlock()
    }
  }

  getTop() {
    const width = this.getGroupWidth(0)

    if (!this.block.hasPrev()) {
      return [`h ${width}`]
    }

    const remainder =
      width - Constraints.StackSocketOffset - Constraints.StackSocketWidth
    return [...Constraints.GetStackSocket(), `h ${remainder}`]
  }

  getBottom() {
    if (!this.block.hasNext()) {
      return [`H 0`]
    }

    const remainder =
      Constraints.StackSocketOffset + Constraints.StackSocketWidth
    return [`H ${remainder}`, ...Constraints.GetStackNotch()]
  }

  getInput(input) {
    switch (input.type) {
      case BlockInput.Statement:
        return this.getStatement(input)
      case BlockInput.Value:
        return this.getValue(input)
      default:
        return this.getDummy()
    }
  }

  getDummy() {
    this.inputsHeight.push(Constraints.MinInputHeight)
    return [`v ${Constraints.MinInputHeight}`]
  }

  getValue(input) {
    let height = Constraints.MinInputHeight

    const drawer = this.renderer.getDrawer(input.connection?.getTargetBlock())
    if (drawer) {
      height = drawer.getHeight()
    }

    this.inputsHeight.push(height)
    const remainder =
      height - Constraints.RowSocketOffset - Constraints.RowSocketHeight
    return [...Constraints.GetRowSocket(), `v ${remainder}`]
  }

  getStatement(input) {
    const width = this.getGroupWidth(input.group)
    let height = Math.max(
      Constraints.MinInputWidth,
      this.getStackHeight(input.connection?.getTargetBlock()) + 5
    )

    const path = [
      `H ${Constraints.StatementBarWidth}`,
      `v ${height}`,
      `H ${Constraints.StatementBarWidth + width}`,
    ]

    if (input.index == this.block.inputs.length - 1) {
      height += Constraints.StatementClosureHeight
      path.push(`v ${Constraints.StatementClosureHeight}`)
    }

    this.inputsHeight.push(height)
    return path
  }

  getOutput() {
    const height = this.getHeight()
    if (!this.block.hasOutput()) return []

    const remainder =
      Constraints.RowSocketHeight + Constraints.RowSocketOffset - height

    return [`v ${remainder}`, ...Constraints.GetRowNotch()]
  }

  getGroupWidth(group) {
    const groups = this.getInputGroups()
    if (group < 0 || group >= groups.length) {
      return Constraints.MinInputWidth
    }

    if (group < this.groupsWidth.length - 1) {
      return this.groupsWidth[group]
    }

    let maxWidth = Constraints.MinInputWidth
    for (const input of groups[group]) {
      let inputWidth = 0
      for (const field of input.fields) {
        inputWidth += this.getStringWidth(field.value || field.placeholder)
      }

      if (inputWidth > maxWidth) {
        maxWidth = inputWidth
      }
    }

    return maxWidth + Constraints.InputPadding
  }

  getStringWidth(string) {
    if (typeof string !== 'string' || string == '') return 0

    const pseudo = document.createElement('div')
    pseudo.appendChild(document.createTextNode(string))
    pseudo.style.font = 'normal 11pt sans-serif'
    pseudo.style.position = 'absolute'
    pseudo.style.visibility = 'hidden'
    pseudo.style.whiteSpace = 'nowrap'
    document.body.appendChild(pseudo)

    const width = pseudo.getBoundingClientRect().width
    pseudo.remove()

    return width
  }
}
