import axios from 'axios';

export default {
  namespaced: true,
  state: {
    loading: false,
  },
  mutations: {
    setLoading(state, bol) {
      state.loading = bol;
    },
  },
  actions: {
    getDataFromApi(context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(payload.n, { params: payload.p })
          .then((d) => resolve(d.data))
          .catch((e) => reject(e));
      });
    },
    optionChange({ dispatch, rootGetters }, payload) {
      if (rootGetters['filter/filterIsNotEmpty'] || payload.q) {
        return dispatch('filter/search', payload, { root: true });
      }
      return dispatch('getDataFromApi', payload);
    },
  },
};
