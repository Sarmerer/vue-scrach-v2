import { declareModule } from '../blocks'
import { Scratch } from './scratch'
import { JSONGenerator } from './generator/json'
import { CodeGenerator } from './generator/code'

import functions from '../blocks/functions'
import lists from '../blocks/lists'
import loops from '../blocks/loops'
import math from '../blocks/math'
import sql from '../blocks/sql'
import strings from '../blocks/strings'
import variables from '../blocks/variables'
import logic from '../blocks/logic'
import base from '../blocks/builder/base'
import inputs from '../blocks/builder/inputs'
import fields from '../blocks/builder/fields'

export class Toolbox {
  static Presets = {
    Scripting: {
      generator: CodeGenerator,
      modules: [functions, loops, math, strings, logic, lists, variables],
    },
    SQL: { generator: CodeGenerator, modules: [sql] },
    Factory: { generator: JSONGenerator, modules: [base, inputs, fields] },
  }

  constructor(scratch) {
    this.scratch = scratch

    this.toolbox = new Scratch()
    this.preset = 'Scripting'
    this.categories = {}

    this.updateCategories()
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
    this.updateGenerator()
    this.updateCategories()
  }

  updateGenerator() {
    this.scratch.setGenerator(this.gerPresetGenerator())
  }

  updateCategories() {
    this.reset()

    for (const module of this.getPresetModules()) {
      declareModule(module)
    }

    Object.keys(Scratch.Blocks).map((type) => {
      const block = this.toolbox.spawnBlock(type)
      block.isFrozen = true
    })

    this.categories = this.toolbox.blocks.reduce((acc, b) => {
      const category = b.type.split(':')[0] || 'blocks'
      if (!acc[category]) acc[category] = { blocks: [], color: null }

      acc[category].blocks.push(b)
      acc[category].background = b.colors.background
      acc[category].text = b.colors.text
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
    this.toolbox = new Scratch()
  }

  static AddPreset(name, includedCategories) {
    Toolbox.Presets[name] = includedCategories
  }
}
