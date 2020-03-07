export default {
  namespaced: true,
  state: {
    dialog: false,
    loading: false,
  },
  mutations: {
    toggleDialog(state, bol) {
      state.dialog = bol;
    },
    toggleLoading(state, bol) {
      state.loading = bol;
    },
  },
  getters: {
    isMultipleSelect: (state) => (state.selected.length > 1),
  },
};
