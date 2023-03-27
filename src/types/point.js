export class Point {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  moveBy(x = 0, y = 0) {
    this.x += x
    this.y += y
    return this
  }

  moveTo(x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  clone() {
    return new Point(this.x, this.y)
  }
}
