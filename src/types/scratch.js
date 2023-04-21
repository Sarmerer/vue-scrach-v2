import { Proximity } from './proximity'
import { DOMElement } from './dom-element'
import { Block } from './block'
import { uuidv4 } from '../utils'
import { Generator } from './generator'
import { EventBus } from './event-bus'
import { Events } from './events'
import { Renderer } from './renderer'
import { DionysusRenderer } from '../renderers/dionysus/renderer'
import { AphroditeRenderer } from '../renderers/aphrodite/renderer'
import { Point } from './point'
import { CodeGenerator } from './generator/code'
import { Toolbox } from './toolbox'

export class Scratch extends DOMElement {
  static Blocks = {}
  static Events = Events
  static Renderers = {
    Dionysus: DionysusRenderer,
    Aphrodite: AphroditeRenderer,
  }
  static Renderer = Scratch.Renderers.Aphrodite

  constructor() {
    const id = uuidv4()
    super(id)
    this.id = id

    this.blocks = []
    this.variables = []

    this.events = new EventBus()
    this.proximity = new Proximity(this)

    this.generator = new CodeGenerator(this)
    this.toolbox = new Toolbox(this)

    this.renderer = new Scratch.Renderer(this)
    this.renderer.init()
  }

  /**
   * @param {Renderer} renderer
   */
  setRenderer(renderer) {
    if (!(renderer?.prototype instanceof Renderer)) {
      console.error('renderer must extend Renderer class:', renderer)
      return
    }

    Scratch.Renderer = renderer
    this.renderer = new renderer(this)
  }

  /**
   * @param {Generator} generator
   */
  setGenerator(generator) {
    if (!(generator?.prototype instanceof Generator)) {
      console.error('generator must extend Generator class:', generator)
      return
    }

    this.generator = new generator(this)
  }

  /**
   * @param {import('../../toolboxes').ToolboxDefinition} toolbox
   */
  setToolbox(toolbox) {
    Scratch.Blocks = {}

    if (toolbox.renderer) {
      this.setRenderer(toolbox.renderer)
    }

    if (toolbox.generator) {
      this.setGenerator(toolbox.generator)
    }

    Scratch.DeclareBlocksFromToolbox(toolbox)

    this.toolbox.blocks = toolbox.blocks
    this.toolbox.categories = toolbox.categories
    this.toolbox.generator = toolbox.generator
  }

  /** @returns {Array<Block>} */
  getBlocks() {
    return this.blocks.filter((b) => !b.isRelative())
  }

  /** @returns {Block | null} */
  getActiveBlock() {
    return this.blocks.find((b) => b.isDragged)
  }

  getBlockOfType(type) {
    const factory = Scratch.Blocks[type]
    if (!factory) {
      console.error('unknown block type:', type)
      return null
    }

    const block = new Block(this, 0, 0, type)
    factory(block)
    return block
  }

  /**
   * @param {String} type
   * @param {Number} x
   * @param {Number} y
   *
   * @returns {Block}
   */
  spawnBlock(type, x = 0, y = 0) {
    const block = this.getBlockOfType(type)
    if (!block) return

    block.position.moveTo(x, y)
    this.addBlock(block)

    return block
  }

  /**
   * @param {Block} block
   */
  addBlock(block) {
    if (!block.scratch) {
      block.scratch = this
    }

    this.blocks.push(block)

    for (const connection of block.getActiveConnections()) {
      this.proximity.addConnection(connection)
    }

    this.renderer.addDrawer(block)
    this.renderer.update(block, {})
    this.generator.compile()
    this.events.dispatch(Scratch.Events.BLOCK_CREATE, { block })
  }

  /** @param {Block} block */
  removeBlock(block) {
    if (!block) return

    const index = this.blocks.indexOf(block)
    if (index === -1) return

    this.renderer.removeDrawer(block)
    this.blocks.splice(index, 1)
    for (const connection of block.getActiveConnections()) {
      this.proximity.removeConnection(connection)
    }

    this.events.dispatch(Scratch.Events.BLOCK_DELETE, { block })
  }

  getVariables() {
    return this.variables
  }

  addVariable(name, value) {
    this.variables.push({ name, value })
    this.events.dispatch(Scratch.Events.VARIABLE_CREATE, { name })
  }

  /**
   * @param {MouseEvent} event
   * @returns {MouseEvent}
   */
  normalizeMouseEvent(event) {
    if (event.normalized) return event

    const rect = this.getBoundingClientRect()
    const normalized = new MouseEvent('mousemove', {
      clientX: event.clientX - rect.x,
      clientY: event.clientY - rect.y,
    })

    normalized.normalized = true
    return normalized
  }

  /**
   * @param {Point} point
   * @returns {Point}
   */
  normalizePoint(point) {
    const rect = this.getBoundingClientRect()
    return new Point(point.x - rect.x, point.y - rect.y)
  }

  toJSON() {
    return {
      id: this.id,
      blocks: this.blocks.map((b) => b.toJSON()),
      variables: this.variables.map((v) => ({ name: v.name, value: v.value })),
    }
  }

  /**
   *
   * @param {import('../../toolboxes').ToolboxDefinition} toolbox
   */
  static DeclareBlocksFromToolbox(toolbox) {
    const blocks = { ...toolbox.blocks }
    for (const category of toolbox.categories) {
      Object.assign(blocks, category.blocks)
    }

    Scratch.DeclareBlocks(blocks)
  }

  /**
   * @param {Object<String, import('../../blocks').BlockDefinition>} blocks
   */
  static DeclareBlocks(blocks) {
    for (const [name, block] of Object.entries(blocks)) {
      Scratch.DeclareBlock(name, block)
    }
  }

  /**
   * @param {String} name
   * @param {import('../../blocks').BlockDefinition} block
   */
  static DeclareBlock(name, block) {
    if (Scratch.Blocks[name]) {
      console.warn('overriding existing block type with name:', name)
    }

    Scratch.Blocks[name] = block
  }
}
