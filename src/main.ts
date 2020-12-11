import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import './plugins/composition-api'
import App from './App.vue'
import router from './router'
import store from './store'
import { provide } from "@vue/composition-api";

Vue.config.productionTip = false

new Vue({
  setup(){
    provide("vuex-store", store);
  },
  router,
  store,
  render: h => h(App)
}).$mount('#app')
