import { declareModule } from '../blocks'
import functions from '../blocks/functions'
import lists from '../blocks/lists'
import loops from '../blocks/loops'
import math from '../blocks/math'
import sql from '../blocks/sql'
import strings from '../blocks/strings'
import variables from '../blocks/variables'
import builder from '../blocks/builder'
import all from '../blocks/all'
import { Scratch } from './scratch'
import logic from '../blocks/logic'

export class Toolbox {
  static Presets = {
    All: all,
    Scripting: [functions, loops, math, strings, logic, lists, variables],
    SQL: [sql],
    Factory: [builder],
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

  getPresetModules() {
    return Toolbox.Presets[this.preset] || []
  }

  setPreset(preset) {
    if (!Toolbox.Presets[preset]) return

    this.preset = preset
    this.updateCategories()
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
