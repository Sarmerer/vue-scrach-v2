import { Point } from '../point'
import { Scratch } from '../scratch'

export class BoxDebugger {
  /**
   * @param {Object} source
   * @param {Point} position
   * @param {Number} width
   * @param {Number} height
   * @param {Scratch} scratch
   * @param {Object} options
   * @param {string} options.color
   * @returns {HTMLElement}
   */
  static Debug(source, position, width, height, scratch, options = {}) {
    if (!source.debugEl_) {
      const container = document.getElementById(`${scratch.id}.mask`)
      if (!container) return

      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'absolute',
        zIndex: 999,
        pointerEvents: 'none',
        border: `1px solid ${options?.color || 'cyan'}`,
      })
      container.appendChild(el)
      source.debugEl_ = el
    }

    Object.assign(source.debugEl_.style, {
      top: `${position.y}px`,
      left: `${position.x}px`,
      width: `${width}px`,
      height: `${height}px`,
    })

    return source.debugEl_
  }
}
