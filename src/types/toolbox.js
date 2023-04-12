import { declareModule } from '../../blocks'
import { Scratch } from './scratch'
import { JSONGenerator } from './generator/json'
import { CodeGenerator } from './generator/code'

import functions from '../../blocks/functions'
import lists from '../../blocks/lists'
import loops from '../../blocks/loops'
import math from '../../blocks/math'
import sql from '../../blocks/sql'
import strings from '../../blocks/strings'
import variables from '../../blocks/variables'
import logic from '../../blocks/logic'
import base from '../../blocks/builder/base'
import inputs from '../../blocks/builder/inputs'
import fields from '../../blocks/builder/fields'

export class Toolbox extends Scratch {
  static Presets = {
    Scripting: {
      generator: CodeGenerator,
      modules: [functions, loops, math, strings, logic, lists, variables],
    },
    SQL: { generator: CodeGenerator, modules: [sql] },
    Factory: { generator: JSONGenerator, modules: [base, inputs, fields] },
  }

  constructor(scratch) {
    super()

    this.scratch = scratch

    this.preset = 'Scripting'
    this.categories = {}

    this.setPreset(this.preset)
  }

  getAvailablePresets() {
    return Object.entries(Toolbox.Presets).map(([name, modules]) => {
      return { name, modules }
    })
  }

  getPreset() {
    return Toolbox.Presets[this.preset]
  }

  getPresetModules() {
    const preset = this.getPreset()
    if (!preset) return []
    return preset.modules
  }

  gerPresetGenerator() {
    const preset = this.getPreset()
    if (!preset) return CodeGenerator
    return preset.generator || CodeGenerator
  }

  setPreset(preset) {
    if (!Toolbox.Presets[preset]) return

    this.preset = preset
    this.scratch.setGenerator(this.gerPresetGenerator())
    this.updateCategories()
  }

  updateCategories() {
    this.reset()

    for (const module of this.getPresetModules()) {
      declareModule(module)
    }

    for (const type of Object.keys(Scratch.Blocks)) {
      const block = super.spawnBlock(type)
      block.isFrozen = true
    }

    const offsetLeft = 20
    this.categories = this.blocks.reduce((acc, block) => {
      const category = block.type.split(':')[0] || 'blocks'
      if (!acc[category]) {
        acc[category] = { blocks: [], color: null, width: 0, offsetTop: 20 }
      }

      if (block.width > acc[category].width) {
        acc[category].width = block.width + 50
      }

      block.position.moveTo(offsetLeft, acc[category].offsetTop)
      acc[category].offsetTop += block.height + 20

      acc[category].blocks.push(block)
      acc[category].background = block.colors.background
      acc[category].text = block.colors.text
      return acc
    }, {})
  }

  spawnBlock(event, block) {
    event = this.scratch.normalizeMouseEvent(event)
    block = this.scratch.spawnBlock(block.type, event.clientX, event.clientY)

    block.dragStart(event)
  }

  addVariable() {
    const name = prompt('Enter a name for a variable')
    if (!name?.length) return

    this.scratch.addVariable(name)
  }

  reset() {
    Scratch.Blocks = {}
    this.blocks = []
  }

  static AddPreset(name, includedCategories) {
    Toolbox.Presets[name] = includedCategories
  }
}
