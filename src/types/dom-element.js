export class DOMElement {
  constructor(id) {
    this.id = id
    this.element_ = null
  }

  /** @returns {HTMLElement} */
  getElement() {
    return document.getElementById(this.id)
  }

  /** @returns {DOMRect} */
  getBoundingClientRect() {
    const element = this.getElement()
    if (!element) return { x: 0, y: 0, width: 0, height: 0 }
    return element.getBoundingClientRect()
  }
}
