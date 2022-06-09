import Vue from 'vue'
import Vuex from 'vuex'
import {Ls} from "../src/Ls"


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    brewCasksInfo: [],
    brewLsFormulas: [],
    brewServices: [],
    isFirstOpened: true,
    isShowNavigation: true,
    statusHome: "Finished",
    statusVariantHome: "info",
    statusInfo: "Finished",
    statusVariantInfo: "info",
    brewLocation: Ls.brewLocation
  },
  mutations: {
    setBrewLocation: (state, val) => {
      state.brewLocation = val;
      Ls.brewLocation = val;
    },
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
    setStatusHome: (state, val) => {
      state.statusHome = val;
    },
    setStatusVariantHome: (state, val) => {
      state.statusVariantHome = val;
    },  
    setStatusInfo: (state, val) => {
      state.statusInfo = val;
    },
    setStatusVariantInfo: (state, val) => {
      state.statusVariantInfo = val;
    },       
  },
  actions: {
  },
  modules: {
  }
})
