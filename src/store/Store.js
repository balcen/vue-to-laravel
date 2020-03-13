import Vue from 'vue';
import Vuex from 'vuex';
import AuthStore from './module/Auth';
import FilterStore from './module/Filter';
import Confirm from './module/Confirm';
import Crud from './module/Crud';

Vue.use(Vuex);

const store = new Vuex.Store({
  // 設定直接手改到 state 的提醒
  // 正式環境上會有效能的影響
  // strict: true,
  modules: {
    auth: AuthStore,
    filter: FilterStore,
    confirm: Confirm,
    crud: Crud,
  },
  state: {
    messageLine: [],
  },
  mutations: {
    pushMessage(state, mes) {
      return state.messageLine.push(mes);
    },
    shiftMessage(state) {
      return state.messageLine.shift();
    },
  },
  actions: {
  },
});

export default store;
