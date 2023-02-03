import { BlockComponent } from './block-component'

export class BlockTemplate {
  constructor() {
    this.components = []

    this.colors = {
      background: 'cyan',
      text: 'white',
    }
  }

  backgroundColor(cssColor) {
    this.colors.background = cssColor
    return this
  }

  textColor(cssColor) {
    this.colors.text = cssColor
    return this
  }

  header(text) {
    this.components.push(new BlockComponent('Header', { text }))
    return this
  }

  children() {
    this.components.push(new BlockComponent('Children', { children: [] }))
    return this
  }

  footer() {
    this.components.push(new BlockComponent('Footer'))
    return this
  }

  reset() {
    this.components = []
    return this
  }
}
