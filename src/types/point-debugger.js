import { Point } from './point'
import { Scratch } from './scratch'

export class PointDebugger {
  /**
   * @param {Point} point
   * @param {Scratch} scratch
   * @param {Object} options
   * @param {string} options.color
   * @param {Number} options.width
   * @param {Number} options.height
   * @returns {HTMLElement}
   */
  static Debug(point, scratch, options = {}) {
    if (!point.debugEl_) {
      const container = document.getElementById(`${scratch.id}.mask`)
      if (!container) return

      const backgroundColor = options?.color || 'purple'
      const width = `${options?.width || 5}px`
      const height = `${options?.height || 5}px`

      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'absolute',
        zIndex: 999,
        backgroundColor,
        width,
        height,
      })
      container.appendChild(el)
      point.debugEl_ = el
    }

    Object.assign(point.debugEl_.style, {
      left: `${point.x}px`,
      top: `${point.y}px`,
    })

    return point.debugEl_
  }
}
