import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import AuthStore from './module/Auth'

Vue.use(Vuex);

const store = new Vuex.Store({
  // 設定直接手改到 state 的提醒
  // 正式環境上會有效能的影響
  // strict: true,
  modules: {
    auth: AuthStore
  },
  state: {
    selected: [],
    flash:[]
  },
  mutations: {
    setSelected (state, selected) {
      state.seletected = selected
    },
    updateFlash (state, flash) {
      state.flash.push(flash)
    },
    removeFlash (state, index) {
      state.flash = state.flash.splice(index, 1)
    },
    popFlash (state) {
      state.flash.pop()
    }
  },
  actions: {
  }
});

export default store;
