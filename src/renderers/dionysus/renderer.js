import { Renderer } from '../../types/renderer'
import { DionysusDrawer } from './drawer'

export class DionysusRenderer extends Renderer {
  BlocksContainerComponent = () => import('./index.vue')
  BlockComponent = () => import('./Block.vue')

  Drawer = DionysusDrawer

  constructor(scratch) {
    super('dionysus', scratch)
  }
}
