import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'
import { BlockField } from '../../types/block-field'
import { Connection } from '../../types/connection'
import { Point } from '../../types/point'

import { Drawer } from '../../types/block-drawer'
import { Constraints } from './constraints'

import { BoxDebugger } from '../../types/debug/box'

export class AphroditeDrawer extends Drawer {
  /** @param {Block} block */
  constructor(block, renderer) {
    super(block, renderer)

    this.path = ''

    this.groupWidths = []
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

  getConnectionPosition(connection) {
    const position = connection.position.clone()

    switch (connection.type) {
      case Connection.Prev:
      case Connection.Next:
        position.moveBy(-Constraints.StackSocketOffset, 0)
        break
      case Connection.Input:
      case Connection.Statement:
        position.moveBy(0, -Constraints.RowSocketHeight)
        break
    }

    return position
  }

  /**
   * @param {Object} options
   * @param {Point} options.delta
   * @param {Boolean} options.fast
   *
   * FIXME - the update methods gets called too many times
   * which may cause performance issues on larger workspaces
   * when using the propagateUp flag.
   *
   * Why does it happen: when using the propagateUp flag,
   * the whole tree of block ascendants gets slow updated;
   * during the slow update, all the connected blocks of
   * every ascendant get updated recursively to preserve
   * proper blocks and connections positioning.
   *
   * Possible fixes:
   * - implement propagateUp inside a drawer itself to walk the ascendants
   * - introduces renderer ticks and allow each drawer to get slow updated only once on each tick
   */
  update(options) {
    if (options.fast) {
      this.updateFast(options)
      return
    }

    this.updateAbsolutePosition()
    this.updateRelativePosition()
    this.updateDimensions()

    const path = ['m 0 0', ...this.getTop()]

    path.push(...this.getInputs())

    path.push(...this.getBottom(), ...this.getOutput(), 'z')
    this.path = path.join(' ')

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

    let inputOffsetTop = 0
    for (const input of this.block.inputs) {
      const offsetX =
        input.type == BlockInput.Value
          ? this.getGroupWidth(input.group)
          : Constraints.StatementBarWidth

      this.moveConnectionTo(
        input.connection,
        new Point(x + offsetX, y + inputOffsetTop + Constraints.RowSocketHeight)
      )

      let fieldOffsetLeft = 0
      for (const field of input.fields) {
        field.relativePosition.moveTo(
          fieldOffsetLeft + Constraints.FieldPaddingX,
          inputOffsetTop + Constraints.FieldPaddingY
        )

        field.position.moveTo(
          x + field.relativePosition.x,
          y + field.relativePosition.y
        )

        fieldOffsetLeft += field.width + Constraints.FieldsGap
      }

      inputOffsetTop += input.height
    }

    BoxDebugger.Debug(
      this.block,
      this.block.position,
      this.block.width,
      this.block.height,
      this.block.scratch
    )
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

    BoxDebugger.Debug(
      this.block,
      this.block.position,
      this.block.width,
      this.block.height,
      this.block.scratch
    )
  }

  updateAbsolutePosition(delta) {
    if (!this.block.isRelative()) return

    if (delta) {
      this.block.position.moveBy(delta.x, delta.y)
      return
    }

    let alignTo = this.block.previousConnection || this.block.outputConnection
    if (!alignTo || !alignTo.isConnected()) {
      return
    }

    alignTo = alignTo.target
    const position = this.getConnectionPosition(alignTo)
    this.block.position.moveTo(position.x, position.y)
  }

  updateRelativePosition() {
    let alignTo = this.block.previousConnection || this.block.outputConnection
    if (!alignTo || !alignTo.isConnected()) {
      return
    }

    alignTo = alignTo.target
    const relativePosition = this.getConnectionPosition(alignTo)
    relativePosition.moveBy(
      -alignTo.block.position.x,
      -alignTo.block.position.y
    )

    this.block.relativePosition.moveTo(relativePosition.x, relativePosition.y)
  }

  updateConnectedBlock(connection, options) {
    if (
      connection.type == Connection.Output ||
      connection.type == Connection.Prev ||
      !connection.isConnected()
    ) {
      return
    }

    this.renderer.update(connection.getTargetBlock(), options)
  }

  moveConnectionBy(connection, delta) {
    if (!connection) return

    connection.position.moveBy(delta.x, delta.y)
    this.updateConnectedBlock(connection, { delta, fast: true })
  }

  moveConnectionTo(connection, point) {
    if (!connection) return

    connection.position.moveTo(point.x, point.y)
    this.updateConnectedBlock(connection, {})
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

  getInputs() {
    const inputs = []
    for (const input of this.block.inputs) {
      if (this.block.isInline) {
        inputs.push(...this.getInput(input))
      } else {
        inputs.push(...this.getInputInline(input))
      }
    }

    return inputs
  }

  getInputInline(input) {
    return this.getInput(input)
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
    return [`v ${input.height}`]
  }

  getValue(input) {
    const remainder =
      input.height - Constraints.RowSocketOffset - Constraints.RowSocketHeight
    return [...Constraints.GetRowSocket(), `v ${remainder}`]
  }

  getStatement(input) {
    const closureWidth = Math.max(
      this.getGroupWidth(input.group),
      Constraints.MinInputWidth
    )

    const path = [
      `H ${Constraints.StatementBarWidth}`,
      `v ${input.height}`,
      `H ${closureWidth}`,
    ]

    if (input.index == this.block.inputs.length - 1) {
      path.push(`v ${Constraints.StatementClosureHeight}`)
    }

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
    if (group < 0 || group > this.groupWidths.length - 1) {
      return Constraints.MinInputWidth
    }

    return this.groupWidths[group]
  }

  updateDimensions() {
    for (const input of this.block.inputs) {
      for (const field of input.fields) {
        this.updateFieldDimensions(field)
      }

      this.updateInputWidth(input)
      this.updateInputHeight(input)
    }

    this.updateGroupsDimensions()
    this.updateBlockHeight(this.block)
    this.updateBlockWidth(this.block)
  }

  updateBlockWidth(block) {
    if (!block.isInline) {
      block.width = [...this.groupWidths].sort((a, b) => b - a)[0] || 0
      return
    }

    let width = 0
    for (const input of block.inputs) {
      if (input.type !== BlockInput.Statement) {
        width += input.width
      }
    }

    block.width = width
  }

  updateBlockHeight(block) {
    let totalValuesHeight = 0
    let totalStatementsHeight = 0
    let maxInlineInputHeight = 0

    for (const input of block.inputs) {
      switch (input.type) {
        case BlockInput.Statement:
          totalStatementsHeight += input.height
          if (input.index === block.inputs.length - 1) {
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

    if (block.isInline) {
      block.height = maxInlineInputHeight + totalStatementsHeight
      return
    }

    if (block.hasNext() && !block.nextConnection.isConnected()) {
      totalValuesHeight += Constraints.StackSocketDepth
    }

    block.height = totalValuesHeight + totalStatementsHeight
  }

  updateGroupsDimensions() {
    const groups = this.getInputGroups()
    const widths = new Array(groups.length).fill(Constraints.MinInputWidth)

    for (let i = 0; i < groups.length; i++) {
      for (const input of groups[i]) {
        if (input.width < widths[i]) continue

        widths[i] = input.width
      }
    }

    this.groupWidths = widths
  }

  updateInputWidth(input) {
    let width = Constraints.FieldPaddingX * 2

    if (input.fields.length > 1) {
      width += Constraints.FieldsGap * input.fields.length - 1
    }

    if (input.type == BlockInput.Value) {
      if (!input.block.isInline) {
        width += Constraints.RowSocketDepth
      } else if (input.connection.isConnected()) {
        const connection = input.connection.getTargetBlock()
        width += connection.width + Constraints.FieldsGap * 2
      } else {
        width += Constraints.EmptyInlineInputWidth + Constraints.FieldsGap * 2
      }
    }

    for (const field of input.fields) {
      width += field.width
    }

    input.width = width
  }

  updateInputHeight(input) {
    let height = Constraints.MinInputHeight
    switch (input.type) {
      case BlockInput.Value:
        const target = input.connection?.getTargetBlock()
        if (!target) break

        height = target.height
        break
      case BlockInput.Statement:
        let curr = input?.connection?.getTargetBlock()
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

    input.height = height
  }

  updateFieldDimensions(field) {
    field.height = Constraints.FieldHeight

    const tolerance = Constraints.FieldWidthTolerance[field.type] || 0
    const width =
      this.getStringWidth(field.value || field.placeholder) + tolerance

    if (field.type !== BlockField.Label) {
      field.width = Math.max(Constraints.MinFieldWidth, width)
    } else {
      field.width = width
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

  debugFieldBox(field) {
    BoxDebugger.Debug(
      field,
      field.position,
      field.width,
      Constraints.FieldHeight,
      this.block.scratch
    )
  }
}
