import { Block } from '../../types/block'
import { BlockInput } from '../../types/block-input'
import { Connection } from '../../types/connection'
import { Point } from '../../types/point'

import { Drawer } from '../../types/block-drawer'
import { Constraints } from './constraints'

import { Block as DrawableBlock } from './drawables/block'
import { Groups as DrawableGroups } from './drawables/groups'
import { Input as DrawableInput } from './drawables/input'
import { Field as DrawableField } from './drawables/field'

import { BoxDebugger } from '../../types/debug/box'
import { PointDebugger } from '../../types/debug/point'

export const Corner = {
  TL: 0,
  TR: 1,
  BR: 2,
  BL: 3,
}

export class AphroditeDrawer extends Drawer {
  /** @param {Block} block */
  constructor(block, renderer) {
    super(block, renderer)

    this.path = ''

    this.didMount = false
    this.drawable = new DrawableBlock(this.block)
    this.drawableGroups = new DrawableGroups(this.block)
    this.drawableInputs = new Map()
    this.drawableFields = new Map()
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
    this.measure()

    const path = ['m 0 0', ...this.getTop()]
    path.push(...this.getInputs())
    path.push(...this.getBottom(), ...this.getOutput(), 'z')
    this.path = path.join(' ')

    this.positionBlockConnections()
    this.positionInputConnections()
  }

  /**
   * @param {Object} options
   * @param {Point} options.delta
   */
  updateFast(options) {
    const delta = options.delta
    if (!(delta instanceof Point)) return

    this.updateAbsolutePosition(delta)
    this.positionBlockConnections(delta)
    this.positionInputConnections(delta)
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
    let width = this.block.inputs[0].groupWidth
    const top = []

    if (this.isCornerRounded(Corner.TL)) {
      const depth = Constraints.CornerArcDepth
      width -= depth
      top.push(`m 0 ${depth}`, `a ${depth} ${depth} 0 0 1 ${depth} ${-depth}`)
    }

    if (!this.block.hasPrev()) {
      top.push(`h ${width}`)
    } else {
      let remainder =
        width - Constraints.StackSocketOffset - Constraints.StackSocketWidth

      top.push(...Constraints.GetStackSocket(), `h ${remainder}`)
    }

    return top
  }

  getBottom() {
    const lastInput = this.block.inputs[this.block.inputs.length - 1]
    let width = lastInput.groupWidth

    const bottom = []
    const corner = []

    if (this.isCornerRounded(Corner.BL)) {
      width -= Constraints.CornerArcDepth
      const depth = Constraints.CornerArcDepth
      corner.push(`a ${depth} ${depth} 0 0 1 ${-depth} ${-depth}`)
    }

    if (!this.block.hasNext()) {
      bottom.push(`h ${-width}`)
    } else {
      const remainder =
        Constraints.StackSocketOffset + Constraints.StackSocketWidth - width
      bottom.push(`h ${remainder}`, ...Constraints.GetStackNotch())
    }

    bottom.push(...corner)

    return bottom
  }

  getInputs() {
    if (this.block.isInline) {
      return this.getInputsInline()
    }

    const inputs = []
    for (const input of this.block.inputs) {
      inputs.push(...this.getInput(input))
    }

    return inputs
  }

  getInputsInline() {
    let highestInput = 0
    const path = ['v 0']
    for (const input of this.block.inputs) {
      if (input.type == BlockInput.Statement) {
        path.push(...this.getInput(input))
        continue
      }

      if (input.height > highestInput) {
        highestInput = input.height
        path[0] = `v ${highestInput}`
      }
    }

    return path
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
    const closureWidth = Math.max(input.groupWidth, Constraints.MinInputWidth)

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

  positionBlockConnections(delta) {
    if (delta instanceof Point) {
      this.moveConnectionBy(this.block.previousConnection, delta)
      this.moveConnectionBy(this.block.nextConnection, delta)
      this.moveConnectionBy(this.block.outputConnection, delta)
      return
    }

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
  }

  positionInputConnections(delta) {
    const { x, y } = this.block.position

    let inputOffsetTop = 0
    let inputOffsetLeft = 0
    for (const input of this.block.inputs) {
      if (delta instanceof Point) {
        this.moveConnectionBy(input.connection, delta)

        for (const field of input.fields) {
          field.position.moveBy(delta.x, delta.y)
        }

        continue
      }

      let fieldOffsetLeft = 0
      for (const field of input.fields) {
        const fieldPosition = new Point(
          fieldOffsetLeft + Constraints.FieldPaddingX,
          Constraints.FieldPaddingY
        )

        if (!this.block.isInline) {
          fieldPosition.moveBy(0, inputOffsetTop)
        } else {
          fieldPosition.moveBy(inputOffsetLeft, 0)
        }

        field.relativePosition.moveTo(fieldPosition.x, fieldPosition.y)

        field.position.moveTo(
          x + field.relativePosition.x,
          y + field.relativePosition.y
        )

        fieldOffsetLeft += field.width + Constraints.FieldsGap
      }

      const offsetX =
        input.type == BlockInput.Value
          ? input.groupWidth
          : Constraints.StatementBarWidth

      const inputPosition =
        this.block.isInline && input.type !== BlockInput.Statement
          ? new Point(
              x + inputOffsetLeft + fieldOffsetLeft + Constraints.FieldPaddingX,
              y + Constraints.FieldPaddingY + Constraints.RowSocketHeight
            )
          : new Point(
              x + offsetX,
              y + inputOffsetTop + Constraints.RowSocketHeight
            )

      this.moveConnectionTo(input.connection, inputPosition)

      inputOffsetTop += input.height
      inputOffsetLeft += input.width
    }
  }

  measure() {
    for (const input of this.block.inputs) {
      for (const field of input.fields) {
        this.measureField(field)
      }

      this.measureInput(input)
    }

    this.drawableGroups.measure()
    this.drawable.measure()
  }

  measureInput(input) {
    if (!this.drawableInputs.has(input.id)) {
      this.drawableInputs.set(input.id, new DrawableInput(input))
    }

    this.drawableInputs.get(input.id).measure()
  }

  measureField(field) {
    if (!this.drawableFields.has(field.id)) {
      this.drawableFields.set(field.id, new DrawableField(field))
    }

    this.drawableFields.get(field.id).measure()
  }

  isCornerRounded(corner) {
    const rules = {
      [Corner.TL]: !(
        this.block.hasOutput() || this.block.previousConnection?.isConnected()
      ),
      [Corner.BL]: !(
        this.block.hasOutput() || this.block.nextConnection?.isConnected()
      ),
    }

    return rules[corner] || false
  }

  debugBlockBox() {
    BoxDebugger.Debug(
      this.block,
      this.block.position,
      this.block.width,
      this.block.height,
      this.block.scratch
    )
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

  debugConnection(connection) {
    PointDebugger.Debug(connection.position, connection.block.scratch)
  }
}
