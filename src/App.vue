<template>
  <v-app>
    <v-toolbar flat dense class="shrink">
      <v-toolbar-title to="/upload" class="headline text-uppercase">
        <span class="red--text text--darken-1">TSCL</span>
        <span class="font-weight-light">TRUST-SEARCH</span>
      </v-toolbar-title>
      <v-toolbar-items>
        <v-btn text to="/upload" :active-class="'red--text text--darken-1'">UPLOAD</v-btn>
        <v-btn text to="/index/" :active-class="'red--text text--darken-1'">DATA</v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn icon text v-if="!isLoggedIn" to="/login" :active-class="'red--text text--darken-1'"><v-icon>mdi-account</v-icon></v-btn>
      <v-btn icon text v-if="isLoggedIn" to="/dashboard" :active-class="'red--text text--darken-1'"><v-icon>account_circle</v-icon></v-btn>
      <v-btn icon text v-if="isLoggedIn" @click="logout" :active-class="'red--text text--darken-1'"><v-icon>logout</v-icon></v-btn>
    </v-toolbar>

    <v-content id="content">
      <v-snackbar
        v-model="snackbar"
        :color="flash.type"
        top
      >
        {{ flash.content }}
        <v-btn
          dark
          text
          @click="closeSnackbar"
        >
          Close
        </v-btn>
      </v-snackbar>

      <transition name="fade">
        <router-view
          :key="$route.fullPath"
        ></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
export default {
  name: 'App',
  data () {
    return {
      bager: true,
      snackbar: false,
    }
  },
  created: function() {
    this.axios.interceptors.response.use((res) => {
      var token = res.headers.authorization
      if (token) {
        this.refreshAction()
      }
      return res
    }, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && err.config.__isRetryReqeust) {
          this.logoutAction()
        }
        throw err
      })
    })
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
    flash: {
      get: function () {
        if (!this.$store.state.flash.type) {
          this.snackbar = false
        } else {
          this.snackbar = true
        }
        return this.$store.state.flash
      },
      set: function() {
      }
    }
  },
  methods: {
    ...mapActions({
      logoutAction: 'auth/logout',
      refreshAction: 'auth/refresh'
    }),
    ...mapMutations({
      removeFlash: 'removeFlash'
    }),
    logout() {
      this.logoutAction()
        .then(() => {
          this.$router.push({name: 'root'})
        })
    },
    closeSnackbar() {
      this.removeFlash
      this.snackbar = false
    }
  }
}
</script>

<style>

html { overflow-y: auto !important }
/* v-btn 加上 link 的底線 */
a:not(.md-button):hover {
    text-decoration: none !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave {
  opacity: 0;
}

/* .customMessage {
  left: 50%;
  transform:translateX(-50%);
  z-index: 9999;
} */

.customMessage {
  /* position: fixed !important;
  left: 50%;
  transform: translateX(-50%); */
  z-index: 9999;
}
/* 
#flashMessage .flash__message.success {
  background-color: #dff0d8 !important;
  border-color: #d6e9c6 !important;
} */

</style>

