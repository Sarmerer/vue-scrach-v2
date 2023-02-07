import { Scratch } from './scratch'
import { Block } from './block'

export class ProximityZone {
  constructor(type, x, y, options = {}) {
    this.type = type
    this.x = x
    this.y = y

    options = Object.assign({ block: null, input: null }, options)
    this.block = options.block
    this.input = options.input
  }
}

export class BlockProximityDetector {
  /** @param {Scratch} scratch */
  constructor(scratch) {
    this.scratch = scratch

    this.next = null
    this.prev = null
    this.input = null
  }

  getZones(block) {
    if (!block) return []

    const zones = []
    const rect = block.getBoundingClientRect()
    if (block.hasPrev) {
      zones.push(
        new ProximityZone(Block.Connection.Prev, rect.x, rect.y, { block })
      )
    }

    if (block.hasNext) {
      zones.push(
        new ProximityZone(Block.Connection.Next, rect.x, rect.y + rect.height, {
          block,
        })
      )
    }

    for (const input of block.inputs) {
      let type = null
      if (input.type == 'Statement') type = Block.Connection.Statement
      else if (input.type == 'Value') type = Block.Connection.Input
      if (!type) continue

      const rect = input.getBoundingClientRect()
      zones.push(new ProximityZone(type, rect.x, rect.y, { block, input }))
    }

    return zones
  }

  getNearbyBlocks(block, radius = 30) {
    const r1 = block.getBoundingClientRect()

    return this.scratch.blocks.filter((b) => {
      if (b.id == block.id || b.isActive()) return false

      const r2 = b.getBoundingClientRect()

      return !(
        r1.x > r2.x + r2.width + radius ||
        r1.x + r1.width < r2.x - radius ||
        r1.y > r2.y + r2.height + radius ||
        r1.y + r1.height < r2.y - radius
      )
    })
  }

  /** @param {Block} block */
  update(block) {
    this.clear()
    if (!block) return

    const nearBlocks = this.getNearbyBlocks(block)
    if (!nearBlocks.length) return

    const zones = nearBlocks
      .reduce((acc, b) => {
        acc.push(...this.getZones(b))
        return acc
      }, [])
      .filter((z) => {
        if (z.type == Block.Connection.Input && block.hasOutput) return true
        if (z.type == Block.Connection.Statement && block.hasPrev) return true
        if (z.type == Block.Connection.Prev && block.hasNext) return true
        if (z.type == Block.Connection.Next && block.hasPrev) return true

        return false
      })

    const nearbyZones = []
    const cRect = block.getBoundingClientRect()
    for (const zone of zones) {
      let dist = 100
      if (zone.type == Block.Connection.Prev) {
        dist = Math.abs(zone.y - (cRect.y + cRect.height))
      } else {
        dist = Math.abs(zone.y - cRect.y)
      }

      if (dist >= 50) continue

      nearbyZones.push({ zone, dist })
    }

    let minDist = 100
    let closest = null
    for (const zone of nearbyZones) {
      if (zone.dist > minDist) continue

      minDist = zone.dist
      closest = zone
    }

    if (!closest) return

    switch (closest.zone.type) {
      case Block.Connection.Prev:
        this.prev = closest.zone.block
        break

      case Block.Connection.Next:
        this.next = closest.zone.block
        break

      case Block.Connection.Input:
      case Block.Connection.Statement:
        this.input = closest.zone.input
        break

      default:
        break
    }
  }

  connect(block) {
    if (!block) {
      this.clear()
      return
    }

    if (this.prev) {
      block.setNext(this.prev)
    }

    if (this.next) {
      block.setPrev(this.next)
    }

    if (this.input) {
      block.setInputOf(this.input)
    }

    this.clear()
  }

  clear() {
    this.prev = null
    this.next = null
    this.input = null
  }
}
