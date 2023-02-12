import { Template } from './template'
import { Block } from './block'
import sql from '../templates/sql.json'

export class CodeGenerator {
  constructor(scratch) {
    this.scratch = scratch
    this.code = ''
  }

  /**
   * @param {Block} block
   * @returns {String}
   */
  compileBlock(block, indentation = '') {
    const blockTemplate = sql[block.type]
    if (!blockTemplate || !blockTemplate.lines) return []

    const fields = block.getFieldsValues()
    const compiledStatements = {}

    const rawStatements = block.getStatements()
    for (const [name, statement] of Object.entries(rawStatements)) {
      if (!statement.length) continue

      compiledStatements[name] = []
      for (const block of statement) {
        compiledStatements[name].push(
          this.compileBlock(block, indentation + '  ').join('\n')
        )
      }

      compiledStatements[name] = compiledStatements[name].join('\n')
    }

    if (Object.keys(compiledStatements).length) {
      fields.statement = compiledStatements
    }

    const lines = []
    for (const line of blockTemplate.lines) {
      lines.push(indentation + Template.interpolate(line, fields))
    }

    return lines
  }

  compile() {
    const lines = []
    const blocks = this.scratch.getBlocks().sort((a, b) => a.y - b.y)
    for (const block of blocks) {
      lines.push(...this.compileBlock(block))
    }

    this.code = lines.join('\n')
  }
}
