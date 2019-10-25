<template>
  <v-app>
    <v-toolbar dense class="shrink">
      <v-toolbar-title to="/upload" class="headline text-uppercase">
        <span class="red--text text--darken-1">TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn text to="/upload" flat :active-class="'red--text text--darken-1'">UPLOAD</v-btn>
        <v-btn text to="/index/" flat :active-class="'red--text text--darken-1'">DATA</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn icon flat text v-if="!isLoggedIn" to="/login" :active-class="'red--text text--darken-1'"><v-icon>person</v-icon></v-btn>
      <v-btn icon flat text v-if="isLoggedIn" to="/dashboard" :active-class="'red--text text--darken-1'"><v-icon>account_circle</v-icon></v-btn>
      <v-btn icon flat text v-if="isLoggedIn" @click="logout" :active-class="'red--text text--darken-1'"><v-icon>logout</v-icon></v-btn>
    </v-toolbar>

    <v-content>
      <flash-message class="customMessage ma-2"></flash-message>
      <router-view
        :key="$route.fullPath"
      ></router-view>
    </v-content>
  </v-app>
</template>

<style>
/* v-btn 加上 link 的底線 */
a:not(.md-button):hover {
    text-decoration: none !important;
}

.customMessage {
  transition: all 0.5s ease-in-out;
  width: 60%;
  position: fixed;
  left: 50%;
  transform:translateX(-50%);
  z-index: 9999;
}

.customMessage .success {
  background-color: #dff0d8 !important;
}

.customMessage .error {
  background-color: #f2dede !important;
}

.customMessage .warning {
  background-color: #fcf8e3 !important;
}

.customMessage .info {
  background-color: #f2f5fe !important;
}

/* 取消 btn 的 active 背景色
.v-btn--active:before, .v-btn:hover:before, .v-btn:focus:before {
    background-color: transparent !important;
} */
</style>

<script>
export default {
  name: 'App',
  data () {
    return {
      bager: true
    }
  },
  created: function() {
    this.axios.interceptors.response.use((res) => {
      var token = res.headers.authorization
      if (token) {
        this.$store.dispatch('refresh', token)
      }
      return res
    }, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && err.config.__isRetryReqeust) {
          this.$store.dispatch('logout')
        }
        throw err
      })
    })
  },
  computed: {
    isLoggedIn: function(){
      return this.$store.getters.isLoggedIn
    }
  },
  methods: {
    logout: function() {
      // this.$auth.logout({
      //   // 用來通知 api，如果 false 的話就只會刪除本地 token
      //   makeRequest: true,
      //   params: {},
      //   success: function() {},
      //   error: function() {},
      //   redirect: '/login'
      // });
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
    },
  }
}
</script>
