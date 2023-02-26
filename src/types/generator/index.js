import { Block } from '../block'
import { Scratch } from '../scratch'

export class Generator {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch

    const compile = this.compile.bind(this)
    this.scratch.events.addEventListener(Scratch.Events.BLOCK_CHANGE, compile)
    this.scratch.events.addEventListener(Scratch.Events.BLOCK_MOVE, compile)
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
