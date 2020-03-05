export default {
  namespaced: true,
  state: {
    dialog: false,
    selected: [],
  },
  mutations: {
    toggleDialog(state, bol) {
      state.dialog = bol;
    },
  },
  getters: {
    isMultipleSelect: (state) => (state.selected.length > 1),
  },
};
