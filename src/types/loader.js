import { newFactory } from '../blocks'
import all from '../blocks/all'
import { Block } from './block'
import { BlockInput } from './block-input'
import { Scratch } from './scratch'

export class ScratchLoader {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch

    this.blocksCache = {}
  }

  load(json) {
    if (!json || typeof json !== 'object') return

    if (Array.isArray(json.variables)) {
      this.loadVariables(json.variables)
    }

    if (Array.isArray(json.blocks)) {
      this.loadBlocks(json.blocks)
    }

    if (this.scratch.generator) {
      this.scratch.generator.compile()
    }

    if (this.scratch.renderer) {
      this.scratch.renderer.init()
    }
  }

  loadVariables(variables) {
    for (const variable of variables) {
      if (!variable?.name) continue

      this.scratch.addVariable(variable.name, variable.value)
    }
  }

  loadBlocks(blocks) {
    for (const blockData of blocks) {
      if (typeof blockData !== 'object') continue

      const { type } = blockData
      const factory = this.getFactory(type)
      if (typeof factory !== 'function') {
        console.error('could not recreate block of type:', blockData?.type)
        continue
      }

      const { id, x, y } = blockData
      const block = new Block(this.scratch, x, y, type)
      factory(block)

      this.makeOverrides(block, blockData)
      this.blocksCache[block.id] = block
    }

    this.makeConnections(blocks)

    for (const block of Object.values(this.blocksCache)) {
      this.scratch.addBlock(block)
    }

    this.blocksCache = {}
  }

  makeOverrides(block, overrides) {
    block.id = overrides.id

    const inputs = overrides.inputs || []
    for (let i = 0; i < inputs.length; i++) {
      if (i >= block.inputs.length) continue

      const inputOverride = inputs[i]
      block.inputs[i].id = inputOverride.id

      const fields = inputOverride.fields || []
      for (let j = 0; j < fields.length; j++) {
        if (i >= block.inputs[i].fields.length) continue

        const fieldOverride = inputOverride.fields[j]
        const field = { id: fieldOverride.id }
        if (fieldOverride.value !== undefined) {
          field.value = fieldOverride.value
        }

        Object.assign(block.inputs[i].fields[j], field)
      }
    }
  }

  makeConnections(blocks) {
    for (const blockData of blocks) {
      const self = this.blocksCache[blockData.id]

      const inputs = blockData?.inputs || []
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i]
        const inputBlock = this.blocksCache[input.connection]
        if (!inputBlock) continue

        const connection =
          self.inputs[i].type == BlockInput.Statement
            ? inputBlock.previousConnection
            : inputBlock.outputConnection

        connection.setTargetsMutual(self.inputs[i].connection)
      }
    }

    for (const blockData of blocks) {
      const self = this.blocksCache[blockData.id]

      const prevBlock = this.blocksCache[blockData.previousConnection]
      const nextBlock = this.blocksCache[blockData.nextConnection]

      if (
        prevBlock &&
        !self.previousConnection.isConnected() &&
        !prevBlock.nextConnection.isConnected()
      ) {
        self.previousConnection.setTargetsMutual(prevBlock.nextConnection)
      }

      if (
        nextBlock &&
        !self.nextConnection.isConnected() &&
        !nextBlock.previousConnection.isConnected()
      ) {
        self.nextConnection.setTargetsMutual(nextBlock.previousConnection)
      }
    }
  }

  getFactory(type) {
    if (typeof type !== 'string') return
    const path = type.split(':')
    if (path.length < 2) return null

    const superType = path[0]
    const module = all[superType]
    if (!Array.isArray(module?.blocks)) return null

    const subType = path[1]
    const template = module.blocks.find((t) => t.name == subType)
    if (!template) return null

    return newFactory(template)
  }
}
