export class CompilerContext {
  constructor(block, inputs = {}, fields = {}) {
    this.block = block
    this.fields = fields
    this.inputs = inputs
  }

  getInput(name, fallback = null) {
    return this.inputs[name] || fallback
  }

  getField(name, fallback = null) {
    return this.fields[name] || fallback
  }
}
