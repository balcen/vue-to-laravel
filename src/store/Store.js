import Vue from 'vue'
import Vuex from 'vuex'
import AuthStore from './module/Auth'
import MenuStore from './module/Menu'

Vue.use(Vuex);

const store = new Vuex.Store({
  // 設定直接手改到 state 的提醒
  // 正式環境上會有效能的影響
  // strict: true,
  modules: {
    auth: AuthStore,
    menu: MenuStore
  },
  state: {
    flash:{}
  },
  mutations: {
    updateFlash (state, flash) {
      state.flash = flash
    },
    removeFlash (state) {
      state.flash = {}
    }
  },
  actions: {
  }
})

export default store;
