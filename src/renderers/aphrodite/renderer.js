import { Scratch } from '../../types/scratch'
import { Renderer } from '../../types/renderer'
import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'

export class AphroditeRenderer extends Renderer {
  BlocksContainerComponent = () => import('./index.vue')
  BlockComponent = () => import('./Block.vue')

  /** @param {Scratch} scratch */
  constructor(scratch) {
    super('aphrodite', scratch)

    this.didInit = false

    this.drawers = {}
  }

  getDrawer(block) {
    return this.drawers[block.id]
  }

  init() {
    if (this.didInit) return

    for (const block of this.scratch.blocks) {
      const d = new Drawer(block, this)
      d.update()
      this.drawers[block.id] = d
    }

    this.didInit = true
  }
}

export class Drawer {
  /** @param {Block} block */
  constructor(block, renderer) {
    this.renderer = renderer
    this.block = block
    this.path = ''
    this.groupsWidth = []
  }

  update() {
    for (let i = 0; i < this.block.getInputGroups().length; i++) {
      this.groupsWidth.push(this.getGroupWidth(i))
    }

    const path = ['m 0 0', this.getTop()]

    for (const input of this.block.inputs) {
      path.push(this.getInput(input))
    }

    path.push(this.getBottom())

    this.path = path.join(' ')
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
      return 'v 25'
    }

    if (input.type == BlockInput.Value) {
      return 'v 5 h -5 v 10 h 5 v 5'
    }

    const nextGroupWidth = this.getGroupWidth(input.group + 1)
    let path = `H 20 v 25 H ${20 + nextGroupWidth}`
    if (input.index == this.block.inputs.length - 1) {
      path += ' v 25'
    }

    return path
  }

  getGroupWidth(group) {
    if (group < 0 || group >= this.groupsWidth.length) {
      return 20
    }

    const padding = 20
    let maxWidth = 20
    for (const input of this.block.getInputGroups()[group]) {
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
