import axios from 'axios'

export default {
  namespaced: true,
  state: {
    search: {},
    q: ''
  },
  mutations: {
    setSearch (state, search) {
      state.search = search
    },
    setQuery (state, q) {
      state.q = q
    }
  },
  actions: {
    search ({ state, getters }, type) {
      return new Promise ((resolve, reject) => {
        let query = []
        if (getters.price) {
          query.push(`p=${getters.price}`)
        }
        if (getters.amount) {
          query.push(`a=${getters.amount}`)
        }
        if (getters.date) {
          query.push(`d=${getters.date}`)
        }
        if (getters.expireDate) {
          query.push(`ed=${getters.expireDate}`)
        }
        if (state.q) {
          query.push(`q=${state.q}`)
        }

        let url = `${type}/search?${query.join('&')}`
        axios.get(url)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      })
    }
  },
  getters: {
    price: ({ search }) => search.minPrice || search.maxPrice ? [search.minPrice, search.maxPrice] : null,
    amount: ({ search }) => search.minAmount || search.maxAmount ? [search.minAmount, search.maxAmount] : null,
    date: ({ search }) => search.date1 || search.date2 ? [search.date1, search.date2] : null,
    expireDate: ({ search }) => search.expireDate1 || search.expireDate2 ? [search.expireDate1, search.expireDate2] : null,
  }
}