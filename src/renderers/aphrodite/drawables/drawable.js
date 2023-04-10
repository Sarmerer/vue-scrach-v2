export class Drawable {
  constructor(drawable) {
    this.drawable = drawable
    this.height = 0
    this.width = 0
  }

  measure() {
    this.width = 0
    this.height = 0
  }
}
