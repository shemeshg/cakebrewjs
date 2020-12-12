import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    brewCasksInfo: [],
    brewLsFormulas: [],
    isFirstOpened: true,
  },
  mutations: {
    setBrewCasksInfo: (state, val) => {
      state.brewCasksInfo = val;
    },
    setBrewLsFormulas: (state, val) => {
      state.brewLsFormulas = val;
    },
    setIsFirstOpened: (state, val) => {
      state.isFirstOpened = val;
    },    
  },
  actions: {
  },
  modules: {
  }
})
