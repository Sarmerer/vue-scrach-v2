export class EventBus {
  constructor() {
    this.bus = document.createElement('event-bus')
  }

  addEventListener(event, callback) {
    this.bus.addEventListener(event, callback)
  }

  removeEventListener(event, callback) {
    this.bus.removeEventListener(event, callback)
  }

  dispatch(event, detail = {}) {
    this.bus.dispatchEvent(new CustomEvent(event, { detail }))
  }
}
