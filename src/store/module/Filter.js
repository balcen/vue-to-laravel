import axios from 'axios'

export default {
  namespaced: true,
  state: {
    search: {
      minPrice: null,
      maxPrice: null,
      minAmount: null,
      maxAmount: null,
      earlierDate: null,
      laterDate: null,
      earlierExpeDate:null,
      laterExpDate:null,
    },
    q: ''
  },
  mutations: {
    setQuery (state, q) {
      state.q = q
    },
    setMinPrice (state, price) {
      state.search.minPrice = price
    },
    setMaxPrice (state, price) {
      state.search.maxPrice = price
    },
    setMinAmount (state, amount) {
      state.search.minAmount = amount
    },
    setMaxAmount (state, amount) {
      state.search.maxAmount = amount
    },
    setEarlierDate (state, date) {
      state.search.earlierDate = date
    },
    setLaterDate (state, date) {
      state.search.laterDate = date
    },
    setEarlierExpDate (state, date) {
      state.search.earlierExpeDate = date
    },
    setLaterExpDate (state, date) {
      state.search.laterExpDate = date
    }
  },
  actions: {
    search ({ state, getters }, { type, page }) {
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

        let url = `${type}/search${page}&${query.join('&')}`
        axios.get(url)
          .then(res => resolve(res.data))
          .catch(err => reject(err))
      })
    }
  },
  getters: {
    price: ({ search }) => search.minPrice || search.maxPrice ? [search.minPrice, search.maxPrice] : null,
    amount: ({ search }) => search.minAmount || search.maxAmount ? [search.minAmount, search.maxAmount] : null,
    date: ({ search }) => search.earlierDate || search.laterDate ? [search.earlierDate, search.laterDate] : null,
    expireDate: ({ search }) => search.earlierExpeDate || search.laterExpDate ? [search.earlierExpeDate, search.laterExpDate] : null,
    filterIsEmpty: function (state) {
      let trigger = false
      for (var index in state.search) {
        if (state.search[index] !== null && state.search[index] !== undefined && state.search[index] !== "") {
          trigger = true
          break
        }
      }
      if (state.q === "") return false
      return trigger
    }
  }
}