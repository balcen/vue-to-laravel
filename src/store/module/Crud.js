import axios from 'axios';

export default {
  namespaced: true,
  state: {},
  actions: {
    getDataFromApi({}, payload) {
      return new Promise((resolve, reject) => {
        axios.get(payload.n, { params: payload.p })
          .then((d) => resolve(d.data))
          .catch((e) => reject(e));
      });
    },
    optionChange({ dispatch, rootGetters }, payload) {
      if (rootGetters.filter.filterIsNotEmpty) {
        dispatch('filter/search', payload.search, { root: true });
      }
    },
  },
};
