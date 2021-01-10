import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    brewCasksInfo: [],
    brewLsFormulas: [],
    brewServices: [],
    isFirstOpened: true,
    isShowNavigation: true,
  },
  mutations: {
    setBrewCasksInfo: (state, val) => {
      state.brewCasksInfo = val;
    },
    setBrewLsFormulas: (state, val) => {
      state.brewLsFormulas = val;
    },
    setBrewServices: (state, val) => {
      state.brewServices = val;
    },
    setIsFirstOpened: (state, val) => {
      state.isFirstOpened = val;
    },  
    setIsShowNavigation: (state, val) => {
      state.isShowNavigation = val;
    },   
  },
  actions: {
  },
  modules: {
  }
})
