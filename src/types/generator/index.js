import { Block } from '../block'

export class Generator {
  constructor(scratch) {
    this.scratch = scratch
  }

  /**
   * @param {Block} block
   * @returns {null}
   */
  static CompileBlock(block) {
    return null
  }

  /**
   * @param {Block} input
   * @returns {null}
   */
  static CompileInput(input) {
    return null
  }

  /**
   * @param {Block} input
   * @returns {null}
   */
  static CompileValue(input) {
    return null
  }

  /**
   * @param {Block} input
   * @returns {null}
   */
  static CompileStatement(input, indentation) {
    return null
  }

  compile() {}
}
