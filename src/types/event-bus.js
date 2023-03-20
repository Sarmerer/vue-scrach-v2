export class EventBus {
  constructor() {
    this.bus = document.createElement('event-bus')
  }

  addEventListeners(listeners) {
    for (const [event, callback] of Object.entries(listeners)) {
      this.addEventListener(event, callback)
    }
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
