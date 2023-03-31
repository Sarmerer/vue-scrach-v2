import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'
import { Drawer } from '../../types/block-drawer'
import { Constraints } from './constraints'
import { PointDebugger } from '../../types/point-debugger'
import { Point } from '../../types/point'
import { Connection } from '../../types/connection'

export class AphroditeDrawer extends Drawer {
  /** @param {Block} block */
  constructor(block, renderer) {
    super(block, renderer)

    this.path = []

    this.groupsWidthCache = []
    this.didMount = false
  }

  getHeight() {
    return this.block.height
  }

  getInputOffsetTop(index) {
    return this.block.inputs
      .slice(0, index)
      .reduce((acc, i) => acc + i.height, 0)
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

  /**
   * @param {Object} options
   * @param {Point} options.delta
   * @param {Boolean} options.fast
   */
  update(options) {
    if (options.fast) {
      this.updateFast(options)
      return
    }

    this.updateAbsolutePosition()
    this.updateRelativePosition()
    this.cacheGroupWidths()

    const path = ['m 0 0', ...this.getTop()]

    for (const input of this.block.inputs) {
      path.push(...this.getInput(input))
    }

    this.block.height = this.block.inputs.reduce((acc, i) => acc + i.height, 0)

    path.push(...this.getBottom(), ...this.getOutput(), 'z')
    this.path = path

    const { x, y } = this.block.position

    this.moveConnectionTo(
      this.block.previousConnection,
      new Point(x + Constraints.StackSocketOffset, y)
    )

    this.moveConnectionTo(
      this.block.nextConnection,
      new Point(x + Constraints.StackSocketOffset, y + this.getHeight())
    )

    this.moveConnectionTo(
      this.block.outputConnection,
      new Point(x - Constraints.RowSocketDepth, y + Constraints.RowSocketOffset)
    )

    let offsetTop = 0
    for (const input of this.block.inputs) {
      this.moveConnectionTo(
        input.connection,
        new Point(
          x + this.getGroupWidth(input.group),
          y + offsetTop + Constraints.RowSocketHeight
        )
      )

      for (const field of input.fields) {
        field.position.moveTo(
          x + this.getFieldPaddingX(field),
          y + Constraints.DefaultFieldPaddingY
        )
      }

      offsetTop += input.height
    }
  }

  /**
   * @param {Object} options
   * @param {Point} options.delta
   */
  updateFast(options) {
    const delta = options.delta || new Point(0, 0)

    this.updateAbsolutePosition(delta)

    this.moveConnectionBy(this.block.previousConnection, delta)
    this.moveConnectionBy(this.block.nextConnection, delta)
    this.moveConnectionBy(this.block.outputConnection, delta)

    for (const input of this.block.inputs) {
      this.moveConnectionBy(input.connection, delta)

      for (const field of input.fields) {
        field.position.moveBy(delta.x, delta.y)
      }
    }
  }

  updateAbsolutePosition(delta) {
    PointDebugger.Debug(this.block.position, this.block.scratch, {
      color: 'green',
    })

    if (!this.block.isRelative()) return

    if (delta) {
      this.block.position.moveBy(delta.x, delta.y)
      return
    }

    const rect = this.block.scratch.normalizePoint(
      this.block.getBoundingClientRect()
    )
    this.block.position.moveTo(rect.x, rect.y)
  }

  updateRelativePosition() {
    let alignTo = this.block.previousConnection || this.block.outputConnection
    if (!alignTo || !alignTo.isConnected()) {
      this.block.relativePosition.moveTo(
        this.block.position.x,
        this.block.position.y
      )
      return
    }

    alignTo = alignTo.target
    const parent = this.renderer.getDrawer(alignTo.block)

    let offsetTop = 0
    if (alignTo.input) {
      offsetTop = parent.getInputOffsetTop(alignTo.input.index)
    }

    const relativePosition = new Point(0, 0)
    switch (alignTo.type) {
      case Connection.Input:
        relativePosition.moveBy(
          parent.getGroupWidth(alignTo.input.group),
          offsetTop
        )
        break
      case Connection.Statement:
        relativePosition.moveBy(Constraints.StatementBarWidth, offsetTop)
        break
      case Connection.Next:
        relativePosition.moveBy(0, alignTo.block.height)
        break
    }

    this.block.relativePosition.moveTo(relativePosition.x, relativePosition.y)
  }

  moveConnectionBy(connection, delta) {
    if (!connection) return

    connection.position.moveBy(delta.x, delta.y)
    PointDebugger.Debug(connection.position, this.block.scratch)
  }

  moveConnectionTo(connection, point) {
    if (!connection) return

    connection.position.moveTo(point.x, point.y)
    PointDebugger.Debug(connection.position, this.block.scratch)
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
        return this.getDummy(input)
    }
  }

  getDummy(input) {
    input.height = Constraints.MinInputHeight
    return [`v ${Constraints.MinInputHeight}`]
  }

  getValue(input) {
    let height = Constraints.MinInputHeight

    const drawer = this.renderer.getDrawer(input.connection?.getTargetBlock())
    if (drawer) {
      height = drawer.getHeight()
    }

    input.height = height
    const remainder =
      height - Constraints.RowSocketOffset - Constraints.RowSocketHeight
    return [...Constraints.GetRowSocket(), `v ${remainder}`]
  }

  getStatement(input) {
    let height = Math.max(
      Constraints.MinInputWidth,
      this.getStackHeight(input.connection?.getTargetBlock()) + 5
    )

    const path = [
      `H ${Constraints.StatementBarWidth}`,
      `v ${height}`,
      `H ${Constraints.StatementBarWidth + this.getGroupWidth(input.group)}`,
    ]

    if (input.index == this.block.inputs.length - 1) {
      height += Constraints.StatementClosureHeight
      path.push(`v ${Constraints.StatementClosureHeight}`)
    }

    input.height = height
    return path
  }

  getOutput() {
    if (!this.block.hasOutput()) return []

    const height = this.getHeight()
    const remainder =
      Constraints.RowSocketHeight + Constraints.RowSocketOffset - height

    return [`v ${remainder}`, ...Constraints.GetRowNotch()]
  }

  getGroupWidth(group) {
    if (group < 0 || group > this.groupsWidthCache.length - 1) {
      return Constraints.MinInputWidth
    }

    return this.groupsWidthCache[group]
  }

  getInputWidth(input) {
    let width = Constraints.InputPadding
    for (const field of input.fields) {
      field.width =
        this.getStringWidth(field.value || field.placeholder) +
        this.getFieldPaddingX(field, 'left') +
        this.getFieldPaddingX(field, 'right')
      width += field.width
    }

    input.width = width
    return width
  }

  getFieldPaddingX(field, side) {
    const padding = Constraints.FieldPaddingX[field.type]
    if (padding == null) return Constraints.DefaultFieldPaddingX

    if (Array.isArray(padding)) {
      if (!side) return padding[0]

      const index = side == 'right' ? 1 : 0
      return padding[index]
    }

    return padding
  }

  cacheGroupWidths() {
    this.groupsWidthCache = []

    const groups = this.getInputGroups()
    for (const group of groups) {
      let groupWidth = Constraints.MinInputWidth
      for (const input of group) {
        const inputWidth = this.getInputWidth(input)

        if (inputWidth > groupWidth) {
          groupWidth = inputWidth
        }
      }

      this.groupsWidthCache.push(groupWidth)
    }
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
