import { BlockField } from '../../types/block-field'

export class Constraints {
  static StackSocketDepth = 5
  static StackSocketWidth = 15
  static StackSocketOffset = 10

  static RowSocketDepth = 5
  static RowSocketHeight = 15
  static RowSocketOffset = 8

  static StatementBarWidth = 20
  static StatementClosureHeight = 15

  static MinInputHeight = 35
  static MinInputWidth = 25
  static InputPadding = 20

  static DefaultFieldPaddingY = 7
  static DefaultFieldPaddingX = 6
  static FieldPaddingX = {
    [BlockField.Text]: 10,
    [BlockField.Number]: [10, 30],
  }

  static GetStackSocket() {
    const curveWidth = 3
    return [
      `h ${Constraints.StackSocketOffset}`,
      `q 0 ${Constraints.StackSocketDepth} ${curveWidth} ${Constraints.StackSocketDepth}`,
      `h ${Constraints.StackSocketWidth - curveWidth * 2}`,
      `q ${curveWidth} 0 ${curveWidth} ${-Constraints.StackSocketDepth}`,
    ]
  }

  static GetStackNotch() {
    const curveWidth = 3
    return [
      `q 0 ${Constraints.StackSocketDepth} ${-curveWidth} ${
        Constraints.StackSocketDepth
      }`,
      `h ${curveWidth * 2 - Constraints.StackSocketWidth}`,
      `q ${-curveWidth} 0 ${-curveWidth} ${-Constraints.StackSocketDepth}`,
      `h ${-Constraints.StackSocketOffset}`,
    ]
  }

  static GetRowSocket() {
    const curveHeight = 3
    return [
      `v ${Constraints.RowSocketOffset}`,
      `q ${-Constraints.RowSocketDepth} 0 ${-Constraints.RowSocketDepth} ${curveHeight}`,
      `v ${Constraints.RowSocketHeight - curveHeight * 2}`,
      `q 0 ${curveHeight} ${Constraints.RowSocketDepth} ${curveHeight}`,
    ]
  }

  static GetRowNotch() {
    const curveHeight = 3
    return [
      `q ${-Constraints.RowSocketDepth} 0 ${-Constraints.RowSocketDepth} ${-curveHeight}`,
      `v ${curveHeight * 2 - Constraints.RowSocketHeight}`,
      `q 0 ${-curveHeight} ${Constraints.RowSocketDepth} ${-curveHeight}`,
      `v ${-Constraints.RowSocketOffset}`,
    ]
  }
}
