export default {
  namespaced: true,
  state: {
    dialog: false,
    isMultiple: true,
    id: null,
  },
  mutations: {
    toggleDialog(state, payload) {
      state.dialog = payload.b;
      if (typeof payload.m !== 'undefined') state.isMultiple = payload.m;
      if (typeof payload.id !== 'undefined') state.id = payload.id;
    },
    toggleLoading(state, bol) {
      state.loading = bol;
    },
  },
};
