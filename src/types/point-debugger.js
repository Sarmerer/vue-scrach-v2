import { Point } from './point'
import { Scratch } from './scratch'

export class PointDebugger {
  /**
   * @param {Point} point
   * @param {Scratch} scratch
   * @returns {HTMLElement}
   */
  static Debug(point, scratch) {
    if (!point.debugEl_) {
      const container = document.getElementById(`${scratch.id}.mask`)
      if (!container) return

      const el = document.createElement('div')
      Object.assign(el.style, {
        position: 'absolute',
        backgroundColor: 'purple',
        width: '5px',
        height: '5px',
        zIndex: 999,
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
