import Vue from 'vue'
import Vuex from 'vuex'
import { Scratch } from './types/scratch'

Vue.use(Vuex)

const store = new Vuex.Store({
  state() {
    return {
      scratch: new Scratch(),
    }
  },
})

export default store
