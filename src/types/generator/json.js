import { Block } from '../block'
import { BlockInput } from '../block-input'
import { Generator } from '.'
import { CompilerContext } from './context'

export class JSONGenerator extends Generator {
  constructor(scratch) {
    super(scratch)

    this.code = ''
  }

  /**
   * @param {Block} block
   * @returns {Array<Object>}
   */
  static CompileBlock(block) {
    const compiler = block?.compiler
    if (typeof compiler !== 'function') {
      console.error('block compiler must be a function:', block)
      return null
    }

    const fields = block.getFieldsValues()
    const inputs = {}
    for (const [name, input] of Object.entries(block.getInputs())) {
      inputs[name] = JSONGenerator.CompileInput(input)
    }

    const objects = []

    const context = new CompilerContext(block, inputs, fields)
    objects.push(compiler(context))

    if (block.hasNext() && block.nextConnection.isConnected()) {
      objects.push(
        ...JSONGenerator.CompileBlock(block.nextConnection.getTargetBlock())
      )
    }

    return objects
  }

  /**
   * @param {Block} input
   * @returns {Array<String>}
   */
  static CompileInput(input) {
    if (input.type == BlockInput.Dummy) return null

    return JSONGenerator.CompileBlock(input.connection.getTargetBlock())
  }

  compile_() {
    const objects = []
    const blocks = this.scratch.getBlocks().sort((a, b) => a.y - b.y)
    for (const block of blocks) {
      objects.push(...JSONGenerator.CompileBlock(block))
    }

    this.code = objects
  }
}
