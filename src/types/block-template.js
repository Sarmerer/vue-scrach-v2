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

  header(text, inputs) {
    this.components.push(new BlockComponent('Header', { text, inputs }))
    return this
  }

  children() {
    this.components.push(new BlockComponent('Children', { children: [] }))
    return this
  }

  footer(inputs) {
    this.components.push(new BlockComponent('Footer', { inputs }))
    return this
  }

  reset() {
    this.components = []
    return this
  }
}
