import axios from 'axios'
// import cookie from 'vue-cookies'

export default {
  namespaced: true,
  state: {
    status: '',
    token: sessionStorage.getItem('token') || localStorage.getItem('token') || '',
    user: {}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, token, user) {
      state.status = 'success',
      state.token = token
      state.user = user
    },
    auth_error(state) {
      state.status = 'error'
    },
    auth_logout(state) {
      state.status = '',
      state.token = '',
      state.user = {}
    },
    auth_refresh(state, token) {
      state.token = token
    }
  },
  actions: {
    login({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/auth/login', user)
        .then(res => {
          // const token = res.data.access_token
          // const user = res.data.user
          const { token, user, token_type, expires_at } = res.data
          const finalToken = token_type + ' ' + token
          
          if (typeof(expires_at) !== 'undefined' && Array.length(expires_at) > 0) {
            localStorage.setItem('token', finalToken)
            localStorage.setItem('expires_at', expires_at)
          } else {
            sessionStorage.setItem('token', finalToken)
          }
          axios.defaults.headers.common['Authorization'] = finalToken
          commit('auth_success', finalToken, user)
          // commit('auth_success', cookie.get('token'), user)
          resolve()
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
    register({commit}, user) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        axios.post('/auth/register', user)
        .then(res => {
          // const token = res.data.token
          // const user = res.data.user
          const { token, user, token_type } = res.data
          const finalToken = token_type + ' ' + token
          // localStorage.setItem('token', token)
          sessionStorage.setItem('token', finalToken)
          axios.defaults.headers.common['Authorization'] = finalToken
          commit('auth_success', finalToken, user)
          resolve()
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
    logout({commit}) {
      return new Promise((resolve) => {
        localStorage.removeItem('token') || sessionStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        commit('auth_logout')
        resolve()
      })
    },
    refresh({commit}, token) {
      return new Promise(() => {
        localStorage.token = token
        axios.defaults.headers.common['Authorization'] = token
        commit('auth_refresh', token)
      })
    },
    check({ dispatch, state }) {
      return new Promise(() => {
        axios.defaults.headers.common['Authorization'] = state.token
        axios.get('auth/refresh')
          .catch(() => {
            dispatch('logout')
          })
      })
    }
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status
  }
}