import { Template } from '../template'
import { Block } from '../block'
import { BlockInput } from '../block-input'
import { Generator } from '.'

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

    const context = block.getFieldsValues()
    context.input = {}
    for (const [name, input] of Object.entries(block.getInputs())) {
      context.input[name] = JSONGenerator.CompileInput(input)
    }

    const objects = []
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

  compile() {
    const objects = []
    const blocks = this.scratch.getBlocks().sort((a, b) => a.y - b.y)
    for (const block of blocks) {
      objects.push(...JSONGenerator.CompileBlock(block))
    }

    this.code = JSON.stringify(objects, null, 2)
  }
}
