import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'
import { Drawer } from '../../types/block-drawer'

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

    const path = ['m 0 0', this.getTop()]

    for (const input of this.block.inputs) {
      path.push(this.getInput(input))
    }

    path.push(this.getBottom(), this.getOutput(), 'z')

    this.path = path.join(' ')
    this.align()
  }

  align() {
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
      input.type == BlockInput.Statement ? 20 : this.getGroupWidth(input.group)

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
      return `h ${width}`
    }

    const socketOffset = 10
    const socketWidth = 15
    const remainder = width - socketOffset - socketWidth
    return `h ${socketOffset} v 5 h ${socketWidth} v -5 h ${remainder}`
  }

  getBottom() {
    if (!this.block.hasNext()) {
      return `H 0`
    }

    const socketOffset = 10
    const socketWidth = 15
    const sum = socketOffset + socketWidth
    return `H ${sum} v 5 h -${socketWidth} v -5 h -${socketOffset}`
  }

  getInput(input) {
    if (input.type == BlockInput.Dummy) {
      this.inputsHeight.push(25)
      return 'v 25'
    }

    if (input.type == BlockInput.Value) {
      let height = 25

      const drawer = this.renderer.getDrawer(input.connection?.getTargetBlock())
      if (drawer) {
        height = drawer.getHeight()
      }

      this.inputsHeight.push(height)
      return `v ${height}`
      return `v 5 h -5 v 10 h 5 v 5`
    }

    const nextGroupWidth = this.getGroupWidth(input.group + 1)
    const stackHeight = Math.max(
      25,
      this.getStackHeight(input.connection?.getTargetBlock())
    )
    let path = `H 20 v ${stackHeight} H ${20 + nextGroupWidth}`
    let height = stackHeight

    if (input.index == this.block.inputs.length - 1) {
      height += 25
      path += ' v 15'
    }

    this.inputsHeight.push(height)
    return path
  }

  getOutput() {
    const height = this.getHeight()
    if (!this.block.hasOutput()) return ''

    const notchWidth = 5
    const notchHeight = 10
    const offset = 8
    const remainder = notchHeight + offset - height
    return `v ${remainder} h -${notchWidth} v -${notchHeight} h ${notchWidth}`
  }

  getGroupWidth(group) {
    const groups = this.getInputGroups()
    if (group < 0 || group >= groups.length) {
      return 20
    }

    const padding = 20
    let maxWidth = 20
    for (const input of groups[group]) {
      let inputWidth = 0
      for (const field of input.fields) {
        inputWidth += this.getStringWidth(field.value || field.placeholder)
      }

      if (inputWidth > maxWidth) {
        maxWidth = inputWidth
      }
    }

    return maxWidth + padding
  }

  getStringWidth(string) {
    if (typeof string !== 'string' || string == '') return 0

    const pseudo = document.createElement('div')
    pseudo.appendChild(document.createTextNode(string))
    pseudo.style.font = '12px arial'
    pseudo.style.position = 'absolute'
    pseudo.style.visibility = 'hidden'
    pseudo.style.whiteSpace = 'nowrap'
    document.body.appendChild(pseudo)

    const width = pseudo.getBoundingClientRect().width
    pseudo.remove()

    return width
  }
}
