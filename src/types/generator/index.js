import { debounce } from '../../utils'
import { Block } from '../block'
import { Scratch } from '../scratch'

export class Generator {
  compile = debounce(this.compile_, 700)

  /** @param {Scratch} scratch */
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

  compile_() {
    console.warn('should be overridden')
  }
}
