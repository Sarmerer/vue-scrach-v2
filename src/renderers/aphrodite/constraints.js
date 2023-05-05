import { BlockField } from '../../types/block-field'

export class Constraints {
  static StackSocketDepth = 4
  static StackSocketWidth = 16
  static StackSocketOffset = 8

  static RowSocketDepth = 4
  static RowSocketHeight = 16
  static RowSocketOffset = 12

  static StatementBarWidth = 16
  static StatementClosureHeight = 16
  static EmptyInlineInputWidth = 16

  static MinInputHeight = 40
  static MinInputWidth = 48
  static MinFieldWidth = 24

  static FieldsGap = 8
  static FieldPaddingY = 8
  static FieldPaddingX = 12
  static FieldHeight = 24

  static CornerArcDepth = 8

  static FieldWidthTolerance = {
    [BlockField.Text]: 12,
    [BlockField.Number]: 12,
    [BlockField.Select]: 24,
    [BlockField.Variable]: 24,
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
