export class Renderer {
  BlocksContainerComponent = null
  BlockComponent = null

  constructor(name, scratch) {
    this.scratch = scratch
    this.name = name
    this.didInit = false
  }

  init() {
    this.didInit = false
    this.init_()
    this.didInit = true
  }

  init_() {
    console.warn('init_ implementation should be provided')
  }
}
