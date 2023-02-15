import { Template } from '../template'
import { Block } from '../block'
import { BlockInput } from '../block-input'
import { Generator } from '.'

export class CodeGenerator extends Generator {
  constructor(scratch) {
    super(scratch)

    this.code = ''
  }

  /**
   * @param {Block} block
   * @param {String} indentation
   * @returns {Array<String>}
   */
  static CompileBlock(block, indentation = '') {
    let compiler = block?.compiler
    if (typeof compiler !== 'function' && !Array.isArray(compiler)) return []
    if (Array.isArray(compiler)) {
      compiler = this.DefaultCompiler(compiler)
    }

    const context = block.getFieldsValues()
    context._indentation = indentation
    context.input = {}

    for (const [name, input] of Object.entries(block.getInputs())) {
      context.input[name] = CodeGenerator.CompileInput(input, indentation).join(
        '\n'
      )
    }

    const lines = compiler(context, block)

    if (block.hasNext() && block.nextBlock.isConnected()) {
      lines.push(
        ...CodeGenerator.CompileBlock(
          block.nextBlock.getTargetBlock(),
          indentation
        )
      )
    }

    return lines
  }

  /**
   * @param {Block} input
   * @param {String} indentation
   * @returns {Array<String>}
   */
  static CompileInput(input, indentation = '') {
    switch (input.type) {
      case BlockInput.Value:
        return CodeGenerator.CompileValue(input)
      case BlockInput.Statement:
        return CodeGenerator.CompileStatement(input, indentation)
      default:
        return []
    }
  }

  /**
   * @param {Block} input
   * @returns {Array<String>}
   */
  static CompileValue(input) {
    const block = input.connection.getTargetBlock()
    return CodeGenerator.CompileBlock(block)
  }

  /**
   * @param {Block} input
   * @param {String} indentation
   * @returns {Array<String>}
   */
  static CompileStatement(input, indentation) {
    const block = input.connection.getTargetBlock()
    return CodeGenerator.CompileBlock(block, indentation + '  ')
  }

  compile() {
    const lines = []

    lines.push(
      this.scratch
        .getVariables()
        .map((v) => `var ${v.name}`)
        .join(', '),
      ''
    )

    const blocks = this.scratch.getBlocks().sort((a, b) => a.y - b.y)
    for (const block of blocks) {
      lines.push(...CodeGenerator.CompileBlock(block), '')
    }

    this.code = lines.join('\n')
  }

  static DefaultCompiler(lines) {
    return function (context) {
      return lines.map((line) => {
        let baked = Template.interpolate(line, context)
        if (!baked.startsWith(context._indentation)) {
          baked = context._indentation + baked
        }

        return baked
      })
    }
  }
}
