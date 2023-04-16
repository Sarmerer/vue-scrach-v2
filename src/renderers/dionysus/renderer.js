import { Renderer } from '../../types/renderer'
import { DionysusDrawer } from './drawer'

export class DionysusRenderer extends Renderer {
  Drawer = DionysusDrawer

  constructor(scratch) {
    super('dionysus', scratch)
  }
}
